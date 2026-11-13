---
name: React Native Team
description: Team for React Native and Expo apps — navigation, state, native modules, offline, push, OTA, performance and validation on an emulator or phone with screenshot and logcat. Use when the project has react-native or expo, app.json, eas.json, android/ or ios/, or when the user asks for "React Native team", "react native team" or "mobile app".
---

# React Native Team

Mobile app team. The manager orchestrates; the React Native specialist implements, the tester validates on the emulator or phone, and the reviewer covers native module, permission and performance risk.

## When to use

- Project with `react-native`, `expo`, `app.json`, `eas.json`, `android/` or `ios/`.
- Screen, navigation, state, form, list, animation or gesture.
- Native module, permission, camera, notification, push, offline, storage or OTA.
- Bug that only appears on the device/emulator.

## When not to use

- Pure web UI: use `frontend-team`.
- API, database or server authentication: use `backend-team`.
- Godot: use `game-dev-team`.
- Store build, signing, Apple/Google account or publishing: there is no dedicated agent; the manager works with the user and does not publish without explicit approval.

## Roster

| Role | OpenCode | Claude Code | Strength | Hand off to | Do not hand off to |
|---|---|---|---|---|---|
| Implementation | `react-native` | `developer` with this skill | Navigation, state, mobile UI, native module, offline, push, OTA, performance | Implement the stage and run the project checks | Pure web, backend, Godot, store publishing |
| Test | `tester` | `tester` | Emulator/device, flow, permission, logcat, screenshot | Install, open, walk through the flow and capture evidence | Fixing the app or deciding UX |
| Visual validation | `visual-validator` | `tester` with screenshot + `reviewer` | Layout, design system, keyboard, contrast, accessibility | Check the screen and states on the device | Native logic or product fixes |
| Review | `reviewer` | `reviewer` | Risk, regression, native module, performance | Review a large diff or crash/permission risk | Implementing |

## Handoffs

1. **Manager** defines the stage, acceptance criteria, allowed files and test command.
2. **`react-native`** implements and runs lint/typecheck/test.
3. **`tester`** starts the emulator or connects the phone, installs the app, walks through the flow and collects screenshot and logcat.
4. **`visual-validator`** (OpenCode) or **`tester`** (Claude Code) checks layout, states and accessibility.
5. **`reviewer`** reviews when touching native module, permission, OTA or performance.
6. **Manager** checks the evidence and writes the report.

## Verification

Read the `AGENTS.md` and use the project's real command. Examples:

```bash
adb devices
npx expo start
npx expo run:android
npx react-native run-android
adb logcat -d -t 300
adb exec-out screencap -p > docs/testing/evidence/<date>-<slug>/tela.png
```

- Use the `mobile` MCP to list devices, open the app, tap, type, swipe and read the accessibility tree.
- Test the happy path and the errors: permission denied, offline, reload, back, background.
- iOS is only testable on macOS; outside it, record the blocker.
- Without an emulator/device, record `BLOCKED` and the setup command; do not simulate a result.
- EAS build, new native module or new native dependency only with explicit approval from the user.

## Acceptance criteria

- The stage's flow works on the emulator or phone, not only in the unit test.
- No crash and no new error in logcat.
- Permissions and error states have visible handling.
- Evidence (screenshot + log) and report at the agreed paths.

## Handback to the manager

Reply with: what changed, files, device/emulator used, commands and output, screenshot/log, risks and what was not tested. Do not commit, push, merge or open a PR.
