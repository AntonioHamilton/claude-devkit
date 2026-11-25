---
name: lesson
description: Write one visual HTML lesson that explains one technical concept.
disable-model-invocation: true
argument-hint: "<concept> [link, file or pasted material]"
---

A **lesson** is one self-contained HTML file that teaches one concept, starting from the problem that forces the concept to exist. The reader finishes it in one sitting and can explain the concept afterwards.

## Steps

1. **Scope.** Name the one concept. If the request holds several (e.g. "all of OAuth"), propose a numbered series of lessons, ask which one to write, and wait for the answer. Done when one concept is chosen.

2. **Research.** Read the material the user passed, then find 1–3 **primary sources** (official docs, the paper, the creator's own post). Never trust parametric knowledge: every claim in the lesson traces to a source you read this session. Done when you hold the sources and the one concrete example the lesson will run on.

3. **Write** `./lessons/<slug>/lesson.html`, in the language of the request (or `--lang`), styled by [`STYLE.md`](STYLE.md).

   Open with the **map**: one diagram, right under the title, showing the world the concept lives in (a system, a process, a team) with the concept highlighted as the piece it adds. 4–7 elements, labels only, readable at a glance. The map orients; the ladder explains.

   Then climb the **ladder**, one rung per section:
   1. a real, simple scenario;
   2. what breaks, shown on the concrete example (names, values, what happens at each step);
   3. why it breaks;
   4. only now, the technical name;
   5. how it is solved, saying which part of the problem each fix removes.

   Each rung gets a diagram when a picture shows it better than prose. Then add:
   - **Terms**: every technical term the lesson used, a one-line definition each (what it IS), with `Avoid:` for weaker synonyms.
   - **Check**: 3–5 questions that make the reader apply the concept to a new case, answer hidden behind a click.
   - **Sources**: the primary sources, one marked as the next thing to read or watch.

4. **Open** the file in the browser (`open` / `xdg-open` / `start` on Windows). Done when the reader has it on screen.

## Origin

Adapted copy of https://github.com/YudiG12/ganeko-skills (`skills/beta/lesson`, commit `9b566b7`, MIT, Yudi Ganeko). Changed: the Windows `start` command in step 4. `super-readme` reuses [`STYLE.md`](STYLE.md) for project READMEs.
