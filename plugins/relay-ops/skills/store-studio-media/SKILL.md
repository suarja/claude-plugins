---
name: store-studio-media
description: Select and attach the right Store Studio video or screenshot to a Hub post before manual publication.
---

# Store Studio media

Use this skill when a Hub post needs a product video, screenshot, or store
listing asset. Store Studio (or the project's equivalent media workspace) is
the source of truth; the Hub keeps the selected asset attached to the post.
The agent prepares the handoff, but a human keeps the final publication click.

## Workflow

1. From the repository root, locate the Store Studio project registry,
   manifests, rendered videos, preview images, and their locale/status metadata.
   Prefer the repository's read-only asset inventory script when one exists.
2. Match the asset to the post before selecting it:
   - short-form social: prefer a short vertical video in the post locale;
   - professional or community channels: prefer one clear localized product
     flow or capture;
   - tester recruitment: show the live product flow and keep the test request
     in the text;
   - launch: show the product flow, then a concrete result as proof.
3. Check the project status, captions, locale, dimensions, and provenance. A
   draft or mixed-locale asset is a candidate to review, not a finished claim.
4. In the project's Hub/Studio, open the post and use its Store Studio/media
   importer when available. Otherwise attach the exact source file through the
   existing asset flow. Save the post and associate its publication targets.
5. Reopen the post and confirm the media survives reload. Download it when the
   destination needs a local attachment. Prepare the signed-in channel, stop
   before the final publish action, and record the result only after the owner
   confirms the click.

## Guardrails

- Never publish, schedule, follow, message, or post from this skill.
- Never modify Store Studio source files while preparing a Hub post.
- Do not copy one caption verbatim across channels; adapt it to the destination
  and locale.
- Do not present a draft, mixed-locale, or unverified asset as approved.
- Report the exact project, file, locale, status, dimensions, and reason for
  the chosen asset in the handoff.

## Handoff

```text
Asset:
Project:
File:
Locale:
Status:
Target channel:
Reason:
Publication state: needs review
```
