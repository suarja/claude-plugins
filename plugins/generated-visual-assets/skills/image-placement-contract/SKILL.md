---
name: image-placement-contract
description: Serve several placements — hero, thumbnail, banner, card — from a single generated or photographic source, deterministically. Use when the same image must appear at different aspect ratios, when a title has to sit over an image, or when crops keep losing the subject.
---

# Image placement contract

One image, several placements. The naive approaches both fail: generating a
separate image per placement breaks visual identity and multiplies cost, and
cropping by hand does not survive the hundredth asset.

## Never ask the image to reserve space for the title

The tempting instruction is "leave empty space in the lower left for the title".
It fails twice:

- a generative model places that reserve differently every time, so the title
  lands somewhere else on every asset;
- the reserve **disappears the moment the image is re-cropped** for another
  placement.

Instead, the interface draws the title over a band anchored to the bottom of
whatever placement is in use. The position is then fixed by construction, not
negotiated with the image.

**A band, not a full-frame veil.** A translucent layer over the whole image
dulls the entire illustration — the thing you paid to generate. A band occupies
the bottom and leaves the rest untouched. If the band's height varies with title
length, cap it and shrink or ellipsize the text rather than letting it climb.

## Constrain the subject to a safe region instead

Turn the framing instruction around. Rather than reserving space, declare where
the subject must be:

> Fill the frame. Keep the subject self-contained and roughly centred, within
> the upper square. Nothing essential in the bottom third, nor in the outer
> 15% of the left and right edges — those regions are cropped or covered.

This is reliable to prompt, and it is exactly what the crops need.

## Declare a focal point per image

Store two ratios with each image, set once when it is accepted. Every placement
is cut centred on that point and clamped inside the frame:

```
left = clamp(focal.x * width  - targetWidth  / 2, 0, width  - targetWidth)
top  = clamp(focal.y * height - targetHeight / 2, 0, height - targetHeight)
```

A single hand-tuned offset per placement does not generalise: a tight portrait
and a wide scene need different ones. A focal point does, because it describes
the image rather than the crop.

## Composition must survive a strip

The focal point decides **where** to cut. It cannot save a composition that does
not survive being cut. A subject spread across two opposite corners loses half
its meaning in any wide banner crop.

So the framing rule carries a second clause: one self-contained subject, never
split into elements that need each other to make sense. Judge it by cutting the
widest placement first — that is the one that breaks.

## Absorb edge artefacts with a fixed inset

Trim a small deterministic inset — a few percent — from every source before
cutting placements. A printed border, passe-partout or stray edge disappears; a
clean full-bleed image simply tightens, and the framing rule already declared
the outer edges free of anything essential.

This replaces a prompt clause with arithmetic. Prefer that trade whenever it is
available.

## Judge in situation, never in isolation

An image on its own does not tell you whether it survives a title, a grid
neighbour, or a thumbnail. Build the smallest possible surface that shows the
real placements with real titles, and judge there.

This is worth building early. It changes decisions: a cover that looked strong
alone can be unreadable at card size, and a modest one can carry perfectly once
the title does its half of the work.
