# Proposal

## Why

The devkit needs a repeatable way to find useful design references, improve the architecture diagrams the user draws in Excalidraw, and turn game briefs into playable Godot work. The workflow must respect free-plan limits, use the user's existing Meta AI/Gemini image process, and avoid local servers or image-generation runtimes.

## What Changes

- Add first-party skills for reference selection, image-prompt handoff, manual Excalidraw review, and Godot game production.
- Add an English source catalog for Pinterest, Refero, Mobbin, Behance, Dribbble, Awwwards, SiteInspire, Land-book, One Page Love, and platform design guides, with free-tier limits and a fallback route by task.
- Use existing browser capabilities only where the source's terms allow it. Pinterest is manual-only: the user searches and shares selected links/images; no automated browsing, scraping, or Pin extraction.
- Keep Excalidraw manual. The user draws online and shares an export or screenshot; the agent analyzes it and suggests concrete edits without an Excalidraw MCP.
- For local game work, add project-scoped scripts only. Use existing Godot coding skills and the Godot CLI when installed; do not add editor add-ons, MCP servers, or local image-generation services.
- Prepare prompts for the user's free consumer Meta AI/Gemini image UI; do not call image APIs, automate sign-in, or bypass usage limits.
- Use no paid plans, subscriptions, credit packages, or new runtime dependencies. Do not copy source screenshots/assets into shipped work without rights.

## Capabilities

### New Capabilities

- `design-reference-workflow`: Choose, rotate among, and cite a small number of free reference sources without bypassing their limits or terms.
- `image-prompt-handoff`: Prepare copy-ready prompts for the user's existing no-cost consumer image interface and help integrate returned images using scripts.
- `godot-game-production`: Let the agent plan and implement a playable Godot milestone with bounded chat decisions and script-based verification.
- `architecture-diagramming`: Review user-provided Excalidraw exports/screenshots and return actionable architecture feedback for the user to apply.

### Modified Capabilities

None.

## Impact

Expected changes to `skills/`, `scripts/`, `docs/design-reference-sources.md`, and testing guidance. No new MCP server, local service, editor add-on, image-generation runtime, or OpenCode global MCP entry is planned.
