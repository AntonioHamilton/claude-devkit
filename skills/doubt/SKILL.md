---
name: doubt
description: Adversarial review before a decision that has consequences — argue the opposite thesis before pulling the trigger. Use before high-impact or hard-to-reverse decisions, in any project.
---

# Doubt

Do an adversarial review, as if you wanted to defend the opposite thesis, before making a decision that has consequences. Long sessions make unquestioned facts look unquestionable — and that goes wrong fast exactly when changing course is still cheap.

## When to use

- Before a high-impact decision (killing an NPC, closing a plot thread, changing how a rule is interpreted, overwriting a genre/keymap already in use, rewriting material already published).
- Before any action that is hard to reverse within a larger plan (the skeptic step of the pipeline).

## Process

1. **State the decision** in one sentence, plus what it assumes to be true.
2. **Argue the opposite**: write the strongest, most honest case for NOT doing it (or for doing the reverse).
3. **List what would have to be true** for the opposite case to win.
4. **Check the evidence**: verify these assumptions against the project's real data (files, history, documentation) — do not trust the conversation's memory for facts that live in files.
5. **Verdict**: proceed as planned · adjust the decision · ask the user. State which one and why, in two or three sentences.

## In the devkit context (manager pipeline)

Run `doubt` at three fixed points:

- **Spec Skeptic pass** — after the spec is written, before the Approval Gate. The decision at stake is "is this spec the right thing to build".
- **End of each stage** — after the developer delivers, before moving on to the next. The decision is "does this stage actually implement the spec and leave no open doubt".
- **Before any action that is hard to reverse** — overwriting a file in use, deleting a migration, changing a public contract, force-pushing.

An additive, reversible action does not need this step.
