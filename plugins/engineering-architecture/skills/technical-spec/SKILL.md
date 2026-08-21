---
name: technical-spec
description: Use when an engineering change needs an implementation-ready RFC with explicit goals, non-goals, requirements, alternatives, failure modes, rollout, and open questions.
---

# Technical Spec

Write the decision artifact that makes implementation predictable and
disagreement cheap. Lead with the decision, expose uncertainty early, and do
not hide the risky core behind vague prose.

## Gather

Collect the problem, affected users or systems, current behavior, constraints,
proposed approach, and explicit non-goals. Inspect the relevant code and docs.
State assumptions and distinguish observed facts from guesses.

## Standard structure

1. title, status, date, and reviewers;
2. summary or TL;DR;
3. background and context;
4. goals and explicit non-goals;
5. functional and quantified non-functional requirements;
6. end-to-end design with data models, interfaces, components, sequence, and
   ownership;
7. failure modes, timeouts, retries, partial failure, observability, and
   authorization;
8. alternatives considered and trade-offs;
9. rollout, migration, feature flags, rollback, and cleanup;
10. open questions at the top and wherever they affect implementation;
11. validation commands and appendix details.

Use real field names, endpoints, limits, and actors. Describe diagrams with
their nodes, arrows, and trust boundaries when a rendered diagram is not
available. A new engineer should be able to implement from the spec without a
meeting.

## Quality bar

Every component has a responsibility and interface. Every risky operation has
a failure path and recovery behavior. Backwards compatibility and data
migration are addressed or explicitly out of scope. Do not implement while a
material open question is being silently decided in code.

## Deliverable

Return the spec with open questions prominent, alternatives and trade-offs,
rollout/rollback, and evidence for the current-state claims. Mark validation
`PASS`, `FAIL`, `NOT RUN`, or `BLOCKED`.
