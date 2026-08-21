---
name: show-me-your-work
description: Use when a long, unattended, multi-phase, or high-stakes run needs a compact decision trail that a reviewer can audit without rereading the transcript.
---

# Show Me Your Work

Keep one canonical trail of decisions and evidence for work whose result must
remain understandable after the agent stops.

## Trail format

Use one TSV file with these columns in order: `ts`, `phase`, `decision`, `why`,
`evidence`, `result`.

Add one row per meaningful decision, checkpoint, pivot, revert, or completed
unit. Keep cells on one line. `evidence` is a resolvable pointer such as a
commit, file and line, command output, test artifact, screenshot, or issue.
`result` must say `VERIFIED`, `NOT VERIFIED`, `INCONCLUSIVE`, `NOT RUN`,
`BLOCKED`, or the concrete outcome.

## Logging rules

Log decisions, not every shell command. Explain the reason in plain language
and record the proof that lets a reviewer check it. Do not cite a self-report
when the artifact can be inspected. If a TSV is opened in a spreadsheet,
prefix cells beginning with `=`, `+`, `-`, or `@` so evidence cannot become a
formula.

Keep the trail local by default, for example `decisions.tsv` or
`.audit/<task>.tsv`. Commit it only when the run is ambitious, unattended, or
important enough that a reviewer needs the history. Review the file from top to
bottom and spot-check every evidence pointer before claiming completion.

## Deliverable

Return the trail path, the result of the final review, and an **Attention**
section naming any row or moment that still deserves human scrutiny. “No
flags” is valid only after the evidence pointers were checked.
