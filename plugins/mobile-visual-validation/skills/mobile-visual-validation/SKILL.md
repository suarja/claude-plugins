---
name: mobile-visual-validation
description: Use when a mobile or responsive UI change needs evidence across a production web route, Expo native app, iPhone, iPad, simulator, or an available visual harness
---

# Mobile Visual Validation

Use this skill as a validation adapter after a visual direction is chosen and
production code exists. It decides which available surface can produce useful
evidence; it does not choose the design, install a client, or claim that one
surface proves another.

## Scope boundary

- Use `design-first` for a new visual direction, mockup, Design Chart, or
  owner approval gate. Do not reopen that gate for ordinary production
  validation.
- Use the project's build, Expo, Xcode, Android, or deployment commands to
  create and install the app. `serve-sim` controls an already available Apple
  Simulator session; it is not a build system.
- Tests and typecheck are useful evidence about behavior and contracts. They
  do not replace inspection of the changed production route at its target
  dimensions.

## Preflight

Before acting, record:

1. the changed production route/screen, commit, target platforms, required
   phone/tablet dimensions, and states to inspect;
2. whether the route needs an account, deep link, seeded data, native module,
   or a particular locale/theme;
3. the capabilities that are actually available: browser or Computer Use,
   a booted Apple Simulator, `serve-sim`, Android tooling, and the project's
   configured dev/build command. On macOS, check `uname -s`, `xcrun --version`,
   `node --version`, and `xcrun simctl list devices booted` rather than
   inferring availability.

If `uname -s` is not `Darwin`, do not invoke `serve-sim`; mark Apple-native
rows unavailable and use the documented fallback. Missing Xcode CLI or an
unsupported Node version is a prerequisite failure to report, not a reason to
attempt the command anyway.

Never assume that a dev build, Metro server, simulator, account, or helper
process is already running. If native dependencies changed, rebuild the
appropriate dev build before treating a native checkpoint as current. Do not
use Expo Go for a branch that requires native modules.

## Choose the surface

- **Web or Next.js:** inspect the real production route with the available
  browser/Computer Use capability. Use the accessibility tree or semantic
  locators when available; do not guess a target from stale pixel coordinates.
- **Expo/React Native on Apple:** when a current dev build and booted iPhone or
  iPad Simulator are available, prefer `serve-sim`. Start by listing the
  current devices and use the project's package runner for the installed CLI,
  for example `npx serve-sim --list -q` and `npx serve-sim --detach -q`.
  Identify the current device/UDID when more than one is available, surface
  the returned stream URL, and never silently reuse an old stream.
- **No Apple Simulator:** run the strongest available Expo-web, browser, or
  headless fallback so layout issues are still found, then keep the native
  checkpoint `VALIDATE`. A web fallback never proves native behavior, safe
  areas, native modules, or platform-specific navigation.
- **Android:** do not use `serve-sim` as if it were Android evidence. Use the
  project's Android/ADB harness when available; otherwise report the missing
  platform checkpoint and keep `VALIDATE`.

If the repository requires one Metro process on `127.0.0.1:8081`, verify that
contract and the configured runner. Do not hide a port or binding conflict by
switching to an unapproved LAN/alternate binding; report the startup failure.

## Interaction and evidence rules

- Validate the changed production route and current commit, not only an HTML
  mockup, a story, or a stale simulator stream.
- For `serve-sim`, coordinates are normalized (`0..1`, top-left origin). Use a
  single `tap` for a tap. Reserve `gesture` for a real drag, swipe, or pinch;
  a begin/end gesture can become a long press.
- After each Computer Use or simulator action, re-read the accessibility/state
  surface or capture a fresh checkpoint. If browser authentication blocks the
  required state, ask the user to sign in in the selected browser; never bypass
  the state by searching another site or inspecting cookies/storage.
- Check the required phone and tablet surfaces where the product supports
  them. At minimum inspect relevant happy, loading, empty, error,
  authenticated/unauthenticated, and unknown-data states. Add light/dark,
  longest locale strings, text scaling, safe areas, and accessibility paths
  when they are in the product contract.
- A required account, deep link, device, or state that cannot be reached is a
  missing checkpoint, not a pass. Do not invent a screenshot or infer native
  success from web success.
- When an accessibility target cannot be found, stop and report the missing
  semantic state instead of guessing coordinates.

## Handoff

Report one row per checkpoint with route/commit, surface, device and
dimensions, state, tool, observed result, evidence location, and limitation.
Every required visual row must reference a fresh screenshot/frame, or an
equivalent captured stream checkpoint, from the production route. A URL,
accessibility tree, live stream, test result, or typecheck alone is not visual
evidence. Use `PASS` only when every required checkpoint has current evidence.
Use
`VALIDATE` when any required native, device, account, or state checkpoint is
unverified, while clearly listing the completed fallback evidence.

Stop helper processes after inspection (for example `npx serve-sim --kill`)
unless the user explicitly asks to keep them running. Keep the exact command,
device, state, and reason for every fallback in the handoff so another agent or
human can resume without guessing.

Read `references/validation-matrix.md` for the compact matrix and command
examples.
