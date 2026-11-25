# AGENTS.md

Guide for agents in this repository. The README.md describes the kit and its installation.

## What it is

Portable kit of instructions, skills, agents and scripts for development assistants.
It is not a user application; preserve compatibility between Claude Code and OpenCode.

## Stack

Markdown, PowerShell, Bash and Node.js for scripts. Do not add a runtime or product dependency
to organize skills and agents.

## Structure

- `skills/`: installable skills, each one in `<id>/SKILL.md`
- `agents/`: Claude Code agents distributed by the installer
- `rules/`: shared rules
- `scripts/`, `install.ps1`, `install.sh`: installation and checks
- `hooks/`, `tools/`, `mcp/`: integrations and documentation

## Commands

- `git diff --check`
- `opencode models` (lists the full catalog; does not take the provider ID as a positional argument)
- `./install.ps1 -DryRun -NoHooks -NoRules -Dest "$env:TEMP\claude-devkit-test"`
- `npx -y @fission-ai/openspec@latest validate <change> --type change --strict`
- `.\scripts\check-team-skills.ps1` (structure of the five team skills and references in the README/rules)
- Skill/team-specific verification described in the report in `docs/testing/`
- For PDFs, if `pdftotext`/`pypdf` are not installed, use the harness reader; do not install dependencies without authorization.

## Conventions

Markdown in English for repository files; replies follow the user's language. Text files in LF.
Do not overwrite global configuration or install dependencies without authorization.
Use only existing agents or explicitly declare the fallback per harness.
Third-party skill copies: record source, commit and license in the skill's `## Origin` section and in the README credits; strip trailing whitespace so `git diff --check` passes, and list that change in Origin.
Teams are coordination skills (`game-dev-team`, `frontend-team`, `backend-team`, `react-native-team`, `regression-team`); do not create a plugin or agent to represent a team.

## What not to do

- Do not install third-party plugins/agents as part of this work.
- Do not change models, quotas or permissions of existing agents.
- Do not push, merge or open a PR.
- Do not claim a test passed without real evidence.
