---
name: coverage-gap-finder
description: Use when deciding what to test next from real branch coverage, code churn, and domain risk, especially when a high coverage percentage still feels unsafe.
---

# Coverage Gap Finder

Find the uncovered paths that would hurt, not the files with the lowest
percentage. A line-only percentage is not enough to prescribe work: first
obtain branch/condition coverage from the repository's real test runner.

## Inputs

Collect the coverage report and its mode, recent git churn, critical domain
areas, and the release horizon. Critical areas usually include money,
authentication/authorization, deletion, migrations, uploads, and externally
visible correctness. If the owner cannot name them, propose a labeled guess.

## Rank gaps

For each uncovered branch, weigh:

`risk = blast radius × change frequency × ambiguity`

Prioritize high-blast-radius code, recently changed files, and branches with
complex conditions, time/date math, rounding, concurrency, early returns, or
error paths. Do not confuse a generated client, formatter, or static config at
zero percent with a critical behavior gap.

Name the missing cases rather than repeating the report: empty/null input,
boundaries, invalid permissions, timeout/exception paths, retries, and
concurrent or partially applied state where relevant. Pick the smallest unit,
integration, or end-to-end test that exercises each risk.

## Deliverable

Return a ranked gap plan containing the exact path/branch, risk rationale with
evidence, missing cases, test type, and the first test to write. Include a
named non-gap list and recommend per-module branch floors for critical code;
do not prescribe a global percentage. Hand covered-but-unasserted behavior to
mutation testing, and hand legacy behavior before a refactor to
characterization-test-writer.
