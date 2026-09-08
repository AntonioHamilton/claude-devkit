# Cria uma branch a partir da default do repo. Usado na etapa Branch do manager.
# Uso: .\scripts\new-branch.ps1 feat/nome-da-tarefa
param([Parameter(Mandatory=$true)][string]$Name)

git rev-parse --is-inside-work-tree | Out-Null
if (-not $?) { Write-Output "Nao e um repositorio git."; exit 1 }

$dirty = git status --porcelain
if ($dirty) {
    Write-Output "Ha mudancas nao commitadas. Resolva antes - o manager deve perguntar ao usuario."
    Write-Output $dirty
    exit 1
}

$base = "main"
try { $ref = git symbolic-ref --quiet --short refs/remotes/origin/HEAD; if ($ref) { $base = $ref -replace '^origin/','' } } catch {}
git show-ref --verify --quiet "refs/heads/$base"
if (-not $?) { $base = "master" }

git switch $base
git pull --ff-only
if (-not $?) { Write-Output "aviso: pull falhou, seguindo com o estado local de $base" }
git switch -c $Name
Write-Output "Branch $Name criada a partir de $base."
