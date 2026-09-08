# Roda lint, teste e build do projeto, detectando o gerenciador. Usado no Gate 1.
# Uso: .\scripts\checks.ps1 [caminho]
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
    Write-Output "Nenhum projeto reconhecido. Rode os checks do projeto manualmente e cole o resultado real."
    exit 2
}

if ($fail -eq 0) { Write-Output "CHECKS: OK" } else { Write-Output "CHECKS: FALHOU" }
exit $fail
