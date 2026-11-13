# Proposal

## Why

The repository mixes Portuguese and English across its agent instructions, skills, documentation, and OpenSpec artifacts. A consistent English source makes repository material easier for AI tools to read without changing the language used in conversation with the user.

## What Changes

- Translate all Portuguese natural-language prose in repository text files, including documentation, skills, agent instructions, scripts' comments, examples, and OpenSpec changes.
- Keep code, identifiers, filenames, command names, paths, protocol/API contracts, test fixtures that require exact text, and externally defined strings unchanged.
- Replace the repository's language guidance with: repository content is maintained in English; assistant replies follow the user's current language.
- Leave global files outside this repository untouched.
- Verify there is no unintended Portuguese prose left, links and commands still resolve, and installer/OpenSpec checks still pass.

## Capabilities

### New Capabilities

None. This is a documentation and instruction-language change with no behavior-level requirement changes.

### Modified Capabilities

None.

## Impact

Text files throughout the repository, including `README.md`, `AGENTS.md`, `rules/`, `skills/`, `agents/`, `tools/`, `mcp/`, scripts' comments, and existing OpenSpec artifacts. Machine-readable identifiers and global user configuration remain out of scope. This change sets `skip_specs: true` because it changes no system behavior.
