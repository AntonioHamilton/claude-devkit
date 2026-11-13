# Devkit in OpenCode

## Where things live

- Devkit rules: `~/.claude/devkit-rules.md` (loaded by `instructions`).
- Devkit skills: `~/.claude/skills` (OpenCode compatibility).
- Skills new to this setup: `~/.config/opencode/skills` (they take precedence over same-ID skills in `~/.claude/skills`).
- Subagents: `~/.config/opencode/agents`.
- Commands: `~/.config/opencode/commands`.
- RTK plugin: `~/.config/opencode/plugins/rtk.ts`.
- Devkit scripts/tools: `scripts/` and `tools/` in the devkit repository (on Windows, prefer `.ps1`).

## Teams and models

All on the `opencode-go` provider, which bills in **requests per 5 hours**. The quota table and escalation rules are in the `team-routing` skill.

| Role | Agent | Model | req/5h |
|---|---|---|---|
| Manager/planning | `manager` (primary) + `/manager` | `opencode-go/gpt-6-luna#high` | 5,640 |
| General development | `developer` | `opencode-go/claude-haiku-5-5#high` | 5,133 |
| Frontend | `frontend` | `opencode-go/claude-haiku-5-5#high` | 5,133 |
| Backend | `backend` | `opencode-go/claude-haiku-5-5#high` | 5,133 |
| React Native | `react-native` | `opencode-go/claude-haiku-5-5#high` | 5,133 |
| Godot (architecture) | `godot` | `opencode-go/claude-haiku-5-5#high` | 5,133 |
| Godot (GDScript) | `godot-gdscript` | `opencode-go/claude-haiku-5-5#high` | 5,133 |
| Scout/recon | `scout` | `opencode-go/deepseek-v4.1-flash#high` | 45,500 |
| Testing | `tester` | `opencode-go/deepseek-v4.1-flash#high` | 45,500 |
| Regression | `regression-tester` | `opencode-go/deepseek-v4.1-flash#high` | 45,500 |
| Review | `reviewer` | `opencode-go/kimi-k3.1-pro#high` | 196 |
| Visual validation | `visual-validator` | `opencode-go/gemini-4-argon#high` | 513 |

Every agent uses `#high`. Models without variants (`mimo`, `longcat`, `iceman`) do not become a primary model; they stay only in the fallback when no variant exists.

**Fallback:** `opencode-auto-fallback@0.4.61` is registered in `opencode.json` and configured in `fallback.json`. The default chain applies to every agent and always ends in models with `free` in the name: `deepseek-v4.1-flash-free#high`, `glm-5.3-flash-free#high`, `minimax-m3.1-flash-free#high`, `beam-free#high`, `longcat-2.5-free`, `iceman-free`. Quota, 401/402/403, and rate limit fall through to the next model without restarting the task.

`manager` is the only customized `primary` agent: it appears in `Shift+Tab` next to Build and Plan. Teams and specialists are `subagent`.

Escalation for a hard task: `kimi-k2.7-code` (1,462 req/5h). Mechanical work: `muse-spark-1.3-contributor` (49,075) or one of the free models (unlimited).

The `team-routing` skill has the detection table and the delegation rules. `/manager` loads that skill automatically.

### Team skills

The team composition - who does what, in what order, what not to delegate, and how to validate - lives in five independent skills: `game-dev-team`, `frontend-team`, `backend-team`, `react-native-team`, and `regression-team`.

The manager loads the team skill **and** `team-routing`: the first defines the roster and handoffs; the second defines model and quota. A team is not a plugin or a primary agent; it is coordination text.

## Testing: this setup's contract

- **The AI tests; the human approves.** Never ask the human to test first.
- Every test opens the real app: browser via the `chrome-devtools` MCP, mobile via the `mobile` MCP + `adb`, Godot via headless/GUT, API via a real call.
- Required evidence: screenshot, console, network, logcat, or command output in `docs/testing/evidence/`.
- Required report: `docs/testing/<date>-<slug>.md` with summary, environment, flows, findings, regression tests, **Concepts explained**, and a human checklist.
- A confirmed bug becomes a regression test that fails before the fix.
- Without an environment (browser/device/database/Godot), record the blocker and the setup command; do not invent a result.
- The `ai-testing` skill has the full template.

## Installed dependencies

| Dependency | For | How to check |
|---|---|---|
| `chrome-devtools-mcp` (global npm) | Browser and UI tests | `opencode mcp list` |
| `@mobilenext/mobile-mcp` (global npm, bin `mcp-server-mobile`) | Android emulator/phone tests | `opencode mcp list` |
| Android SDK Platform-Tools (`adb`) | Android device/emulator | `adb devices` |
| `rtk` + OpenCode plugin | Token savings on commands | `rtk init --show` |

The `~/.config/opencode/setup.ps1` script reinstalls the npm dependencies and checks `adb`.

## Claude to OpenCode tool map

| Claude Code | OpenCode |
|---|---|
| `AskUserQuestion` | `question` tool |
| `Task` / Agent | `subagent` tool |
| `Bash` | `shell` |
| `Read` / `Edit` / `Write` | `read` / `edit` / `write` |
| `WebSearch` / `WebFetch` | `websearch` / `webfetch` |

Claude Code hooks (session banner and memory reminder) were not ported. RTK in OpenCode works through the plugin, not the hook.

## Memory

Shared memory stays in `~/.claude/memory/`, with the vault configured in `config.md`.

## Where the specialists came from

The specialists were selected on [agnthub.sh](https://app.agnthub.sh/) and adapted for this devkit pipeline:

- Godot: `Donchitos/Claude-Code-Game-Studios` and `msitarzewski/agency-agents`.
- Frontend: `msitarzewski/agency-agents` and `github/awesome-copilot`.
- Backend: `msitarzewski/agency-agents` and `wshobson/agents`.
- React Native: `VoltAgent/awesome-claude-code-subagents` and `wshobson/agents`.
- Regression: `PostHog/posthog` and `wshobson/agents`.
- Visual: `wshobson/agents`.

The final files were rewritten in the OpenCode V2 format, with their own model, permissions, and testing contract.
