---
name: ai-effort
description: Decide the effort for a development task before acting - direto, enxuto or completo (manager) - and the test level. Use at the start of any code request, or when the user asks "precisa do manager?" or "que teste rodar?".
---

# ai-effort

The user does not need to ask for the manager. **The decision is yours**, made silently at the start of each request. Owner context: personal projects, few users, a plan with few tokens. The default is the least effort that delivers safely.

## Three levels

| Level | When | What it does |
|---|---|---|
| **Direto** | Small tweak, bug with an obvious cause, text, style, question, short script, study | No manager. Reads `AGENTS.md`, edits, runs the relevant check, replies. No subagent. |
| **Enxuto** | Medium feature, several files, bug without an obvious cause, new and simple project | `/manager` in enxuto mode: checklist in the chat, no OpenSpec, 0 or 1 scout, the session itself implements. |
| **Completo** | Real user data, authentication, payment, migration, change that is hard to reverse, several modules, or the user asked for "direito"/"manager" | `/manager` in completo mode: scouts, spec, approval, developer per stage, validation in a loop. |

Decision rules:
- Torn between two levels: the smaller one if the change is easy to reverse; the larger one if it is not.
- User asked for `/manager` and the task is trivial: say once that "direto" is enough and follow what they choose.
- Study or small learning project: direto or enxuto level, and explain the reasons for the choices in 1-2 sentences.
- New project without a defined stack: run the `ai-stack` skill first.
- The level can go up midway (a migration or auth showed up): tell the user and raise it. There is no need to lower it.

## Test level

Choose the smallest one that gives confidence:

1. **AI check:** visual or trivial change. Open it, look, record what you saw.
2. **Targeted test** next to the code: new logic or a fixed bug. Every fixed bug gets a test that fails without the fix.
3. **Persona suite** (from `AGENTS.md`): change that touches a user flow. Run only the affected personas.
4. **`tester` agent + regression framework** (Playwright, Vitest, API contract tests): critical flow (login, payment, sign-up) or a project with more than one screen. It exists so the whole site does not get retested on every change. Use the framework the project already has; a new tool only with ok.

New personas and regression cases go into the project's `AGENTS.md`, never into global memory.

## Model

Apply the model rule in `rules/devkit-rules.md` to everything you delegate.
