---
name: shared-state-separation
description: Use when concurrent agents, jobs, processes, or requests may write the same file, branch, key, database row, or mutable state object.
---

# Separate Shared State Before Serializing

First ask whether concurrent actors truly need one mutable write target. If
they do not, remove the sharing. If one shared writer is a real invariant,
serialize it structurally rather than trusting an instruction to take turns.

## Apply the rule

1. Enumerate each actor and the exact files, branches, keys, rows, or objects it
   reads and writes.
2. Separate independent facts into independently owned targets, worktrees,
   branches, state directories, or keys.
3. Merge at a deliberate read/report boundary after each owner has finished.
4. If one canonical shared target is unavoidable, use a single writer,
   lockfile, transaction, compare-and-swap, or other mechanism whose failure is
   observable.

Two workers writing different fields in one JSON state file still share a
mutation target. A prose convention is not concurrency control. Treat “we need
a lock” as a reason to recheck ownership before adding synchronization.
