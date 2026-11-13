# Design

## Context

OpenCode 2.2.7 already has the agents `godot`, `godot-gdscript`, `frontend`, `backend`, `react-native`, `regression-tester`, `tester`, `reviewer`, `scout` and `visual-validator`, plus global skills for the five domains. The repository has `skills/manager`, `rules/devkit-rules.md` and installers, but it does not contain source versions of the five domain skills. The current `/manager` config chooses GPT-6 Luna; the global table uses Haiku for implementation and MiMo for testing. The testing skill and the five domain agents require regression testing in every change.

There is already `~/.claude/agents/financas.md` and a set of AUVP skills in `C:\development\Hamilton\.claude\skills`; there is no finance agent in OpenCode. The vault `C:\development\Hamilton\financas` contains 29 Markdown files and 7 PDFs. It is personal and stays outside the repository. The Agnthub teams page lists 15 examples; the useful pattern is to declare triggers, limits, roster, strengths, handoffs, and what each member must not receive. The Game Dev example is explicitly Unity; this devkit's implementation stays specific to Godot.

## Goals / Non-Goals

**Goals:**
- Give the manager clear profiles for the five teams, and use only agents that exist in the active harness.
- Version the five domain skills in the repository and sync only those files with the global OpenCode copies.
- Keep `manager` as the only custom primary agent; keep Build/Plan and the user's choice of session model.
- Select subagents/models by risk and task type, and allow automatic failover per role.
- Make verification mandatory, without forcing scout/doubt or regression testing on tasks that do not justify them; keep functional testing and explicit human verification for trivial cases.
- Add a private finance subagent in OpenCode that consults the vault only for personal finance tasks.

**Non-Goals:**
- Installing third-party agents, MCPs or teams.
- Changing the existing Claude Code finance agent or including personal data in the devkit.
- Changing the global model, hiding built-in agents, executing financial operations or delivering a tax return.
- Rewriting the AUVP method or copying prompts/code from the researched repositories.

## Decisions

### Profiles and delegation

`game-dev-team`, `frontend-team`, `backend-team`, `react-native-team` and `regression-team` will be added, in `skills/<id>/SKILL.md`. Each one describes `when to use/when not to use`, real members, strengths, `hand off to/do not hand off to`, handoff and validation. The manager calls only the roles that are needed:

- Godot: `godot`/`godot-gdscript`; `tester` or `reviewer` depending on risk. Game and level design stay with the manager because there are no dedicated agents installed for them.
- Frontend: `frontend`; `visual-validator` for a relevant visual change; `tester`/`reviewer` when the flow or risk calls for it.
- Backend: `backend`; `reviewer` for auth, migration and high-risk contracts; `tester` for integration when the change needs a real environment.
- React Native: `react-native`; validation on device/emulator for a mobile flow; visual/review depending on the task.
- Regression/QA: `regression-tester` only for a confirmed bug, a real coverage gap or a critical flow; it does not replace the specialist who fixes the product.

In Claude Code the profiles use only `developer`, `tester` and `reviewer`, which the repo already distributes. No fake Claude aliases will be created. `install.ps1 -LinkAgents` ignores OpenCode targets that already exist; therefore, synchronization will be file by file, preserving the directories and global settings.

### Domain skills and research

The current copies of `godot-dev`, `frontend-senior`, `backend-senior`, `react-native-dev` and `regression-testing` will be added to the repo as the canonical source and reviewed with handoffs and limits. The corresponding global skills and agents will receive the same proportional testing rule. Source selection combines relevance to the domain, stars observed on Agnthub and license, not just popularity; Agnthub also warns that listing a repository is not an endorsement.

