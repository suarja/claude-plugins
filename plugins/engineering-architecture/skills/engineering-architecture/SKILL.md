---
name: engineering-architecture
description: Use when a feature or refactor crosses module, data, or runtime boundaries and needs a design sketch or technical specification before implementation.
---

# Engineering Architecture

Make the shape of a non-trivial change explicit while it is still cheap to
change. The artifact should help another engineer implement the decision
without a meeting and should make disagreement visible before code lands.

## Ground the problem

Inspect the current code, domain vocabulary, neighboring modules, data model,
runtime boundaries, existing helpers, and operational constraints. Trace the
current ownership and request/data flow; naming files is not enough. Record
assumptions and distinguish observed facts from guesses.

## Sketch the caller's use first

Start with a concrete caller or user flow, then derive:

- types and invariants;
- function/API signatures and error results;
- module/package ownership;
- data and control flow across boundaries;
- lifecycle, concurrency, idempotency, and authorization rules.

Prefer a smaller model that deletes branches over a flexible model that adds
optional flags. Reuse existing canonical contracts and identify any intentional
breaking change.

## Write the decision artifact

For a small change, a focused sketch is enough. For a larger change, produce a
spec with:

1. title, status, date, and reviewers;
2. TL;DR and context;
3. goals and explicit non-goals;
4. measurable functional and non-functional requirements;
5. end-to-end design with interfaces, data shapes, sequence/flow description,
   failure modes, retries, partial failure, and observability;
6. alternatives considered and trade-offs;
7. rollout, migration, feature-flag, rollback, and cleanup plan;
8. open questions at the top and again where they affect implementation;
9. validation commands and acceptance evidence.

Use real field names, endpoints, limits, and ownership. If a diagram is
needed, describe its actors, arrows, and trust boundaries precisely.

## Stay in the loop

Implement against the agreed sketch. Surface every deviation: it may indicate
missing requirements, a wrong design, or overreach. If the same workaround
appears repeatedly, stop patching the sketch: re-ground the implementation,
delete unnecessary concepts, and redesign from the new constraints. A human
checkpoint is optional unless the requester asks for one, but unresolved
questions must never be silently decided in code.

## Deliverable

Return the design artifact first, with open questions and the synthesis
decision prominent. Do not implement until the user or project workflow makes
implementation in scope. Separate `PASS`, `FAIL`, `NOT RUN`, and `BLOCKED`
validation evidence.
