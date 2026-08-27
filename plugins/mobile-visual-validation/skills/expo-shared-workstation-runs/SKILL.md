---
name: expo-shared-workstation-runs
description: Use when several Expo projects or several agents share one workstation and a build shows stale code, a Metro server answers but serves nothing, a native module is missing at runtime, or a simulator may belong to someone else.
---

# Expo runs on a shared workstation

Use this skill for **local** runs when one machine hosts several Expo checkouts,
several simulators, or several agents working at once. For loading Metro from
outside the local network, use `expo-metro-tunneling` instead; the diagnosis
order there applies to a tunnel, this one applies to the machine.

The failures below share one property: **the app looks alive and is simply not
running your code**, which sends people to debug application logic that was
never reached.

## Before touching a device

**Never drive a simulator another agent or person is using.** A booted
simulator is not free real estate: someone may be mid-flow, with a dialog your
tap will answer.

~~~sh
xcrun simctl list devices booted
~~~

Establish which device belongs to which project from the repository's own notes
or by asking. Do not infer it from what happens to be running.

## Diagnose before rebuilding

A native rebuild costs minutes. These three checks rule out whole classes of
problem, in order.

~~~sh
# 1. Is anything listening, and on which port?
lsof -nP -iTCP -sTCP:LISTEN | grep -E ':80[0-9][0-9]'
curl -fsS http://localhost:<port>/status        # expects packager-status:running

# 2. Which checkout is that server rooted in?
lsof -a -p <pid> -d cwd -Fn
ps -o command= -p <pid>

# 3. Which server is the installed build pointed at?
xcrun simctl spawn <udid> defaults read <bundle-id> RCT_jsLocation
~~~

Inspect the PID and its working directory before stopping anything. Never kill
an unknown listener.

### A running packager is not a serving packager

A Metro started with the **wrong project root** answers `/status` correctly and
fails every bundle request. The build then keeps replaying its last good
bundle, so the screen is alive and never changes — indistinguishable, from the
outside, from a change that did not apply.

Prove the server is serving *your* tree by requesting a bundle and grepping for
a string you just wrote:

~~~sh
curl -s "http://localhost:<port>/<entry>.bundle?platform=ios&dev=true" \
  | grep -c "<a string from your change>"
~~~

Zero, together with an `UnableToResolveError` naming a directory that is not the
app's, is the signature. Restart Metro from the application directory.

**Use the project's real entry point.** An expo-router app is bundled from
`node_modules/expo-router/entry.js`, not `index.js`, so a 404 on `/index.bundle`
proves nothing on its own. Metro's own startup log names what it bundled and how
many modules; read that rather than guessing.

**In a workspace, the entry path is relative to the workspace root**, not to the
app. Metro serves from the root that holds the lockfile, so the bundle for an
app in `apps/<name>` is at `/apps/<name>/node_modules/expo-router/entry.bundle`.
Ask for the un-prefixed path and you get a 404 whose `originModulePath` is the
repository root — which reads exactly like the wrong-root failure above and is
not one. Before concluding anything from that error, request the prefixed path:

~~~sh
curl -s "http://localhost:<port>/<app-dir>/node_modules/expo-router/entry.bundle?platform=ios&dev=true" \
  | grep -c "<a string from your change>"
~~~

The distinction that settles it: a genuinely misrooted server fails **both**
paths and its `cwd` is not the app; a workspace server fails only the
un-prefixed one.

## Ports on a shared machine

**A debug build has its packager port compiled in.** A build made without an
explicit port looks for 8081 and loads whatever project is serving there — which
surfaces as another product's screens inside this one, and is far more
confusing than a blank screen.

Give each project a port and keep it:

~~~sh
npx expo run:ios --device <udid> --port <port>
npx expo start --port <port>
~~~

To repoint a build that already exists, without rebuilding:

~~~sh
xcrun simctl spawn <udid> defaults write <bundle-id> RCT_jsLocation "localhost:<port>"
~~~

On a **physical device** this does not apply: the compiled address is the
workstation's, on 8081. Build Release instead — the bundle is embedded and no
packager is involved.

## When a rebuild is genuinely required

Reloading JavaScript is not enough after any of these:

- a **native module** is added, including anything shipping a config plugin;
- the app config changes in a way the native project reads — icons, plugins,
  bundle identifier, permissions;
- a config plugin's own version changes.

The symptom is easy to misread as an application bug, because the typecheck is
green and the tests pass:

~~~
Uncaught Error: Cannot find native module '<ModuleName>'
~~~

The JavaScript is correct; the **binary** is old.

### Prefer a graceful degradation for a convenience module

