---
name: app-showcase-pipeline
description: Use when producing localized Store screenshots or mobile app demo videos from real captures with reproducible manifests, source provenance, and preflight checks, including rendering framed App Store and Google Play packs.
---

# App Showcase Pipeline

Use this skill to turn real mobile-build captures into a repeatable launch-asset
pack: static Store screenshots, short vertical videos, and the manifests that
make both outputs reproducible. The pipeline is source-first: a screenshot,
video scene, dashboard preview, and export must resolve the same declared
capture instead of keeping separate hidden copies.

## Outcome

Finish with:

- a versioned project manifest naming the app, surface, locale, devices, claim,
  scenes/frames, sources, composition settings, and review status;
- real-build captures (or real screen recordings) with device and locale
  provenance;
- a storyboard whose text, logo, background, phone shell, and screen content
  are independent layers;
- a rendered MP4 plus Store-ready images, each linked back to the manifest;
- a preflight report that names the exact scene/layer for every failure.

Keep real captures, fixture data, generated artwork, and composition layers
separate. Only a real capture from the product build can prove the product
interface.

This skill creates an asset pipeline. It does not invent interface screenshots,
silently translate a capture, or treat a marketing composition as product
evidence.

## Workflow

1. **Choose one story and a target matrix.** State the one promise the pack
   proves (for example: prepare → participate → remember), the surface
   (Apple, Google, social, or review), the locales, and the requested phone and
   tablet profiles. Keep optional variants explicit; do not create every
   device/locale combination by accident.
2. **Create the source manifest first.** Give every capture a stable `sourceId`,
   `appId`, `deviceId`, `locale`, native dimensions, route/state, capture date,
   and `sourceKind` (`real-capture` or `screen-video`). Keep secrets, invite
   codes, personal data, and temporary IDs out of versioned files.
3. **Capture the real build.** Set the app language and fixture explicitly,
   remove development overlays, and verify the route, state, visible strings,
   and claim against the current product. A missing or wrong-locale source
   remains capture-required; a route or template not verified in the build
   remains brief-only. Never fill either state with a placeholder or a
   capture from a different device.
4. **Write the storyboard.** Use a small narrative (hook → proof → detail →
   close) and one job per scene. Reuse a source for a static frame or attach a
   real screen recording for a gesture such as a carousel or feed scroll. The
   storyboard is data, not CSS copied into a generated HTML file.
5. **Compose independent layers.** Keep background, text, logo/image overlays,
   phone shell, and screen content separate. The shell may have a restrained
   entrance/settle motion; the screen may pan, play a screen video, or receive
   a short focus zoom. Never transform the whole canvas to fake phone motion.
6. **Run preflight before rendering.** Resolve every source for the selected
   app + locale + device, measure text and phone boxes in canvas coordinates,
   detect safe-area and layer collisions, check duration/ratio/fps, and report
   scene IDs and layer names. A generic “text overflows” warning is not enough.
7. **Render and inspect.** Render a browser preview and the final MP4, then
   inspect at full size on the target phone/tablet aspect ratios. Extract a
   poster for each important scene and verify that the static Store export and
   video use the same source IDs. Keep intermediate ZIPs and temporary URLs out
   of the repository.
8. **Hand off with evidence.** Report PASS, FAIL, NOT RUN, or BLOCKED
   separately for source, preflight, render, device review, locale review, and
   owner review. Include exact paths, commands, dimensions, claim source, and
   limitations.

## Motion and text rules

Read [references/video-recipe.md](references/video-recipe.md) when choosing
presets or effects. The short version:

- Use a small named motion vocabulary: `still`, `fade`, `rise`, `soft-tilt`,
  `focus`, `content-pan`, `screen-video`, and `focus-zoom`. Keep the device
  frame stable while its screen content moves.
- Text effects are independent of phone motion. Offer `fade`, line/word/letter
  reveal, tracking reveal, mask wipe, and soft-blur-in as options with readable
  defaults. Do not stack several effects unless the scene calls for it.
- A real scroll or carousel must be a screen recording from the real build,
  clipped to the screen window. Do not simulate a user gesture with a CSS
  panorama when a recording is available.
- Treat the logo as its own layer. An opening title card may show only logo,
  copy, and background; the logo is not forced inside the phone mockup.
- Choose a restrained background per project or variant (for example, a dark
  neutral base plus one accent). Do not randomize every scene or inherit a
  product-specific brand color into another app.

## Layout and preflight invariants

- Derive the phone screen window from the device profile; do not estimate it
  from the outer canvas. The shell and screen content share one coordinate
  system.
- Define a text safe box that stays outside the phone when the scene intends an
  external caption. The checker must test the actual rendered text bounds,
  including line height, tracking, font weight, and animated start/end states.
- Permit text inside a phone only when the scene explicitly declares an
  in-screen overlay. Otherwise any intersection with the shell plus its safety
  margin is a hard preflight error.
- Keep the first and last frames readable at a glance: generous scale, clear
  hierarchy, and enough spacing from the phone. Use measured fit/line wrapping,
  not a fixed slider value that happens to fit one locale.
- Static exports must omit editor handles, focus guides, debug labels, and
  development menus. Focus effects belong to video scenes and must not leak into
  Store PNG/JPEG output.

## Source and locale contract

Read [references/capture-contract.md](references/capture-contract.md) when
building an iPhone/iPad or multi-locale batch. The source catalogue is the
boundary between the app and the renderer:

- dashboard, screenshots, and video resolve `appId + sourceId + locale +
  deviceId` from the same manifest;
- a source added through the UI is written to the canonical asset folder and
  appears on the next manifest reload; a source added in code is discovered by
  the same reconciliation step;
- Apple and Google Play compositions may both carry a device shell and a
  title: the native-only rule for Google Play was lifted by the owner on
  6 September 2026. An Android capture goes in an Android shell, never an Apple
  frame. A native unframed export remains a valid option;
- native dimensions and current Store requirements come from the project’s
  device profile, not from an old screenshot or a hard-coded crop.

## Static store pack

When the project has no store generator of its own, render the framed
screenshots with [scripts/render-store-frames.py](scripts/render-store-frames.py):
one pack file per platform and locale (theme, titles, captures, the extract
lifted out of each capture), a `board` target for the owner's gate, and the
App Store, iPad, Google Play and feature-graphic sizes for the export. Read
[references/store-pack.md](references/store-pack.md) for the schema, the store
sizes and the capture traps (soft share-sheet icon, store currency, Android
status bar, stale UI).

## Adapter boundary

This skill is generic. In Bandaa, first load the sibling
`bandaa-showcase-assets` skill and its store capture protocol reference,
then inspect the current app-preview/app-store-generator manifests. That skill
defines the available routes, localized fixtures, device dimensions, render
commands, and provenance paths; this skill supplies the reusable video and
validation recipe without duplicating those project-specific sources.

For source taxonomy and provenance fields, read
references/capture-contract.md. Do not turn project-specific routes, fixtures,
provider choices, or product claims into generic defaults in this skill.
