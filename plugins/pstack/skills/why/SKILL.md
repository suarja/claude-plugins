---
name: why
description: Use when investigating why a design, threshold, API, workaround, or regression exists and the answer needs evidence from code history, issues, docs, or operational records.
---

# Why

Recover motivation without inventing a story from today's code. `how` explains
what the system does; `why` investigates the forces, trade-offs, and evidence
that shaped it.

## Anchor the question

Identify the target file/symbol or decision, inspect its current shape, and
collect recent history with blame and file-scoped log/diff. State the question
and any best-guess scope before searching. Do not infer intent from an
implementation alone.

## Search evidence

Search available sources in parallel where practical:

1. source-control history, blame, commit messages, and linked pull requests;
2. repository docs, ADRs, plans, comments, and changelogs;
3. issue/ticket records and review discussion;
4. operational evidence such as logs, metrics, incidents, or analytics only
   when the relevant connector or exported artifact is actually available.

Use primary evidence first. Cite commit hashes, issue/PR numbers, file paths,
or URLs for every claim about intent. Treat an unavailable or empty source as a
reported gap, not as confirmation that no decision existed.

## Calibrate the conclusion

Separate:

- **Observed:** directly supported by a source;
- **Inferred:** the best explanation supported by multiple clues;
- **Unknown:** not established by the available record.

Surface contradictions and plausible alternative explanations. Explain which
constraints were real, which alternatives appear to have been rejected, and
whether the original reason still applies. For thresholds or defensive code,
look for incident, performance, product, or compliance evidence before calling
the value arbitrary.

## Deliverable

Return the answer first, followed by an evidence table, timeline, trade-offs,
confidence level, unresolved gaps, and a recommendation if the old rationale
no longer holds. Never manufacture citations, and mark searches or tools that
were `NOT RUN` or `BLOCKED`.
