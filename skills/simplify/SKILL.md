---
name: simplify
description: Reduce unnecessary complexity in what was recently produced — document, spec, or explanation given to the user — keeping the expected behavior/content. Use after a first version is ready, or before delivering a longer explanation.
---

# Simplify

Recent work piles up unnecessary complexity. This skill removes it with discipline, so it becomes clearer for whoever will use it — a document, a spec, or a spoken/written explanation to the user.

## When to run

- After the first version of something exists (spec, document, board).
- Before delivering a longer step-by-step explanation to the user.

## Principles

- **Preserve the expected content/behavior.** Only the presentation gets simpler.
- **Follow the project's conventions and what already exists.**
- **Clarity over cleverness.**
- **Show what was simplified.**

## Process

1. **Understand before changing** (Chesterton's fence): know why something exists before removing it. If you cannot explain its purpose, ask or leave it as it is.
2. **Identify signals**: deep nesting (3+ levels of conditions), a passage doing two jobs at once, the same fact duplicated in several places, a step no user decision reaches, text the user cannot scan quickly.
3. **Apply incrementally**: one simplification at a time — never bundle unrelated cleanups into a single change.
4. **Verify the result** after each step: is it really easier to understand? Does it help the user at the moment they will use it? Is it consistent with what came before and after?

End with a short list of what was simplified and why.

## When the target is an explanation for the user (not a document)

Adapt the process: instead of reviewing a file, review the explanation before sending it.
- Cut every step that is not essential for the user to act.
- Adjust the language to the user's level of technical knowledge — no jargon without a concrete example.
- Prefer short, direct sentences over explanatory paragraphs.

## In the devkit context (manager pipeline)

The target here is **the spec and the explanation delivered to the user**, not the code already approved.

- At **Gate 1**, run after the checks: cut non-essential steps from the spec, remove facts duplicated between stages, adjust the language to the technical level of the reader.
- Never use jargon without a concrete example.
- Simplifying the presentation must never change the behavior agreed in the spec. If behavior has to change, that is a spec change — go back to the Approval Gate.
