# MCP — Chrome browser

Two ways to give the agent control of Chrome. Choose **one**.

## Option A — Claude in Chrome (preferred in Claude Code)

Official Chrome extension. It is not installed by a config file: the user installs the extension, connects it to Claude Code and grants per-site permissions inside it.

- Tools are available as `mcp__claude-in-chrome__*` (navigate, computer, read_page, read_console_messages, form_input, ...).
- Runs in **the user's existing Chrome session**, with their logins. Treat it as a real environment, not a sandbox.

To check whether it is already active: ask the agent to call `tabs_context_mcp`. If it replies with the tabs, it is working.

## Option B — chrome-devtools-mcp (portable, any harness)

MCP server via `npx`, useful in a harness that does not have the extension. Config in `mcp-servers.json` in this directory.

Install in Claude Code:

```
claude mcp add chrome-devtools -- npx -y chrome-devtools-mcp@latest
```

In another harness, copy the block from `mcp-servers.json` into its MCP configuration file.

Requirements: Node.js installed and Chrome installed. Confirm the package name before running on a new machine — the devkit installer does **not** install this option automatically, it only writes/offers the configuration.

## Usage rules (apply to both options)

- Never trigger `alert`, `confirm` or `prompt`: a modal dialog freezes the entire browser session.
- Never reuse a tab ID from a previous session — call `tabs_context_mcp` first.
- Before clicking anything destructive (delete, send, pay), warn the user.
- Failed 2 or 3 times in a row: stop and ask, do not keep insisting.
