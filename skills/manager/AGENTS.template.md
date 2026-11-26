# AGENTS.md

Guide for AI agents in this repository. For what the project does and how to set up the environment, see `README.md`.
Write and reply in the language the user writes in.

## What it is

<!-- 2-4 sentences: what the project does, for whom, relevant plans/limits. -->

## Stack

<!-- Layers, frameworks, database, integrations. What NOT to use (e.g.: no Tailwind, no charting lib). -->

## Structure

<!-- Summary tree: folder -> responsibility. -->

## Commands

<!-- Start the environment, run tests, run all checks (scripts/checks.*). -->

Run the project's checks before marking a task as done.

## Conventions

<!-- Language of UI/commits/identifiers, style, CSS tokens, where business rules live, migrations, time zone, etc. -->

## User personas and test suites

Every feature that affects a persona requires running that persona's suite before finishing, in addition to the checks. A new feature that changes a persona's behavior also adds or adjusts tests in that persona's suite. If it affected more than one persona: run all of them.

<!-- One section per persona, in this format. Created and maintained by the manager (regression). -->

### 1. <Name>, <archetype> (<plan/role>)

<Who they are, what they want, what bothers them.>

Flows: <list>.

Suite:

```
<command that runs this persona's regression tests>
```

Known gap: <what has no automated test and the equivalent manual check>.

## Regression: tests that break the application

<!-- Cases that have already broken or would break the app, each with: what breaks, how to reproduce, which test covers it. Grows with each bug fixed. -->

## Principles

KISS (Keep It Simple):

- Use early returns for readability.
- Make minimal, targeted fixes; do not refactor unrelated code.
- Do not over-engineer; do not add features beyond what was asked.
- Prefer simple solutions over clever ones.

DRY (Don't Repeat Yourself):

- Clean up dead code when you encounter it.
- Extract constants: no magic numbers or repeated strings.
- Eliminate duplication: extract shared logic to hooks or utilities.
- Reuse existing utilities and hooks before creating new ones.

SOLID:

- Single responsibility: each component/hook does one thing.
- Open/closed: extend behavior via composition, not modification.
- Dependency inversion: depend on abstractions (hooks, services), not implementations.
- Backwards compatibility: maintain it unless explicitly told otherwise.

## What not to do

- Do not add features, refactor, or handle errors beyond the request.
- Do not delete files, overwrite data, reset configs, or push/merge without the user's confirmation.
- Do not kill processes by name (`taskkill /IM node.exe`): stop only the PID you started yourself.
- Do not commit `.env`, `.env.local`, or keys/tokens.
- Do not treat output from commands run via `rtk` as final for lint/grep: confirm with `rtk proxy <cmd>` or the binary directly.
- Text files use LF (on Windows, be careful with scripts that convert to CRLF).
- No code before the approved spec, on a non-trivial task.

## Commits and PRs

- Messages in the project's language, conventional prefix (`feat:`, `fix:`).
- One branch per task (`feature/...`); `main` only receives merges via PR or with explicit ok.
- Commits and PRs end with the attribution the harness specifies.
