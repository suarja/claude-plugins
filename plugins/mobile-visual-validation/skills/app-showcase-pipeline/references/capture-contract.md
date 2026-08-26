# Capture and export contract

This reference keeps screenshots, videos, and the dashboard on one source of
truth. Adapt the paths and commands to the host repository.

## Source record

Every source record should contain at least:

```text
sourceId, appId, sourceKind, locale, deviceId, platform,
routeOrState, nativeWidth, nativeHeight, path, capturedAt, reviewStatus
```

`sourceKind` is `real-capture` for a still image and `screen-video` for a
recording made from the real build. A composition, phone bezel, logo, or
generated artwork is not a source capture; record it separately as a layer with
its own provenance.

## Asset taxonomy

Keep these inputs distinct in the manifest:

| Kind | Can prove the product interface? | Minimum provenance |
| --- | --- | --- |
| fixture-data | no | scenario, command or route, synthetic-data status |
| generated-artwork | no | provider, model, prompt, dimensions, date, licence/source, review status |
| real-capture | yes | app build, route/state, locale, device, native dimensions, capture date |
| screen-video | yes for the recorded interaction | app build, route/state, locale, device, duration, capture date |
| composition | no | source IDs, layers, settings, export path, review status |

Generated artwork must not be presented as a screen capture. A composition must
not repair a wrong locale, missing route, or unverified fixture. Never store API
keys or private credentials in provenance.

Use explicit statuses such as draft, brief-only, capture-required, approved,
not-needed, and NOT RUN when the project needs to distinguish planning from
evidence.

## Locale/device matrix

Build the matrix explicitly before capture:

| Surface | Required sources | Presentation |
| --- | --- | --- |
| Apple Store | iPhone; iPad when the listing supports it | optional Apple shell/overlay |
| Google Play | Android phone/tablet profiles required by the listing | native capture, no Apple shell |
| Social video | one declared target canvas per export | independent background, phone, text |

Use the current device profile for native dimensions. As a local example, a
project may use 1206×2622 for an iPhone source, 2048×2732 for an iPad source,
and 1080×1920 for a vertical social render; these are examples, not universal
Store requirements. Never crop a source to hide a wrong device or locale.

For each locale, verify the app language, fixture content, mission/feature copy,
system labels that are part of the product, and the text overlay copy. A French
overlay on an English capture is a mismatch even if the pixels look polished.
The claim must have a source in the product or an explicit owner-review status.

## Reconciliation rules

- The Dashboard source picker, static exporter, and video renderer read the
  same catalogue/manifest.
- A UI upload writes the canonical asset path and atomically updates the
  catalogue; a code-added asset is discovered by the same reload/reconcile
  operation.
- Missing files remain visible as `missing`/`capture-required` with the path;
  they are never silently removed or replaced.
- A project may override presentation (background, text, motion, shell), but it
  may not override the selected app, locale, device, or source pixels without a
  new source record.

## Static vs video output

Static Store images must be deterministic: no playback, focus halo, editor
handles, debug labels, development menus, or video-only crop. Video may add
motion and a real screen recording, but it still resolves the same source ID and
locale. Keep the source PNG/MP4 immutable and store composition settings in a
project manifest.

## Review evidence

For each output, retain:

- source path and SHA-256 (or the repository’s equivalent fingerprint);
- native dimensions and rendered dimensions;
- app, locale, device, route/state, and scene/frame ID;
- preflight report and exact render command;
- browser preview URL/path and poster frames;
- owner review status and any unverified native checkpoint.

The final handoff must separate automated checks from visual/device review. A
green typecheck or a browser preview does not prove an iPhone/iPad capture,
native safe areas, or Store acceptance.
