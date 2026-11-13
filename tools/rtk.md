# RTK — shell output token reduction

**Mandatory installation** — step 4 of the README, not an extra.

**RTK is not a skill.** It is a Rust binary (`rtk`) that sits between the agent and the shell and compresses command output before the model reads it: `ls`, `cat`, `grep`, `git status/diff/log`, `npm test`, `pytest`, `cargo test`, `docker ps` and ~100 others. That is why it lives in `tools/`, not in `skills/` — there is no `SKILL.md` to copy.

Source: https://github.com/rtk-ai/rtk (Apache-2.0)

## What it actually does

It cuts up to 90% of the **bash output** that the agent reads. That is not 90% of the bill: bash output is one part of the input tokens, and input is one part of the cost. The percentages it reports are reliable; the absolute token numbers are estimated by `bytes / 4`.

Important limit: the hook only intercepts calls to the **Bash** tool. Claude Code's `Read`, `Grep` and `Glob` do not go through it. To gain from RTK in those cases, use a shell command (`cat`, `rg`, `find`) or call `rtk read` / `rtk grep` / `rtk find` directly.

> This fits the devkit's auto mode rule — working via Bash instead of the dedicated tools — but it is a trade-off: with RTK on, `cat` gets cheaper than `Read`; without RTK, it does not.

## Install

macOS / Linux:

```bash
brew install rtk
# or
curl -fsSL https://raw.githubusercontent.com/rtk-ai/rtk/refs/heads/master/install.sh | sh
```

Windows: download the release zip, put `rtk.exe` on the PATH (e.g.: `C:\Users\<voce>\.local\bin`) and run it from Prompt/PowerShell/Windows Terminal — do not double-click the `.exe`. It needs `ripgrep` on the PATH (`winget install BurntSushi.ripgrep.MSVC`).

Turn on the hook in Claude Code:

```bash
rtk init -g       # installs the PreToolUse hook + RTK.md
rtk init --show   # verify
```

After that, **restart Claude Code**.

## Caveats

- `rtk init -g` **writes to the user's `~/.claude/settings.json`** (global hook). It affects all of their sessions, not just this project. `install.sh`/`install.ps1` do not run this — whoever installs the kit runs it by hand, warning the user first about what changes in the config. If they refuse, stop and report the installation as incomplete.
- Name collision on crates.io: there is another package named `rtk` (Rust Type Kit). If `rtk gain` fails, it was the wrong package — use `cargo install --git https://github.com/rtk-ai/rtk`.
- It does not break the prompt cache: the filter runs once per command and the result goes into the history normally.
