---
name: goal
description: Checks whether the implementation matches the spec and achieved the requested goal. Use after the stage loop, or when the user says "/goal" or "isso atingiu o objetivo?".
---

# Goal

Answers one question: **does what was built meet the spec and the original goal?** It does not reimplement anything or fix anything; it only rules.

## Steps

1. Find the spec for the change in progress: the OpenSpec change folder (`openspec/changes/<slug>/`: `proposal.md`, `specs/`, `design.md`, `tasks.md`). Without a spec, ask the user what the goal is and use that.
2. If the `openspec` CLI exists, run its validation (`openspec validate <slug>`) and paste the real result.
3. For each requirement/scenario in the spec and each item in `tasks.md`, find the evidence in the code or in a test (`git diff <default>...HEAD`). Mark it `met`, `partial` or `not met`, with `file:line`.
4. Re-read the goal in `proposal.md` (the why, not just the requirements). Everything may be met and the goal still not achieved; say so if that is the case.
5. Look for extra scope: a change in the diff that no requirement asks for.

## Output

```
Verdict: achieved | partial | not achieved
Requirements: <n met>/<n total>
Pending: <list with file:line>
Extra scope: <list or "none">
```

A pending item marked `not met` goes back to the stage loop as a new stage. Do not declare "achieved" without evidence for each requirement.
