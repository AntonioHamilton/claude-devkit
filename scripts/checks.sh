#!/usr/bin/env bash
# Runs the project's lint, test and build, detecting the package manager. Used at Gate 1.
# Usage: scripts/checks.sh [project-path]
set -uo pipefail
cd "${1:-.}" || exit 1

fail=0
run() {
  echo "--- $* ---"
  "$@" || fail=1
}

if [ -f package.json ]; then
  if   [ -f pnpm-lock.yaml ]; then pm=pnpm
  elif [ -f yarn.lock ];      then pm=yarn
  elif [ -f bun.lockb ];      then pm=bun
  else pm=npm; fi
  has() { node -e "process.exit(require('./package.json').scripts?.['$1']?0:1)" 2>/dev/null; }
  for s in lint typecheck test build; do
    has "$s" && run "$pm" run "$s"
  done
elif [ -f pyproject.toml ] || [ -f requirements.txt ]; then
  command -v ruff  >/dev/null && run ruff check .
  command -v mypy  >/dev/null && run mypy .
  command -v pytest >/dev/null && run pytest -q
elif [ -f go.mod ]; then
  run go vet ./...
  run go test ./...
elif [ -f Cargo.toml ]; then
  run cargo clippy -- -D warnings
  run cargo test
else
  echo "No recognized project (package.json, pyproject.toml, go.mod, Cargo.toml)."
  echo "Run the project's checks manually and paste the real result."
  exit 2
fi

[ "$fail" -eq 0 ] && echo "CHECKS: OK" || echo "CHECKS: FAILED"
exit "$fail"
