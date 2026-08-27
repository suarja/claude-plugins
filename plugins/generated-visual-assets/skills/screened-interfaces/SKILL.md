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

## Print each dot once, and change which plate it is on

The cheapest animation on a screened surface prints **every dot exactly once**
and varies only which layer carries it.

For a surface that recomposes in place — the loading texture — print one still
plate holding every dot at its thin size, then one plate per cluster holding the
same dots at their thick size. Fade a cluster's plate in and that clump swaps
state; a thick dot covers the thin one beneath it, so the swap is clean. The
whole surface costs two plates' worth of geometry, and after that a handful of
opacities on the driver and no per-frame work.

For a surface where something genuinely travels, print a plate two windows wide
whose field repeats every window and slide it, quantising the slide to the
lattice period — a lattice shifted by its own period maps onto itself, so the
background grain looks nailed down while the plate moves. Slide it continuously
instead and every dot lands between its own sites, and the grain crawls.

Reach for a frame stack only when neither fits. Then mount every frame and
cross-fade opacity with triangular windows that sum to one, build frame zero
during the first render and the rest one per tick, and rasterise each layer.

## An even surface is a tile, not a plate

The plate model above is for surfaces that carry something — an illustration, a
face, a field. Interface chrome carries nothing: a card, a block, the ground.
Its texture is the same in every square inch, and that changes the construction
entirely.

An even texture is **one tile repeated**, and repeating is what a renderer does
for free — an SVG `<pattern>`, a tiled bitmap brush, a wrapped sampler. The
geometry stops growing with the surface: a whole interface's texture becomes one
or two short paths. Pulling a plate per card at its measured size is the
per-frame traffic problem re-entering through the door marked *chrome*.

**A tile is seamless only when its side is a whole repeat of the lattice.** For
an upright screen the lattice is a square of side `pitch`, so any multiple
works. For a 45° screen it is the even squares of a grid of side `pitch/√2`, so
the tile is an **even** number of those — `pitch·√2`. **No other angle tiles at
all.** That is a real constraint on the design and not a detail: a rotated
multi-ink set cannot be a repeating texture, so interface chrome gets one ink.

Round the requested tile size to the nearest whole repeat, and prove it with a
deliberately wrong control. Off by 0.4% the seam shows as ruled bands at real
size, plainly. Check the property on the numbers too — every mark must repeat
one tile away to floating-point noise — because no amount of jitter hides a bad
repeat.

Marks clipped by the tile edge are correct: the piece cut off one edge is drawn
by the neighbour's copy of the same lattice point. That only holds while the
lattice is periodic with the tile, which is what the rounding buys.

**Jitter has to be periodic too.** A lattice this sparse reads as graph paper
without it, so hash each mark's radius and offset from its lattice index
*reduced modulo the tile*. Corresponding marks in neighbouring tiles then wander
identically and the repeat stays exact. Non-periodic jitter seams.

**Judge a texture at real size, never at a zoom.** Two textures set by eye at 4×
were both invisible at 1× and needed roughly tripling. A texture judged at a
magnification is a texture nobody ever sees.

## Sweeping is almost always the wrong instinct

A band crossing a rectangle is a wipe. It reads as a machine drawing the
surface, not as content arriving, and on a large surface it makes the density
uneven wherever it happens to be. Three variants of it were tried on one real
product and all three were rejected by the same person for the same reason.

What reads as waiting is the ink **settling in place**: clusters alternating
between two states, one thickening as its neighbour thins, nothing travelling.
Cluster from a smooth function of position so a clump is tens of points across —
per-dot grouping is television snow — and jitter each dot's reading before
sorting so clump edges dither instead of cut.

On a large surface, drop the clusters entirely: at any size they read as areas
changing together. Every mark then gets its own clock, which is what
scintillation is.

And keep that motion away from faces. The same alternation that reads as a
surface at work reads, on a face, as someone malfunctioning.

## Two traps that cost the most attempts

**A repeating pattern is usually temporal, not spatial.** If every cluster
shares one animated value and differs only by a phase offset, the whole surface
beats at a single frequency, and the eye catches that cycle however random the
grouping is in space. Chasing better noise will not fix it. Give each cluster
its own clock at its own duration, stepped so no two share a beat.

**An evenly random surface reads as homogeneous.** Marks drawn from one flat
distribution make every part of the surface statistically identical, so there is
nothing anywhere to tell apart — perfect randomness and visible sameness are the
same thing at a glance. Mix a slow, large-scale field into the draw so a region's
odds tilt towards certain clocks. Areas then have their own tempo without any of
them becoming a shape.

## If you must sweep, sweep like something that shipped

Two properties separate a highlight from a wipe, and neither is obvious:

- The profile is **two soft peaks with a dip between them**, not one band. One
  band crossing a shape is a machine drawing it; two uneven peaks are light
  catching a surface.
- It goes **there and back with easing at each end**, not one way. A one-way
  loop has a seam to hide and reads as a belt turning.

Keep the contrast low — the reference that worked peaked at 0.24 alpha.

## A modelled subject beats a photographed one, once it has to move

A photograph is someone. It is also fixed: it holds only the view it was taken
from, so it can be warped but never turned, and personalising it means
generating another photograph — one image per user, per variation.

Modelled geometry has neither limit. Ray-march an implicit surface per screen
dot and the rotation is exact at any angle, because what comes into view was
always there. Personalisation becomes a handful of numbers: nothing to generate,
nothing to ship, nothing to store. This is also how a 1-bit console works —
render the geometry, screen the result, nobody draws the frames.

You need no mesh and no rasteriser: the screen asks for ink at a few thousand
points and nowhere else, so each of those is one short ray.

The trade is identity. A portrait is a person, a sculpture is a mask. Keep both
side by side and choose by looking.

## Baking, and where the time actually goes

**Baking is the runtime step that turns a field into path strings** — sample,
size a dot, append an arc, a few hundred kilobytes per plate — kept afterwards
and never recomputed. A field read from a grid bakes in milliseconds. A field
ray-marched from geometry is two orders of magnitude dearer, and that gap
decides the whole strategy.

Levers in the order they pay:

1. **Bake fewer plates.** Nothing else is close. Baking a dozen poses eagerly
   cost fifteen seconds per change of shape on one real device; baking a
   gesture's poses when that gesture is first asked for made it one plate.
2. **Bake off the first frame.** Bake what the user is waiting to see during the
   first render, everything else on a tick behind it.
3. **Keep what is baked**, keyed on the shape rather than on the field — a field
   is a closure and cannot be compared.
4. **Only then the arithmetic.** Culling missed rays, tetrahedron normals,
   skipping fine detail far from the mass: all three together measured 15%.

Precomputing at build time works for a fixed set and stops working the moment a
user shapes their own. If it is still too slow after all four, move the bake off
the main thread rather than shaving further.

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
| Seconds of freeze on a settings change | Every pose is being baked eagerly; bake a gesture when it is asked for |
| A subject that cannot turn | It is a photograph; model it instead, and personalise by numbers |
| Grain crawls while something travels | The slide is continuous; quantise it to the lattice period |
| A cycle is visible however random the noise | Every group shares one clock and differs only by phase; give each its own duration |
| Random everywhere, yet reads homogeneous | One flat distribution over the whole surface; mix in a slow field so regions differ |
| Still stutters once built | A frame stack where a slide would do, or too many resident frames |
