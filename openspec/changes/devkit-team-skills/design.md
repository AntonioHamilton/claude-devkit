# Design

## Context

The repository installs skills from `skills/<id>/SKILL.md`; Claude Code has `developer`, `tester`, `reviewer` and `scout`. OpenCode 2.2.7 already has domain specialists. `Shift+Tab` switches primary agents, not the session model; the current TUI configuration does not override that shortcut. The Agnthub example is Unity, so the game profile will be Godot.

## Goals / Non-Goals

**Goals:**
- Define five independent coordination skills, one per team, as a versioned source for Claude Code and OpenCode.
- Select only `manager` as a custom primary; team/model profiles stay as subagents, while the built-in Build and Plan remain visible.
- Apply economical routing by task type and quota fallback for the manager and each configured role.
- Test chains with synthetic quota/rate limit errors, without consuming the user's real quota.

**Non-Goals:**
- Installing an orchestrator plugin that replicates the team, such as OpenChoreographer.
- Changing the session model selection or the global model used by the user.
- Building a UI to dynamically create teams like Agnthub.
- Copying the Unity profile from the example; the game position is specific to Godot.

## Decisions

1. **One skill per team.** The IDs will be `game-dev-team`, `frontend-team`, `backend-team`, `react-native-team` and `regression-team`, each in `skills/<id>/SKILL.md`. This follows the OpenCode skill unit and the Agnthub pattern.

2. **Mapping per harness, without inventing Claude agents.** OpenCode uses its existing specialists; Claude Code uses `developer`, `tester` and `reviewer`, with the domain context inside each team skill.

3. **Manager as the only custom primary.** A `manager` agent uses Haiku 5.5 and `/manager` selects this agent. Conversation models remain selectable by the user; the `Shift+Tab` cycle switches agents, not the model. Planning, domain, analysis, review and testing profiles use `mode: subagent`, so the manager chooses only the ones needed.

4. **Routing driven by effort and domain.** DeepSeek V4.1 Flash handles simple planning and economical development; GLM-5.3 Flash handles complex planning; Kimi K3.1 Pro handles critical analysis/heavy review; Muse Spark 1.3 handles high-volume testing. The manager may skip scout/doubt on small tasks, but it does not omit the test. A simple check may be left to the human with steps and expected result.

5. **Failover with `opencode-auto-fallback@0.4.61`.** OpenCode V2 does not expose native configuration for fallback between different model IDs. The plugin offers per-agent fallback for the primary session and subagents; the chains live in `~/.config/opencode/fallback.json`, with a general fallback and per-role overrides. The version is pinned, `autoUpdate` stays `false`, and the configuration has an attempt/cooldown limit and logging.

6. **Discarded alternatives.** `openchoreographer` does not fall back for its own orchestrator and registers a roster that may collide; `@renjfk/opencode-model-fallback` only maps one model to another; `opencode-model-router` declares a V1 API. A single router for all roles would lose task/capability compatibility.

## Risks / Trade-offs

- [A quota on the account may be shared across models] → fallback only helps while at least one alternative model has quota available.
- [A fallback may not accept the image or tools required] → each chain will be specific per role/capability; validate a multimodal candidate before using it for the visual-validator.
- [The optional plugin update runs npm and changes the local cache] → pin the version and `autoUpdate: false`; do not install third-party scripts outside the pinned plugin.
- [The provider may encode quota in a way not recognized] → test simulated 402/429 responses and check logs; if real messages diverge, add a pattern only after reproducing it.
- [Long chains generate cost/latency] → limit the number of fallbacks per role and keep a cooldown; record which model took over the session.
- [The metadata API and the CLI may diverge in the catalog] → validate IDs with `opencode models` on the host before writing chains.

## Migration Plan

1. Add the five profiles and the effort/testing instructions to the repo; the normal installer already distributes the skills.
2. Create the primary `manager` and the necessary subagent profiles in the global OpenCode; do not change the global `model` or hide the built-ins.
3. Install `opencode-auto-fallback@0.4.61` and configure chains in `fallback.json` with `autoUpdate: false`.
4. Validate failover with a synthetic provider and check real routing; do not trigger a real OpenCode Go limit.
5. Rollback: remove only the plugin and its fallback data after saving the file; revert the new agents/commands/skills without touching other plugins, models or MCPs.

## Open Questions

None for the architecture. The final choice of multimodal fallback is conditional on proving image support; if no compatible alternative model is available, record the limitation instead of degrading to text.