| Domain | 3 selected references and their use in the design |
|---|---|
| Godot | [Donchitos/Claude-Code-Game-Studios](https://github.com/Donchitos/Claude-Code-Game-Studios) (MIT, ~38.8k): engine authority, GDScript and QA; [jame581/GodotPrompter](https://github.com/jame581/GodotPrompter) (MIT, ~960): scene and signal architecture; [MRCalderon3D/everything-game-dev-code](https://github.com/MRCalderon3D/everything-game-dev-code) (MIT, ~108): risk review and separation of game roles. |
| Frontend | [affaan-m/ECC](https://github.com/affaan-m/ECC) (MIT, ~302k): WCAG, keyboard and accessibility; [msitarzewski/agency-agents](https://github.com/msitarzewski/agency-agents) (MIT, ~168k): UI implementation and handoff; [wshobson/agents](https://github.com/wshobson/agents) (MIT, ~42.5k): React/Next, states and performance. |
| Backend | [msitarzewski/agency-agents](https://github.com/msitarzewski/agency-agents) (MIT, ~168k): architecture and contracts; [wshobson/agents](https://github.com/wshobson/agents) (MIT, ~42.5k): service boundaries and resilience; [VoltAgent/awesome-claude-code-subagents](https://github.com/VoltAgent/awesome-claude-code-subagents) (MIT, ~26.5k): API, data and security checklist. |
| React Native | [msitarzewski/agency-agents](https://github.com/msitarzewski/agency-agents) (MIT, ~168k): app scope and mobile UX; [wshobson/agents](https://github.com/wshobson/agents) (MIT, ~42.5k): native/offline integration; [VoltAgent/awesome-claude-code-subagents](https://github.com/VoltAgent/awesome-claude-code-subagents) (MIT, ~26.5k): Expo, native modules, push and OTA. |
| Regression/QA | [msitarzewski/agency-agents](https://github.com/msitarzewski/agency-agents) (MIT, ~168k): deterministic tests and evidence; [wshobson/agents](https://github.com/wshobson/agents) (MIT, ~42.5k): layered tests and TDD; [github/awesome-copilot](https://github.com/github/awesome-copilot) (MIT, ~41.1k): dedicated QA only when the change calls for it. |
| Finance | [msitarzewski/agency-agents](https://github.com/msitarzewski/agency-agents) (MIT, ~168k): analysis roles, FP&A, bookkeeper, investments and taxes; [wshobson/agents](https://github.com/wshobson/agents) (MIT, ~42.5k): unit economics and scenarios; [anthropics/financial-services](https://github.com/anthropics/financial-services) (Apache-2.0, ~41.3k): model auditing. The last one depends on CapIQ/Daloopa, which will not be installed; only its portable principles will be considered. |

Stars are an approximate snapshot of the index consulted on 2026-11-13, not proof of quality. The texts will be rewritten; no external agent or repository will be installed. The PostHog repository was left out of the distributable source list because Agnthub did not confirm a license for the agent content.

### Manager and routing

`manager` will be the only custom OpenCode `primary` agent, with Haiku 5.5 as the default in `/manager`; the user can still choose the session model. Build and Plan remain visible. The specialists and a single `planner` are `subagent`s; no redundant agents will be created just to represent models. The manager chooses the model in the subagent call:

| Type of work | Preferred model |
|---|---|
| Simple planning and economical code | DeepSeek V4.1 Flash |
| Complex planning | GLM-5.3 Flash |
| Critical decision, large repository or heavy review | Kimi K3.1 Pro |
| High-volume testing | Muse Spark 1.3 |
| Visual validation | Gemini 4 Argon, which supports images |

The manager may skip scout and doubt when the task is small and verifiable. Verification is not optional: adequate functional testing must happen, or a trivial check may be handed to the human with commands/steps and the expected result. Regression testing is included only after confirming a bug, a coverage gap or a behavior risk; reuse an existing test instead of duplicating it.

### Fallback

OpenCode does not offer native failover between different model IDs. `opencode-auto-fallback@0.4.61` will be used, which has a V2 hook and per-agent chains, after a review of its license, dependencies, code and compatibility with OpenCode 2.2.7. The configuration uses `autoUpdate: false`, limited retries/cooldown and role-based chains; unavailable or incompatible models (especially image) are skipped. The manager's first choice does not change because of the fallback: the plugin only acts when the call fails.

Initial chains for validation, subject to checking the catalog with `opencode models` and input support:

- Manager: Haiku 5.5 → GPT-6 Luna → DeepSeek V4.1 Flash → Muse Spark 1.3.
- Simple planning: DeepSeek V4.1 Flash → MiniMax M3.1 Flash → Muse Spark 1.3.
- Complex planning: GLM-5.3 Flash → DeepSeek V4 Pro → Qwen 3.8 Max → DeepSeek V4.1 Flash.
- Development: DeepSeek V4.1 Flash → MiniMax M3.1 Flash → DeepSeek V4 Pro.
- Testing: Muse Spark 1.3 → MiMo V2.6 Flash → GLM-5.3 Flash → DeepSeek V4.1 Flash.
- Critical review: Kimi K3.1 Pro → DeepSeek V4 Pro → GLM-5.3 Flash → GPT-6 Luna.
- Visual validation: Gemini 4 Argon; no fallback will be enabled without confirming image input.

The fallback does not get around a quota shared between models if all of them are blocked. No real limit will be triggered; failover will be tested with a synthetic provider for 402/429. `opencode-auto-fallback` has optional automatic update and npm checks; both stay disabled.

### Private AUVP agent

OpenCode will gain `financas` as a `subagent`, mirroring the role and routing of the private skill that already exists in Claude Code. The agent reads only the context it needs from the vault: budget/month for budgeting, reference guides and studies for analysis, pending items when there is a conflict, and PDFs only when the summaries are not enough. It does not copy the full content of the PDFs or personal values into the devkit.

The AUVP method and the registered heuristics are the user's preference for analysis and organization. Current facts about legislation, taxes, fees and companies require a current official source, a date and a divergence warning. The agent does not decide trades or move money; it may update vault files or AUVP tracking tools when the user asks, and after the user confirms. The financial classification remains preliminary, with the final decision left to the user.

### Discarded alternatives

- A third-party orchestrator would create another roster and could collide with the installed agents.
- One primary per domain/model would clutter the `Shift+Tab` cycle and take the dynamic choice away from the manager.
- Copying the Unity example without adaptation would promise agents and tools that do not exist in Godot.
- Copying the vault contents into the devkit would make leaks easier and mix methodology with personal data.
- Regression testing for every change would produce duplicates and noise; functional testing remains mandatory.

## Risks / Trade-offs

- [The model quota may be shared] → the fallback only works if at least one eligible model remains available.
- [A fallback may not accept the required tools or input] → distinct chains per role and image verification; an incompatible failure must not be hidden.
- [The plugin intercepts or replays a call when it receives certain errors] → review the pinned package before installing, and validate only with a synthetic provider.
- [The skills in the repo and in `~/.config/opencode` may diverge] → treat `claude-devkit/skills/` as the canonical source, make the identical change in the global copy, and verify the diffs of the synced files; do not replace existing directories.
- [Vault data may leak through prompts or logs] → the finance agent is only called by the manager for personal finance, reads the minimum, does not include values in external searches, and does not write to the repo or general memory.
- [AUVP lessons contain facts subject to change] → prioritize the user's methodology, but verify current law, fees and data in an official source and flag any divergence.
- [Models may stop existing in the catalog or may share a limit] → validate the IDs on the machine, record the models tried, and never declare completion after the chain is exhausted.

## Migration Plan

1. Add the team skills and the canonical versions of the five domain skills to the repository; do not include the personal vault.
2. Update the global skill copies and the agents/routing in specific files, preserving other agents, permissions and providers.
3. After implementation approval, audit and install the pinned plugin; write the fallback config in a separate file with `autoUpdate: false`.
4. Validate agents in OpenCode, `Shift+Tab`, loaded skills and synthetic failover; run smoke tests of the relevant flows without consuming real quota.
5. Rollback: restore the backups of the global files touched, remove only the plugin and the config entries added by this change, and revert the change files. Do not touch the vault, financial accounts, other plugins or the global model.

## Open Questions

None. The five team profiles and the finance agent's limits were defined by the existing roster and the vault that was consulted.
