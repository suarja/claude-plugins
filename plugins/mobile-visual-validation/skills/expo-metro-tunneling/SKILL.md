---
name: expo-metro-tunneling
description: Use when an Expo development build must load Metro from outside the local network, including Expo/ngrok, Tailscale Serve/Funnel, Cloudflare Tunnel, native deep links, stale URLs, or loading-state failures.
---

# Expo Metro tunneling

Use this skill to make an Expo **development build** load JavaScript from a
Mac that is not on the phone's network. The important contract has two parts:

1. the HTTPS tunnel forwards Metro on port `8081`;
2. the native development build opens a deep link containing that tunnel URL.

The tunnel URL alone is not the app launch URL. Always hand the developer both
URLs.

## Quick path for Bandaa

Run from the active checkout, with no second Metro:

```sh
cd /Users/mata/App/26k/panoptik
lsof -nP -iTCP:8081 -sTCP:LISTEN
bunx expo start --dev-client --tunnel --clear --scheme bandaa
```

Wait for both `Tunnel connected` and `Tunnel ready`. Expo prints a deep link
similar to:

```text
bandaa://expo-development-client/?url=https%3A%2F%2F<dynamic-host>.exp.direct
```

It also exposes the underlying tunnel URL:

```text
https://<dynamic-host>.exp.direct
```

Open the **deep link** in the installed Bandaa development build. Do not open
the raw HTTPS URL as if it were the native app entry point. Turn off Wi-Fi on
the phone and reload over 4G/5G for the real external-network check.

## URL contract

| Value | Purpose | Give to the developer? |
|---|---|---|
| `https://<dynamic-host>.exp.direct` | Public HTTPS forwarding to Metro | Yes, for diagnostics |
| `bandaa://expo-development-client/?url=<encoded-https-url>` | Launches the native development build and points it at Metro | Yes, primary entry point |
| `http://localhost:8081` | Mac-local Metro only | No |
| `http://<LAN-IP>:8081` | LAN development only | No for this workflow |

The `url` query value must be URL-encoded. Copy the deep link printed by Expo;
do not hand-edit it unless necessary. If it must be rebuilt manually, preserve
the `https://` scheme and encode it as `https%3A%2F%2F...`.

The `bandaa` scheme comes from the app's native configuration. If Expo prints
only `Metro: http://localhost:8081`, restart with `--scheme bandaa`. A warning
about not finding a shared URI scheme means the CLI cannot create a usable
native launch link; it is not a tunnel health signal.

## Select the tunnel path

Choose the path from the phone's network situation before starting Metro. The
Expo-managed path generates the native link for you; every raw provider below
requires the current public HTTPS URL to be inserted into the deep link.

| Path | Phone requirement | Exposure | URL shape | Best use |
|---|---|---|---|---|
| Expo tunnel / ngrok | None | Public | Random `exp.direct` or `ngrok-free.app` | Default short session |
| Tailscale Serve | Tailscale connected on phone | Private tailnet | `https://<node>.<tailnet>.ts.net[:port]` | Personal devices and work machines |
| Tailscale Funnel | None | Public | `https://<node>.<tailnet>.ts.net` | Public phone test without installing Tailscale |
| Cloudflare Quick Tunnel | None | Public | Random `trycloudflare.com` | Short, disposable test |
| Cloudflare named Tunnel | None | Public | Your Cloudflare hostname | Repeated sessions or controlled access |

Serve and Funnel are different security modes: Serve is reachable only inside
the tailnet, while Funnel is reachable from the public Internet. Cloudflare
Quick Tunnels and Funnel are public exposure; anyone with the URL can request
Metro files. Never include secrets in the bundle, environment, or handoff.

## Handoff checklist

Before sending the link:

1. Confirm the listener belongs to the active checkout:

   ```sh
   lsof -nP -iTCP:8081 -sTCP:LISTEN
   lsof -a -p <PID> -d cwd -Fn
   ```

