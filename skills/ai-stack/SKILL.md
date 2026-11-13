---
name: ai-stack
description: For a new project or one without a defined stack - asks the key questions (users, data, security, platform) and suggests language, database and app type with a short rationale, plus UI references. Use when starting a project, or when the user asks "que stack uso?".
---

# ai-stack

Goal: decide the simplest stack that works, fast and cheap. The owner knows JavaScript/TypeScript and wants to open room for Go and Java on the backend.

## 1. Key questions

A single round of the harness's question tool (`AskUserQuestion` in Claude Code; without it, ask in numbered text), 4 questions, recommended option first. Skip anything that `AGENTS.md`, memory or the request already answers.

1. **Users:** just me / up to dozens / hundreds / thousands or more.
2. **Data:** volume (a few MB / GB / a lot) and shape (relational tables / free-form JSON / files and media).
3. **Security:** none (local use) / simple login / personal data / payment or sensitive data.
4. **Platform:** web / installable web (PWA) / mobile app / desktop or CLI.

## 2. Suggestion (fixed, short format)

```
STACK: <language> + <framework> + <database> + <platform>
POR QUE: <2-3 lines tying back to the answers>
ALTERNATIVA: <one, and when it would be worth switching>
CUSTO: <hosting and what is free>
```

### Languages

| Language | Good for | Choose when |
|---|---|---|
| TypeScript/JavaScript | Front end, back end and scripts in one language | Default: the owner knows it; fewer parts |
| Go | Simple, fast API, single binary, concurrency | Backend that will grow or run cheaply; wants to learn |
| Java | Enterprise backend, Spring ecosystem | Work uses it or the goal is to learn; heavy for a small project |
| Python | Scripts, data, automation, AI | Study, analysis, data prototype |

### Databases

| Database | Choose when |
|---|---|
| SQLite | Personal use or few users, zero cost, one file. Default for a small project |
| Postgres (Neon, Supabase) | Several people, relational, wants to grow. A `JSONB` column covers free-form JSON data |
| MongoDB | Only if the data is truly unpredictable JSON with no relations |
| Firebase/Supabase (BaaS) | Wants login and a database without writing a backend; fast prototype |
| Files/S3 | Media and attachments; store only the path in the database |

### Type of application

- **Web** (default): minimal cost, one deploy.
- **PWA:** web that installs on the phone; solves most of the "I need an app" cases.
- **Mobile app:** Expo/React Native only if you need a store or hardware.
- **Native (Swift/Kotlin):** only for system features the rest cannot reach.
- **CLI/desktop:** personal automation.

Rule: the fewer users and the less sensitive data, the fewer parts. No login, no server, no remote database, unless you need them.

## 3. UI

Modern, clean visual direction, with white space, strong typography and few color tokens (light and dark). References: https://www.tokos.com.br/ (landing page), https://build.withcastor.co/pt, https://refero.design/ (library of screen patterns).

- Record the chosen direction in `AGENTS.md` (palette, typography, reference) and reuse it; do not re-check the web for every screen.
- Consult at most one reference per task, through the browser MCP (see `mcp/README.md`), and only if the user asks for something new visually.
- AI-generated UI: `tools/openui.md` (optional).

## 4. Record

Write the decision in `AGENTS.md` (Stack section) and, if the user revealed a preference, in `devkit-memory`.
