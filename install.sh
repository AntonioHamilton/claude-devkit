#!/usr/bin/env bash
# Installs claude-devkit into ~/.claude (skills and agents). Never overwrites without --force.
# Usage: ./install.sh [--force] [--dry-run] [--no-claude] [--no-hooks] [--no-rules] [--link-agents] [--opencode] [--dest ~/.claude] [--opencode-dest ~/.config/opencode]
# --no-claude skips the Claude Code specifics (agents, CLAUDE.md import, hooks). Skills are still copied to --dest.
set -uo pipefail

SRC="$(cd "$(dirname "$0")" && pwd)"
DEST="${HOME}/.claude"
FORCE=0; DRY=0; NOCLAUDE=0; HOOKS=1; RULES=1; LINK=0; OPENCODE=0; OCDEST=""

while [ $# -gt 0 ]; do
  case "$1" in
    --force)   FORCE=1; shift ;;
    --dry-run) DRY=1; shift ;;
    --no-claude) NOCLAUDE=1; shift ;;
    --no-hooks) HOOKS=0; shift ;;
    --no-rules) RULES=0; shift ;;
    --link-agents) LINK=1; shift ;;
    --opencode) OPENCODE=1; shift ;;
    --dest)    DEST="$2"; shift 2 ;;
    --opencode-dest) OCDEST="$2"; shift 2 ;;
    *) echo "Unknown argument: $1"; exit 1 ;;
  esac
done

installed=(); skipped=(); pending=()
STAMP=$(date +%Y%m%d%H%M%S)

