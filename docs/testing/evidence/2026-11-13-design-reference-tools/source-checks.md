# Evidence: design reference sources — 2026-11-13

This note records read-only source checks. No accounts were created, no paid API was called, and no source image was saved.

## Official vendor pages

- Refero plans: free plan is limited; free does not include Refero MCP or the Figma plugin. Current pricing page advertises approximately 3% of the library and three Research searches per day.
- Mobbin pricing: free access is limited; the published machine-readable summary lists up to three collections and no free MCP/API. That summary is dated 2026-09-11, so the router requires a live pricing-page check before relying on an exact feature limit.
- Pinterest Terms, effective 2026-11-12: unauthorized automated search, collection, scraping, copying, or data extraction is disallowed. Pinterest is therefore a user-operated source only.
- Behance Help Center: participation is free; no project or media upload limit is stated. Its discovery/search pages were reachable through official help/search documentation.
- Dribbble Pro page: the plan table includes Free at $0; Pro perks are separate.
- Land-book Pro page: a free plan exists; the page lists limits for categories, sections, motion, filtering/search, and boards.
- Awwwards public website gallery and One Page Love's public about/gallery pages were reachable. These are website/creative inspiration, not evidence of mobile user flows.
- Apple HIG and Material Design 3 official docs were discoverable and suitable as platform-standard references.

## Read-only fetch limitations

- The Refero pricing page was available in search results; its official plan documentation was fetched successfully.
- Mobbin's official machine-readable pricing page was fetched successfully.
- Pinterest Terms and search-help pages were fetched successfully; no Pin search was automated.
- Behance help, Dribbble plans, Land-book plans, Awwwards pages, and One Page Love's about page were available.
- SiteInspire direct fetch returned HTTP 429 from this research tool. Its official About page was discoverable by search. Do not infer site-wide unavailability from that one response.
- No screenshot, image, browser cookie, or account data was persisted.

## Runtime check

`Get-Command godot` returned no executable. Running `scripts/godot-preflight.ps1 -ProjectPath . -GodotPath __godot_missing__` produced the blocked message and child exit code `3`; no software was installed.