2. Keep exactly one Metro. Stop an old process only after checking its PID and
   working directory; never kill an unknown or unrelated listener.

3. Verify the public endpoint, not just the terminal output:

   ```sh
   curl -fsS https://<dynamic-host>.exp.direct/status
   # expected: packager-status:running
   curl -sS -o /dev/null -w '%{http_code} %{url_effective}\n' \
     https://<dynamic-host>.exp.direct
   # expected: 200 ...
   ```

   A `200` on the root page alone is insufficient; `/status` must report a
   running packager.

4. Give the developer this compact handoff:

   ```text
   Development build: Bandaa (not Expo Go)
   Deep link: bandaa://expo-development-client/?url=...
   Tunnel URL: https://<dynamic-host>.exp.direct
   Metro check: /status -> packager-status:running
   Test: close/reopen the build, then disable Wi-Fi and reload
   ```

5. Keep Metro, the selected tunnel process, the Mac, and the network connection
   alive. For a long manual session, use:

   ```sh
   caffeinate -i -w <PID_METRO>
   ```

After restarting Expo, the old hostname/deep link is stale. Always send the
URLs from the current session.

## Expo tunnel versus raw ngrok

Prefer the Expo command above. It starts the supported tunnel and generates the
development-client deep link in one operation. In this project Expo uses
`@expo/ngrok` underneath; if the CLI says that package is missing, install it
once and restart:

```sh
npm install --global @expo/ngrok
bunx expo start --dev-client --tunnel --clear --scheme bandaa
```

Use raw ngrok only as a fallback or when exposing a non-Metro HTTP service:

```sh
ngrok http 8081
```

The raw command gives an HTTPS forwarding URL but does not generate the native
deep link. If it is unavoidable, construct the link explicitly with the
current HTTPS URL:

```text
bandaa://expo-development-client/?url=https%3A%2F%2F<ngrok-host>
```

Common raw-ngrok mistakes:

- handing out only `https://<ngrok-host>`;
- using `http://` instead of the HTTPS forwarding address;
- tunneling `3200` or `3100` and expecting Metro to load;
- assuming a static subdomain is available on a free account;
- reusing an old `.ngrok-free.app` or `.exp.direct` hostname after its process
  stopped.

Do not make a static subdomain a prerequisite. A dynamic hostname is the
normal, sufficient path. Reserved/custom domains require the account and
credentials that provide them and are unrelated to app correctness.

## `serve-sim` is a different tunnel

`serve-sim` previews and controls a simulator; it does not replace Metro:

| Service | Port | External use |
|---|---:|---|
| Metro / native bundle | `8081` | Expo tunnel or raw ngrok fallback |
| serve-sim preview UI | `3200` | HTTP tunnel when the preview itself must be remote |
| serve-sim raw stream | `3100` | Low-level MJPEG/WebSocket access |

For a remote simulator preview, start `npx serve-sim --detach -q` and tunnel
the returned human-facing URL/port. For a remote phone loading Bandaa, tunnel
Metro with Expo. Do not confuse the two URLs in the handoff.

## When a native rebuild is required

JavaScript-only changes need a Metro restart, usually with `--clear`. Rebuild
the development build after adding or changing a native dependency such as
`expo-dev-client`, Reanimated, Worklets, Gesture Handler, or camera modules.

On the Bandaa checkout, build without starting a second bundler:

```sh
bun install
pod install --project-directory=ios
bunx expo run:ios --device "<device>" --no-bundler
```

Then start exactly one tunnelled Metro using the quick path. `--no-bundler` is
important when a tunnelled Metro is already running.

## Diagnosis loop

### App stuck on loading

Check in this order:

1. The installed app is the Bandaa development build, not Expo Go.
2. Expo output contains `Tunnel ready`.
3. The current deep link was opened; an old link cannot revive a dead tunnel.
4. The public `/status` returns `packager-status:running`.
5. Only one process listens on `8081`.
6. The phone is actually off Wi-Fi.
7. The terminal shows an iOS bundle request or an actionable bundling error.

