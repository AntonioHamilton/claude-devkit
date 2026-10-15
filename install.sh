#!/usr/bin/env bash
# Instala o claude-devkit em ~/.claude (skills e agents). Nao sobrescreve nada sem --force.
# Uso: ./install.sh [--force] [--dry-run] [--no-hooks] [--no-rules] [--link-agents] [--dest ~/.claude]
set -uo pipefail

SRC="$(cd "$(dirname "$0")" && pwd)"
DEST="${HOME}/.claude"
FORCE=0; DRY=0; HOOKS=1; RULES=1; LINK=0

while [ $# -gt 0 ]; do
  case "$1" in
    --force)   FORCE=1; shift ;;
    --dry-run) DRY=1; shift ;;
    --no-hooks) HOOKS=0; shift ;;
    --no-rules) RULES=0; shift ;;
    --link-agents) LINK=1; shift ;;
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

rules_msg=""
if [ "$RULES" -eq 1 ]; then
  copy "$SRC/rules/devkit-rules.md" "$DEST/devkit-rules.md" "rules:devkit-rules"
  if grep -qxF '@devkit-rules.md' "$DEST/CLAUDE.md" 2>/dev/null; then
    rules_msg="regras de ouro ja importadas em $DEST/CLAUDE.md."
  elif [ "$DRY" -eq 1 ]; then
    rules_msg="[dry-run] adicionaria '@devkit-rules.md' ao fim de $DEST/CLAUDE.md."
  else
    mkdir -p "$DEST/.devkit-backups/$STAMP"
    [ -e "$DEST/CLAUDE.md" ] && cp "$DEST/CLAUDE.md" "$DEST/.devkit-backups/$STAMP/CLAUDE.md"
    printf '
@devkit-rules.md
' >> "$DEST/CLAUDE.md"
    rules_msg="adicionei '@devkit-rules.md' ao fim de $DEST/CLAUDE.md (backup em .devkit-backups). Remover: apague essa linha."
  fi
fi
[ -e "$DEST/agents/manager.md" ] && rules_msg="$rules_msg ATENCAO: $DEST/agents/manager.md e legado (o manager agora e a skill); apague-o para a sessao nao despachar o manager como subagent."

hooks_msg=""
if [ "$HOOKS" -eq 1 ]; then
  if ! command -v node >/dev/null 2>&1; then
    hooks_msg="hooks do Jev NAO instalados: Node.js nao encontrado (precisa do Node 22+)."
  else
    copy "$SRC/hooks/jev-hooks.mjs" "$DEST/hooks/jev-hooks.mjs" "hook:jev-hooks"
    extra=(); [ "$DRY" -eq 1 ] && extra=(--dry-run)
    copy "$SRC/hooks/session-start.mjs" "$DEST/hooks/session-start.mjs" "hook:session-start"
    node "$SRC/hooks/merge-settings.mjs" "$DEST/settings.json" "$DEST/hooks/jev-hooks.mjs" --banner="$DEST/hooks/session-start.mjs" "${extra[@]}"       && hooks_msg="hooks registrados em $DEST/settings.json: banner de inicio de sessao (DEVKIT_BANNER=off desliga) e hooks do Jev (so agem se TYPESAFE_API_KEY existir; JEV_HOOKS=off desliga)."       || hooks_msg="falha ao registrar os hooks do Jev em settings.json."
  fi
fi

link_msgs=()
if [ "$LINK" -eq 1 ]; then
  for t in "$HOME/.agents/skills" "$HOME/.codex/skills" "$HOME/.config/opencode/skills" "$HOME/.kimi-code/skills"; do
    if [ ! -d "$t" ]; then link_msgs+=("link: $t nao existe, pulado"); continue; fi
    n=0
    for d in "$SRC"/skills/*/; do
      name=$(basename "$d"); [ -f "$d/SKILL.md" ] || continue
      if [ -e "$t/$name" ] || [ -L "$t/$name" ]; then continue; fi
      if [ "$DRY" -eq 0 ]; then ln -s "$DEST/skills/$name" "$t/$name" 2>/dev/null || continue; fi
      n=$((n+1))
    done
    link_msgs+=("link: $n skill(s) ligadas em $t")
  done
fi

echo "== instalado =="; printf '  %s\n' "${installed[@]:-(nada)}"
echo "== pulado ==";    printf '  %s\n' "${skipped[@]:-(nada)}"
echo "== pendente ==";  printf '  %s\n' "${pending[@]:-(nada)}"
echo
echo "MCP do Chrome nao e instalado por este script. Veja mcp/README.md e escolha a opcao A ou B."
[ -n "$hooks_msg" ] && echo "$hooks_msg"
[ -n "$rules_msg" ] && echo "$rules_msg"
[ ${#link_msgs[@]} -gt 0 ] && printf '%s\n' "${link_msgs[@]}"
[ "$HOOKS" -eq 1 ] && echo "Privacidade: com a key, os hooks enviam a TypeSafe prompts, comandos Bash de aparencia arriscada e texto de paginas lidas (segredos mascarados). Use --no-hooks para nao instalar."
echo "Destino: $DEST"
[ -d "$DEST/.devkit-backups/$STAMP" ] && echo "Backup do que foi sobrescrito: $DEST/.devkit-backups/$STAMP"
