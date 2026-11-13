# Runs the project's lint, test and build, detecting the package manager. Used at Gate 1.
# Usage: .\scripts\checks.ps1 [path]
param([string]$Path = ".")
Set-Location $Path
$fail = 0

function Run-Step {
    param([string]$Cmd, [string[]]$Args)
    Write-Output "--- $Cmd $($Args -join ' ') ---"
    & $Cmd @Args
    if ($LASTEXITCODE -ne 0) { $script:fail = 1 }
}

if (Test-Path package.json) {
    $pm = "npm"
    if (Test-Path pnpm-lock.yaml) { $pm = "pnpm" }
    elseif (Test-Path yarn.lock)  { $pm = "yarn" }
    elseif (Test-Path bun.lockb)  { $pm = "bun" }
    $pkg = Get-Content package.json -Raw | ConvertFrom-Json
    foreach ($s in @("lint","typecheck","test","build")) {
        if ($pkg.scripts -and $pkg.scripts.PSObject.Properties.Name -contains $s) {
            Run-Step $pm @("run", $s)
        }
    }
}
elseif ((Test-Path pyproject.toml) -or (Test-Path requirements.txt)) {
    if (Get-Command ruff   -ErrorAction SilentlyContinue) { Run-Step "ruff" @("check",".") }
    if (Get-Command mypy   -ErrorAction SilentlyContinue) { Run-Step "mypy" @(".") }
    if (Get-Command pytest -ErrorAction SilentlyContinue) { Run-Step "pytest" @("-q") }
}
elseif (Test-Path go.mod) {
    Run-Step "go" @("vet","./..."); Run-Step "go" @("test","./...")
}
elseif (Test-Path Cargo.toml) {
    Run-Step "cargo" @("clippy","--","-D","warnings"); Run-Step "cargo" @("test")
}
else {
    Write-Output "No recognized project. Run the project's checks manually and paste the real result."
    exit 2
}

if ($fail -eq 0) { Write-Output "CHECKS: OK" } else { Write-Output "CHECKS: FAILED" }
exit $fail
