#!/usr/bin/env bash
# Abre PR da branch atual. So rodar depois do ok explicito do usuario (etapa Ship).
# Uso: scripts/open-pr.sh "titulo" [caminho-da-spec]
set -euo pipefail
[ $# -ge 1 ] || { echo "Uso: $0 \"titulo\" [spec.md]"; exit 1; }
command -v gh >/dev/null || { echo "gh CLI nao encontrado."; exit 1; }

branch=$(git rev-parse --abbrev-ref HEAD)
[ "$branch" != "main" ] && [ "$branch" != "master" ] || { echo "Voce esta na $branch. Nao abra PR daqui."; exit 1; }

body="## Resumo"$'\n\n'"$(git log --oneline "$(git merge-base HEAD @{u} 2>/dev/null || echo main)"..HEAD 2>/dev/null | sed 's/^/- /')"
[ $# -ge 2 ] && [ -f "$2" ] && body="$body"$'\n\n'"## Spec"$'\n\n'"\`$2\`"

git push -u origin "$branch"
gh pr create --title "$1" --body "$body"
