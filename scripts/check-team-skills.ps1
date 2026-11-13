# Checks the five team skills, the per-harness roster, and the references in the README/rules.
# Usage: .\scripts\check-team-skills.ps1
# Kept ASCII-only so it runs on Windows PowerShell 5.1 and PowerShell 7.
$ErrorActionPreference = "Stop"
$root = Split-Path $PSScriptRoot -Parent
$fail = 0

$teams = [ordered]@{
    "game-dev-team"     = @("godot", "godot-gdscript")
    "frontend-team"     = @("frontend", "visual-validator")
    "backend-team"      = @("backend", "reviewer")
    "react-native-team" = @("react-native", "tester")
    "regression-team"   = @("regression-tester", "reviewer")
}

$required = @(
    @{ Label = "When to use";       Needle = "## When to use" },
    @{ Label = "When not to use";   Needle = "## When not to use" },
    @{ Label = "Roster";            Needle = "## Roster" },
    @{ Label = "Handoffs";          Needle = "## Handoffs" },
    @{ Label = "Verification";      Needle = "## Verification" },
    @{ Label = "Acceptance criteria"; Needle = "## Acceptance criteria" }
)

function Read-Utf8([string]$Path) {
    return [IO.File]::ReadAllText($Path, [Text.Encoding]::UTF8)
}

foreach ($team in $teams.Keys) {
    $path = Join-Path $root "skills\$team\SKILL.md"
    if (-not (Test-Path $path)) {
        Write-Output "FAIL: $team has no SKILL.md"
        $fail = 1
        continue
    }

    $text = Read-Utf8 $path
    if (-not $text.StartsWith("---")) {
        Write-Output "FAIL: $team has no frontmatter"
        $fail = 1
    }
    if (-not $text.Contains("name:") -or -not $text.Contains("description:")) {
        Write-Output "FAIL: $team has no name/description in the frontmatter"
        $fail = 1
    }

    foreach ($item in $required) {
        if (-not $text.Contains($item.Needle)) {
            Write-Output "FAIL: $team missing section '$($item.Label)'"
            $fail = 1
        }
    }

    if (-not $text.Contains("| Role | OpenCode | Claude Code |")) {
        Write-Output "FAIL: $team roster has no OpenCode/Claude Code columns"
        $fail = 1
    }

    foreach ($agent in $teams[$team]) {
        $needle = '`' + $agent + '`'
        if (-not $text.Contains($needle)) {
            Write-Output "FAIL: $team does not cite agent $agent"
            $fail = 1
        }
    }

    if ($text.Contains("unity-developer") -or $text.Contains("level-designer")) {
        Write-Output "FAIL: $team cites an agent that does not exist in this harness"
        $fail = 1
    }
}

$readme = Read-Utf8 (Join-Path $root "README.md")
$rules = Read-Utf8 (Join-Path $root "rules\devkit-rules.md")

foreach ($team in $teams.Keys) {
    if (-not $readme.Contains($team)) {
        Write-Output "FAIL: README does not cite $team"
        $fail = 1
    }
}
if (-not $rules.Contains("game-dev-team")) {
    Write-Output "FAIL: golden rules do not cite the teams"
    $fail = 1
}

if ($fail -eq 0) {
    Write-Output "PASS: 5 teams with roster, handoffs, verification and references in the README/rules."
}
exit $fail
