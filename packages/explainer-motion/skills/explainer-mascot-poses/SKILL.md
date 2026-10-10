---
name: explainer-mascot-poses
description: Create or adopt the character of a mascot explainer video, then generate its consistent pose bank (one image per gesture) from a single reference and cut every pose out as a transparent sticker. Use when an explainer video has no character yet, when the existing mascot cannot gesture (no hands, no body), when beats.json needs a pose that does not exist, or when poses drift off-model.
---

# Mascot and pose bank

The pose bank carries the format: 15–20 poses whose gestures say the words. One
reference image fixes the character; every pose is drawn from it, so the character
stays the same.

## 1. The character (a gate for the user)

Ask first whether they already have a mascot or an avatar. Then:

- **They have one with a body and hands**: put a clean full-body image on white in
  `character/ref.png` and go to step 2.
- **They have one without hands or body** (a blob, a logo): propose a version of it with
  short arms and legs — the format needs hands to point, hold a phone, give a gift.
- **They have none**: draw 3–4 directions with `scripts/img.ts`, one image each, and
  two test poses per direction from it (step 2 with `--only`), so they judge
  consistency, not just a portrait. Vary the species and the rendering
  (3D soft toy, Memoji-like human, flat 2D, animal), not just colours.

Reference prompt shape (keep the craft constraints, invest in the description):

```
Character design sheet, single character, full body, standing in a relaxed neutral pose,
arms loosely at the sides, facing the viewer, centred with a margin all around. Rendered as
a soft 3D character like a premium animated feature or a high-end Memoji: smooth matte
materials, soft studio key light from the upper left, a soft contact shadow. Big, warm,
expressive eyes with a catch-light. Clearly readable hands, because the character will
later hold objects and gesture. Plain pure white background, no text, no logo.

The character: <who it is, what it does for the viewer, shape, colours tied to the brand,
clothing, personality in three adjectives>.
```

Proportions: a big head and a compact body (2–3 heads tall) read on a phone; realistic
proportions make the face tiny once the sticker shrinks under a card. Recommend, then
let the user choose — it is their brand.

```bash
export AI_GATEWAY_API_KEY=...   # Vercel AI Gateway
bun <skill>/scripts/img.ts --out=character/candidates/a.png --prompt-file=a.txt
```

Default model `google/gemini-3-pro-image` (accepts reference images, best consistency
tested). Alternatives on the same gateway: `openai/gpt-image-2`, `spacexai/grok-imagine-image`.
No key: the user supplies `ref.png` and the poses, and only step 3 runs.

## 2. The pose bank

`character/poses.tsv`, one pose per line, `name<TAB>description`. Names are the
`pose` values of `beats.json`. Describe the gesture big and literal:

```
salut	Waving hello enthusiastically with one hand raised high, big open smile, slight lean.
toi	Pointing straight at the viewer, arm fully extended toward the camera, index finger foreshortened, knowing grin.
choc	Shocked: both hands pressed on the cheeks, eyes huge, mouth open in an O.
telephone	Holding a smartphone toward the viewer, the screen facing out and plain white, other hand pointing at it, excited.
cadeau	Holding out a wrapped gift box toward the viewer with both hands, warm smile.
```

A starting vocabulary that covers most scripts: hello, bored, confused, shrug,
pointing at you, proud presenter, phone, idea (light bulb), thinking, shocked,
thumbs up, reading a card, magnifying glass, celebrating, gift, wink. Add the ones
the script needs (money on fire for "costs", laptop for "code", scissors for "cut").

```bash
bun <skill>/scripts/poses.ts --dir=<project>/character --only=salut,toi,choc,ennui
```

**Look at the first four before drawing the rest.** One bad draw tells you which
clause misfired; twenty bad draws teach nothing. Check: same face and colours as
the reference, the gesture readable at thumbnail size, nothing extra (props
floating, two characters). Then draw the rest (`poses.ts` skips files that exist;
`--force --only=x` redraws one).

Known misses: an extra hand on foreshortened pointing poses; a phone screen with
invented UI (ask for a plain white screen — a real screenshot can go in a `phone`
card instead); timid gestures (say "big, exaggerated, cartoon key frame", already
in the prompt).

## 3. Cut-outs

`poses.ts` cuts each pose with `npx hyperframes remove-background` into
`character/cut/<name>.png` (transparent; the contact shadow is dropped, the sticker
outline is drawn by the video). Check one on a coloured ground before trusting the
batch:

```bash
ffmpeg -f lavfi -i color=c=0xE85D3A:s=1024x1024 -i character/cut/salut.png -filter_complex overlay -frames:v 1 check.png
```

Keep `raw/` and the `.txt` prompt beside each image: they are the version of the pose.
