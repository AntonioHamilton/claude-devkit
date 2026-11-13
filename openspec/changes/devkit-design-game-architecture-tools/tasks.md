# Tasks

## 1. Reference source research and routing

- [x] 1.1 Add `docs/design-reference-sources.md` with official links, intended use, current free-tier limits, restrictions, and verification date for Refero, Mobbin, Pinterest, Behance, Dribbble, Awwwards, SiteInspire, Land-book, One Page Love, and official platform design guides; verify every price/limit statement points to a primary source or is marked unknown.
- [x] 1.2 Rewrite `design-reference-workflow` to choose sources by task and rotate after limits/no-results; verify fixture prompts route product flows to Refero/Mobbin, web landing pages to website galleries, and moodboards to visual portfolios.
- [x] 1.3 Add explicit Pinterest manual-only and no-scraping behavior; verify the skill does not automate Pinterest or download Pin content, and offers a user-shared screenshot/link fallback.
- [x] 1.4 Read-only check an official source page in each category with the existing web-fetch tool where reachable; record rate limits/blocked pages and do not automate Pinterest or save reference screenshots.

## 2. Manual architecture and image workflows

- [x] 2.1 Replace Excalidraw MCP requirements with a review skill for user-provided `.excalidraw` exports/screenshots; verify it returns specific diagram edits without creating or changing an online document.
- [x] 2.2 Keep `image-prompt-handoff` for Meta AI/Gemini consumer interfaces and remove all local image model/API claims; verify prompts cover character concepts, sheets, style references, and game-screen illustrations with no image-generation call.
- [x] 2.3 Add the Godot game-production skill and only project-scoped helper scripts; verify scripts do not install plugins/services/dependencies or write outside the selected project.
- [x] 2.4 Check the actual Godot executable availability; if missing, document the blocked runtime tests and verify the preflight script reports the exact missing command without installing Godot.

## 3. Integration and evidence

- [ ] 3.1 Update README/AGENTS guidance to forbid new local MCPs, editor add-ons, and image-generation runtimes for this workflow; verify the approved integrations are browser references, user-supplied diagrams/images, and scripts only.
- [ ] 3.2 Run skill checks, script syntax checks, source-router fixture tests, and `git diff --check`; save the evidence/report and verify no API keys, paid MCP entries, local image servers, or Excalidraw server are added.
- [ ] 3.3 Validate this OpenSpec change in strict mode and inspect the final diff; record Godot runtime as not tested if the executable remains unavailable.
