---
name: flaky-test-detangler
description: Use when a test passes locally but fails intermittently, fails in CI and passes on rerun, or has been labeled flaky and needs its hidden dependency removed.
---

# Flaky Test Detangler

An intermittent failure is usually a dependency that was left uncontrolled:
ordering, timing, shared state, a real clock, a live network, or a port/process.
Find and remove that dependency; a retry is not a fix.

## Workflow

1. Reproduce before theorizing. Run the focused test repeatedly in isolation
   and in the full suite using the repository's supported command. Preserve
   the environment, runner version, seed, and order of a failure.
2. Randomize order when supported and capture the failing seed/order. A test
   that fails only in the suite indicates cross-test contamination; one that
   fails alone owns its dependency.
3. Replace sleeps and fixed waits with observable conditions. Await the state
   that proves the behavior instead of extending a timeout.
4. Isolate mutable state: reset module caches, fixtures, database rows,
   environment variables, singleton state, and ports per test as appropriate.
5. Freeze the clock and stub outbound network/I/O. Sort unordered results
   before asserting; never rely on hash, set, or database insertion order.
6. Fix the root cause and rerun the captured seed deterministically across the
   repository's meaningful repetition budget. Do not add retries, sleeps, or a
   widened timeout as the remedy.
7. Quarantine only when the cause cannot yet be fixed: link an issue, name an
   owner, set a deadline, and keep collecting evidence. A quarantine without
   those fields is an open-ended skip.

## Deliverable

Return the one-sentence root cause, captured seed/order and environment, the
minimal fix, and rerun evidence (for example, the repository-approved count of
consecutive passes). Mark evidence `NOT RUN` or `BLOCKED` when it was not
possible. Delete a test only if it asserts nothing meaningful or duplicates
coverage.
