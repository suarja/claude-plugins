---
name: still-to-motion
description: Give an existing still image a short, subtle motion clip without losing what makes the still good. Use when a feed or gallery of static artwork needs to feel alive, when image-to-video output drifts off-style, or when a clip has to come to rest on an image that was already approved.
---

# Still to motion

A catalogue of good stills starts to feel inert once it is scrolled full-screen.
A three or four second clip fixes that — and quietly destroys the artwork if it
is done naively. This skill is the difference between the two.

Everything here assumes the still already exists and was approved. **The clip
serves the still; the still never gets regenerated to suit the clip.**

## The one thing that ruins a run

**Generate at exactly the ratio of the placement where the clip will play.**

Hand a 2:3 source to a 9:16 request and the model does not letterbox it, and it
does not merely invent the edges. It **redraws the subject** — another pose,
another palette, the texture gone. Measured on a real run: a portrait came back
as a different portrait; a bust came back with a whole body underneath it.

Match the ratio and the same model, same prompt, produces a subject that stays
framed and a palette that holds. Crop the source before the call. Never ask for
the reframe in the prompt.

There is a second, quieter payoff: with nothing left to invent, **the model
drifts far less**. A pronounced dolly-out becomes a slight float.

## No frame of the clip is your image

This is the finding that reorganises everything else.

The input is treated as a **style reference, not as a first frame**. Frame zero
comes back visually close but redrawn — measured at ~17 dB PSNR from the
source, which is a different image, not a compression artefact. A `last_frame`
input, where a model accepts one at all, is ignored just as thoroughly.

So:

- **reversing the clip buys nothing** on its own — the other end is not your
  image either;
- **the guarantee has to come from the interface.** Play the clip, then
  cross-fade to the still. The fade absorbs the difference, which is small.

Prefer a deterministic step downstream over a guarantee you asked a model for.
It is the same trade as trimming a fixed inset instead of prompting away a
border.

## Ask motion of the subject, never of the texture

A generative video model's instinct is to animate the surface — and on
textured artwork the surface *is* the artwork. Halftone that swims, grain that
crawls, separations that slide: the image stops being a print and becomes a
filter over a photograph.

Write the prompt so the texture is explicitly fixed and the motion belongs to
the subject and to whatever sits behind it. Then check that clause first when
you look at the result.

## The model has one move — use it

Across different subjects, a given model tends to repeat one camera gesture. In
one measured case it always departed from the input in a slow dolly-out. The
same move on every card in a feed reads as a template, not as life.

Played in reverse, that dolly-out becomes a dolly-**in** that settles into the
framing of the still — which is the effect worth having, and it makes the
closing cross-fade nearly invisible. One `ffmpeg` pass, no extra generation.

Identify the model's default gesture early: it is a property of the model, not
of your subject, and it is usually more useful reversed than fought.

## Motion is an arrival, not a loop

Play once on arrival, fade to the still, and rearm when the viewer leaves. A
looping clip in a feed becomes wallpaper within seconds and burns battery for
it.

Make the clip optional per item. Some items will never have one, and **the
still has to stand on its own** — if it does not, the clip is covering for a
weak image.

## Compression is where texture dies

High-frequency detail — halftone dots, grain, print noise — is exactly what a
codec discards first. So measure it rather than assuming.

On a real run, 3.7 MB of rushes came down to about 210 KB at H.264 CRF 30 and
540 px wide, and the dot screen was still legible at 100%. A feed prefetching
three pages then carries well under a megabyte.

Do the comparison at 100% on a crop, not on the whole frame scaled down. That
is the only view where the failure is visible.

## Cost and latency shape the pipeline

Roughly $0.15 for four seconds, and one to two minutes of compute per clip.

Cheap enough not to agonise over, slow enough that it can never sit in a
request path. The still ships first; the clip arrives afterwards, or not at
all.

## A clip belongs to a placement, not to a subject

The corollary of the ratio rule. One subject with a card crop and a full-screen
crop needs **two** clips, or one clip and one placement that does without.
Reusing a clip across placements reintroduces the mismatch one step later.

## Known failure modes

| Symptom | Cause |
| --- | --- |
| The subject is redrawn: new pose, new palette, texture gone | The source ratio did not match the requested ratio |
| The texture swims, shimmers or crawls | Motion was asked of the whole image instead of the subject |
| Every clip performs the same camera move | The model's default gesture. Reverse it rather than prompting against it |
| The clip ends somewhere other than the still | Expected. No frame is the still — cross-fade in the interface |
| Halftone turns to mush after encoding | Compressed too hard, or judged on a scaled-down view |
| The feed feels busy rather than alive | The clip loops. Play once on arrival and rearm on leave |

## Reference

[`references/still-to-motion.ts`](references/still-to-motion.ts) generates one
clip from one still: crops the source to the requested ratio, calls an
image-to-video model, and writes a manifest carrying the full motion prompt
beside the file. Bun, the Vercel AI Gateway, and `sips` for cropping.

For the still side, see `series-image-generation`. For the crops a clip is
generated from, see `image-placement-contract`.
