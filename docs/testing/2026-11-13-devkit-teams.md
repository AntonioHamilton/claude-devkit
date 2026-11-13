# Test: devkit teams in OpenCode and the repository — 2026-11-13

## Summary

The five team skills were created in the repository, mirrored to the global OpenCode, and linked to `team-routing`, the README, the golden rules and the `manager` skill. The structural check passed, the installer in dry-run listed all five, the source/destination hashes match, OpenSpec validated the two team changes, and OpenCode discovered the skills at runtime. There is no app, browser or device to open: the deliverable is a coordination contract and skill distribution, and the validation covers that contract.

## Environment

- Project: `C:\development\claude-devkit`, branch `main`, HEAD `0015d28`.
- Harness: OpenCode v2.2.7; PowerShell 5.1.26100.9818.
- Global OpenCode configuration: `C:\Users\Anton\.config\opencode`.
- No browser, device, database or server: the change is not an executable application.
- No third-party plugin or agent was installed. OpenSpec ran via `npx`, without adding a dependency to the repository.

## What was tested

- [x] The five skills exist in `skills/<id>/SKILL.md`, with frontmatter, `When to use`, `When not to use`, `Roster`, `Handoffs`, `Verification` and `Acceptance criteria`.
- [x] Each roster separates OpenCode and Claude Code and cites only agents that exist in the harness.
- [x] No skill cites `unity-developer` or `level-designer`, which do not exist here.
- [x] README, golden rules and the `manager` skill reference the five teams.
- [x] The installer in dry-run lists the five skills for `~/.claude/skills`.
- [x] The SHA-256 hashes of source and destination match for the five skills.
- [x] OpenCode discovers the five skills at runtime.
- [x] `devkit-team-skills` and `devkit-teams-finance-domain-skills` pass `openspec validate --strict`.
- [x] `git diff --check` passes.

## Evidence

- `docs/testing/evidence/2026-11-13-devkit-teams/check-team-skills.txt` → `PASS: 5 teams with roster, handoffs, verification and references in the README/rules.` (exit 0).
- `.../installer-dry-run.txt` → lists `skill:backend-team`, `skill:frontend-team`, `skill:game-dev-team`, `skill:react-native-team` and `skill:regression-team`; `pulado` and `pendente` empty.
- `.../hash-compare.txt` → `MATCH` for the five skills.
- `.../opencode-discovery.txt` → the smoke test with `opencode-go/mimo-v2.6-flash` returned `backend-team`, `frontend-team`, `game-dev-team`, `react-native-team` and `regression-team` (exit 0).
- `.../openspec-validate.txt` → `Change 'devkit-team-skills' is valid` (exit 0).
- `.../openspec-validate-finance.txt` → `Change 'devkit-teams-finance-domain-skills' is valid` (exit 0).
- `.../global-config.txt` → the five folders exist in `~/.config/opencode/skills` and the global `team-routing`/instructions reference them.
- `.../git-diff-check.txt` → `git diff --check` exit 0.
- `.../versions.txt` → OpenCode, PowerShell, branch and HEAD versions.

## Findings

1. **[medium] README in CRLF** — the README was already in CRLF in the index, so `git diff --check` flagged every new line as whitespace. I fixed it with `.gitattributes` (`README.md whitespace=cr-at-eol`) so as not to convert the whole file and create a 300-line diff. The rest of the repository stays in LF. The decision to normalize the README someday is up to the human.
2. **[low] Check encoding on PowerShell 5.1** — the first version of `check-team-skills.ps1` had accented literals and failed because PowerShell 5.1 reads the script itself as ANSI. I rewrote the script in ASCII and started reading the files as UTF-8; now it passes. The error became a test: the script validates the five skills for real.
3. **[informational] OpenCode has no `debug skills`** — the 2.2.7 CLI exposes `debug agents`, `config`, `paths` and `heap-dump`, but not a skills command. The discovery was proven with an `opencode run` on the cheap model, which listed the five IDs; the harness itself also added the skills to the list available at runtime.
4. **[informational] Two overlapping specs** — `devkit-team-skills` and `devkit-teams-finance-domain-skills` cover the same team core. This delivery implements the common core (the five skills). The finance agent, the primary `manager` and the fallback plugin remain pending in the specs. Both validate.
5. **[decision] Test run by the AI** — the `devkit-team-skills` spec optionally allows leaving a trivial check to the human. This installation did not adopt that option: the contract in `devkit-opencode.md` says "The AI tests; the human approves." The human reviews the report and the checklist afterward. If you want the exception, it must be written deliberately into the rules and the team skill.

## Regression tests added

- `scripts/check-team-skills.ps1` — fails if a team skill disappears, loses a required section, does not cite the area's agent, or is not referenced in the README/rules. Its section needles match the English headings (`## When to use`, `## Roster`, `## Verification`, ...). Ran: `PASS` (exit 0).
- `.gitattributes` — prevents the false CRLF positive in the README without changing the file's content or history.

## Concepts explained

### Skill, agent and team

An **agent** is the worker that carries out a task. A **skill** is the manual that teaches the agent how to do something. A **team** here is the line-up sheet: it says which workers come in, in what order, what each one receives and what they should not receive. It's like a game's line-up: the coach (manager) picks who plays, but the player (agent) is the one who runs.

### Dry-run

Dry-run is rehearsing without writing. The installer shows what it would do, but copies nothing. It's like reading the recipe and laying out the ingredients before lighting the stove: you find out whether something is missing without burning the food.

### Hash

A hash is a file's fingerprint. If the source and destination hashes are equal, the two files are byte-for-byte identical. It proves that the copy in OpenCode did not end up different from the source in the repository.

### Skill discovery

The harness scans skill folders and exposes to the model those that have a `SKILL.md` with valid frontmatter. A skill only truly exists when the harness finds it and the model can load it. The smoke test proves this: the model listed the five IDs without me saying which they were.

## What was not tested

- **Real run of a team on a Godot, frontend, backend or React Native project** — there is no app of those kinds in this repository. The skills are the contract; the first real project is the acceptance test.
- **Quota fallback plugin** — not installed. The spec asks for an audit and a test with a synthetic provider first; that is a separate delivery.
- **Primary `manager` agent and finance agent** — not created. They remain pending in the specs.
- **Real installation in `~/.claude`** — dry-run only. I did not overwrite the global Claude Code configuration. The repository is the source; the installer can copy the five skills when you authorize it.
- **`-LinkAgents` symlink on Windows** — not exercised. The copy to OpenCode was direct, file by file.
- **Browser/device** — not applicable to this change.

## Checklist for the human

- [ ] Read the five skills in `skills/*-team/SKILL.md` and confirm whether the roster, limits and handoffs make sense for your work.
- [x] Run `.\scripts\check-team-skills.ps1` and confirm `PASS`.
- [ ] On a real Godot, frontend, backend or React Native project, request the team and check whether the manager loads the right skill and delegates to the area's specialist.
- [ ] Decide whether you want to run `.\install.ps1` to copy the five skills to `~/.claude` (without `-Force`, it skips what already exists).
- [ ] Decide what to do with the spec backlog: primary `manager`, fallback plugin, finance agent, and versioning of the five domain skills.
