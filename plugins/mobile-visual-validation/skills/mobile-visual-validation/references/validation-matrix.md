# Mobile visual validation matrix

Use this as a starting checklist. Replace example dimensions with the product's
declared phone and tablet targets, and record `not applicable` only when the
product contract explicitly excludes a state or surface.

| Surface | Primary evidence | Fallback | What it proves | What it cannot prove |
| --- | --- | --- | --- | --- |
| Web/Next.js | Browser or Computer Use on the changed route | Browser/headless capture | Web layout, state, semantics | Native safe areas, native modules, iOS/Android navigation |
| Expo iPhone | Current dev build + booted iPhone Simulator via `serve-sim` | Expo-web/browser, then `VALIDATE` | Native iPhone rendering and interactions | iPad layout unless separately checked |
| Expo iPad | Current dev build + booted iPad Simulator via `serve-sim` | Expo-web/browser, then `VALIDATE` | Native tablet density, split-width and safe-area behavior | Android behavior |
| Android | Project Android/ADB harness | Web fallback, then `VALIDATE` | Android rendering and interactions | iOS behavior; `serve-sim` is not Android evidence |
| Authenticated/deep-link state | Real current account/session and route | Explicitly marked fixture/fallback | The named auth or navigation checkpoint | A missing account or redirect path |

For every native row, record the device UDID, app/dev-build identity, Metro
runner/port, current route, and commit. If any is unavailable, write
`unavailable` and keep that native row `VALIDATE`. A stream URL without this
provenance is not sufficient evidence.

## Safe command examples

Run the commands supported by the project's package manager and installed
version; do not install a global CLI just to make a report look green.

```sh
xcrun simctl list devices booted
npx serve-sim --list -q
npx serve-sim --detach -q
npx serve-sim tap 0.5 0.5
npx serve-sim --kill
```

`serve-sim` uses normalized coordinates from the top-left. Prefer its device
list and accessibility-aware controls when available. If a command fails or no
simulator is booted, preserve the error and move to the documented fallback;
never relabel a web result as native evidence.

## Handoff row

```text
route/commit | surface/device/dimensions | state | tool | result | evidence | limitation
```

The final status is `PASS` only when all required rows are evidenced. Otherwise
use `VALIDATE` and list the exact rows a human or later agent must complete.
