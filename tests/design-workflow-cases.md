# Design Workflow Cases

Manual routing fixtures for `skills/design-reference-workflow/SKILL.md`.

| Request | Expected primary/fallback | Expected boundary |
|---|---|---|
| “How does a mobile checkout collect a billing address?” | Refero Free, then Mobbin Free or a public product/help page | State the free limit; at most three references; no paid MCP |
| “Give this SaaS landing page a more editorial visual direction.” | Awwwards, then SiteInspire or Land-book | Observe layout/type/motion; don't copy assets |
| “Build a moodboard for an original fantasy character.” | Behance or Dribbble; Pinterest only if the user browses manually | Treat portfolio art as style inspiration, not production UI evidence |
| “What is the native iOS dialog/accessibility convention?” | Apple Human Interface Guidelines | Prefer primary platform guidance over a single screenshot |
| “Refero says my free searches are used.” | Mobbin Free sample, then public product/help pages or a user-provided screenshot | Don't create accounts, bypass quotas, or use paid MCP |
| “Review this Excalidraw diagram of User → Web app → Database.” | Analyze the user-provided export/screenshot and return suggested labels/edges | Do not edit the online canvas or create an Excalidraw file |
| “Create a 2D character sheet for my Godot game.” | Write a copy-ready Meta AI/Gemini prompt | No local image generation/API; do not promise exact sprite-grid output |
| Godot CLI is absent during a game task | Run `scripts/godot-preflight.ps1` | Report runtime blocked; do not install Godot |

## Excalidraw review fixture

Input described by the user: `User -> Web app -> Database`, with no identity, trust boundary, or failure flow shown.

Expected review: ask whether the web app is intended to access the database directly; identify the missing authentication/authorization boundary and the data crossing the boundary; suggest labels and a separate request/error flow. State that these are unknowns to confirm, not facts. Do not create or edit an Excalidraw file.
