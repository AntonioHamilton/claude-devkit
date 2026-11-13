---
name: game-production
description: Turn a game idea into a bounded, playable Godot milestone with autonomous implementation, chat-based creative decisions, user-provided image assets, and script-based verification. Use when starting or substantially extending a Godot game.
---

# Game Production

## Working agreement

The user wants the agent to handle routine design, implementation, and verification. Make reversible, low-risk decisions within the approved brief. Ask in chat only when a decision would materially change genre, target platform, audience, art direction, or a core mechanic. The user may test the game occasionally and decide among creative directions.

## Workflow

1. Inspect `project.godot`, `AGENTS.md`, the main scene, existing scripts, assets, and test structure. Follow `godot-dev` for Godot APIs and GDScript conventions.
2. Turn a new idea into a short brief: player goal, core loop, controls, target platform assumption, visual direction, and first playable milestone. Ask only about consequential missing decisions.
3. Sketch the scene/system structure in text first. If the user wants an architecture picture, describe what to draw in Excalidraw; the user owns and edits the canvas.
4. Implement one playable slice at a time. Prefer typed GDScript, small scenes, reusable Resources for game data, clear state machines, and working input/feedback over broad scaffolding.
5. For images, prepare a copy-ready prompt for Meta AI or Gemini Apps. The user generates and returns the image. Do not call an image API, automate login, or generate images locally. If a model quota is reached, offer a prompt for the other free interface, script-based art, or wait for the user's choice.
6. Use project-scoped scripts only for asset inspection/cropping/slicing/import or test orchestration. Never add an MCP server, editor add-on, background service, image-generation runtime, or dependency without explicit approval.
7. When Godot is available, run parsing/import checks, project tests, and a runtime smoke test through the Godot CLI; capture evidence. If the executable is absent, run the preflight script and report the runtime check as blocked. Never claim a playable build was tested when it was not.
8. After each slice, report the playable result, decisions made, remaining uncertainty, and the smallest next test for the user.

## Asset prompt handoff

For a character, specify identity anchors (silhouette, face, clothing, palette), camera/view, pose, background, and intended use. For a character sheet, ask for clearly separated views/poses and a simple consistent background; warn that consumer image tools may not obey exact sprite grids or pixel dimensions. Request one clean concept or pose at a time when consistency matters. The user can provide the result as a reference image for follow-up prompts.

For UI and game-art direction, specify the target screen/asset, hierarchy, composition, visual style, palette, lighting, and any areas that must remain empty. Write the prompt in the user's language; provide an English version only when useful or requested.

## Verification

- Use the project's existing Godot version and test framework; do not install Godot or a test framework automatically.
- Prefer `godot --headless --path <project> --quit` for parse/import and the project's existing test suite for behavior.
- Exercise the actual main loop in Godot when the executable and display/runtime are available.
- Save real command output/screenshots to the project's testing evidence when the project's test policy requires them.
- Use `scripts/godot-preflight.ps1` on Windows to report whether the selected project and Godot CLI are available.
