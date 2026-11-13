---
name: Backend Team
description: Team for API, server, database, migrations, authentication and integrations — contract, idempotency, observability and integration tests against a real environment. Use when the project has Express/Nest/Fastify, FastAPI/Django, Go, Java, docker-compose, migrations, or when the user asks for "backend team", "backend team" or "API".
---

# Backend Team

Server and data team. The manager orchestrates; the backend implements, the tester exercises the API and the test database, and the reviewer covers contract, auth and migration risk.

## When to use

- API or service with Express, Nest, Fastify, FastAPI, Django, Go, Java, .NET or similar.
- Database, migration, schema, queue, cache, cron or external integration.
- Authentication, authorization, permissions, idempotency or webhook.
- Bug in contract, status, validation, concurrency or server performance.

## When not to use

- UI, CSS or web component: use `frontend-team`.
- React Native/Expo app: use `react-native-team`.
- Godot: use `game-dev-team`.
- Deploy infrastructure, Kubernetes or CI: there is no dedicated agent; the manager leads it or declares the blocker.

## Roster

| Role | OpenCode | Claude Code | Strength | Hand off to | Do not hand off to |
|---|---|---|---|---|---|
| Implementation | `backend` | `developer` with this skill | API, domain, database, migration, auth, integration, observability | Implement the stage and run the service tests | UI, mobile, Godot, production deploy |
| Test | `tester` | `tester` | Real API, test database, migration up/down, contract, error | Bring up the environment, call the routes, check database effects | Deciding the API design or fixing the service |
| Review | `reviewer` | `reviewer` | Risk, contract, auth, migration, regression | Review auth, migration, contract and high-risk diff | Implementing |
| Recon | `scout` | `scout` | Read-only map of a large or unknown service | Map modules, routes and database before the stage | Editing any file |

## Handoffs

1. **Manager** defines the stage, acceptance criteria, allowed files and test command.
2. **`backend`** implements the contract and persistence, with a reversible migration.
3. **`tester`** brings up the API and test database, runs the migration up and down, and calls the routes.
4. **`reviewer`** mandatorily reviews auth, migration, public contract and data-loss risk.
5. **Manager** checks the evidence and writes the report.

## Verification

Read the `AGENTS.md` and use the project's real command. Examples:

```bash
npm test
pytest -q
go test ./...
cargo test
```

- **API:** call the routes with test data and check status, body, headers and the database effect.
- **Errors:** validation, unauthenticated, no permission, not found, duplicate and invalid payload.
- **Migration:** run up and down on the test database; never in production.
- **Contract:** if there is OpenAPI/JSON Schema, validate the response against it.
- **Load:** k6 or autocannon when the criterion is latency/throughput.

Never use production data or log secrets, tokens or passwords. Without a test database, record the blocker and the setup command; do not simulate a result.

## Acceptance criteria

- The stage's contract works with real test data.
- Errors and permissions return the expected status and body.
- The migration goes up and down without unexpected loss.
- Logs do not expose secrets.
- Evidence and report at the agreed paths.

## Handback to the manager

Reply with: what changed, files, routes/migrations, commands and output, evidence, risks and what was not tested. Do not commit, push, merge or open a PR.
