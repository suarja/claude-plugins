---
name: figure-it-out
description: Use when a task is large, cross-cutting, multi-phase, or will be reviewed later and no narrower workflow provides enough rigor.
---

# Figure It Out

Design an auditable playbook before starting a task whose wrong shape would be
expensive. The deliverable is a sequence of falsifiable, independently
verifiable units, not a vague project plan.

## Frame the work

State:

- the definition of done as a checkable predicate;
- scope in concrete units, rough effort, and blockers found during grounding;
- the risk and rigor level, including the first checkpoint;
- what is explicitly out of scope.

Surface one-way-door decisions before spending hours on implementation. Use the
current repository's architecture and domain vocabulary as constraints.

## Design the workflow

Decompose the work into atomic units that can land and be checked on their own.
Order the riskiest unknown first. Capture a baseline before changing behavior.
For each unit, name the artifact, owner, write boundary, command or observation
that proves it, and the stop condition.

Parallelize only genuinely independent seams. Give concurrent workers separate
branches, worktrees, files, or state keys and merge at a reporting boundary.
Do not serialize shared mutation with a prose instruction.

## Run the loop

Treat each unit as an experiment:

1. state the hypothesis and expected predicate;
2. make the smallest change;
3. inspect the real artifact and run its check;
4. keep it only if it advances the predicate;
5. record `VERIFIED`, `NOT VERIFIED`, or `INCONCLUSIVE` before advancing.

Do not batch all edits and postpone verification. If the check is weak, fix the
check as its own unit instead of routing around it.

## Keep the trail

For long, unattended, or high-stakes work, maintain a compact TSV decision log
with timestamp, phase, decision, reason, evidence pointer, and result. Keep it
local by default; commit it when a reviewer needs to trust the run after the
fact. Use `show-me-your-work` if that skill is installed.

## Finish

Evaluate the complete predicate against the real artifact, not a proxy. Report
what is verified, what is open, and what is `NOT RUN` or `BLOCKED`. Turn a
recurring correction into a check, script, or durable instruction before
closing the work.
