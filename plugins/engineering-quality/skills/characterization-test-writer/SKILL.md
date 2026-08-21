---
name: characterization-test-writer
description: Use when pinning the current behavior of untested or legacy code before a refactor, including behavior that may be incorrect but is already relied upon.
---

# Characterization Test Writer

Record what the code does today so a behavior-preserving refactor cannot drift
silently. This is a safety net, not a chance to redesign the behavior.

## Procedure

1. Bound the exact function/module and the refactor blast radius. List its
   database, clock, random, network, filesystem, environment, and global
   dependencies.
2. Introduce the smallest mechanical seam needed to invoke the code: inject a
   dependency, extract a method, parameterize a constructor, or use a narrow
   test seam. Do not refactor logic while creating the seam.
3. Capture actual outputs from a real run. Start with a deliberately failing
   placeholder, replace it with the observed value, and record any suspect
   output with a `pins_known_bug_` name or comment. Never derive the expected
   value from the specification or from reading the implementation.
4. Control nondeterminism: freeze time, seed randomness, stub network/I/O,
   isolate database state, and scrub only genuinely volatile fields from a
   golden output.
5. Exercise every branch in the refactor's blast radius, including empty,
   null, boundary, invalid, exception, timeout, and concurrency cases where
   relevant. Keep each test narrow and name the behavior it pins.
6. Run the focused suite twice consecutively with no flakes before the
   refactor. Record the command and result.

## Deliverable

Return the characterization tests, a coverage note naming the pinned paths,
twice-in-a-row evidence, and a tagged list of pinned-but-suspect outputs. Do
not fix the discovered bug in the characterization change; fix it in a later,
intentional change. Do not characterize code that will be deleted or already
has intention-revealing coverage.
