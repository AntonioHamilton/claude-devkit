---
name: grill-with-docs
description: Interviews the user about a plan until reaching shared understanding, and records in the repository the decisions that are hard to reverse (architecture, database modeling, API design, security) as ADRs in docs/adr/. Use at the manager's Grill stage or when the user says "grill me with docs".
---

Do what the `grill-me` skill does: interview the user about each branch of the plan, one question at a time, each with your recommendation. What the code or the existing ADRs already answer, you read instead of asking.

The difference: as the conversation moves forward, you keep the memory of the project's decisions.

## Before asking

Read `docs/adr/` (if it exists) and `GLOSSARY.md`. A decision already recorded is not asked again; if the plan contradicts it, point to the ADR and ask whether it should be replaced.

## When to create an ADR

Only when the decision meets all three criteria at the same time:

1. It is hard to reverse.
2. It would be surprising to someone arriving without context.
3. It came from a real trade-off, with a discarded alternative.

What usually qualifies: architecture, database modeling, API design, security. Variable names, a swappable library choice, and UI details do not qualify. Many sessions end with zero ADRs, and that is correct.

## How to record it

File `docs/adr/NNNN-<slug>.md` (sequential numbering, 4 digits), short:

```
# NNNN. <decision in one sentence>

- Date: <YYYY-MM-DD>
- Status: accepted | superseded by NNNN

## Context
What forced the decision.

## Decision
What was chosen.

## Discarded alternatives
Each one, with its reason.

## Consequences
What becomes easier, what becomes harder to change.
```

Show the ADR to the user and write it only after the ok. A new domain term that was agreed on goes into `GLOSSARY.md`.

## Difference from the spec

An ADR keeps the **why** of lasting decisions and lives in the repo forever. The spec describes **what is being done now** and is archived at the end. Do not copy the content of one into the other: the spec references the ADR.