Do not start by changing React Native code. First separate tunnel, deep link,
native build, Metro cache, and application code.

### `No script URL provided`

The native build did not receive a bundle URL. Reopen the current deep link and
confirm that `expo-dev-client` is installed in the native build. Rebuild if it
was added after the last installation.

### `ERR_NGROK_3200` or an offline `.exp.direct` host

The old public address is no longer served. Check port `8081`, restart the
current checkout with Expo tunnel, wait for `Tunnel ready`, verify `/status`,
and send the newly printed deep link.

### `Could not find a shared URI scheme`

The tunnel can still be healthy, but the CLI cannot generate the native launch
URL. Use `--scheme bandaa` and ensure the native app declares the same scheme.

### Worklets/Reanimated version mismatch

The JavaScript bundle and installed native Pods/binary are out of sync. Do not
patch navigation or `ErrorBoundary` first. Compare JavaScript package versions
and `ios/Podfile.lock`; rebuild the native app if the native side differs, then
restart Metro with `--clear`.

### Raw HTTPS root returns `200` but the app still loads forever

This proves only that an HTTP server answered. Recheck the `/status` endpoint,
the native deep link, the `bandaa` scheme, and the development-build identity.
The native client must receive the tunnel URL in its `expo-development-client`
deep link.

## Safety and cleanup

- Never expose `.env.local`, Convex tokens, API keys, or full process
  environments in a handoff or debug log.
- Do not deploy Convex or production code merely to make Metro reachable.
- Do not use Expo Go for a branch that requires native modules.
- Keep dynamic tunnel URLs temporary; they are session addresses, not hosting.
- Stop the foreground Expo process with `Ctrl+C` when the external session is
  finished, then confirm port `8081` is free.

## Incident report: raw Ngrok reaches Metro but the development build stays loading (2026-08-04)

This incident documents the working fallback when Expo's Ngrok adapter fails
and Tailscale Serve cannot reach its macOS LocalAPI.

### What failed and why

- `bunx expo start --dev-client --tunnel` failed inside Expo with
  `TypeError: Cannot read properties of undefined (reading 'body')`. This is a
  tunnel-adapter failure before `Tunnel ready`; it is not evidence of an app
  or Metro failure.
- Tailscale's macOS GUI daemon appeared as `IPNExtension`, but the CLI could
  not reach its LocalAPI on `127.0.0.1:<dynamic-port>` and reported
  `can't assign requested address`. Restarting the app did not restore the
  CLI/LocalAPI path. Tailscale's HTTP reverse proxy only supports a
  `http://127.0.0.1` backend, so do not switch the target to `[::1]` as an
  HTTP proxy workaround.
- A raw Ngrok URL can successfully return `/status` and a 200 bundle while
  the native client still remains on its loading screen. When Metro runs in
  `--lan` mode, Expo can generate runtime/asset URLs for the LAN address.
  The development build may then fetch the JavaScript through Ngrok but try
  to fetch fonts or other bootstrap assets from the Mac's LAN address. In
  Bandaa, the root layout waits for the brand fonts before rendering the
  first screen, so this presents as an indefinite spinner.
- A hand-copied deep link is fragile. A single missing hostname segment can
  open the development client but point it at a dead or different URL. Always
  copy the current hostname from the Ngrok log.

### Working raw Ngrok protocol

Use a non-default port when another service owns `8081`, and keep exactly one
Metro. First start Metro in LAN mode so Ngrok can reach its non-loopback
address:

```sh
bunx expo start --dev-client --lan --clear --scheme bandaa --port 8082
```

In a second terminal, expose that LAN address with raw Ngrok:

```sh
ngrok http <mac-lan-ip>:8082
```

Copy the exact `https://<dynamic-host>.ngrok-free.app` URL from Ngrok, then
restart Metro on the same port with that URL as Expo's packager proxy. This
step makes the asset/bootstrap URLs resolve through Ngrok instead of the LAN
address:

