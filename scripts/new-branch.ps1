# Creates a branch from the repo's default branch. Used in the manager's Branch step.
# Usage: .\scripts\new-branch.ps1 feat/task-name
param([Parameter(Mandatory=$true)][string]$Name)

git rev-parse --is-inside-work-tree | Out-Null
if (-not $?) { Write-Output "Not a git repository."; exit 1 }

$dirty = git status --porcelain
if ($dirty) {
    Write-Output "There are uncommitted changes. Resolve them first - the manager must ask the user."
    Write-Output $dirty
    exit 1
}

$base = "main"
try { $ref = git symbolic-ref --quiet --short refs/remotes/origin/HEAD; if ($ref) { $base = $ref -replace '^origin/','' } } catch {}
git show-ref --verify --quiet "refs/heads/$base"
if (-not $?) { $base = "master" }

git switch $base
git pull --ff-only
if (-not $?) { Write-Output "warning: pull failed, continuing with the local state of $base" }
git switch -c $Name
Write-Output "Branch $Name created from $base."
