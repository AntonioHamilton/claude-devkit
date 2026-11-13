# Tasks

## 1. Canonical team and domain skills

- [ ] 1.1 Add the five team-profile skills and the five domain skills to `skills/`; verify each profile names only agents present in the active harness and has explicit triggers, limits, handoffs, and proportional verification.
- [ ] 1.2 Update manager and specialist guidance for risk-based routing, failover selection, and justified regression tests; verify examples keep Build/Plan visible and do not expose model profiles as extra primary agents.
- [ ] 1.3 Sync only the five approved domain skill files and the approved manager/team files to OpenCode global paths; compare source and destination hashes and confirm unrelated skills, agents, permissions, and providers are unchanged.

## 2. Private finance assistant

- [ ] 2.1 Review the existing Claude `financas` agent and AUVP skill instructions without copying private financial values; write the OpenCode `financas` subagent with minimal-vault-read rules and no transaction execution.
- [ ] 2.2 Verify the finance agent is discoverable only in OpenCode, reads only explicitly relevant vault files, cites current official sources for legal/market facts, and never writes private values into the repo or general memory.

## 3. Model routing and fallback

- [ ] 3.1 Verify the selected model IDs and image-input capabilities against the local OpenCode catalog; record the final per-role chains and skip incompatible models.
- [ ] 3.2 Audit the pinned `opencode-auto-fallback@0.4.61` source, dependencies, hooks, and update behavior; verify it has no unexplained network, filesystem, or command-execution behavior before installation.
- [ ] 3.3 Add per-role fallback configuration with automatic updates and unnecessary telemetry disabled; test 402/429 and incompatible-model cases with a synthetic provider, never a real quota.

## 4. Runtime verification and rollback

- [ ] 4.1 Verify `manager` is the only custom primary while built-in Build and Plan remain available; verify manager, teams, finance agent, and skills appear in the intended OpenCode locations.
- [ ] 4.2 Run proportional smoke checks for discovery, routing, and synthetic failover; save logs/screenshots and a `docs/testing` report with environment, results, concepts, and human review checklist.
- [ ] 4.3 Compare global config and synchronized skill files against backups/source hashes; verify rollback restores only files and entries introduced by this change and does not touch the finance vault.
