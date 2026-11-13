#!/usr/bin/env bash
# Opens a PR for the current branch. Run only after the user's explicit approval (Ship step).
# Usage: scripts/open-pr.sh "title" [spec-path]
set -euo pipefail
[ $# -ge 1 ] || { echo "Usage: $0 \"title\" [spec.md]"; exit 1; }
command -v gh >/dev/null || { echo "gh CLI not found."; exit 1; }

branch=$(git rev-parse --abbrev-ref HEAD)
[ "$branch" != "main" ] && [ "$branch" != "master" ] || { echo "You are on $branch. Do not open a PR from here."; exit 1; }

body="## Summary"$'\n\n'"$(git log --oneline "$(git merge-base HEAD @{u} 2>/dev/null || echo main)"..HEAD 2>/dev/null | sed 's/^/- /')"
[ $# -ge 2 ] && [ -f "$2" ] && body="$body"$'\n\n'"## Spec"$'\n\n'"\`$2\`"

git push -u origin "$branch"
gh pr create --title "$1" --body "$body"
