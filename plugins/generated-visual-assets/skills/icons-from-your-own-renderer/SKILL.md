---
name: icons-from-your-own-renderer
description: Produce an app icon, favicon and store assets by drawing them with the product's own rendering code rather than prompting an image model. Use when a project needs brand raster assets and already has a visual system in code.
---

# Icons from your own renderer

The reflex when a project needs an app icon is to prompt an image model. Do that
second, or not at all, and understand what it actually returns first.

## What a model returns, and why it is the wrong object

Ask for "an app icon" and you get **a picture of an app icon**: a rounded square
rendered inside a frame, with a drop shadow, a highlight, and its own margins
baked into the pixels. It is an illustration *of* the thing rather than the
thing.

Three consequences, all of which surface late:

- **It cannot be re-cut.** Platforms mask icons themselves — a circle here, a
  squircle there, a full bleed for the adaptive layer. Pixels that already
  contain a rounded corner and a shadow get masked *again*, and the result is a
  corner inside a corner.
- **It is off-brand by accident even when it is pretty.** A model has no access
  to the palette, the type, or the technique the product is actually built from.
  It approximates them, and approximation is exactly what a mark cannot afford.
- **It is not reproducible.** Regenerating means a prompt and a hope. Six months
  later nobody can produce a variant that matches.

## What to do instead

If the product has a visual system **in code** — a palette, a texture, a
generative treatment, a chart style, anything with a renderer — the icon should
be drawn by that same code.

    field / palette / technique  →  SVG  →  raster at every required size

This is not a compromise. It is strictly better on every axis that matters: the
mark is on-brand *by construction* rather than by luck, it is exact at any size
because it is vector until the last step, and regenerating it is a command
instead of a prompt.

Write it as a script in the repo, next to the other generators, not as a
one-time export from a design tool.

```ts
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" …>`
await sharp(Buffer.from(svg)).resize(size).png().toFile(out)
```

`sharp` rasterises SVG directly, so there is no browser and no headless step.

## Rules that decide whether the mark works

**Draw to the full bleed. Never draw the platform's shape.** No rounded corners,
no shadow, no inner padding. The platform masks. A mark with its own corners
gets a corner inside a corner, and a mark with its own shadow gets a shadow that
does not match the system's.

**Judge at the smallest size first.** An icon is a 60-point object, and most of
the time a 38-point one. Render every candidate at 1024 *and* at ~40, put them
side by side, and look at the small one. Anything that only works large is not
an icon — it is a poster.

**A texture is not a mark.** This is the failure worth predicting, because the
temptation is strong when the product *is* its texture: at icon size the grain
either disappears into a flat colour or turns to noise. A texture reads as
matter only where there is enough surface for it. Draw the *element* of the
technique instead — one dot, one rosette, one stroke — at the scale where it
becomes a symbol.

**The one place a physical pitch may scale.** A grain written in points is
normally sacred, because a screen and a card share a page at one viewing
distance. An icon shares nothing: the artwork *is* the whole surface. So if a
grain appears in an icon at all, it scales with the artwork — and this is the
only such exception.

**Offer several claims, not several styles.** Each candidate should be a
different answer to *what is this product*, not the same answer with different
colours. Then choose by looking.

## Sizes

Cover the platform's list from the one SVG. For Expo that is `icon` and
`adaptive-icon` at 1024, `splash-icon` at 512, `favicon` at 96 — check the
current docs rather than trusting this list, since it moves.

Keep the SVG next to the PNGs. It is the source; the rasters are output.

## When a model is genuinely right

When the mark is **illustrative** — a character, a scene, a portrait — and the
product has no renderer for it. Then generate the artwork, and still compose the
icon in code around it: bleed, crop and sizes stay in the script, so the
platform's masking is never fighting baked-in pixels.
