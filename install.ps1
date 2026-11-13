# Installs claude-devkit into ~/.claude (skills and agents). Never overwrites without -Force.
# Usage: .\install.ps1 [-Force] [-DryRun] [-NoClaude] [-NoHooks] [-NoRules] [-LinkAgents] [-OpenCode] [-Dest "$HOME\.claude"] [-OpenCodeDest "$HOME\.config\opencode"]
# -NoClaude skips the Claude Code specifics (agents, CLAUDE.md import, hooks). Skills are still copied to -Dest.
param([switch]$Force, [switch]$DryRun, [switch]$NoClaude, [switch]$NoHooks, [switch]$NoRules, [switch]$LinkAgents, [switch]$OpenCode, [string]$Dest = "$HOME\.claude", [string]$OpenCodeDest = "")

$src = $PSScriptRoot
$installed = @(); $skipped = @(); $pending = @()
$stamp = Get-Date -Format "yyyyMMddHHmmss"

function Copy-Item-Safe {
    param([string]$From, [string]$To, [string]$Label, [string]$Base = $Dest)
    if ((Test-Path $To) -and (-not $Force)) { $script:skipped += "$Label (already exists)"; return }
    if ($DryRun) { $script:installed += "$Label [dry-run]"; return }
    $parent = Split-Path $To -Parent
    if (-not (Test-Path $parent)) { New-Item -ItemType Directory -Force $parent | Out-Null }
    if (Test-Path $To) {
        # Back up outside skills/ and agents/: a .bak folder inside them is loaded as a real skill.
        $rel = $To.Substring($Base.Length).Trim([IO.Path]::DirectorySeparatorChar)
        $backupPath = Join-Path (Join-Path $Base ".devkit-backups") (Join-Path $script:stamp $rel)
        New-Item -ItemType Directory -Force (Split-Path $backupPath -Parent) | Out-Null
        Copy-Item $To $backupPath -Recurse -Force
        # Remove before copying: Copy-Item with an existing destination nests instead of overwriting.
        Remove-Item $To -Recurse -Force
    }
    Copy-Item $From $To -Recurse -Force
    $script:installed += $Label
}

foreach ($d in Get-ChildItem "$src\skills" -Directory) {
    if (-not (Test-Path "$($d.FullName)\SKILL.md")) { $pending += "skill:$($d.Name) (sem SKILL.md)"; continue }
    Copy-Item-Safe $d.FullName "$Dest\skills\$($d.Name)" "skill:$($d.Name)"
}

foreach ($f in $(if ($NoClaude) { @() } else { Get-ChildItem "$src\agents" -Filter *.md })) {
    Copy-Item-Safe $f.FullName "$Dest\agents\$($f.Name)" "agent:$($f.BaseName)"
}

$rulesMsg = ""
if (-not $NoRules -and -not $NoClaude) {
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
        $rulesMsg = "added '@devkit-rules.md' to the end of $claudeMd (backup in .devkit-backups). To remove: delete that line."
    }
}
if (Test-Path "$Dest\agents\manager.md") { $rulesMsg += " WARNING: $Dest\agents\manager.md is legacy (the manager is now a skill); delete it so the session does not dispatch the manager as a subagent." }

