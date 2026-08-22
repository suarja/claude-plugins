# Video recipe

Use this reference after the source manifest exists and before editing scene
values. It is a practical starting point, not a promise to copy a proprietary
tool’s private easing, font, or color values.

## Minimal scene contract

```json
{
  "projectId": "feature-demo-en",
  "appId": "example-app",
  "surface": "social-video",
  "locale": "en",
  "canvas": { "width": 1080, "height": 1920, "fps": 30 },
  "background": { "kind": "solid", "value": "#101114" },
  "scenes": [
    {
      "id": "hook",
      "kind": "title",
      "durationSec": 2.4,
      "text": { "value": "Make every moment count", "effect": "fade" },
      "logo": { "enabled": true, "placement": "center" },
      "phone": { "enabled": false }
    },
    {
      "id": "proof-feed",
      "kind": "feature",
      "durationSec": 3.4,
      "sourceId": "feed-phone-en",
      "phone": { "motion": "soft-tilt" },
      "screen": { "motion": "screen-video", "asset": "feed-scroll.mp4" },
      "text": { "value": "See the story unfold", "effect": "word-reveal" }
    },
    {
      "id": "close",
      "kind": "close",
      "durationSec": 2.2,
      "text": { "value": "Built for the moments worth keeping", "effect": "tracking-reveal" },
      "logo": { "enabled": true, "placement": "center" },
      "phone": { "enabled": false }
    }
  ]
}
```

The exact schema belongs to the host renderer. Preserve the concepts even when
field names differ: stable source ID, independent layers, explicit duration,
and explicit motion.

## Storyboard shape

For a 15–30 second vertical video, start with four responsibilities:

1. **Hook:** one short claim, generous typography, optional logo-only card.
2. **Proof:** the most differentiating screen or real interaction.
3. **Detail:** a close-up, focus treatment, or second real interaction that
   explains how the product works.
4. **Close:** a concise outcome and optional logo/CTA.

Add scenes only when they prove a different idea. Repeated phone entrances,
automatic zooms, and one caption per screenshot make the story feel like a
slideshow rather than a product demonstration.

## Motion vocabulary

| Layer | Safe primitives | Guardrail |
| --- | --- | --- |
| Background | still, slow opacity/gradient shift | no per-scene random color churn |
| Phone shell | fade, rise, soft tilt, settle | never spin/slide the whole canvas |
| Screen content | still, content pan, screen video, short focus zoom | clip to the screen window |
| Text | fade, rise, line/word/character reveal, tracking reveal, mask wipe, soft blur | keep readable end state and safe bounds |
| Logo/image | fade, scale-to-rest, slight drift | independent layer; do not bury logo in mockup |

Use one entrance and one emphasis effect per layer. If a scene has a real
screen recording, prefer it over a synthetic pan. Keep easing and duration in
named preset tokens so the Dashboard and renderer cannot drift.

## Type and spacing defaults

- Pick one display family and one UI family per project; reserve a mono face for
  metadata. Expose family, weight, size, tracking, line height, color, and
  alignment as scene settings, not CSS literals.
- Start the caption at least one safe margin away from the phone’s measured
  bounds. Reflow to two lines before shrinking below the project’s minimum
  readable size.
- For the first title card, allow more scale and vertical breathing room than
  for feature captions. A logo should be optically sized, not merely given the
  same width as the phone icon.
- Keep the same copy while a real screen recording plays unless the copy is
  intentionally tied to a state change. Do not make text jump with every swipe.

## Preflight checklist

The renderer should stop with actionable diagnostics when any item fails:

- source ID resolves to the selected app, locale, device, and current file;
- every screen video has a real-build provenance record and fits its scene;
- text bounds stay inside the canvas safe box at start, midpoint, and end;
- caption bounds do not intersect the phone shell plus its safety margin;
- logo/image bounds stay inside the canvas and do not cover required copy;
- selected effects are supported by the renderer and do not animate the shell
  and canvas as one object;
- scene duration, total duration, ratio, frame rate, and codec match the target;
- static exports contain no editor chrome or video-only focus treatment.

The error should name `sceneId`, `layer`, measured bounds, allowed bounds, and a
concrete adjustment. “Text exceeds safe area” without those details is a failed
diagnostic, not a completed preflight.
