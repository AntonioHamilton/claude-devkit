# Proposal

## Why

Agnthub shows that a team works as a coordination skill: it defines when to use the group, its members and the limits of delegation. The devkit already has specialists in OpenCode, but it has no versioned team profiles and no automatic failover when a model quota interrupts the manager or a subagent.

## What Changes

- Add team profiles for Godot, frontend, backend, React Native/mobile and regression/QA, mapping OpenCode to the existing specialist agents and Claude Code to `developer`, `tester` and `reviewer`.
- Add the primary `manager` agent, Haiku by default, and keep teams and model profiles as subagents; the manager chooses the members/models according to the size and risk of the task.
- Define economical routing per task: DeepSeek V4.1 Flash for simple planning and standard code, GLM-5.3 Flash for complex planning, Kimi K3.1 Pro for critical analysis/heavy review, and Muse Spark 1.3 for testing.
- Configure automatic fallback per agent for quota, rate limit and transient failures, covering the manager and the subagents.
- Small tasks may skip scout/doubt when they add no value; tests are never skipped. Trivial checks may be run by the human with explicit steps and expected result.
- Update the devkit/OpenCode routing and documentation, and validate the agent cycle, the failover and the profiles in both harnesses.

## Capabilities

### New Capabilities

- `team-orchestration`: Select and coordinate agent teams by domain, with members and handoffs specific to each harness.

### Modified Capabilities

None.

## Impact

- `skills/`: five new team skills, installable by the current installer.
- `rules/devkit-rules.md` and `README.md`: selection guidance and inventory of the teams.
- Global OpenCode configuration: `manager` agent, subagent profiles, fallback integration and routing per task.
- Global configuration of the fallback plugin, with automatic update disabled and chains per agent.
- `rules/devkit-rules.md`, manager/testing skills and `README.md`: proportional effort, testing policy and inventory of the teams.
- `docs/testing/`: evidence and validation report of the agent cycle and of the synthetic fallback.
- An OpenCode V2 fallback plugin; no third-party agents installed.
