#!/usr/bin/env bash
# Creates a branch from the repo's default branch. Used in the manager's Branch step.
# Usage: scripts/new-branch.sh feat/task-name
set -euo pipefail
[ $# -eq 1 ] || { echo "Usage: $0 <type/slug>"; exit 1; }

git rev-parse --is-inside-work-tree >/dev/null 2>&1 || { echo "Not a git repository."; exit 1; }

if [ -n "$(git status --porcelain)" ]; then
  echo "There are uncommitted changes. Resolve them first (commit or stash) - the manager must ask the user."
  git status --short
  exit 1
fi

base=$(git symbolic-ref --quiet --short refs/remotes/origin/HEAD 2>/dev/null | sed 's#^origin/##')
base=${base:-main}
git show-ref --verify --quiet "refs/heads/$base" || base=master

git switch "$base"
git pull --ff-only || echo "warning: pull failed, continuing with the local state of $base"
git switch -c "$1"
echo "Branch $1 created from $base."