```sh
EXPO_PACKAGER_PROXY_URL=https://<dynamic-host>.ngrok-free.app \
bunx expo start --dev-client --lan --clear --scheme bandaa --port 8082
```

Verify both the packager and the real iOS bundle through the current tunnel:

```sh
curl -fsS https://<dynamic-host>.ngrok-free.app/status
curl -fsS -o /dev/null -w '%{http_code} %{size_download}\n' \
  'https://<dynamic-host>.ngrok-free.app/node_modules/expo-router/entry.bundle?platform=ios&dev=true&hot=false&lazy=true&transform.engine=hermes&transform.routerRoot=app&unstable_transformProfile=hermes-stable'
```

Expected results are `packager-status:running` and `200 <non-zero-size>`.
Construct the native link from the same exact current hostname:

```text
bandaa://expo-development-client/?url=https%3A%2F%2F<dynamic-host>.ngrok-free.app
```

Force-close the development build before opening the new link. Keep both
Metro and Ngrok alive for the whole test; if an agent terminal may close, use
a controlled user launchd session only after the owner explicitly authorizes
the temporary third-party tunnel. Ngrok exposes the development server and
anything reachable through the app for the duration of the tunnel; never put
secrets in the handoff or logs.

### Evidence checklist for a loading spinner

1. The current Ngrok `/status` is `packager-status:running`.
2. The current iOS bundle returns `200` with a non-zero size.
3. Ngrok logs contain a join from the phone's network address.
4. Metro logs contain an `iOS Bundled` line after the phone opens the link.
5. If all four are true but the app still spins, inspect bootstrap assets and
   runtime URLs; do not immediately change navigation or application code.

## Incident report: Tailscale HTTPS fallback (2026-08-03)

This incident documents a validated fallback for the case where ngrok/Expo
tunneling is unreliable and the iPhone already runs Tailscale. It is an
addition to the Expo/ngrok path above, not a replacement for it.

### Symptoms and failed attempts

- A Metro listener was found on `8081`, but its working directory was the main
  checkout rather than the active testing checkout. Always inspect the PID's
  cwd before handing out a URL:

  ```sh
  lsof -nP -iTCP:8081 -sTCP:LISTEN
  lsof -a -p <PID> -d cwd -Fn
  ```

- A fresh normal clone did not contain the ignored `convex/_generated/*`
  artifacts. Metro then failed with `Unable to resolve
  "../../convex/_generated/api"`. Generate the local bindings before testing a
  fresh clone, using the project's approved Convex workflow and environment;
  do not copy secrets into the clone:

  ```sh
  bunx convex codegen
  ```

- Raw ngrok can answer `/status` while Metro has already stopped. The public
  hostname is then stale from the phone's point of view. A raw ngrok process
  is not a substitute for a persistent Metro process; verify both processes
  and the bundle endpoint immediately before handoff.

- `http://<tailscale-ip>:8081` reached Metro, but the iOS Development Build
  rejected it with:
  `The resource could not be loaded because the App Transport Security policy
  requires the use of a secure connection.` `NSAllowsLocalNetworking` does
  not make this HTTP URL a reliable remote Development Build URL.

- Tailscale Serve on its default HTTPS port (`443`) was also insufficient for
  this session: the Development Build requested
  `https://mako.<tailnet>.ts.net:8081/...`. Serving HTTPS on `443` while the
  client requests `:8081` produces a connection failure.

- A foreground Metro/ngrok process attached to a temporary agent terminal can
  disappear when that terminal/session ends. For a long manual session, keep
  the terminal open, use `caffeinate`, or register a controlled macOS
  background session and verify it after launch. Do not assume `nohup` alone
  survived the terminal owner.

### Validated Tailscale solution

Use Tailscale's private HTTPS proxy on the **same port** that the Development
Build requests. Keep Metro local; Tailscale Serve terminates TLS with the
tailnet certificate and proxies to loopback:

