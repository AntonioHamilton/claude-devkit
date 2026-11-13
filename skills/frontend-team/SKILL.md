---
name: Frontend Team
description: Team for web UI in React, Next, Vue or Angular — components, state, routes, CSS, accessibility, performance and browser validation with screenshot and console. Use when the project has package.json with a web framework, src/app, CSS, or when the user asks for "frontend team", "frontend team" or "web UI".
---

# Frontend Team

Web UI team. The manager orchestrates; the members implement, validate in the browser and review. The test is run by the AI, with evidence; the human reviews afterward.

## When to use

- `package.json` with React, Next, Vue, Angular, Svelte or similar.
- `src/`, `app/`, `pages/`, `components/`, CSS, Tailwind or design system.
- Bug in layout, state, route, form, accessibility or performance.
- Visual change that needs a screenshot, keyboard check and contrast check.

## When not to use

- API, database, queue or server authentication: use `backend-team`. The UI may depend on it, but does not replace it.
- React Native/Expo app: use `react-native-team`.
- Godot: use `game-dev-team`.
- Text or markdown only: the main session handles it; do not open a team.

## Roster

| Role | OpenCode | Claude Code | Strength | Hand off to | Do not hand off to |
|---|---|---|---|---|---|
| Implementation | `frontend` | `developer` with this skill | Components, state, routes, forms, CSS, a11y, performance | Implement the stage and run lint/typecheck/test | Backend, database, native mobile, Godot |
| Visual validation | `visual-validator` | `tester` with browser + `reviewer` for a11y | Screenshot, layout, design system, keyboard, contrast | Open the UI, compare states, capture evidence | Business logic or product fixes |
| Flow test | `tester` | `tester` | User flow, console, network, error cases | Run the happy path and the errors in the browser | Deciding design or fixing the component |
| Review | `reviewer` | `reviewer` | Risk, regression, spec adherence | Review a large diff, a11y, performance or risk | Implementing |

## Handoffs

1. **Manager** defines the stage, acceptance criteria, allowed files and test command.
2. **`frontend`** implements and runs the local checks.
3. **`visual-validator`** (OpenCode) or **`tester`** (Claude Code) opens the browser, tests desktop and narrow viewport, keyboard and contrast, and saves screenshots.
4. **`tester`** walks through the real flow, including empty, error, permission and reload states; console and failed requests are findings.
5. **`reviewer`** reviews when the diff is large or there is a11y/performance risk.
6. **Manager** checks the evidence and writes the report.

## Verification

Read the `AGENTS.md` and use the project's package manager:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

Swap for `pnpm`, `yarn` or `bun` if applicable. If the script does not exist, skip it and record the reason.

In the browser, use the `chrome-devtools` MCP: navigate, snapshot, click, type, resize, screenshot, console and network. Save to `docs/testing/evidence/<date>-<slug>/`.

- Test desktop and narrow viewport.
- Navigate by keyboard: visible focus, labels and logical order.
- Contrast and alternative text are findings, not details.
- If the MCP is not available, use Playwright CLI and record the alternative.

## Acceptance criteria

- The stage's flow works in the browser, not only in the unit test.
- No new error in the console and no broken request left unhandled.
- Keyboard and screen reader can use the main flow.
- Evidence and report at the agreed paths.

## Handback to the manager

Reply with: what changed, files, commands and output, screenshots, console/network, open risks and what was not tested. Do not commit, push, merge or open a PR.
