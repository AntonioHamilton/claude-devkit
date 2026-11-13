# OpenUI

Open pattern for generative UI: the model describes the interface in OpenUI Lang and the app renders it with the project's components and design system. It serves dashboards, forms, tables, charts and screens, not just chat. Site: https://www.openui.com/ · Code: https://github.com/thesysdev/openui

Optional. It only makes sense in a project that has (or wants) AI-generated UI.

## Install

There is no global install: the CLI runs via `npx`, with no package to install beforehand (requires Node).

New project:

```bash
npx @openuidev/cli@latest create
```

Existing project, so that coding agents (Claude Code, Codex, Cursor) know how to use OpenUI:

```bash
npx @openuidev/cli@latest setup-agent
```

`setup-agent` creates or **edits the project's `AGENTS.md`**, appending the OpenUI instructions. It can be run again to update. Projects created with `create` already come with this.

## Rules for the agent

- **Warn before running**: both commands write to the user's repository (`setup-agent` changes `AGENTS.md`). Ask for ok.
- Run from the project root, after the devkit's base `AGENTS.md` exists, so that OpenUI appends instead of creating a parallel file.
- Do not commit unless the user asks.
- The official page does not document an MCP or a Claude Code plugin; do not make one up. For usage questions, check the documentation in /docs on the site.
