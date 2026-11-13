# Design

## Context

See `proposal.md` for motivation. The repo currently has Portuguese source guidance in `AGENTS.md`, `rules/`, installation documentation, skills, script comments, and OpenSpec metadata. `openspec/config.yaml` currently requires Portuguese artifacts, which conflicts with the user's explicit request for an English repository. The user-facing language rule must remain dynamic and follow the language of each user message.

## Goals / Non-Goals

**Goals:**

- Make maintained repository prose consistently English across source documentation, agent instructions, skills, and OpenSpec artifacts.
- Keep technical examples and machine-readable contracts stable.
- Establish English as the repository-writing language while preserving the language of chat responses.

**Non-Goals:**

- Translate files under the user's global home/config directories or any vault outside this repository.
- Rename skill IDs, paths, commands, model IDs, environment variables, schemas, or public API identifiers.
- Translate code, executable literals, or exact error/output fixtures when changing them would break a contract.
- Rewrite upstream source content solely for style; preserve upstream text that is already English and keep attribution and license notices.

## Decisions

### Translate natural-language prose, not technical payloads

Use a file inventory over the repository text formats: Markdown, PowerShell, Bash, JavaScript/TypeScript, Python, YAML, and JSON. Translate Portuguese prose in documentation, comments, descriptions, and prompts. Leave code blocks, commands, stable filenames, identifiers, URLs, and protocol literals unchanged unless the text is explicitly repository-owned human-facing copy. Update any tests whose expected human-readable output changes, without changing machine-facing keys.

### Preserve upstream provenance and licensing

Before editing an upstream-derived skill or agent, check its source and license notes. Keep already-English upstream bodies unchanged. Translate repository-owned attribution/footer text only where doing so does not alter an upstream contract; retain all source links and license notices. If a file has unclear modification rights, do not translate or replace its upstream body in this change—record the exception and ask before making a derivative rewrite.

### Make the language rule explicit in the repo

Update `AGENTS.md`, `rules/devkit-rules.md`, and `openspec/config.yaml` so repository artifacts are English, while assistant responses follow the language of the current user message. This is a repository-local rule only; do not edit the global copies in `~/.claude` or `~/.config/opencode`.

### Verify both language and behavior

Run a dictionary/diacritic scan over repository text files and review matches manually; identifiers and test fixtures can create false positives. Then run `git diff --check`, the dry-run installer, relevant script syntax checks, and strict validation of each new OpenSpec change. Compare code fences, URLs, model IDs, shell commands, and config keys before and after translation.

## Risks / Trade-offs

- [A broad translation can alter shell commands, permission names, or expected output] → Preserve code blocks and machine-facing literals; review diffs around scripts and config separately.
- [Some upstream copies may have unclear or restrictive licensing] → Keep already-English upstream content unchanged and do not create unauthorized translated derivatives.
- [A dictionary scan can flag Portuguese identifiers or miss prose without diacritics] → Treat it as a locator, not proof; manually review each remaining match.
- [OpenSpec artifacts may remain Portuguese if they were authored before this change] → Translate repository-owned OpenSpec material in scope and set `openspec/config.yaml` to English for future artifacts.
- [Global instructions may still contain Portuguese] → They are outside this repository change; make the repo-local language rule explicit and avoid changing home configuration.

## Migration Plan

1. Inventory text files and classify repository-authored prose, upstream-derived content, code literals, and tests.
2. Translate repository-authored prose in manageable sections, preserving identifiers, commands, links, source attributions, and licensing notices.
3. Update `AGENTS.md`, shared rules, and the OpenSpec context to set English repository content and dynamic user-language responses.
4. Run the Portuguese scan, inspect all matches, check links/code fences/commands, and execute the installer dry-run and strict OpenSpec validation.
5. If a licensing exception prevents translation, list the exact file and reason rather than modifying upstream text without permission.

## Open Questions

None. Any license exception is handled conservatively by preserving the upstream body and documenting the exact file.
