---
name: interrogate
description: Use when a diff, design, or implementation needs independent adversarial review to expose blind spots before acceptance.
---

# Interrogate

Challenge the work from independent angles before it is accepted. Agreement
between independent reviewers is useful signal, but a lone finding can still
be correct. Produce a synthesized verdict and do not modify the reviewed code
automatically.

## Scope and intent

Identify the exact diff or artifact, its base, surrounding contracts, and the
user intent. Read the relevant docs, tests, and neighboring modules. State the
intent in one paragraph so reviewers test whether the implementation achieves
the goal rather than debating the goal itself.

## Review independently

When parallel agents or model diversity are available, give each reviewer the
same scope, intent, evidence, and rubric. Otherwise perform independent passes
sequentially and label the reduced independence. Useful lenses include:

- correctness, state transitions, and boundary cases;
- security, authorization, privacy, and abuse paths;
- maintainability, architecture, types, and complexity;
- tests, observability, performance, and operational rollback.

Each reviewer must cite exact files/symbols or evidence, explain impact, and
separate a blocker from a preference. Do not ask reviewers to make fixes.

## Synthesize

Deduplicate findings and mark consensus versus lone findings. Categorize every
finding as:

- **Act on:** blocks acceptance given the actual goal;
- **Consider:** real concern with a cost or scope trade-off;
- **Noted:** valid but low-impact or contextual;
- **Dismissed:** wrong, duplicated, or unsupported by the artifact.

## Deliverable

Return intent, scope and base, reviewer/evidence coverage, `Act on`,
`Consider`, `Noted`, `Dismissed`, and an agreement map. State what was not
reviewed as `NOT RUN` or `BLOCKED`. Leave edits and final acceptance to the
owner after the verdict.
