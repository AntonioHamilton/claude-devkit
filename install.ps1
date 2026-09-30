# Instala o claude-devkit em ~/.claude (skills e agents). Nao sobrescreve nada sem -Force.
# Uso: .\install.ps1 [-Force] [-DryRun] [-NoHooks] [-Dest "$HOME\.claude"]
param([switch]$Force, [switch]$DryRun, [switch]$NoHooks, [string]$Dest = "$HOME\.claude")

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

$hooksMsg = ""
if (-not $NoHooks) {
    if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
        $hooksMsg = "hooks do Jev NAO instalados: Node.js nao encontrado (precisa do Node 22+)."
    } else {
        Copy-Item-Safe "$src\hooks\jev-hooks.mjs" "$Dest\hooks\jev-hooks.mjs" "hook:jev-hooks"
        $mergeArgs = @("$src\hooks\merge-settings.mjs", "$Dest\settings.json", "$Dest\hooks\jev-hooks.mjs")
        if ($DryRun) { $mergeArgs += "--dry-run" }
        & node @mergeArgs
        if ($LASTEXITCODE -eq 0) { $hooksMsg = "hooks do Jev registrados em $Dest\settings.json (so agem se TYPESAFE_API_KEY existir; JEV_HOOKS=off desliga)." }
        else { $hooksMsg = "falha ao registrar os hooks do Jev em settings.json." }
    }
}

Write-Output "== instalado =="; if ($installed) { $installed | ForEach-Object { "  $_" } } else { "  (nada)" }
Write-Output "== pulado ==";    if ($skipped)   { $skipped   | ForEach-Object { "  $_" } } else { "  (nada)" }
Write-Output "== pendente =="; if ($pending)   { $pending   | ForEach-Object { "  $_" } } else { "  (nada)" }
Write-Output ""
Write-Output "MCP do Chrome nao e instalado por este script. Veja mcp\README.md e escolha a opcao A ou B."
if ($hooksMsg) { Write-Output $hooksMsg }
if (-not $NoHooks) { Write-Output "Privacidade: com a key, os hooks enviam a TypeSafe prompts, comandos Bash de aparencia arriscada e texto de paginas lidas (segredos mascarados). Use -NoHooks para nao instalar." }
Write-Output "Destino: $Dest"
if (Test-Path (Join-Path $Dest ".devkit-backups\$stamp")) {
    Write-Output "Backup do que foi sobrescrito: $Dest\.devkit-backups\$stamp"
}
