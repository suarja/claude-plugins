---
name: design-first
description: Use when a new screen, flow, component, or material visual direction must be chosen before production UI implementation
---

# Design First

Treat design-first as a bounded visual direction gate. It answers one design
question, records the decision, and then gets out of the way so production work
can proceed.

## When to use

Use for a new visual surface, a new flow, a substantially new component, or a
direction change. Do not reopen it for a small spacing, copy, or color tweak on
an already approved direction.

## Workflow

1. State the design question, host route, target surfaces, and decision maker.
   Prefer an existing route or screen so the proposal is judged with real
   density and navigation context.
2. Read the product constraints, current theme tokens, responsive helpers,
   existing component patterns, and the current visual source of truth. Record
   the source path and date; do not let an old mockup silently outrank the
   active product docs.
3. Create or update a clearly marked HTML mockup/design chart before touching
   production UI. If the question is genuinely open, use the `prototype` skill
   to show at most three structurally different variants, not color-only
   alternatives. A palette-only question is a separate check with one palette
   question, at most three options, and its own approval record.
4. Include the states that can change the decision: happy, loading, empty,
   error, authenticated/unauthenticated, and unknown data kinds when relevant.
   For every supported locale, use the longest relevant strings; for supported
   themes, check light and dark; for supported accessibility settings, check
   text expansion and the relevant accessibility path. Express responsive
   behavior and safe areas; do not design only for one phone screenshot.
5. Validate the mockup in a browser at the target widths. For a mobile target,
   check the project’s required phone and tablet dimensions (for example
   390×844 and 834×1112) and check overflow, contrast, and basic accessibility.
6. Stop and request approval. Do not write production UI before approval. The
   gate is complete only when the selected
   direction, included/excluded states, target surfaces, and acceptance criteria
   are explicit.
7. Record the decision and map the mockup to production tokens, layout rules,
   and public behavior seams. Fixtures are mockup-only; the production slice
   must exercise a typed public seam or mark an explicit stub boundary. Then
   implement a small vertical slice. Use behavioral TDD for production logic
   and interactions; never write tests or snapshots that freeze mockup markup,
   layout, selectors, or CSS values. A production snapshot is acceptable only
   when it asserts public behavior rather than visual implementation details.
8. Validate the real surface after implementation: browser/computer-use for
   web, `serve-sim` for an available Apple simulator, and a human checkpoint
   when the required device, account, or visual state is unavailable. Preflight
   the available capabilities. If `serve-sim` is unavailable for a mobile
   target, run the available Expo-web/headless fallback, then retain `VALIDATE`
   for the native checkpoint; a web fallback does not prove native behavior.
   Evidence must come from the changed production route/commit and include
   surface, dimensions, and state. Otherwise leave the work in `VALIDATE`.

## Stop rule

After direction approval, ordinary typography, spacing, token, and copy
refinements happen in production code and on the real surface. Reopen the
mockup only for a structural direction change, a substantially new component,
or an explicit owner request. If visual sources conflict, stop, list the
competing paths, ask the owner which is canonical, and record the chosen path
and stale paths. Mark exploratory variants `PROTOTYPE` and keep them on a
separate branch or issue; extract the decision before archiving or deleting
them. Preserve the approved mockup as a reference, but do not let it become a
second implementation.

Read `references/design-first-checklist.md` for the handoff and validation
matrix.
