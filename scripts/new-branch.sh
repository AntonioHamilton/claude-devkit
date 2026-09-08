#!/usr/bin/env bash
# Cria uma branch a partir da default do repo. Usado na etapa Branch do manager.
# Uso: scripts/new-branch.sh feat/nome-da-tarefa
set -euo pipefail
[ $# -eq 1 ] || { echo "Uso: $0 <tipo/slug>"; exit 1; }

git rev-parse --is-inside-work-tree >/dev/null 2>&1 || { echo "Nao e um repositorio git."; exit 1; }

if [ -n "$(git status --porcelain)" ]; then
  echo "Ha mudancas nao commitadas. Resolva antes (commit ou stash) - o manager deve perguntar ao usuario."
  git status --short
  exit 1
fi

base=$(git symbolic-ref --quiet --short refs/remotes/origin/HEAD 2>/dev/null | sed 's#^origin/##')
base=${base:-main}
git show-ref --verify --quiet "refs/heads/$base" || base=master

git switch "$base"
git pull --ff-only || echo "aviso: pull falhou, seguindo com o estado local de $base"
git switch -c "$1"
echo "Branch $1 criada a partir de $base."