A native module that only backs a **convenience** should be required lazily,
inside a guard, with a stated fallback — not imported at the top of a file where
its absence takes the whole app down. On a shared workstation some binary is
always older than some install.

~~~ts
function deviceLocales(): Locale[] {
  try {
    return require("expo-localization").getLocales();
  } catch {
    return [];   // the app keeps its default language
  }
}
~~~

Note that LogBox still **reports** the caught error: the red overlay is not
proof that anything broke. Dismiss it and look at the app.

Better, ask before requiring, so there is no throw to report. On a shared
workstation the overlay lands on every relaunch, covering the very screen the
relaunch was for:

~~~ts
function has(name: string): boolean {
  try {
    const core = require("expo-modules-core");
    return core.requireOptionalNativeModule
      ? core.requireOptionalNativeModule(name) != null
      : true;              // unknown: let the try/catch below decide
  } catch {
    return true;
  }
}
~~~

`expo-modules-core` ships with every Expo app, and it is asked for the **native**
module name (`ExpoLocalization`), not the package name — the JavaScript package
is required only once the answer is yes. Keep the `try`/`catch`: this removes the
throw, it is not the reason the code is safe.

Do not reach for `globalThis.expo.modules` instead. It is not a stable location,
and a probe that cannot see the registry silently answers "present" — the guard
then looks like it works and changes nothing.

This does not apply to a module the feature cannot work without. There, the
rebuild is the answer.

## Build failures that are the toolchain, not the project

Two recur on shared macOS workstations and neither is fixed by touching
application code.

**CocoaPods `Encoding::CompatibilityError`.** Ruby reads the Podfile as binary
when the shell has no UTF-8 locale, which a non-interactive agent shell often
does not:

~~~
Unicode Normalization not appropriate for ASCII-8BIT (Encoding::CompatibilityError)
~~~

~~~sh
LANG=en_US.UTF-8 LC_ALL=en_US.UTF-8 npx expo run:ios --device <udid> --port <port>
~~~

**Linking against a framework the SDK will not allow**, typically at the end of
a simulator build:

~~~
cannot link directly with 'SwiftUICore' because product being built is not an allowed client of it
❌ ld: symbol(s) not found for architecture arm64
~~~

Before theorising, find out **how many** libraries carry the reference. Swift
code that imports SwiftUI emits an automatic link directive into its object
file, and the SDK's `SwiftUICore.tbd` refuses direct clients:

~~~sh
for f in $(find ~/Library/Developer/Xcode/DerivedData/<Project>-*/Build -name '*.a'); do
  otool -l "$f" | grep -q SwiftUICore && echo "$f"
done
~~~

**One library** is a dependency problem, and pinning or patching it is worth
trying. **Every Swift library** — as in a plain Expo app, where the whole module
set lights up — means the SDK and the framework version are simply not paired,
and no linker flag in the project is the answer. Read the version advice the
tooling already prints:

~~~
› Using expo@~56.0.8 instead of recommended expo@~57.0.7.
~~~

That line, plus `xcodebuild -version`, is usually the whole diagnosis: the
installed Xcode is newer than what the framework version targets. Report it as a
toolchain pairing and let the owner decide about the upgrade — do not spend the
session guessing at `OTHER_LDFLAGS`.

**A missing `pod install` looks like a dependency version conflict.** After
`expo prebuild --no-install`, the project is regenerated and the pods are not,
so the link fails naming a third-party library and a symbol that genuinely did
move between versions:

~~~
Undefined symbols: facebook::react::Sealable::Sealable()
└─ Referenced from: … in libRNGestureHandler.a
~~~

Nothing is wrong with that library. Run `pod install` and build again before
reading anything into the symbol — and note that the underlying failure may be
a *different* one that the stale artefacts were masking.

## Non-interactive traps

- `expo start` on a taken port asks *"Use port N+1 instead?"* and, with no tty,
  answers itself with **"Skipping dev server"** — a server that never starts and
  says so in one easily scrolled line. Read the startup output; do not assume.
- Backgrounded commands inherit the session's working directory, not a `cd`
  from an earlier call. Use absolute paths in anything backgrounded.
- After relaunching a build, wait for the bundle to download before capturing.
  A screenshot taken during the download shows the previous screen, which looks
  exactly like a change that did not apply. Wait on a condition rather than a
  fixed sleep:

~~~sh
until curl -fsS http://localhost:<port>/status >/dev/null; do sleep 2; done
~~~

## Reporting

Separate PASS, FAIL, NOT RUN and BLOCKED. State the checkout, the port, the
device, and which of the checks above were actually run. Never infer that a
device is showing new code from a terminal message alone — a served bundle and a
loaded bundle are different claims.
