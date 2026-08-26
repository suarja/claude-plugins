---
name: screened-interfaces
description: Render interface surfaces with the same halftone screen as the product's artwork, so avatars, loading states and images share one grain. Use when an app's illustrations look printed but its interface looks flat, when a mascot or avatar needs to match the art direction, or when loading states read as a different product.
---

# Screened interfaces

An app with printed artwork and flat interface chrome reads as two products
stitched together. This skill is about closing that gap by running one screen
across everything, and about the traps that took the longest to find.

## Separate contexts, never techniques

The first instinct is to give each surface the treatment that suits it: a
halftone for the artwork, an ordered dither for loading, flat colour for
buttons. That produces two or three grains in one product, and no shared palette
repairs it.

Run one screen everywhere. What varies is what lies under the screen, how it
moves, and which inks get pulled. A mascot is the screen over a portrait. A
loading surface is the screen over a field that means nothing yet. The context
does the distinguishing.

## The pitch is a physical size

Write the screen pitch in points, never as a fraction of the surface. A relative
pitch gets coarse on a large block and fine on a small one, so two surfaces in
the same view carry different grains and the harmony you were building is gone.

A press does not change its screen because the paper got bigger.

## Rotate one screen per ink

Three things make a screen read as pixel art instead of print: square cells, one
screen, and a lattice aligned to the axes. Fix all three. Round dots, one screen
per ink, each rotated to its own angle. The classic set is yellow flat, red at
15 degrees, black at 45.

Their overlap makes the rosette, and that rosette is what the eye reads as
grain. It also buys resolution: three screens turned against each other read
much finer than one dense screen with the same number of dots.

Let the ink ranges overlap rather than partition the values. Every ink should
cover the darks. Partitioned ranges make a shadow merely red; overlapping ones
make it black.

## Keep the source ahead of the screen

If the field under the screen holds fewer values than the screen has dots, the
extra dots repeat what their neighbours already said and the result reads soft.
Raising the screen frequency then changes nothing.

This is the first thing to check when a screened surface looks blurry. On a real
run the field was 44 by 56 under a screen of roughly 60 dots across, and no
amount of tightening the pitch helped until the field was rebuilt at 88 by 112.

## Bake a face, do not approximate one

To screen a face, start from a face. Writing the values by hand as a sum of
light and shadow blobs placed by eye does not resolve into a head, and no amount
of tuning rescues it. That is the work done backwards.

Generate one flatly lit portrait, reduce it to a small greyscale grid, and emit
the grid as source code. A few kilobytes of numbers ship with the app: nothing
is fetched, nothing is decoded, and the field stays a plain function of two
coordinates. Changing the face means changing the prompt and rerunning.

Two corrections are usually needed, and both are about what a screen needs that
a photograph does not. Add a floor, because a photographic background is never
perfectly even and without one the ink runs to the edges of the frame. Add a
gamma above one, because a photograph's mid grey becomes solid ink under a
screen and the face collapses into a silhouette.

## Move the ink locally, not globally

A travelling wave across a screened surface reads as a sweep, which is a
progress indicator, not a presence. Give each dot its own phase from its own
position and let it drift through its own values. The grain then recomposes in
place: one dot swells as its neighbour thins, and the image stays put.

Use an unordered phase. An ordered offset puts neighbouring dots in step and you
get the sweep back.

## Cost, and where it bites

Screened surfaces are expensive in a way that shows up late.

Build frames on first sight and keep them, rather than building the whole loop
at mount. The cost then spreads over the first cycle and disappears. Building
every phase before the first paint is exactly what a loading surface must not
do.

Even so, a large surface at a fine pitch is tens of thousands of shapes per
frame, and on a phone that stutters. Measure on device early. If it stutters,
the levers in order of how much they cost you visually are: fewer frames in the
loop, a slower loop, a coarser pitch, and a smaller animated area. Consider
animating only the surfaces the eye is on.

## Known failure modes

| Symptom | Cause |
| --- | --- |
| Reads as pixel art | Square cells on an axis-aligned grid, or a single screen |
| Blurry however fine the screen | The field under it holds fewer values than the screen has dots |
| Different grain on different surfaces | Pitch written relative to the surface instead of in points |
| Shadows read red, never black | Ink ranges partition the values instead of overlapping |
| A face that never resolves | Values written by hand rather than baked from a photograph |
| Reads as a progress bar | The phase offset is ordered, so the dots step in sequence |
| Stutters on device | Too many shapes per frame; cut frames or area before pitch |
