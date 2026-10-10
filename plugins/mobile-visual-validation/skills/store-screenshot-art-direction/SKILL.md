---
name: store-screenshot-art-direction
description: Use when planning or refreshing App Store or Google Play screenshots and a product needs a clear, evidence-based visual story before production. Defines the message, frame sequence, and approved visual direction; it does not capture, export, or publish assets.
---

# Store screenshot art direction

Use this skill to decide what a store screenshot series should say and how it
should look before production begins. Keep the work reusable across products:
derive the product, audience, language, claims, and platform requirements from
current project evidence.

## 1. Establish the brief

Confirm the app and release being represented, target stores and locales,
intended audience, screenshot placements, and the decision the listing should
help a visitor make. Ask only for missing product decisions that materially
change the story.

Inspect the current listing pack, relevant product screens, existing approved
visual references, and any recent proposals. Record which sources are current,
stale, proposed, or unverified. Do not reuse a screenshot or claim just because
it looks polished.

## 2. Ground the story in the product

List the product benefits that are visible in the current app and the evidence
for each one. Separate verified capabilities from planned, inferred, or
marketing-only claims. Exclude claims that cannot be demonstrated in the target
build or supported by an authoritative project source.

Build a short sequence in which each frame has one job:
- frame number and its role in the story;
- the visitor question or benefit it answers;
- the real app screen or product evidence to show;
- proposed headline and supporting line, if needed;
- missing capture, copy, or product proof.

Make the sequence read as one argument from the opening frame through the final
frame. Avoid repeating one benefit in several frames.

## 3. Choose visual references

Read [references/proven-direction.md](references/proven-direction.md) first: a
direction, its copy and the owner's rejections from a pack that already passed
this gate. Start direction 1 from it unless the product calls for something
else, and do not repeat what it records as rejected.

Use existing approved store work as a reference when available. A
design-reference skill or library such as design-bank may help find and annotate
references; it is optional. Record what is being borrowed (for example,
hierarchy, pacing, or framing) and what must remain specific to this product.

Do not invoke a screen-redesign workflow just because the work contains
screenshots. These are store-marketing compositions around real product
evidence, not permission to redesign the app UI.

## 4. Propose distinct directions

Present three meaningfully different visual directions before polishing a full
set. Change the visual idea and composition, not just the palette. For each
direction, show:
- a short name and central idea;
- how the opening frame attracts attention;
- typography, color, image treatment, and layout principles;
- how the sequence varies while remaining coherent;
- risks, assumptions, and any asset or capture dependency.

Keep product names, interface content, screenshots, and claims faithful to
current evidence. Label illustrative or synthetic UI clearly; never pass it off
as a real capture.

Build the board on real captures with the store-frame renderer of
app-showcase-pipeline (its board target), one pack file per direction. The
accepted pack then becomes the production export unchanged, so no title or
position is retyped. Another HTML/CSS or design tool works too. Canvas
generation, Claude Design, or another board renderer are optional adapters, not
required skills or dependencies. A board is a proposal, not a production export.

## 5. Review before extending

Show the three directions side by side. Review the opening three frames of the
selected direction both at full size and at a small thumbnail scale (the
renderer's thumbnail board, about the size of a search result). Check that the
message is legible, the app evidence is visible, the hierarchy survives
reduction, and the three frames feel related without looking duplicated.

Wait for the owner's choice or requested blend before extending a direction into
the full sequence. Record the owner's words under each board, verbatim, with
what was kept and dropped. Preserve rejected directions and the reason for the
decision in the handoff when that will prevent repeated exploration.

## 6. Hand off to production

Deliver the approved direction, ordered frame brief, final or provisional copy,
reference sources, product evidence, and outstanding capture needs in a concise
handoff. Mark unresolved claims and missing sources explicitly.

Then use the existing app-showcase-pipeline for real capture provenance,
manifests, localization and platform sizing, technical preflight, and production
exports. Keep those production checks separate from creative approval. This
skill does not create captures, guarantee platform compliance, or publish a
listing.
