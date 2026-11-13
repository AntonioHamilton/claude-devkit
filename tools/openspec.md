# OpenSpec

Spec-driven development framework. The manager uses it in step 3 (full mode) in place of the old `templates/spec.md`. Site: https://openspec.dev/

## Install

```bash
npm install -g @fission-ai/openspec@latest
openspec --version
```

Also works with pnpm, bun, yarn and nix. Requires Node.

## Turn on in a project

At the project root, once:

```bash
openspec init
```

Choose Claude Code when it asks for the tools: it creates the `openspec/` folder and the project's slash commands. This writes to the user's repo: **warn before running** and do not commit unless they ask.

## Structure of a change

Each change lives in `openspec/changes/<slug>/`:

- `proposal.md` — why and what changes.
- `specs/` — requirements and scenarios.
- `design.md` — how it will be done.
- `tasks.md` — implementation checklist (the manager's stages).

OpenSpec flow: explore, propose, apply, verify, archive. The exact slash command names are the ones `openspec init` generates; use those.

## How the manager uses it

- Step 3: generates the change (propose) instead of writing `specs/<slug>.md`. The **How to verify** field of each stage goes in `tasks.md`.
- Step 6: the `goal` skill runs `openspec validate`/verify.
- Step 7: at the end, `archive`.
- Project without `openspec/` and without the user's ok for `init`: stop and ask; do not silently fall back to the old template.
