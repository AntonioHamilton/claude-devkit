---
name: Regression Team
description: Team for confirmed bugs, critical flows without coverage and regression risk — reproduces, reduces the case, writes the test that fails before the fix and verifies afterward. Use when the user asks for "regression team", "regression team", "reproduce this bug" or when there is a confirmed bug without a test.
---

# Regression Team

Regression team. Its job is to turn a confirmed bug into a test that fails for the right reason before the fix and passes after. It is not a feature or refactoring team.

## When to use

- Reproducible bug, with minimal steps.
- Critical flow without test coverage.
- Regression risk in an area that just changed.
- Before a release, to check the flows that must not break.

## When not to use

- Feature or refactoring without a bug: use the area's team.
- Bug without reproduction: first investigate and reduce the case; without a repro there is no regression test.
- Existing coverage for the behavior: run the existing test; do not create a duplicate.
- Product fix: the regression team writes the test; the area specialist fixes the cause.

## Roster

| Role | OpenCode | Claude Code | Strength | Hand off to | Do not hand off to |
|---|---|---|---|---|---|
| Regression | `regression-tester` | `tester` with this skill | Reproduce, reduce, write a test that fails before, verify after | Create the minimal test and the before/after evidence | Fixing the product or deciding the spec |
| Flow test | `tester` | `tester` | Full flow, error cases, evidence | Walk through the real flow and confirm the behavior | Duplicating the regression test |
| Fix | `godot`, `frontend`, `backend` or `react-native` | `developer` with the area's skill | Fix the cause in the right domain | Fix after the test fails | Writing the regression test in place of the area specialist |
| Review | `reviewer` | `reviewer` | Risk, root cause, spec adherence | Review the fix and the test before closing | Implementing |

## Handoffs

1. **Manager** confirms the bug, the expected behavior and the acceptance criteria.
2. **`regression-tester`** reproduces, reduces it to the smallest case and writes the test that fails for the right reason.
3. **Area specialist** fixes the cause, without changing the test to make it pass.
4. **`regression-tester`** runs the test again and confirms it passes; also runs the neighboring suite.
5. **`reviewer`** reviews the cause, the test and the regression risk.
6. **Manager** checks the evidence and writes the report.

## Verification

Use the project's framework. Examples:

```bash
npm test -- <file>
pytest <file>::<test> -q
go test ./... -run <Test>
godot --headless -s addons/gut/gut_cmdln.gd -gdir=res://test -gexit
adb shell am instrument -w <runner>
```

- Run the test **before** the fix and keep the output that fails for the expected reason.
- Run **after** and keep the output that passes.
- Run the neighboring suite to confirm the new test did not break anything.
- If the bug is not fixed, leave the test marked as expected-to-fail, with the reason and the issue.
- Evidence in `docs/testing/evidence/<date>-<slug>/`; report in `docs/testing/<date>-<slug>.md`.

## Acceptance criteria

- The test fails before the fix for the right reason, not because of a setup error.
- The test passes after the fix.
- The neighboring suite stays green.
- There is no duplicate test covering the same behavior.
- The cause was fixed in the right domain, not masked in the test.

## Handback to the manager

Reply with: minimal reproduction, test created, before/after output, fix files, risks and what was not tested. Do not commit, push, merge or open a PR.
