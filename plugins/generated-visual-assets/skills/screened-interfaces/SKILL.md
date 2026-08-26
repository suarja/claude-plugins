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

**But do not do this to a face.** A grain recomposing in place reads as a
surface at work, which is right for something loading and wrong for someone
listening. Put a churning face next to a churning placeholder and the face is
the one that looks broken. A face's life is gesture — turning, nodding,
blinking — and a gesture warps *where* the screen samples the portrait, so the
head moves while the ink stays put. Until you have gestures, leave the face
still and let a slow scale do the breathing. Keep the per-dot offset at a fixed
value: it still roughens the lattice, which is what stops a face printing as a
grid.

## Cost, and where it actually bites

A screened surface is tens of thousands of shapes and, in a retained-mode
renderer, well over a megabyte of path string per frame. The obvious guess is
that building it is what costs. Measure before you believe that: on one real
surface the build was 14 ms, while re-sending the result to the view every
190 ms, across six surfaces, was megabytes a second. **The traffic is the cost,
not the arithmetic.**

So do not rebuild and resend. Build the geometry once and animate it with a
transform, on whatever path your platform runs off the main thread.

## Slide the plate, do not reprint it

The cheapest motion by far is a fixed picture passing by. Print a plate **two
windows wide** whose field repeats every window, and slide it under a fixed
window. One window of travel lands on an identical image, so the loop has no
seam, and the cost is one geometry and one transform, forever.

The move that makes this work on a screened surface: **quantise the slide to the
lattice.** A lattice shifted by its own period maps onto itself, so the even
background grain looks nailed to the surface even though the whole plate is
moving — the eye has nothing to track. Only what varies across the plate appears
to travel. Slide it continuously instead and every dot lands between its own
sites, and the grain crawls.

For a screen at 45° with pitch p, sites sit at multiples of p/√2 in both axes
with the two indices' parity tied, so the smallest horizontal shift that maps
the lattice onto itself is 2p/√2. Drive the transform through a staircase
interpolation of those.

Two consequences worth knowing before you design a motion:

- **Anything baked into the plate is free.** Make the band undulate, taper,
  double — none of it costs more than a straight edge. A straight edge crossing
  a rectangle is a wipe; a slow wave crossing it is something passing through.
- A motion where every dot changes independently cannot be a slide, and that is
  the one that costs a frame stack. Ask whether yours can be a slide first.

If you do need a frame stack, mount every frame and cross-fade opacity with
triangular windows that sum to one, so the total ink does not dip between
frames. Build frame zero during the first render so grain appears immediately
and the rest one per tick — building a whole loop before the first paint is
exactly what a loading surface must not do. Rasterise each layer. Then the
number of frames is the knob, because every frame stays resident.

One thing that is *not* a lever: dropping from three inks to one. At equal
apparent fineness three screens at 3 / 3.3 / 3.6 pt cost about what one screen
at 1.9 pt costs, because the rosette is what buys the resolution. One ink
changes the colour, not the load.

## Known failure modes

| Symptom | Cause |
| --- | --- |
| Reads as pixel art | Square cells on an axis-aligned grid, or a single screen |
| Blurry however fine the screen | The field under it holds fewer values than the screen has dots |
| Different grain on different surfaces | Pitch written relative to the surface instead of in points |
| Shadows read red, never black | Ink ranges partition the values instead of overlapping |
| A face that never resolves | Values written by hand rather than baked from a photograph |
| Reads as a progress bar | The phase offset is ordered, so the dots step in sequence |
| Stutters on device | Geometry is rebuilt and resent every frame; build it once and move it with a transform |
| Grain crawls while something travels | The slide is continuous; quantise it to the lattice period |
| Still stutters once built | A frame stack where a slide would do, or too many resident frames |
