---
name: devkit-memory
description: Persistent memory of what changes HOW the agent works — code preferences, spec decisions, pipeline lessons, and what did not become code (research, discarded alternatives, reasons). Keeps an index of specs per project and lessons by topic in ~/.claude/memory/. Use when the user says "lembre disso", "/devkit-memory", when the manager closes a task, or when it is useful to check what has already been learned.
---

# Memory

Memory in markdown, global — applies to any project. Simple file, editable by hand, searched by grep. No semantic search, no database, no background agent.

Two locations, in this order:

1. **Obsidian vault** (preferred, shared across tools and machines): `<vault>/_memoria/devkit/`, with the same structure as below.
2. **Local fallback**: `~/.claude/memory/` (or `~/.agents/memory/` outside Claude Code), when no vault is configured.

From here on, `<memory>` is the active location.

## Vault configuration

The vault path lives in `~/.claude/memory/config.md` (always local, never inside the vault):

```markdown
vault: C:\caminho\doault
```

- If the file is missing, **ask once** for the vault path (or whether the user wants only the local one), confirm the folder exists, and save `config.md`. Do not guess the path.
- Inside the vault, only write to `_memoria/devkit/`. Never touch other folders in the vault.
- Files use simple YAML frontmatter (`tipo`, `atualizado`, `projeto`/`tema`) and `[[wikilink]]` links between pages, so Obsidian builds the graph.

## Boundary — what goes here

Only **what changes how Claude works** goes in: code preference, spec decision and its reason, pipeline lesson, tool pitfall.

**What happened does not go in.** Narrative session logs, personal projects, study, life — that belongs to `/vault`, which stores by topic in the notes vault. If both seem to fit, ask: *does this change how I should work next time?* If not, it is `/vault`.

Also excluded: anything the repository already records (code structure, git history, `CLAUDE.md`), or anything that only applies to this conversation.

## Structure

```
<memory>/
├── core.md                # summary + pointers — always read
├── preferencias.md        # how Claude should work — always read
├── projects/<project>.md  # index of specs + lessons for that repository
├── topics/<topic>.md      # cross-cutting lesson (godot, powershell, git, ...)
└── _arquivo/              # what cleanup retired (restorable)
```

`<project>` is the name of the repository's root folder. `<topic>` is kebab-case, created on the spot if it does not exist.

If the directory does not exist, create it on the first write, together with empty `core.md` and `preferencias.md`.

## Entry format

An entry is a `##` block. Atomic: one fact per block.

```markdown
## <Short title> [YYYY-MM-DD]
<The fact in 1–3 sentences, including the why.>
```

In `core.md`, the entry is a summary plus a pointer — never the full content:

```markdown
## <Topic>
<One line.>
→ topics/<topic>.md
```

Spec entry, in `projects/<project>.md`, points to the file instead of copying it:

```markdown
## <spec slug> [YYYY-MM-DD]
- **Spec:** <absolute path of openspec/changes/<slug>/>
- **Decidido:** <the decisions that matter beyond this task>
- **O que deu errado:** <what was redone, what the reviewer caught, what the human verification rejected — or "nothing">
```

## Commands

### `/devkit-memory salvar <observation>`

1. Classify: work preference → `preferencias.md`; tied to a repository → `projects/<project>.md`; cross-cutting lesson → `topics/<topic>.md`.
2. Read the target file before writing. If there is already an entry about the same fact, **update that entry** instead of creating a second one — memory with two versions of the same fact is worse than empty memory.
3. Append or update the entry, dated.
4. Only touch `core.md` if the fact recurs or applies beyond that project. `core.md` is always read: every line there costs context on every task.
5. Report: "Saved to `<path>`."

### `/devkit-memory buscar <term>`

1. `grep` in `core.md` and `preferencias.md`.
2. Follow the pointers of the topics that matched and read those files.
3. Return the relevant entries with the path of each one. Nothing found: say "nothing in memory about this" — do not fill it in with assumptions.

### `/devkit-memory carregar`

Context read: `preferencias.md` + `core.md` + `projects/<project>.md` for the current repository, if it exists. Summarize in a few lines what applies to the task at hand.

### `/devkit-memory ver`

List the tree of `~/.claude/memory/`, the contents of `core.md`, and the title of each file's entries.

### `/devkit-memory esquecer <topic>`

Permanently deleting is destructive: **show what will be removed and ask for confirmation first**. Prefer `/devkit-memory consolidar`, which archives instead of deleting. Once confirmed, remove the file or the entry and the matching line in `core.md`.

### `/devkit-memory consolidar`

Reorganizes memory. Run it when closing a large task, or when `core.md` goes past ~60 lines.

1. Read all the files in `<memory>`.
2. Propose a list of changes, **without applying them**: duplicates to merge, contradictions (the most recent wins; mark the old one), entries the repository already records, entries that cite a file/function/flag that no longer exists (verify), entries too vague to change behavior, a topic with 3+ entries that deserves its own `topics/` file.
3. Show the list and ask for ok. With the ok, apply it.
4. Nothing is truly deleted: a removed entry goes to `_arquivo/YYYY-MM-DD.md` with the reason. Only `/devkit-memory esquecer` deletes permanently.
5. Rewrite `core.md` as a short summary with pointers and report how many entries were merged, archived and kept.

## Hard rules

- Do not invent entries. Only what the user said or what actually happened in the session goes in.
- Always an absolute date (`2026-09-11`), never "yesterday" or "last week".
- A wrong entry is debt: if something turns out to be false, fix or delete it right away.
- Retrieved memory describes what was true when it was written. If the entry cites a file, function or flag, confirm it still exists before recommending it.
- Memory in the vault is shared: no secrets, tokens, or third parties' personal data.
- Never copy the whole spec here. The spec lives in the repository, under version control; here goes the pointer and what was decided.
