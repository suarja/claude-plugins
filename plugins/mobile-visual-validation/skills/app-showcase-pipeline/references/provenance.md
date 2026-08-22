# Provenance

This skill is a portable rewrite of the owner-authored showcase workflow that
was already used in the Bandaa repository:

- source workflow: `panoptik/.agents/skills/bandaa-showcase-assets/SKILL.md`;
- local video contract: `panoptik/docs/assets/bandaa-mobile/app-preview/README.md`
  and `motion-contract.json`;
- local capture contract: `panoptik/docs/assets/bandaa-mobile/app-store-generator/README.md`.

The marketplace version keeps the reusable decisions (one source catalogue,
localized real captures, independent layers, real screen recordings, measured
safe areas, and actionable preflight) and removes Bandaa-specific routes,
fixtures, commands, and copy. No third-party code or proprietary AppLaunchFlow
implementation was copied; AppLaunchFlow is treated only as a public model for
the hook → proof → detail → close storyboard responsibility.
