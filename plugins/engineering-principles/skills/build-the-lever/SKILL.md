---
name: build-the-lever
description: Use when non-trivial work is being repeated by hand and a small script, codemod, generator, or rerunnable check could perform or prove it.
---

# Build the Lever

For work that outlives a one-off edit, build the smallest tool that performs or
proves the work. The tool is part of the deliverable because a reviewer can
inspect and rerun it instead of trusting a hand-applied result.

## Choose the smallest lever

Use a codemod for mechanical edits, a generator for repeated artifacts, a
query for analysis, or a deterministic check for verification. Do the first
unit by hand only when it teaches the recipe; then rerun the tool on that unit
and compare the result. Make the lever safe to rerun and keep its write scope
explicit.

When delegating, put the recipe, proof contract, and do-not-touch fence in the
skill or script shared by workers. Prefer one deterministic lever to many
agents hand-editing identical units.

Skip the lever only when the task is genuinely trivial and the tool would be
larger or less clear than the change. Do not build a framework to avoid writing
a small script.

## Deliverable

Return the lever path, its bounded inputs/outputs, the command that reruns it,
and the proof that it produced the intended result without touching unrelated
state. Commit it when the workflow will recur.
