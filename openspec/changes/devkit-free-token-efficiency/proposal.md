# Proposal

## Why

RTK is installed, but OpenCode 2.2.7 rejects the global `rtk.ts` plugin because it lacks the V2 default export contract; its Unix-only `which` check is also incompatible with this Windows setup. The current `rtk gain` totals do not prove that the OpenCode plugin ran, so the devkit needs a verified, free token-saving baseline.

## What Changes

- Make the RTK integration compatible with OpenCode V2 and Windows, using a fail-open command rewrite and a real runtime verification instead of checking only that a plugin file exists.
- Add the free Caveman skill to the OpenCode workflow as an opt-in, skill-only feature. Keep the user's language, technical payloads, and safety wording intact; do not install Caveman's proxy, cloud routing, or telemetry-bearing CLI.
- Document OpenCode's built-in compaction as the zero-cost baseline.
- Document the free token-saving options and candidates, but add no new local compression plugin; the user prefers local tooling to remain scripts and existing integrations.
- Preserve existing global settings and plugins. Do not change model routing, quotas, or permissions, which belong to the separate team/finance change.

## Capabilities

### New Capabilities

- `agent-token-efficiency`: Reduce repeated shell and conversation-context overhead with free tools while preserving task facts, code, errors, and user language.

### Modified Capabilities

None.

## Impact

Expected changes to `tools/rtk.md`, the OpenCode RTK plugin, the canonical Caveman skill, and scoped OpenCode configuration. The current global plugin log reports a missing V2 plugin definition; no global configuration or package has been changed in this proposal phase.
