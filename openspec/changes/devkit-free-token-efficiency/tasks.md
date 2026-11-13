# Tasks

## 1. Repair RTK for OpenCode V2 on Windows

- [ ] 1.1 Add a repository-owned V2 RTK adapter using the installed OpenCode shell-hook contract; verify tests cover PATH/PATHEXT resolution, safe rewrite, permission-sensitive pass-through, missing RTK, and rewrite failure without invoking a shell.
- [ ] 1.2 Run `rtk rewrite` against supported and unsupported command fixtures and document its real stdout/exit-code behavior; verify failures leave the original command unchanged.
- [ ] 1.3 Back up and replace only the global RTK plugin after implementation approval; restart OpenCode and verify startup logs contain no plugin schema error and the plugin registers successfully.
- [ ] 1.4 Update `tools/rtk.md` and the relevant README guidance; verify they distinguish `rtk init --show`, OpenCode plugin-load evidence, Claude hook verification, and global `rtk gain` statistics.

## 2. Add Caveman skill-only

- [ ] 2.1 Add an Apache-2.0-attributed, repository-owned Caveman skill copy without its CLI/proxy; verify license and source attribution are present and the skill preserves the active user language, negation, code, paths, and full safety wording.
- [ ] 2.2 Sync only the Caveman skill into OpenCode's global skill directory after implementation approval; verify OpenCode discovers the skill and that no proxy, model router, telemetry process, or unrelated global setting is added.

## 3. Document the free token-saving stack

- [ ] 3.1 Document native auto-compaction, RTK output filtering, Caveman skill-only, and researched alternatives (`opencode-token-slim`, Squeez, DCP, Magic Compact); verify no additional local plugin/service is installed or added to config.
- [ ] 3.2 Record RTK savings as global estimates only and distinguish them from OpenCode-specific evidence; verify the documentation does not attribute existing `rtk gain` totals to OpenCode.

## 4. Integration evidence and rollback

- [ ] 4.1 Run the RTK adapter test suite, OpenCode plugin-load check, Caveman language/safety examples, and any approved optional-compressor tests; save logs and a `docs/testing` report with limitations and a human review checklist.
- [ ] 4.2 Run `git diff --check` and inspect the exact global config diff; verify unrelated plugins, providers, permissions, quotas, and model routing are unchanged and rollback restores only files/entries added by this change.
