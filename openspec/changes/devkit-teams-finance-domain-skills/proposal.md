# Proposal

## Why

OpenCode already has specialists per domain, but there is no layer that coordinates roles, limits and handoffs the way the Agnthub teams do. The current skills also require a regression test for every change, and OpenCode has no AUVP finance agent, even though one is already configured in Claude Code.

## What Changes

- Create team skills in the repository for Godot, frontend, backend, React Native and regression/QA, with triggers, limits, responsibilities and handoffs compatible with the existing agents.
- Version the five current domain skills in the repository and sync the revised versions to the global OpenCode skills; also review the corresponding agents so they do not require regression tests for changes without a plausible regression.
- Configure `manager` as the only custom primary agent in the `Shift+Tab` cycle; teams and model profiles stay as subagents. Preserve `Build` and `Plan`, and do not change the global model the user chooses.
- Route by task: DeepSeek V4.1 Flash for simple planning and economical development; GLM-5.3 Flash for complex planning; Kimi K3.1 Pro for critical analysis and heavy review; Muse Spark 1.3 for testing; Gemini Argon for visual validation.
- Add automatic failover per agent for quota and transient failures, after auditing the pinned V2 plugin `opencode-auto-fallback@0.4.61`; use chains compatible with role and capability, and keep automatic updates turned off.
- Add a private `financas` subagent to the global OpenCode, the counterpart of the AUVP agent that already exists in Claude Code. It queries `C:\development\Hamilton\financas` when requested, prioritizes the AUVP methodology and concepts, and does not copy personal data to the devkit or to the global memory.
- Keep verification mandatory, but sized to the task: small tasks may skip scout/doubt; a trivial check may be left to the human with steps and an expected result; a regression test is created only when there is a real bug or regression, or a risk that current coverage does not address.

## Capabilities

### New Capabilities

- `agent-team-orchestration`: Team profiles, agent/model selection and continuity through fallback in the supported harnesses.
- `personal-finance-assistant`: Private financial assistant based on the user's AUVP vault, with privacy and action limits.

### Modified Capabilities

None. The repository does not have any existing main specs yet.

## Impact

- `skills/`: five new team profiles and versioned copies of the five current domain skills.
- `rules/`, the `manager` skill, the OpenCode routing and the `ai-testing` skill: proportional effort and testing, and team/model selection per task.
- Global OpenCode configuration: manager as primary, subagent profiles, the private `financas` agent, per-task model and the fallback plugin.
- `README.md` and the global instructions: inventory, installation and privacy limits.
- `docs/testing/`: real validation of discovery, the agent cycle and synthetic failover; no regression tests created without an identified regression.
- External sources will be studied and cited, not copied or installed. The personal vault and the AUVP PDFs stay outside the repository.
