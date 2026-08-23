---
name: bandaa-mobile-operations
description: Use for Bandaa mobile build, signing, push, deep links, RevenueCat, TestFlight, and production-release operations.
---

# Bandaa Mobile Operations

Use the smallest relevant reference for the current mobile operation. Resolve every placeholder from the current repository, EAS, Apple, Google, Firebase, RevenueCat, and Convex consoles at execution time.

These references are an anonymized project adapter. They contain recipes and release gates, never credentials, private keys, tokens, project IDs, fingerprints, or machine-specific paths.

## References

- `references/android-push-setup.md` — FCM v1, EAS push credentials, development-build proof.
- `references/android-signing-and-credentials.md` — Android signing, Play App Signing, keystore handling.
- `references/deep-links.md` — HTTPS links, app schemes, App Links, and Universal Links.
- `references/ios-push-setup.md` — APNs, EAS push credentials, and real-device proof.
- `references/ios-signing-and-credentials.md` — EAS iOS signing and TestFlight submission boundaries.
- `references/ios-xcode-build-setup.md` — local Xcode, Metro, environment separation, payments, and push validation.
- `references/revenuecat-setup.md` — Test Store, Apple sandbox, production entitlement, and webhook proof.
- `references/testflight-production-publication.md` — production content, build, owner, and submission gates.

## Operating rules

1. Never copy a secret, private key, token, credential file, signed URL, project identifier, fingerprint, or private path into the repository, a ticket, a report, or this skill.
2. Replace placeholders only at execution time, from the authoritative console or current checkout; do not turn them into committed project values.
3. Keep build, submit, deploy, content publication, and owner approval as separate gates.
4. Report evidence as `PASS`, `FAIL`, `NOT RUN`, or `BLOCKED`; a token, receipt, local test, or green build does not prove device delivery, entitlement materialization, or publication.
5. Prefer the generic Expo, RevenueCat, Convex, Cloudflare, and marketplace skills for provider mechanics; use these references only for the Bandaa-specific contract and proof sequence.
