#!/usr/bin/env bash
# Roda lint, teste e build do projeto, detectando o gerenciador. Usado no Gate 1.
# Uso: scripts/checks.sh [caminho-do-projeto]
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
  echo "Nenhum projeto reconhecido (package.json, pyproject.toml, go.mod, Cargo.toml)."
  echo "Rode os checks do projeto manualmente e cole o resultado real."
  exit 2
fi

[ "$fail" -eq 0 ] && echo "CHECKS: OK" || echo "CHECKS: FALHOU"
exit "$fail"
