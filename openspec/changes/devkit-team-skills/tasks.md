# Tasks

## 1. Teams in the devkit

- [ ] 1.1 Create `game-dev-team`, `frontend-team`, `backend-team`, `react-native-team` and `regression-team` in `skills/<id>/SKILL.md`; each profile documents use, roster, strengths, limits, handoffs and validation. Confirm that OpenCode uses existing IDs and Claude Code uses only `developer`, `tester` and `reviewer`.
- [ ] 1.2 Update `README.md`, `rules/devkit-rules.md`, `skills/manager/SKILL.md` and `AGENTS.md` to document the teams, proportional effort and that tests are never skipped; allow a trivial check to be run by the human with steps/expected result. Verify the links and examples.
- [ ] 1.3 Install only the five new skills in the global destination without overwriting existing content, and confirm that Claude Code and OpenCode discover them via skill compatibility.

## 2. Manager and model routing

- [ ] 2.1 Create the OpenCode `manager` agent as `primary` with Haiku 5.5 and adjust `/manager` to select it without changing the session's global model; verify `opencode debug agents` and that the team/model profiles are `subagent`, keeping Build and Plan visible.
- [ ] 2.2 Create `planner-simple` (DeepSeek V4.1 Flash), `planner-complex` (GLM-5.3 Flash) and `critical-analyst` (Kimi K3.1 Pro); adjust development agents to the economical route, testing to Muse Spark 1.3, and keep Kimi for heavy analysis/review. Verify all IDs with `opencode models` and the agents with `opencode debug agents`.
- [ ] 2.3 Update `team-routing`, `devkit-opencode.md` and the global `ai-testing` skill so the manager chooses only the necessary members/models, skips scout/doubt on small tasks, and never declares a test complete without execution or a recorded human verification.

## 3. Dynamic quota fallback

- [ ] 3.1 Review the code/manifest of the pinned version `opencode-auto-fallback@0.4.61`; confirm V2 compatibility with OpenCode 2.2.7, license, dependency chain, and that `autoUpdate` is off before installing.
- [ ] 3.2 Install the plugin and configure `fallback.json` with `enabled: true`, `autoUpdate: false`, limited cooldown/retries, a global safety fallback, and chains for `manager`, planning, each domain, tester, reviewer and visual-validator. Verify each ID/model with `opencode models`; validate image support before including a visual fallback.
- [ ] 3.3 Run failover on a synthetic provider for 402 (quota) and 429 (rate limit) on the manager and on a subagent; confirm that it switches to the next model, keeps the task, respects the cooldown, and surfaces the failure when the whole chain is exhausted. Do not trigger real quota on OpenCode Go.

## 4. Integrated validation

- [ ] 4.1 Open the Agnthub reference in the browser and save a screenshot to `docs/testing/evidence/`; open the OpenCode TUI and check the manager in the `Shift+Tab` cycle, without exposing teams/models as primary.
- [ ] 4.2 Run the skills smoke test on OpenCode and the applicable checks; write `docs/testing/2026-11-13-devkit-team-skills.md` with environment, validated chains, real results, limits, concepts explained and human checklist.
- [ ] 4.3 Run `git diff --check` and `npx -y @fission-ai/openspec@latest validate devkit-team-skills --type change --strict`; confirm each requirement of the spec before closing.
