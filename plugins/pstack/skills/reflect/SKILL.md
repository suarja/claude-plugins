---
name: reflect
description: Use when the user asks to reflect, a complex task produced a reusable lesson, or a correction exposes a gap in an existing skill or workflow.
---

# Reflect

Turn durable lessons into proposed skill or workflow improvements without
rewriting the current task's history into a flattering story.

## Collect evidence

Use the current thread, decision trail, diffs, failures, and corrections. If a
transcript or artifact is unavailable, write a concise digest and label the gap.
Separate observed facts from inference. Look for the step that caused the cost,
the evidence that would have caught it earlier, and the smallest structural
guard that prevents recurrence.

## Review from independent angles

Use independent passes when available:

- judgment: is the lesson real and generalizable?
- tooling: can a script, lint rule, metadata field, or check enforce it?
- divergent: what alternative explanation or unintended consequence exists?

Deduplicate findings and map each accepted lesson to one existing skill,
workflow, script, or new skill. Prefer changing the smallest canonical source
instead of adding another overlapping instruction.

## Approval gate

Present the full `Accepted`, `Rejected`, and `Backlog` result before changing
any skill or shared instruction. The owner chooses which accepted items land.
Do not turn a one-off preference, an unsupported guess, or a private transcript
detail into a universal rule.

## Deliverable

Return the evidence reviewed, accepted edits with their target and rationale,
rejected items with reasons, backlog items, and the structural enforcement check.
Mark missing evidence `NOT RUN` or `BLOCKED`.
