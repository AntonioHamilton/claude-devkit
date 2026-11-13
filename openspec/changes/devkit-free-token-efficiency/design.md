# Design

## Context

See `proposal.md` for motivation and `specs/agent-token-efficiency/spec.md` for behavior. The machine has RTK 0.37.2 and OpenCode 2.2.7. The global RTK plugin uses a legacy named export; OpenCode logs reject it because a V2 plugin must expose a default definition with an `id` and `setup`/effect. The same plugin checks for RTK with `which`, which is unavailable in this Windows environment. `rtk init --show` confirms only that the file exists, while `rtk gain` reports global statistics that cannot establish OpenCode plugin activity. The existing `rtk verify` result validates the Claude hook, not OpenCode.

Caveman's skill exists under `~/.claude/skills/caveman`, but not in the global OpenCode skill directory. OpenCode's native compaction is enabled by default. No additional context-compression plugin appears in the installed plugin list.

## Goals / Non-Goals

**Goals:**

- Restore a Windows/OpenCode V2 RTK path with a verified load and safe pass-through behavior.
- Add Caveman as an opt-in skill-only workflow, keeping its output in the user's language.
- Keep native OpenCode compaction as the baseline and do not add another local compression plugin in this change.
- Preserve existing settings, plugins, model routing, and permissions outside the exact files needed for this change.

**Non-Goals:**

- Install a paid tool, paid API, remote compression service, telemetry-bearing Caveman proxy, or cloud router.
- Change model selection, quotas, or subagent permissions.
- Assume that RTK's global `gain` numbers came from OpenCode or represent exact billed-token savings.
- Enable two output/context compressors that can transform the same content.

## Decisions

### Keep a repository-owned OpenCode V2 adapter

Store the RTK OpenCode plugin source in the devkit and copy only that file to the global plugin location after approval. Implement the V2 plugin contract and the current V2 shell-before hook documented for the installed OpenCode version. Resolve `rtk.exe` from the OpenCode process's `PATH` using Windows path rules; invoke it without an intermediate shell. When RTK returns no safe rewrite, cannot be resolved, or fails, leave the original command untouched. Preserve OpenCode's permission decisions: do not rewrite when the transformed command could change the permission result.

Upgrade RTK only if the current release notes or source show that it fixes this exact V2/Windows contract. Otherwise, the adapter delegates to the existing `rtk rewrite` binary; do not overwrite the user's binary or reinstall a separate package as part of this change.

### Add Caveman skill-only, not its proxy

Use the existing Apache-2.0 Caveman skill as the source for a documented, attributed skill copy, then synchronize that one skill into the OpenCode skill directory. Keep activation opt-in. Do not install `caveman` CLI/proxy, model routing, cloud access, Blocks, or telemetry; those are separate capabilities and not required to shorten responses.

### Keep native compaction; document, do not add, another compressor

OpenCode's built-in auto-compaction remains the zero-install baseline. Document `opencode-token-slim` (MIT) and Squeez (Apache-2.0) as researched candidates, not as installed components. The former is a young transcript-rewriting plugin; the latter overlaps with RTK's shell-output filtering. DCP adds license and maintenance concerns, and Magic Compact development is paused. The user wants no additional local service/plugin in this change, so no optional compressor is installed; a future request can reopen the choice with a synthetic preservation test.

### Verify with evidence that does not misattribute savings

Use unit tests around path resolution, RTK rewrite invocation, safe command mutation, and fail-open behavior, plus OpenCode startup logs for plugin loading. Exercise `rtk rewrite` directly for command-level behavior. If a live plugin-hook test requires a model-backed session, do not consume a paid request without approval; use a local/synthetic harness and record that limitation. Report `rtk gain` only as global RTK history, not proof of OpenCode-specific savings.

## Risks / Trade-offs

- [A transformed shell command can alter OpenCode permission behavior] → Keep the integration fail-open and refuse transformations whose permission semantics differ.
- [The V2 plugin API or shell hook may change] → Pin behavior to the installed OpenCode version, test startup logs, and leave the original command unchanged on mismatch.
- [RTK's rewrite command can return a nonzero status for an advisory rewrite] → Test the installed binary's actual stdout and exit-code contract; do not discard valid output based only on exit status.
- [Caveman compression can obscure a complex instruction] → Keep it opt-in and preserve full wording for warnings, irreversible actions, and ambiguous sequences.
- [Context pruning may remove facts needed later or invalidate provider caches] → Do not add an additional pruning plugin without a separate request and a synthetic preservation test.
- [Changing global config can affect unrelated OpenCode sessions] → Back up and edit only the RTK plugin and Caveman skill entries; provide exact rollback steps.

## Migration Plan

1. Add the repository-owned adapter, documented RTK troubleshooting, and the attributed Caveman skill source.
2. Unit-test the adapter with Windows paths, supported/unsupported commands, permission-sensitive commands, missing RTK, and failed rewrites.
3. After implementation approval, back up the existing global `rtk.ts`; install the repository version and sync only Caveman's skill. Do not replace `opencode.json` or unrelated plugins.
4. Restart OpenCode and verify the logs show the RTK plugin loaded without a schema error. Run a test eligible command and confirm its safe rewrite and compact output through the plugin harness where possible.
5. Record the researched alternatives and why they were not added; keep native compaction as the default.
6. Roll back by restoring the RTK plugin backup and removing only the Caveman skill copy introduced by this change.

## Open Questions

None. The change is complete with native compaction, fixed RTK, and Caveman skill-only.
