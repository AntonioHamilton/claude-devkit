# Abre PR da branch atual. So rodar depois do ok explicito do usuario (etapa Ship).
# Uso: .\scripts\open-pr.ps1 "titulo" [caminho-da-spec]
param([Parameter(Mandatory=$true)][string]$Title, [string]$Spec)

if (-not (Get-Command gh -ErrorAction SilentlyContinue)) { Write-Output "gh CLI nao encontrado."; exit 1 }

$branch = git rev-parse --abbrev-ref HEAD
if ($branch -eq "main" -or $branch -eq "master") { Write-Output "Voce esta na $branch. Nao abra PR daqui."; exit 1 }

$commits = git log --oneline "main..HEAD" | ForEach-Object { "- $_" }
$body = "## Resumo`n`n" + ($commits -join "`n")
if ($Spec -and (Test-Path $Spec)) { $body += "`n`n## Spec`n`n``$Spec``" }

git push -u origin $branch
gh pr create --title $Title --body $body
