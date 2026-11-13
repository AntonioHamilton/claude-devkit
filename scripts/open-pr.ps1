# Opens a PR for the current branch. Run only after the user's explicit approval (Ship step).
# Usage: .\scripts\open-pr.ps1 "title" [spec-path]
param([Parameter(Mandatory=$true)][string]$Title, [string]$Spec)

if (-not (Get-Command gh -ErrorAction SilentlyContinue)) { Write-Output "gh CLI not found."; exit 1 }

$branch = git rev-parse --abbrev-ref HEAD
if ($branch -eq "main" -or $branch -eq "master") { Write-Output "You are on $branch. Do not open a PR from here."; exit 1 }

$commits = git log --oneline "main..HEAD" | ForEach-Object { "- $_" }
$body = "## Summary`n`n" + ($commits -join "`n")
if ($Spec -and (Test-Path $Spec)) { $body += "`n`n## Spec`n`n``$Spec``" }

git push -u origin $branch
gh pr create --title $Title --body $body
