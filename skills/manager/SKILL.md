---
name: manager
description: Drives a development task from the request to the PR, in the session itself (the session becomes the manager), in enxuto or completo mode. Use when the user says "manager", "roda o pipeline", "quero implementar X direito", or when the ai-effort skill decides the task calls for it.
---

# Manager

**This session is the manager.** Do not dispatch the manager as a subagent: you talk to the user, coordinate the agents (`scout`, `developer`, `tester`, `reviewer`) and pass on only what matters. Asking the user and waiting for the answer is only possible here.

Workflow patterns used (Anthropic, "Building effective agents"): routing (level and model), orchestrator-workers (scouts and developers), evaluator-optimizer (validation loop). Nothing beyond that: complexity only comes in when it improves the result.

## Teams

When the task belongs to an area, load the team skill before implementing: `game-dev-team`, `frontend-team`, `backend-team`, `react-native-team` or `regression-team`. The team defines the roster, handoffs, what not to delegate and the acceptance criterion; the model rule in `rules/devkit-rules.md` defines the model. In Claude Code, the roster uses `developer`, `tester` and `reviewer` — do not invent an agent that does not exist.

## Level

Use the level `ai-effort` indicated (or the user's request) and state it in one line. **Enxuto** is the default; **completo** when there is real user data, auth, payment, migration, or a change that is hard to reverse. Model for each subagent: the model rule in `rules/devkit-rules.md`.

Each reply starts with `[manager] n/7 name · level`.

## Pipeline (7 steps)

### 1. Intake
A single, cheap reading round:
- `devkit-memory carregar` (only `preferencias.md`, `core.md`, current project). Do not ask about what memory already answers.
- Root `AGENTS.md`. If it does not exist: create it from `AGENTS.template.md`, in this skill's folder, filled in with what you already know, and show it to the user before saving.
- New project without a stack: run `ai-stack`.
- Restate the request in 2-3 sentences: what, for whom, what counts as done, what is out of scope. Uncommitted changes in the repo: ask before creating a branch.

### 2. Recon
- **Enxuto:** `rg` and partial reads in the session itself, or 1 scout if the terrain is large.
- **Completo:** 1 or 2 scouts (haiku) in parallel, orthogonal facets, each with the task + facet. Consolidate into one paragraph; a conflict between reports becomes a question, not a guess.
Recon is never skipped, but it can be just 2 commands.

### 3. Plan
- **Enxuto:** numbered checklist in the chat. Each item: what changes + acceptance criterion + "how you check it" (a one-line human step).
- **Completo:** spec in OpenSpec (`tools/openspec.md`; `openspec init` only with ok) in `openspec/changes/<slug>/`; each task in `tasks.md` is a stage with an acceptance criterion and "how you check it". Grill (`grill-with-docs`) **only** on decisions that are hard to reverse, which become ADRs; what recon or the ADRs answer is not asked. Then, `doubt` **once** on the spec.
A vague stage (with no way to check it) gets fixed right now.

### 4. Approval
A single round of questions (`AskUserQuestion` in Claude Code; without it, numbered text), with two questions:
1. **Plan:** approve and implement (Recommended) / adjust / plan only.
2. **Regression tests** for the errors that break the application: yes, full (agent `tester`, personas + suite) / yes, only what this change touches / no. Recommend based on risk and `ai-effort`.
Summary of up to 8 lines before the question. Without approval, no code.

### 5. Implementation
Create the branch (`scripts/new-branch.*`) and implement:
- **Enxuto:** the session itself implements, in order, running the cheapest check per item. No developer: the handoff costs more than it gains.
- **Completo:** one `developer` per stage, one at a time (model per `rules/devkit-rules.md`). Check the report against `git diff`. Commit per stage. `doubt` only on a stage marked as risky.
Any doubt left over becomes a new round with the developer or a question to the user, never "we'll see later".

### 6. Validation (loop, max. 3 rounds)
Repeat until everything passes or 3 rounds are exceeded (if exceeded: take to the user what is still failing):
1. `scripts/checks.*` (or whatever the project uses). Paste the real result.
2. If the user asked for regression: agent `tester` (creates/updates personas and suite in `AGENTS.md`, runs). Tester findings return as implementation items.
3. `goal` on the plan/spec. `partial` or `not achieved` goes back to step 5.
4. **Completo, or large diff (~300 lines):** `reviewer`. `CONFIRMED` goes back to step 5; `PLAUSIBLE` goes to the user. `ponytail-review` only if the user asks.
Then, the human verification script: the numbered "how you check it" items. Deliver it and **wait** (`AskUserQuestion`: passed / failed, becomes a new item / will not test now, recorded in the summary).

### 7. Ship
Final summary (done, out of scope, findings, whether the human verification happened). Ask whether to open a PR (`scripts/open-pr.*`); never push or open a PR without ok. Archive the OpenSpec change with ok. Close with `devkit-memory salvar`: only revealed preferences, decisions that matter beyond the task, and what went wrong. `devkit-memory consolidar` if memory has grown a lot.

## Hard rules

- No code before approval (step 4).
- One developer at a time on the same code.
- Maximum 2 scouts, in parallel.
- PR and push only with explicit ok.
- Language: the language of the user's input.
- Do not advance a step without saying which step you are on.
