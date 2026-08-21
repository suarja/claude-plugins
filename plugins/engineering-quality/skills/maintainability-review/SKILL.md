---
name: maintainability-review
description: Use when reviewing a branch, module, or change for clean structure, weak boundaries, giant files, tangled conditionals, unnecessary abstractions, or maintainability regressions.
---

# Maintainability Review

Review structure, not just whether the code runs. The goal is to find the
smallest restructuring that preserves behavior while deleting complexity.

## Review procedure

1. Establish the scope and intent from the diff, issue, tests, and neighboring
   modules. Reuse the repository's canonical helpers and architectural rules.
2. Look for a code-judo move: can a state model, ownership boundary, or direct
   data shape remove whole branches or helper layers instead of merely moving
   them?
3. Check the implementation in this order:
   - **Structure:** responsibilities, module boundaries, coupling, and
     canonical ownership.
   - **Control flow:** ad-hoc flags, repeated conditionals, special cases,
     unnecessary sequential orchestration, and partial updates.
   - **Contracts:** explicit types, meaningful invariants, avoidable `any`,
     casts, optionality, or magic fallbacks.
   - **Size and duplication:** file growth toward or past 1,000 lines,
     duplicated logic, thin wrappers, and abstractions that do not earn their
     indirection.
   - **Proof:** tests that exercise the changed behavior and evidence that the
     proposed restructuring preserves it.
4. Prefer deletion, a smaller model, a focused helper, or a canonical layer
   over cosmetic renaming or a new generic abstraction.

## Findings

Report only high-conviction findings. For each one include:

- severity: blocker, high, medium, low, or note;
- exact file and symbol/line evidence;
- the structural risk, not just a style preference;
- the smallest concrete remedy that reduces concepts or coupling;
- the proof needed after the remedy.

Separate correctness, security, maintainability, and cosmetic observations.
Call out what passed and list `NOT RUN` or `BLOCKED` evidence explicitly.

## Boundaries

Do not modify code during a review unless the user explicitly asks for the
fix. Do not approve merely because tests are green, and do not demand an
abstraction without a concrete ownership or complexity problem. Do not flood
the report with naming nits while a file is becoming a monolith or a feature is
leaking through the wrong layer.

## Deliverable

Return: scope and intent, prioritized findings, structural strengths, required
proof, and a minimal remediation sequence. If no blocker remains, say why the
current shape is maintainable rather than giving a generic approval.