```sh
# Run once per Mac/Tailscale configuration.
/Applications/Tailscale.app/Contents/MacOS/Tailscale serve --bg \
  --https=8081 http://127.0.0.1:8081
```

Start Metro from the active checkout, bound to localhost because Serve is the
only network-facing hop:

```sh
cd /path/to/active/checkout
bunx expo start --dev-client --localhost --clear --scheme bandaa
```

Verify the exact HTTPS port, not only the LAN IP:

```sh
curl -fsS https://<mac-magicdns-name>:8081/status
# expected: packager-status:running
curl -fsS -o /dev/null -w '%{http_code} %{size_download}\n' \
  'https://<mac-magicdns-name>:8081/node_modules/expo-router/entry.bundle?platform=ios&dev=true&hot=false&lazy=true&transform.engine=hermes&transform.routerRoot=app&unstable_transformProfile=hermes-stable'
# expected: 200 <non-zero-size>
```

For Bandaa, the validated session used:

```text
Mac Tailscale address: 100.64.182.53
MagicDNS name:         mako.lynx-pogona.ts.net
HTTPS Metro URL:       https://mako.lynx-pogona.ts.net:8081
Deep link:             bandaa://expo-development-client/?url=https%3A%2F%2Fmako.lynx-pogona.ts.net%3A8081
Manual Development Build URL: https://mako.lynx-pogona.ts.net:8081
```

The phone must have Tailscale connected to the same tailnet and MagicDNS
enabled. A direct Tailscale ping and the HTTPS `/status` check are useful
separations of network reachability from Expo/deep-link errors. The final
working path was:

```text
iPhone Tailscale -> https://mako.<tailnet>.ts.net:8081
                  -> Tailscale Serve TLS
                  -> http://127.0.0.1:8081
                  -> Metro from the active checkout
```

### Tailscale Funnel (public fallback)

Use Funnel when the phone is outside the tailnet. It is not a more permissive
form of Serve: Funnel publishes the service to the Internet and requires
MagicDNS, HTTPS certificates, a permitted `funnel` node attribute, and one of
Tailscale's supported public ports (`443`, `8443`, or `10000`). On macOS, the
available Tailscale packaging variant also matters; if the CLI cannot enable
Funnel, resolve that platform or policy gate before changing Metro.

Keep Metro on loopback and let Funnel terminate public TLS on port 443:

```sh
tailscale funnel --bg --https=443 http://127.0.0.1:8081
tailscale funnel status
```

Copy the `https://<node>.<tailnet>.ts.net` hostname printed by `funnel status`.
Because the public listener is port 443, do not append `:8081` to the public
URL:

```sh
curl -fsS https://<node>.<tailnet>.ts.net/status
curl -fsS -o /dev/null -w '%{http_code} %{size_download}\n' \
  'https://<node>.<tailnet>.ts.net/node_modules/expo-router/entry.bundle?platform=ios&dev=true&hot=false&lazy=true&transform.engine=hermes&transform.routerRoot=app&unstable_transformProfile=hermes-stable'
```

Expected results are `packager-status:running` and `200 <non-zero-size>`. The
native entry point is:

```text
bandaa://expo-development-client/?url=https%3A%2F%2F<node>.<tailnet>.ts.net
```

The phone does not need the Tailscale app for Funnel, but it must be off the
work Wi-Fi when validating the public path. Use `tailscale funnel reset` when
the public route is no longer needed. Keep Serve and Funnel as explicit
security choices for the same service; do not assume a Serve route became
public merely because a Funnel command was attempted.

### Cloudflare Tunnel (public fallback)

#### Quick Tunnel for a short session

Cloudflare Quick Tunnel needs no Cloudflare account and prints a random
`trycloudflare.com` hostname. It is a development aid, not a stable host:

```sh
cloudflared tunnel --url http://127.0.0.1:8081
```

