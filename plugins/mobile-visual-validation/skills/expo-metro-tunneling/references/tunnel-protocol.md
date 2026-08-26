# Tunnel protocol details

Read this reference only when the repository needs a provider-specific path or
when the basic diagnosis order does not explain the failure.

## Provider modes

| Mode | Phone requirement | Exposure | Important distinction |
| --- | --- | --- | --- |
| Expo-managed tunnel | none | public | Expo normally prints the native deep link |
| Tailscale Serve | same tailnet | private | HTTPS is reachable only inside the tailnet |
| Tailscale Funnel | none | public | HTTPS is exposed to the Internet |
| Cloudflare Quick Tunnel | none | public | temporary hostname and session |
| Raw ngrok | none | public | creates an origin, not a native deep link |

Choose the mode from the phone's network situation, not from which command is
shortest.

## Expo-managed path

Use the project's package manager and the documented development-client command,
for example:

~~~sh
<package-runner> expo start --dev-client --tunnel --clear
~~~

Wait for both the tunnel-ready signal and the native link. Give the developer
both values, but identify the deep link as the primary entry point.

If the Expo tunnel adapter is unavailable, install the package through the
repository's approved package manager or switch to a raw provider. Do not
silently fall back to a LAN URL.

## Raw providers and asset URLs

A raw provider forwards an HTTP origin but does not create the native
development-client link. Construct the link from the exact current HTTPS origin
and URL-encode it.

If the bundle loads while fonts or other bootstrap assets still point at a LAN
address, restart Metro with the provider origin as the packager proxy when the
project supports that setting:

~~~sh
EXPO_PACKAGER_PROXY_URL=https://<origin> \
<package-runner> expo start --dev-client --lan --clear
~~~

Then verify status, the real bundle endpoint, and the native deep link again.
Do not report success because the provider's root page returns 200.

## Tailscale Serve and Funnel

Serve is private to the tailnet. Funnel is public. Keep Metro on loopback and
let Tailscale terminate HTTPS:

~~~sh
tailscale serve --bg --https=<https-port> http://127.0.0.1:<metro-port>
tailscale funnel --bg --https=<supported-public-port> http://127.0.0.1:<metro-port>
~~~

Use the URL and port printed by the active Tailscale configuration. Verify the
same HTTPS origin that the development client will request. A Serve checkpoint
requires the phone to be connected to the tailnet; a Funnel checkpoint
requires an external-network test and a deliberate public-exposure decision.

## Cloudflare Quick Tunnel and raw ngrok

For a short public session, expose the loopback Metro server:

~~~sh
cloudflared tunnel --url http://127.0.0.1:<metro-port>
ngrok http <host>:<metro-port>
~~~

Both commands produce an origin but not the native deep link. Copy the current
origin, configure the packager proxy when needed, then verify status, the real
bundle, and the encoded deep link. Treat the origin as temporary and stop the
provider when the checkpoint ends.

## Simulator preview versus phone bundle

If the repository also uses a simulator preview harness, keep its ports and
purpose separate from Metro:

| Surface | Typical purpose |
| --- | --- |
| Metro | native JavaScript bundle |
| simulator preview | remote observation/control of a simulator |
| raw simulator stream | low-level transport, not the user-facing preview |

Do not tunnel the simulator preview when the phone must load Metro, or claim a
phone checkpoint from a simulator stream.

## Evidence handoff

Record:

- active checkout and commit;
- Metro PID, working directory, port, and chosen provider;
- current HTTPS origin and native deep link;
- status result and real bundle status/size;
- phone network condition and development-build identity;
- native rebuild status;
- remaining NOT RUN or BLOCKED checkpoints.

Keep dynamic origins out of durable documentation once the session ends. They
are session evidence, not configuration.
