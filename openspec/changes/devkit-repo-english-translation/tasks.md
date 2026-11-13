# Tasks

## 1. Inventory and language policy

- [ ] 1.1 Inventory all tracked and untracked repository text files, including existing OpenSpec changes and `.agents`/`.claude` content; verify each file is classified as repository-authored, upstream-derived, code/config, or fixture.
- [ ] 1.2 Update `AGENTS.md`, shared rules, README language guidance, and `openspec/config.yaml`; verify they require English repository content while assistant responses follow the user's current language.

## 2. Translate repository-authored content

- [ ] 2.1 Translate root documentation, installation guides, `mcp/`, and `tools/` prose; verify links, paths, commands, and code fences are unchanged and still valid.
- [ ] 2.2 Translate repository-owned skills, agents, prompts, and scripts' comments/descriptions; verify skill IDs, YAML frontmatter keys, agent metadata, command names, and external contracts are preserved.
- [ ] 2.3 Translate repository-owned OpenSpec artifacts, including existing changes; verify each translated artifact retains its scope, decisions, requirements, task checkboxes, and source links.
- [ ] 2.4 Review upstream-derived skills and license notes; translate only repository-owned attribution where permitted, keep already-English upstream bodies intact, and document any exact file that cannot be modified without rights confirmation.
- [ ] 2.5 Update tests only where they assert human-readable Portuguese output; verify machine-facing keys and fixture payloads remain exact.

## 3. Language and behavior verification

- [ ] 3.1 Run a Portuguese-word/diacritic scan over all repository text files and manually review every match; verify no unintended Portuguese prose remains in repository-owned content.
- [ ] 3.2 Run `git diff --check` and compare code blocks, URLs, shell commands, identifiers, model IDs, and JSON/YAML keys; verify translation did not alter executable contracts.
- [ ] 3.3 Run the installer dry-run and strict validation for the three new OpenSpec changes; verify the installer does not overwrite existing configuration and all three changes validate.