$hooksMsg = ""
if (-not $NoHooks -and -not $NoClaude) {
    if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
        $hooksMsg = "Claude hooks NOT installed: Node.js not found (needs Node 22+)."
    } else {
        Copy-Item-Safe "$src\hooks\memoria-stop.mjs" "$Dest\hooks\memoria-stop.mjs" "hook:memoria-stop"
        Copy-Item-Safe "$src\hooks\session-start.mjs" "$Dest\hooks\session-start.mjs" "hook:session-start"
        $mergeArgs = @("$src\hooks\merge-settings.mjs", "$Dest\settings.json", "$Dest\hooks")
        if ($DryRun) { $mergeArgs += "--dry-run" }
        & node @mergeArgs
        if ($LASTEXITCODE -eq 0) { $hooksMsg = "hooks registered in $Dest\settings.json: session banner (DEVKIT_BANNER=off turns it off) and memory reminder on Stop (DEVKIT_MEMORIA=off turns it off)." }
        else { $hooksMsg = "failed to register the Claude hooks in settings.json." }
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

$opencodeMsgs = @()
if ($OpenCode) {
    $ocSrc = Join-Path $src "config\opencode"
    $ocDest = if ($OpenCodeDest) { $OpenCodeDest } else { Join-Path $HOME ".config\opencode" }
    $onWindows = [System.Environment]::OSVersion.Platform -eq [System.PlatformID]::Win32NT
    # The fallback plugin reads %APPDATA%\opencode on Windows and ~/.config/opencode elsewhere.
    $fallbackDest = if ($onWindows -and -not $OpenCodeDest) { Join-Path $env:APPDATA "opencode" } else { $ocDest }

    # Skills (same tree as Claude, so both harnesses share the content).
    foreach ($d in Get-ChildItem "$src\skills" -Directory) {
        if (-not (Test-Path "$($d.FullName)\SKILL.md")) { continue }
        Copy-Item-Safe $d.FullName "$ocDest\skills\$($d.Name)" "opencode-skill:$($d.Name)" $ocDest
    }

    # OpenCode agents (the portable English set from config/opencode/agents).
    foreach ($f in Get-ChildItem "$ocSrc\agents" -Filter *.md) {
        Copy-Item-Safe $f.FullName "$ocDest\agents\$($f.Name)" "opencode-agent:$($f.BaseName)" $ocDest
    }

    # RTK plugin, golden rules and the OpenCode instructions file.
    Copy-Item-Safe "$ocSrc\plugins\rtk.ts" "$ocDest\plugins\rtk.ts" "opencode-plugin:rtk" $ocDest
    Copy-Item-Safe "$src\rules\devkit-rules.md" "$ocDest\devkit-rules.md" "opencode-rules" $ocDest
    Copy-Item-Safe "$ocSrc\devkit-opencode.md" "$ocDest\devkit-opencode.md" "opencode-instructions" $ocDest

    # Free-model fallback chain.
    Copy-Item-Safe "$ocSrc\fallback.json" (Join-Path $fallbackDest "fallback.json") "opencode-fallback" $fallbackDest

    # opencode.json is merged, never replaced: it may hold the user's providers and MCP servers.
    $ocConfig = Join-Path $ocDest "opencode.json"
    if (-not (Test-Path $ocConfig)) {
        Copy-Item-Safe "$ocSrc\opencode.json" $ocConfig "opencode-config" $ocDest
    } elseif ($DryRun) {
        $installed += "opencode-config [dry-run merge]"
    } else {
        try {
            $srcObj = Get-Content "$ocSrc\opencode.json" -Raw | ConvertFrom-Json
            $tgtObj = Get-Content $ocConfig -Raw | ConvertFrom-Json

            $backup = Join-Path (Join-Path $ocDest ".devkit-backups") (Join-Path $stamp "opencode.json")
            New-Item -ItemType Directory -Force (Split-Path $backup -Parent) | Out-Null
            Copy-Item $ocConfig $backup -Force

            # instructions: append missing entries.
            $mergedInstructions = @()
            if ($tgtObj.PSObject.Properties.Name -contains 'instructions') { $mergedInstructions = @(@($tgtObj.instructions) | Where-Object { $_ -notmatch 'devkit-(rules|opencode)\.md$' }) }
            foreach ($i in @($srcObj.instructions)) {
                if ($i -and ($mergedInstructions -notcontains $i)) { $mergedInstructions += $i }
            }
            $tgtObj | Add-Member -NotePropertyName instructions -NotePropertyValue $mergedInstructions -Force

            # mcp.servers: add missing servers, keep the user's own.
            if (-not ($tgtObj.PSObject.Properties.Name -contains 'mcp')) {
                $tgtObj | Add-Member -NotePropertyName mcp -NotePropertyValue ([pscustomobject]@{ servers = [pscustomobject]@{} }) -Force
            }
            if (-not ($tgtObj.mcp.PSObject.Properties.Name -contains 'servers')) {
                $tgtObj.mcp | Add-Member -NotePropertyName servers -NotePropertyValue ([pscustomobject]@{}) -Force
            }
            foreach ($serverName in $srcObj.mcp.servers.PSObject.Properties.Name) {
                if (-not ($tgtObj.mcp.servers.PSObject.Properties.Name -contains $serverName)) {
                    $tgtObj.mcp.servers | Add-Member -NotePropertyName $serverName -NotePropertyValue $srcObj.mcp.servers.$serverName -Force
                }
            }

            # plugins: append missing entries.
            $mergedPlugins = @()
            if ($tgtObj.PSObject.Properties.Name -contains 'plugins') { $mergedPlugins = @($tgtObj.plugins) }
            foreach ($p in @($srcObj.plugins)) {
                if ($p -and ($mergedPlugins -notcontains $p)) { $mergedPlugins += $p }
            }
            $tgtObj | Add-Member -NotePropertyName plugins -NotePropertyValue $mergedPlugins -Force

            # The WinGet path only exists on Windows; keep a plain PATH elsewhere.
            if (-not $onWindows -and $tgtObj.mcp.servers.mobile) {
                $mobile = $tgtObj.mcp.servers.mobile
                if ($mobile.PSObject.Properties.Name -contains 'environment') {
                    $mobile.environment | Add-Member -NotePropertyName PATH -NotePropertyValue '{env:PATH}' -Force
                }
            }

            $tgtObj | ConvertTo-Json -Depth 20 | Set-Content $ocConfig -Encoding UTF8
            $installed += "opencode-config (merged)"
        } catch {
            $sidecar = "$ocConfig.devkit.json"
            Copy-Item "$ocSrc\opencode.json" $sidecar -Force
            $opencodeMsgs += "opencode.json is not strict JSON; wrote $sidecar for a manual merge."
        }
    }

    $opencodeMsgs += "OpenCode bundle installed in $ocDest (fallback config in $fallbackDest)."
    $opencodeMsgs += "Next: run 'opencode plugin add opencode-auto-fallback@0.4.61' and restart OpenCode."
}

Write-Output "== installed =="; if ($installed) { $installed | ForEach-Object { "  $_" } } else { "  (none)" }
Write-Output "== skipped ==";   if ($skipped)   { $skipped   | ForEach-Object { "  $_" } } else { "  (none)" }
Write-Output "== pending ==";   if ($pending)   { $pending   | ForEach-Object { "  $_" } } else { "  (none)" }
Write-Output ""
Write-Output "The Chrome MCP is not installed by this script. See mcp\README.md and pick option A or B."
if ($hooksMsg) { Write-Output $hooksMsg }
if ($rulesMsg) { Write-Output $rulesMsg }
$opencodeMsgs | ForEach-Object { Write-Output $_ }
$linkMsgs | ForEach-Object { Write-Output $_ }
Write-Output "Destination: $Dest"
if (Test-Path (Join-Path $Dest ".devkit-backups\$stamp")) {
    Write-Output "Backup of overwritten files: $Dest\.devkit-backups\$stamp"
}
