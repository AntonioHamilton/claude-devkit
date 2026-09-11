#!/usr/bin/env bash
# Instala o claude-devkit em ~/.claude (skills e agents). Nao sobrescreve nada sem --force.
# Uso: ./install.sh [--force] [--dry-run] [--dest ~/.claude]
set -uo pipefail

SRC="$(cd "$(dirname "$0")" && pwd)"
DEST="${HOME}/.claude"
FORCE=0; DRY=0

while [ $# -gt 0 ]; do
  case "$1" in
    --force)   FORCE=1; shift ;;
    --dry-run) DRY=1; shift ;;
    --dest)    DEST="$2"; shift 2 ;;
    *) echo "Argumento desconhecido: $1"; exit 1 ;;
  esac
done

installed=(); skipped=(); pending=()
STAMP=$(date +%Y%m%d%H%M%S)

copy() { # origem destino rotulo
  if [ -e "$2" ] && [ "$FORCE" -eq 0 ]; then
    skipped+=("$3 (ja existe)"); return
  fi
  if [ "$DRY" -eq 1 ]; then installed+=("$3 [dry-run]"); return; fi
  mkdir -p "$(dirname "$2")"
  if [ -e "$2" ]; then
    # Backup fora de skills/ e agents/: pasta .bak ali dentro e carregada como skill de verdade.
    backup="$DEST/.devkit-backups/$STAMP/${2#$DEST/}"
    mkdir -p "$(dirname "$backup")"
    cp -r "$2" "$backup"
    # Remover antes de copiar: cp -r com destino existente aninha em vez de sobrescrever.
    rm -rf "$2"
  fi
  cp -r "$1" "$2"
  installed+=("$3")
}

for d in "$SRC"/skills/*/; do
  name=$(basename "$d")
  if [ ! -f "$d/SKILL.md" ]; then pending+=("skill:$name (sem SKILL.md)"); continue; fi
  copy "$d" "$DEST/skills/$name" "skill:$name"
done

for f in "$SRC"/agents/*.md; do
  [ -e "$f" ] || continue
  copy "$f" "$DEST/agents/$(basename "$f")" "agent:$(basename "$f" .md)"
done

echo "== instalado =="; printf '  %s\n' "${installed[@]:-(nada)}"
echo "== pulado ==";    printf '  %s\n' "${skipped[@]:-(nada)}"
echo "== pendente ==";  printf '  %s\n' "${pending[@]:-(nada)}"
echo
echo "MCP do Chrome nao e instalado por este script. Veja mcp/README.md e escolha a opcao A ou B."
echo "Destino: $DEST"
[ -d "$DEST/.devkit-backups/$STAMP" ] && echo "Backup do que foi sobrescrito: $DEST/.devkit-backups/$STAMP"
