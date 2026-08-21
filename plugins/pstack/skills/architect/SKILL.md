---
name: architect
description: Use when a non-trivial change crosses a function, data, or module boundary and types, signatures, and ownership should be settled before implementation.
---

# Architect

Design the shape before writing implementation code. Start from the caller's
use, sketch explicit types and signatures, and keep implementation aligned with
the chosen module boundaries.

## Ground

Trace the current code, data flow, ownership, neighboring contracts, and
constraints. Read the actual symbols and tests. Record assumptions and the
evidence behind them. Skip grounding only for genuinely greenfield work.

## Sketch

Write the caller's usage first, then derive:

- domain types and invariants;
- function/API signatures and error results;
- module/package ownership;
- data flow, lifecycle, authorization, concurrency, and idempotency rules;
- alternatives and the reason for the selected shape.

Use `not implemented` bodies or pseudocode when a scaffold helps review. A
small change may need one file; a larger change needs a module map and a short
rationale. Prefer a shape that removes branches over one that adds optional
flags.

## Implement and re-ground

Implement against the sketch and surface every deviation. Repeated workarounds,
casts, nullable escape hatches, or callers that know internal rules are signals
that the sketch is wrong. Stop, re-ground, subtract unnecessary concepts, and
redesign rather than bolting on another exception.

## Deliverable

Return the caller usage, type/signature sketch, module map, alternatives,
assumptions, open questions, and validation plan. Do not silently implement an
unresolved architectural decision.
