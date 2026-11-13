---
name: Game Dev Team
description: Team for Godot 4 projects — scenes, GDScript, signals, resources, performance, export and headless tests with GUT/gdUnit4. Use when the project has project.godot, .tscn or .gd files, or when the user asks for "game team", "game dev team" or "Godot".
---

# Game Dev Team

Game development team for **Godot 4**. The `game-dev-team` example from Agnthub is Unity; here the members are the Godot agents that exist in this harness. The manager is not a member: it orchestrates, checks the evidence and answers the user.

## When to use

- Project with `project.godot`, `*.tscn`, `*.gd`, `addons/gut`, `addons/gdUnit4` or export presets.
- Bug in scene, signal, resource, input, physics, animation, audio, save or performance.
- Game architecture review before implementing a system.
- Export to desktop, web or mobile.

## When not to use

- Unity, Unreal or C#: there is no engine agent for these. The manager declares the blocker instead of inventing a member.
- Web frontend, API/database or React Native app: use `frontend-team`, `backend-team` or `react-native-team`.
- Game design, economy, narrative and level design: there is no dedicated agent; the manager works with the user and records the decisions.
- Art, 3D models or soundtrack: there is no asset generator in this team; the manager asks the user for the asset or uses a placeholder.

## Roster

| Role | OpenCode | Claude Code | Strength | Hand off to | Do not hand off to |
|---|---|---|---|---|---|
| Godot architect | `godot` | `developer` with this skill | Scene tree, signals, resources, autoloads, input, performance, export | Decide scene structure, refactor a system, configure export | Writing a whole GDScript system on its own |
| GDScript | `godot-gdscript` | `developer` with this skill | Static typing, idioms, coroutines, signals, script review | Implement and review the stage's `.gd` files | Redesigning the scene tree without the architect |
| Test | `tester` | `tester` | GUT/gdUnit4 headless, scene smoke test, screenshot, evidence | Run the suite, reproduce a bug, validate input/collision/save | Fixing the game or changing the spec |
| Review | `reviewer` | `reviewer` | Risk, regression, spec adherence | Review a large diff, autoload, export or high risk | Implementing the fix |

## Handoffs

1. **Manager** defines the stage, acceptance criteria, allowed files and test command.
2. **`godot`** decides the scene, resource, signal and implementation order; records a short plan.
3. **`godot-gdscript`** implements the stage's scripts, one file at a time.
4. **`tester`** runs parse/import, the headless suite and a scene smoke test; if there is UI, saves a screenshot.
5. **`reviewer`** reviews when the diff is large, touches autoload/export, or there is regression risk.
6. **Manager** checks the evidence, writes the report and hands back.

One specialist at a time on the same file. A finding outside the scope comes back as a report; it does not turn into a free fix.

## Verification

Read the project's `AGENTS.md` and use its real command. If no command is declared, start with:

```bash
godot --version
godot --headless --path . --quit
```

- **GUT:** `godot --headless -s addons/gut/gut_cmdln.gd -gdir=res://test -gexit` (confirm the addon path).
- **gdUnit4:** use the command of the installed addon; do not invent one.
- **Export:** `godot --headless --path . --export-release "<preset>" build/<file>`.
- **UI:** real screenshot of the scene or the editor in `docs/testing/evidence/<date>-<slug>/`.
- **Performance:** measure with `Performance.get_monitor(Performance.TIME_FPS)` or the profiler; do not estimate from memory.

If the `godot` binary does not exist, record `BLOCKED: Godot executable not found`, the install command and what was left untested. Do not declare success.

## Acceptance criteria

- The scene opens and the scripts compile without errors.
- The stage's behavior happens in the game, not only in the unit test.
- The existing suite passes; a new test only when there is a reproducible bug or a real gap.
- The evidence is in `docs/testing/evidence/<date>-<slug>/` and the report in `docs/testing/<date>-<slug>.md`.

## Handback to the manager

Reply with: what changed, files, commands run with the output summarized, evidence path, open risks and what was left untested. Do not commit, push, merge or open a PR.
