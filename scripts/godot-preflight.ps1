param(
    [string]$ProjectPath = ".",
    [string]$GodotPath = "godot",
    [switch]$ValidateProject
)

$ErrorActionPreference = "Stop"
$project = (Resolve-Path -LiteralPath $ProjectPath -ErrorAction SilentlyContinue)
if (-not $project) {
    Write-Error "Project directory not found: $ProjectPath"
    exit 2
}

$godotCommand = Get-Command $GodotPath -ErrorAction SilentlyContinue
if (-not $godotCommand) {
    Write-Output "BLOCKED: Godot executable not found. No software was installed."
    Write-Output "Install Godot separately or pass -GodotPath <path-to-godot.exe>, then rerun."
    exit 3
}

$projectFile = Join-Path $project.Path "project.godot"
if (-not (Test-Path -LiteralPath $projectFile -PathType Leaf)) {
    Write-Error "No project.godot found in: $($project.Path)"
    exit 2
}

$godotExe = $godotCommand.Source
$version = & $godotExe --version
if ($LASTEXITCODE -ne 0) {
    Write-Error "Godot version check failed: $godotExe"
    exit $LASTEXITCODE
}

Write-Output "Godot: $version"
Write-Output "Project: $($project.Path)"

if ($ValidateProject) {
    & $godotExe --headless --path $project.Path --editor --quit
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Godot headless project validation failed."
        exit $LASTEXITCODE
    }
    Write-Output "Godot headless project validation: PASS"
} else {
    Write-Output "Preflight only. Pass -ValidateProject to run the project import/parse check."
}

exit 0
