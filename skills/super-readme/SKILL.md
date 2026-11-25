---
name: super-readme
description: Write or update a project's README.md as a visual explainer - a map of where the project lives, the problem it solves, architecture and flow diagrams, one block per feature, a verified quickstart. Use when the user says "superREADME", "super-readme" or "README visual", and in step 7 of the manager to update the block of the feature just shipped.
argument-hint: "[feature <slug>]  (no argument = the whole README)"
---

# Super README

A **super README** explains a project the way the `lesson` skill explains a concept: it starts from the problem, runs on one concrete example and shows each idea with a picture. The reader finishes it knowing what the project is for, how it works inside and how to run it.

It is plain GitHub Markdown: Mermaid diagrams (GitHub draws them) and SVG/PNG images in `docs/readme/`. No CSS or JS, because GitHub strips them. Look and drawing rules: [`STYLE.md`](STYLE.md).

## Modes

- **Full** (`/super-readme`): create or rewrite `README.md`.
- **Feature** (`/super-readme feature <slug>`): update only that feature's block. The manager calls this in step 7.

## Full mode

1. **Read the project.** Read `AGENTS.md`, the manifest (`package.json`, `pyproject.toml`, `project.godot`...), the entry points and the current README. Every claim in the README traces to something you read in this session. Never fill in from memory. Done when you can name the problem, the 3-7 main parts and one real example input with its output.

2. **Protect what exists.** If `README.md` exists and has no `super-readme` markers, show the user the outline you plan and which current sections you will keep, move or drop. Wait for an ok before replacing it. Keep install steps, licenses and credits the user wrote unless they are wrong.

3. **Write** `README.md` in the language of the existing README (none: the user's language), in this order:
   1. `# Name` and one sentence saying what it does for whom.
   2. **Map:** `docs/readme/map.svg`, right under the title. It shows the world the project lives in (users, systems, data), with the project highlighted as the piece it adds. 4-7 elements, labels only.
   3. **The problem**, as a ladder: a real scenario, what breaks (with names and values), why it breaks, and only then what this project does about it.
   4. **How it works:** a Mermaid `flowchart` of the components (who calls whom) and a Mermaid `sequenceDiagram` of the main flow, using the real names from the code.
   5. **Features:** one block per feature (format below).
   6. **Quickstart:** the commands to install and run. Run each one, or mark it `<!-- not verified -->` and tell the user which ones you did not run.
   7. **Structure:** a tree of the top folders, one line of role each.
   8. **Terms:** every technical term the README used, one line saying what it is.
   9. **Further reading:** the primary docs the project depends on.

4. **Verify** (below) and show the user the paths of the files you wrote.

## Feature mode

1. **Decide whether it applies.** It applies when the change is visible to a README reader: a new feature, a changed command, flag, API or screen, or a component added or removed. Refactors, internal fixes, tests and chores skip it: reply `README: no visible change` and stop.
2. **Read the change:** the plan or spec, and `git diff <base>...HEAD --stat` plus the files that matter.
3. **Replace or insert the block** between its markers. A new block goes at the end of the Features section. If the README has no `super-readme` structure, add only a `## Features` section with this block, and suggest full mode to the user. Do not rewrite the rest without asking.
4. **Touch the map and the diagrams only if** the feature added, removed or rewired a component.
5. **Verify** (below) and commit on the same branch as the feature.

## Feature block

```markdown
<!-- super-readme:feature <slug> -->
### <Feature name>

One sentence: what the user can do now that they could not before.

<diagram: Mermaid, or ![<alt>](docs/readme/<slug>.svg|png)>

**Example:** <real input> → <real output>, with the names and values used in the code or tests.
<!-- /super-readme:feature <slug> -->
```

Use a screenshot (`docs/readme/<slug>.png`) when the feature has a screen. Capture it from the running app with the `run` or `agent-browser` skill, never from a mockup.

## Verify

- Every relative link and image in `README.md` points to a file that exists: `rg -o '\]\((docs/[^)]+)\)' README.md -r '$1'`, then check each path.
- Every SVG parses as XML and contains no `<script>`, `<foreignObject>` or external font.
- Every Mermaid block uses only `flowchart`, `sequenceDiagram`, `classDiagram`, `stateDiagram-v2` or `erDiagram`, and node labels with parentheses or slashes are quoted (`A["save (draft)"]`).
- Quickstart commands ran, or are marked as not verified.
- Feature mode: only the block of that feature, and the map or diagrams it required, changed in `git diff`.
