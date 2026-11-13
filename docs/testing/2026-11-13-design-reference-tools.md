# Validation: Free design-reference workflows — 2026-11-13

## Summary

The source catalog and first-party skills use only existing browser access, user-provided diagrams/images, and scripts. No reference MCP, local image generator, Excalidraw server, or third-party package was installed. The free-reference routing cases and the Godot missing-runtime path were checked.

## Environment

- Project: `C:\development\claude-devkit` on Windows.
- Existing browser MCP: Chrome DevTools was connected in the OpenCode MCP list.
- Godot CLI: not found on `PATH` (`Get-Command godot` returned no executable).
- No Pinterest account automation, Pinterest Pin scraping, or image generation was performed.

## What was checked

- [x] Real product UI: Refero and Mobbin official plan information.
- [x] Moodboard/creative work: Pinterest terms/help and Behance's official free-plan help page.
- [x] Web references: Awwwards public pages, Land-book plans, and One Page Love's public gallery/about page.
- [x] Platform guidance: Apple Human Interface Guidelines and Material Design 3 public documentation were discoverable from official search results.
- [x] Pinterest behavior: official terms prohibit unauthorized automated search/collection/scraping; the skill requires manual-only use.
- [x] Local-engine boundary: Godot preflight reports a missing engine without installing software.

## Evidence

- `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/check-design-reference-workflow.ps1` → `PASS: source catalog, free-tier routing, Pinterest boundary, and design/game fixtures are present.`
- The extended `scripts/check-design-reference-workflow.ps1` run → `PASS: source routing, Pinterest boundary, Excalidraw review, image-prompt handoff, and script-only game workflow are present.`
- PowerShell parser check for `scripts/godot-preflight.ps1` → `POWERSHELL_SYNTAX=OK`.
- Godot preflight using a missing executable → `BLOCKED: Godot executable not found. No software was installed.`; child process exit code `3`.
- Official sources read on 2026-11-13:
  - [Refero plans](https://doc.refero.design/help/plans) and [pricing](https://refero.design/pricing): Free search is limited; Refero MCP/Figma integration are not in Free. The pricing page advertises about 3% of the library and 3 Research searches/day.
  - [Mobbin pricing](https://mobbin.com/pricing): Free access is limited and capped at three collections in the published machine-readable summary; MCP/API are not Free. That summary's `last_updated` is 2026-09-11, so current feature details are deliberately marked for recheck.
  - [Pinterest Terms](https://policy.pinterest.com/en/terms-of-service), effective 2026-11-12, and [Pinterest search help](https://help.pinterest.com/en/article/search-for-ideas-on-pinterest): terms prohibit unauthorized automated access; manual search is available.
  - [Behance free-plan help](https://help.behance.net/hc/en-us/articles/204483894-What-is-Behance): Behance states participation is free, with no project/media upload limit.
  - [Dribbble plans](https://dribbble.com/pro): the official page lists a $0 Free plan.
  - [Land-book plans](https://land-book.com/pro): Free limits categories, sections, motion, search, and boards; currently three boards.
  - [Awwwards public gallery](https://www.awwwards.com/websites/) and [SiteInspire](https://www.siteinspire.com/about): public curated website references.
  - [One Page Love](https://onepagelove.com/about): public one-page website gallery; no numeric browse quota was found.
  - [Apple HIG](https://developer.apple.com/design/human-interface-guidelines/) and [Material Design 3](https://m3.material.io/): public platform design guidance.
- SiteInspire's direct fetch returned HTTP 429 from the research tool. Its official page was still discoverable by search; this is recorded as a tooling/rate-limit constraint, not evidence the site is unavailable to the user.
- No source screenshots or third-party assets were saved to the repository.

## Manual skill-contract cases

- Product flow prompt: “How does a mobile checkout collect a billing address?” routes to Refero Free, then Mobbin Free/public product pages if limited; max three cited references.
- Visual direction prompt: a SaaS landing page routes to Awwwards plus SiteInspire/Land-book; the agent reports visible layout/type/motion rather than copying assets.
- Moodboard prompt: a fantasy-character moodboard routes to Behance/Dribbble. Pinterest is only suggested as a manual user step.
- Architecture fixture: a diagram described as `User -> Web app -> Database` with no identity or failure flow yields proposed edits to label the trust boundary, authentication/authorization, request/response, and error path; these are questions, not facts. No Excalidraw file is created or changed.
- Character-sheet prompt: the handoff asks for stable identity anchors, views/poses, a simple background, and separate frames when exact sheet grids matter. No image was generated.
- Game runtime case: no Godot executable was found; the script reports a blocked runtime check and does not install software.

## Findings

1. Free human-facing libraries are usable as fallbacks, but free-plan coverage is partial and their agent MCPs are paid or absent. The source router must not depend on those MCPs.
2. Pinterest is useful for moodboards, but automatic access conflicts with its terms. The user must search and share selected references manually.
3. Refero and Mobbin are stronger for real product UI than Behance/Dribbble. Their free tiers are limited, so the skill rotates to public product pages or asks the user for an example.
4. Local image generation and editor MCPs are intentionally excluded. The local Godot runtime check is blocked because the executable is not installed/on `PATH`.

## Concepts explained

### Free tier

A free tier is like a trial-sized sample, not necessarily the whole service. The skill records the limit and switches sources rather than trying to bypass it.

### MCP

Model Context Protocol (MCP) is a standard way to give an agent a tool. A library can have a free website while charging for its MCP; the source catalog treats those as separate products.

## What was not tested

- Meta AI/Gemini image generation: no image was generated; only prompt-handoff behavior is planned.
- Pinterest automated access: intentionally not tested because Pinterest prohibits unauthorized automation/scraping.
- Godot project runtime: not tested because no Godot executable was found. Setup/installation remains outside this change's authorization.
- Free-tier search quotas with an authenticated account: not consumed; current account-specific availability remains unknown.

## Checklist for human review

- [ ] Confirm the listed free plans are available in your accounts/region when you need them.
- [ ] Use Pinterest manually and share only the Pins you want the agent to analyze.
- [ ] Draw the architecture in Excalidraw and send the `.excalidraw` export or screenshot for review.
- [ ] Run a Godot project test only after a Godot installation is available.
