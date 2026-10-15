# Instala o claude-devkit em ~/.claude (skills e agents). Nao sobrescreve nada sem -Force.
# Uso: .\install.ps1 [-Force] [-DryRun] [-NoHooks] [-NoRules] [-LinkAgents] [-Dest "$HOME\.claude"]
param([switch]$Force, [switch]$DryRun, [switch]$NoHooks, [switch]$NoRules, [switch]$LinkAgents, [string]$Dest = "$HOME\.claude")

$src = $PSScriptRoot
$installed = @(); $skipped = @(); $pending = @()
$stamp = Get-Date -Format "yyyyMMddHHmmss"

function Copy-Item-Safe {
    param([string]$From, [string]$To, [string]$Label)
    if ((Test-Path $To) -and (-not $Force)) { $script:skipped += "$Label (ja existe)"; return }
    if ($DryRun) { $script:installed += "$Label [dry-run]"; return }
    $parent = Split-Path $To -Parent
    if (-not (Test-Path $parent)) { New-Item -ItemType Directory -Force $parent | Out-Null }
    if (Test-Path $To) {
        # Backup fora de skills/ e agents/: pasta .bak ali dentro e carregada como skill de verdade.
        $rel = $To.Substring($Dest.Length).Trim([IO.Path]::DirectorySeparatorChar)
        $backupPath = Join-Path (Join-Path $Dest ".devkit-backups") (Join-Path $script:stamp $rel)
        New-Item -ItemType Directory -Force (Split-Path $backupPath -Parent) | Out-Null
        Copy-Item $To $backupPath -Recurse -Force
        # Remover antes de copiar: Copy-Item com destino existente aninha em vez de sobrescrever.
        Remove-Item $To -Recurse -Force
    }
    Copy-Item $From $To -Recurse -Force
    $script:installed += $Label
}

foreach ($d in Get-ChildItem "$src\skills" -Directory) {
    if (-not (Test-Path "$($d.FullName)\SKILL.md")) { $pending += "skill:$($d.Name) (sem SKILL.md)"; continue }
    Copy-Item-Safe $d.FullName "$Dest\skills\$($d.Name)" "skill:$($d.Name)"
}

foreach ($f in Get-ChildItem "$src\agents" -Filter *.md) {
    Copy-Item-Safe $f.FullName "$Dest\agents\$($f.Name)" "agent:$($f.BaseName)"
}

$rulesMsg = ""
if (-not $NoRules) {
    Copy-Item-Safe "$src\rules\devkit-rules.md" "$Dest\devkit-rules.md" "rules:devkit-rules"
    $claudeMd = "$Dest\CLAUDE.md"
    if ((Test-Path $claudeMd) -and (Select-String -Path $claudeMd -Pattern '^@devkit-rules\.md\s*$' -Quiet)) {
        $rulesMsg = "regras de ouro ja importadas em $claudeMd."
    } elseif ($DryRun) {
        $rulesMsg = "[dry-run] adicionaria '@devkit-rules.md' ao fim de $claudeMd."
    } else {
        $bk = Join-Path (Join-Path $Dest ".devkit-backups") $stamp
        New-Item -ItemType Directory -Force $bk | Out-Null
        if (Test-Path $claudeMd) { Copy-Item $claudeMd (Join-Path $bk "CLAUDE.md") -Force }
        [IO.File]::AppendAllText($claudeMd, "`n@devkit-rules.md`n")
        $rulesMsg = "adicionei '@devkit-rules.md' ao fim de $claudeMd (backup em .devkit-backups). Remover: apague essa linha."
    }
}
if (Test-Path "$Dest\agents\manager.md") { $rulesMsg += " ATENCAO: $Dest\agents\manager.md e legado (o manager agora e a skill); apague-o para a sessao nao despachar o manager como subagent." }

$hooksMsg = ""
if (-not $NoHooks) {
    if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
        $hooksMsg = "hooks do Jev NAO instalados: Node.js nao encontrado (precisa do Node 22+)."
    } else {
        Copy-Item-Safe "$src\hooks\jev-hooks.mjs" "$Dest\hooks\jev-hooks.mjs" "hook:jev-hooks"
        Copy-Item-Safe "$src\hooks\session-start.mjs" "$Dest\hooks\session-start.mjs" "hook:session-start"
        $mergeArgs = @("$src\hooks\merge-settings.mjs", "$Dest\settings.json", "$Dest\hooks\jev-hooks.mjs", "--banner=$Dest\hooks\session-start.mjs")
        if ($DryRun) { $mergeArgs += "--dry-run" }
        & node @mergeArgs
        if ($LASTEXITCODE -eq 0) { $hooksMsg = "hooks registrados em $Dest\settings.json: banner de inicio de sessao (DEVKIT_BANNER=off desliga) e hooks do Jev (so agem se TYPESAFE_API_KEY existir; JEV_HOOKS=off desliga)." }
        else { $hooksMsg = "falha ao registrar os hooks do Jev em settings.json." }
    }
}

$linkMsgs = @()
if ($LinkAgents) {
    foreach ($t in @("$HOME\.agents\skills", "$HOME\.codex\skills", "$HOME\.config\opencode\skills", "$HOME\.kimi-code\skills")) {
        if (-not (Test-Path $t)) { $linkMsgs += "link: $t nao existe, pulado"; continue }
        $n = 0
        foreach ($d in Get-ChildItem "$src\skills" -Directory) {
            if (-not (Test-Path "$($d.FullName)\SKILL.md")) { continue }
            $lk = Join-Path $t $d.Name
            if (Test-Path $lk) { continue }
            if (-not $DryRun) {
                try { New-Item -ItemType SymbolicLink -Path $lk -Target "$Dest\skills\$($d.Name)" -ErrorAction Stop | Out-Null }
                catch { continue }
            }
            $n++
        }
        $linkMsgs += "link: $n skill(s) ligadas em $t"
    }
}

Write-Output "== instalado =="; if ($installed) { $installed | ForEach-Object { "  $_" } } else { "  (nada)" }
Write-Output "== pulado ==";    if ($skipped)   { $skipped   | ForEach-Object { "  $_" } } else { "  (nada)" }
Write-Output "== pendente =="; if ($pending)   { $pending   | ForEach-Object { "  $_" } } else { "  (nada)" }
Write-Output ""
Write-Output "MCP do Chrome nao e instalado por este script. Veja mcp\README.md e escolha a opcao A ou B."
if ($hooksMsg) { Write-Output $hooksMsg }
if ($rulesMsg) { Write-Output $rulesMsg }
$linkMsgs | ForEach-Object { Write-Output $_ }
if (-not $NoHooks) { Write-Output "Privacidade: com a key, os hooks enviam a TypeSafe prompts, comandos Bash de aparencia arriscada e texto de paginas lidas (segredos mascarados). Use -NoHooks para nao instalar." }
Write-Output "Destino: $Dest"
if (Test-Path (Join-Path $Dest ".devkit-backups\$stamp")) {
    Write-Output "Backup do que foi sobrescrito: $Dest\.devkit-backups\$stamp"
}