copy() { # source destination label [base]
  local base="${4:-$DEST}"
  if [ -e "$2" ] && [ "$FORCE" -eq 0 ]; then
    skipped+=("$3 (already exists)"); return
  fi
  if [ "$DRY" -eq 1 ]; then installed+=("$3 [dry-run]"); return; fi
  mkdir -p "$(dirname "$2")"
  if [ -e "$2" ]; then
    # Back up outside skills/ and agents/: a .bak folder inside them is loaded as a real skill.
    backup="$base/.devkit-backups/$STAMP/${2#$base/}"
    mkdir -p "$(dirname "$backup")"
    cp -r "$2" "$backup"
    # Remove before copying: cp -r with an existing destination nests instead of overwriting.
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
  [ "$NOCLAUDE" -eq 1 ] && break
  [ -e "$f" ] || continue
  copy "$f" "$DEST/agents/$(basename "$f")" "agent:$(basename "$f" .md)"
done

rules_msg=""
if [ "$RULES" -eq 1 ] && [ "$NOCLAUDE" -eq 0 ]; then
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
    rules_msg="added '@devkit-rules.md' to the end of $DEST/CLAUDE.md (backup in .devkit-backups). To remove: delete that line."
  fi
fi
[ -e "$DEST/agents/manager.md" ] && rules_msg="$rules_msg WARNING: $DEST/agents/manager.md is legacy (the manager is now a skill); delete it so the session does not dispatch the manager as a subagent."

hooks_msg=""
if [ "$HOOKS" -eq 1 ] && [ "$NOCLAUDE" -eq 0 ]; then
  if ! command -v node >/dev/null 2>&1; then
    hooks_msg="Claude hooks NOT installed: Node.js not found (needs Node 22+)."
  else
    extra=(); [ "$DRY" -eq 1 ] && extra=(--dry-run)
    copy "$SRC/hooks/memoria-stop.mjs" "$DEST/hooks/memoria-stop.mjs" "hook:memoria-stop"
    copy "$SRC/hooks/session-start.mjs" "$DEST/hooks/session-start.mjs" "hook:session-start"
    node "$SRC/hooks/merge-settings.mjs" "$DEST/settings.json" "$DEST/hooks" "${extra[@]}" && hooks_msg="hooks registered in $DEST/settings.json: session banner (DEVKIT_BANNER=off turns it off) and memory reminder on Stop (DEVKIT_MEMORIA=off turns it off)." || hooks_msg="failed to register the Claude hooks in settings.json."
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

opencode_msgs=()
if [ "$OPENCODE" -eq 1 ]; then
  OCSRC="$SRC/config/opencode"
  if [ -n "$OCDEST" ]; then
    FALLBACKDEST="$OCDEST"
  else
    OCDEST="$HOME/.config/opencode"
    FALLBACKDEST="$OCDEST"
    case "$(uname -s)" in
      MINGW*|MSYS*|CYGWIN*)
        if [ -n "${APPDATA:-}" ] && command -v cygpath >/dev/null 2>&1; then
          FALLBACKDEST="$(cygpath -u "$APPDATA")/opencode"
        fi
        ;;
    esac
  fi

  # Skills (same tree as Claude, so both harnesses share the content).
  for d in "$SRC"/skills/*/; do
    name=$(basename "$d")
    [ -f "$d/SKILL.md" ] || continue
    copy "$d" "$OCDEST/skills/$name" "opencode-skill:$name" "$OCDEST"
  done

  # OpenCode agents (the portable English set from config/opencode/agents).
  for f in "$OCSRC"/agents/*.md; do
    [ -e "$f" ] || continue
    copy "$f" "$OCDEST/agents/$(basename "$f")" "opencode-agent:$(basename "$f" .md)" "$OCDEST"
  done

  # RTK plugin, golden rules and the OpenCode instructions file.
  copy "$OCSRC/plugins/rtk.ts" "$OCDEST/plugins/rtk.ts" "opencode-plugin:rtk" "$OCDEST"
  copy "$SRC/rules/devkit-rules.md" "$OCDEST/devkit-rules.md" "opencode-rules" "$OCDEST"
  copy "$OCSRC/devkit-opencode.md" "$OCDEST/devkit-opencode.md" "opencode-instructions" "$OCDEST"

  # Free-model fallback chain.
  copy "$OCSRC/fallback.json" "$FALLBACKDEST/fallback.json" "opencode-fallback" "$FALLBACKDEST"

  # opencode.json is merged, never replaced: it may hold the user's providers and MCP servers.
  occonfig="$OCDEST/opencode.json"
  if [ ! -e "$occonfig" ]; then
    copy "$OCSRC/opencode.json" "$occonfig" "opencode-config" "$OCDEST"
  elif [ "$DRY" -eq 1 ]; then
    installed+=("opencode-config [dry-run merge]")
  elif ! command -v node >/dev/null 2>&1; then
    cp "$OCSRC/opencode.json" "$occonfig.devkit.json"
    opencode_msgs+=("Node.js not found; wrote $occonfig.devkit.json for a manual merge.")
  else
    if node - "$OCSRC/opencode.json" "$occonfig" <<'NODE'
const fs = require('fs')
const [srcPath, tgtPath] = process.argv.slice(2)
const src = JSON.parse(fs.readFileSync(srcPath, 'utf8'))
let tgt
try { tgt = JSON.parse(fs.readFileSync(tgtPath, 'utf8')) } catch { process.exit(2) }
const uniq = (a, b) => { const out = [...(a || [])]; for (const x of (b || [])) if (!out.includes(x)) out.push(x); return out }
tgt.instructions = uniq((tgt.instructions || []).filter(x => !/devkit-(rules|opencode)\.md$/.test(x)), src.instructions)
tgt.plugins = uniq(tgt.plugins, src.plugins)
tgt.mcp = tgt.mcp || {}
tgt.mcp.servers = tgt.mcp.servers || {}
for (const [k, v] of Object.entries(src.mcp?.servers || {})) if (!(k in tgt.mcp.servers)) tgt.mcp.servers[k] = v
if (process.platform !== 'win32' && tgt.mcp.servers.mobile?.environment) tgt.mcp.servers.mobile.environment.PATH = '{env:PATH}'
fs.writeFileSync(tgtPath, JSON.stringify(tgt, null, 2) + '\n')
NODE
    then
      mkdir -p "$OCDEST/.devkit-backups/$STAMP"
      cp "$occonfig" "$OCDEST/.devkit-backups/$STAMP/opencode.json"
      installed+=("opencode-config (merged)")
    else
      cp "$OCSRC/opencode.json" "$occonfig.devkit.json"
      opencode_msgs+=("opencode.json is not strict JSON; wrote $occonfig.devkit.json for a manual merge.")
    fi
  fi

  opencode_msgs+=("OpenCode bundle installed in $OCDEST (fallback config in $FALLBACKDEST).")
  opencode_msgs+=("Next: run 'opencode plugin add opencode-auto-fallback@0.4.61' and restart OpenCode.")
fi

echo "== installed =="; printf '  %s\n' "${installed[@]:-(none)}"
echo "== skipped ==";   printf '  %s\n' "${skipped[@]:-(none)}"
echo "== pending ==";   printf '  %s\n' "${pending[@]:-(none)}"
echo
echo "The Chrome MCP is not installed by this script. See mcp/README.md and pick option A or B."
[ -n "$hooks_msg" ] && echo "$hooks_msg"
[ -n "$rules_msg" ] && echo "$rules_msg"
[ ${#opencode_msgs[@]} -gt 0 ] && printf '%s\n' "${opencode_msgs[@]}"
[ ${#link_msgs[@]} -gt 0 ] && printf '%s\n' "${link_msgs[@]}"
echo "Destination: $DEST"
[ -d "$DEST/.devkit-backups/$STAMP" ] && echo "Backup of overwritten files: $DEST/.devkit-backups/$STAMP"
exit 0