Copy the exact hostname from the `cloudflared` output. Quick Tunnels are
temporary, have a 200 concurrent-request limit, and do not support SSE. Metro
bundle loading and WebSockets still require an actual end-to-end check; do not
declare success from the hostname alone. If a local
`~/.cloudflared/config.yaml` prevents a Quick Tunnel from starting, check that
condition before diagnosing Metro; Quick Tunnels do not use a persistent
configuration file.

When the public hostname is not known before Metro starts, use the raw-provider
two-phase protocol: start one provisional Metro, start `cloudflared`, then
restart the same Metro with the exact public URL so assets and bootstrap URLs
do not point back to the Mac's LAN address:

```sh
# Terminal A: provisional Metro
bunx expo start --dev-client --lan --clear --scheme bandaa --port 8081

# Terminal B: copy the printed https://<random>.trycloudflare.com URL
cloudflared tunnel --url http://127.0.0.1:8081

# Terminal A: restart Metro with the current public origin
EXPO_PACKAGER_PROXY_URL=https://<random>.trycloudflare.com \
bunx expo start --dev-client --lan --clear --scheme bandaa --port 8081
```

Then verify the packager and real iOS bundle through that exact hostname:

```sh
curl -fsS https://<random>.trycloudflare.com/status
curl -fsS -o /dev/null -w '%{http_code} %{size_download}\n' \
  'https://<random>.trycloudflare.com/node_modules/expo-router/entry.bundle?platform=ios&dev=true&hot=false&lazy=true&transform.engine=hermes&transform.routerRoot=app&unstable_transformProfile=hermes-stable'
```

Use the matching native link, and force-close the development build before
opening it:

```text
bandaa://expo-development-client/?url=https%3A%2F%2F<random>.trycloudflare.com
```

#### Named Tunnel for recurring development

Use a named Cloudflare Tunnel when the hostname must survive restarts or needs
Cloudflare-side access controls. Create it in the Cloudflare dashboard or with
the authenticated CLI, route a hostname to the tunnel, and run it with a
configuration kept outside the repository:

```sh
cloudflared tunnel login
cloudflared tunnel create bandaa-dev
cloudflared tunnel route dns bandaa-dev bandaa-dev.example.com
cloudflared tunnel --config ~/.cloudflared/bandaa-dev.yml run bandaa-dev
```

Use the raw-provider two-phase protocol above for Metro and set
`EXPO_PACKAGER_PROXY_URL=https://bandaa-dev.example.com` on the final Metro
launch so generated assets use the named hostname.

The corresponding config must route the hostname to Metro and end with a
catch-all rule:

```yaml
tunnel: <TUNNEL_UUID>
credentials-file: /Users/<user>/.cloudflared/<TUNNEL_UUID>.json
ingress:
  - hostname: bandaa-dev.example.com
    service: http://127.0.0.1:8081
  - service: http_status:404
```

Do not commit the credentials file or tunnel token. Verify
`cloudflared tunnel info bandaa-dev`, `/status`, and the real bundle before
handing over the deep link. Do not put an interactive Cloudflare Access login
in front of Metro unless the native development client has a compatible,
pre-authenticated path; an HTML login page is not a JavaScript bundle.

### Native build boundary

If the iPhone is `unavailable` to CoreDevice, `expo run:ios --device ...`
cannot install the Development Build even when Pods and the generic
iPhoneOS compilation succeed. This is separate from the tunnel. First connect,
trust, and enable Developer Mode on the phone; then install the native build.
Only after the build exists on the phone should the Tailscale deep link be
used.

### References

- Repository runbook: `docs/guides/expo-tunnel-development-build.md`
- Native deep-link contract: this skill's `URL contract` section above
- Tailscale private HTTPS: this skill's `Validated Tailscale solution` section
- Tailscale public HTTPS: this skill's `Tailscale Funnel` section
- Cloudflare public HTTPS: this skill's `Cloudflare Tunnel` section
- The Tailscale Serve path is private-tailnet fallback. Use Funnel or Cloudflare
  only when public exposure is explicitly required and authorized.
