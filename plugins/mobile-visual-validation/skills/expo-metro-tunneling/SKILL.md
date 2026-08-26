---
name: expo-metro-tunneling
description: Use when an Expo development build must load Metro from outside its local network, including tunnel selection, native deep links, stale URLs, or loading failures.
---

# Expo Metro tunneling

Use this skill when a native Expo development build must load JavaScript from a
Mac or workstation that is not on the phone's local network.

## Contract

The workflow has two separate values:

1. an HTTPS origin that forwards requests to the active Metro server;
2. a native development-client deep link whose encoded url points to that
   origin.

The tunnel URL is a diagnostic endpoint. It is not, by itself, the app launch
URL.

## Workflow

1. Read the repository's current facts before starting: active checkout,
   development-build command, native URI scheme, Metro port/binding, and the
   real bundle endpoint if the project documents one. Do not copy a path,
   scheme, port, or device name from another project.
2. Choose the exposure deliberately:
   - Expo-managed tunneling is the default for a short public session.
   - A private tailnet proxy is appropriate when the phone is trusted and
     connected to the same tailnet.
   - A public Funnel, Cloudflare, or raw ngrok path is an explicit exposure of
     the development server and requires the same external verification.
   Read [references/tunnel-protocol.md](references/tunnel-protocol.md) for
   provider-specific commands.
3. Prove that exactly one Metro serves the active checkout:

   ~~~sh
   lsof -nP -iTCP:<metro-port> -sTCP:LISTEN
   lsof -a -p <pid> -d cwd -Fn
   ~~~

   Inspect the PID and working directory before stopping anything. Never kill
   an unknown or unrelated listener.
4. Start the tunnelled development build using the repository's command. Copy
   the current HTTPS origin and the current native deep link exactly as Expo
   prints them. Preserve the URL encoding in the deep link; do not reuse an old
   hostname.
5. Verify the service through the current origin:

   ~~~sh
   curl -fsS https://<origin>/status
   curl -fsS -o /dev/null -w '%{http_code} %{size_download}\n' \
     https://<origin>/<real-bundle-endpoint>
   ~~~

   The status endpoint must report a running packager and the real bundle
   request must return a non-empty response. A 200 on a root page alone is
   insufficient.
6. Open the current deep link in the installed development build, not Expo Go.
   For an external-network checkpoint, close and reopen the build with Wi-Fi
   disabled. Record the network used and the device state.
7. Rebuild the native development build after adding or changing a native
   dependency. A JavaScript-only change normally needs only a Metro restart
   with the repository's cache policy.
8. Hand off the exact origin, deep link, status result, bundle result, checkout,
   device, and limitations. Separate PASS, FAIL, NOT RUN, and BLOCKED; do not
   infer phone success from a terminal message or a local browser.

## Diagnosis order

When the build stays on a loading screen, check in this order:

1. the installed binary is the expected development build;
2. the current tunnel reports ready;
3. the current deep link was opened;
4. status and the real bundle endpoint pass through the same origin;
5. the Metro PID belongs to the active checkout;
6. the phone is actually outside the local network when that is the claim;
7. the native binary and JavaScript dependency versions agree.

Only after these boundaries are proven should application code or navigation be
debugged.

## Safety

- Never expose environment files, tokens, API keys, or full process
  environments through a public tunnel or handoff.
- Treat public tunneling as temporary Internet exposure of development assets.
- Keep private Serve and public Funnel as separate security claims.
- Do not deploy backend or production code merely to make Metro reachable.
- Stop the tunnel and confirm the listener is gone when the session ends.
