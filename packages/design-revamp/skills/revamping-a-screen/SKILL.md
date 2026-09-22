---
name: revamping-a-screen
description: Orchestrer la refonte d'une interface depuis l'intention et la référence nommée jusqu'au canevas accepté, puis à l'implémentation et à la comparaison visuelle. Use when a screen must be redesigned without losing a traceable decision.
---

# Revamping a screen

This is the orchestration skill. It composes design-bank and canvas-generation; it does not replace either one. The same brief must be understandable by Claude Code, Codex, or another harness.

## Non-negotiable boundary

Do not begin production implementation from a vague inspiration. Do not change product mechanics, copy, tokens, or information architecture without naming the decision and obtaining the project's required approval. A build, a passing test, or a model's preference is not visual acceptance.

Follow the host project's direction, language, accessibility, and delivery rules. Keep all project-specific commands and paths in the host project; do not bake them into this portable skill.

## Sequence

1. **Frame the question.** State the surface, the reader's job, the observed problem, the intended change, the target viewport, and the decision this revamp must settle. Record exclusions and assumptions.
2. **Inspect the current state.** Use the real screen and real data when possible. Capture the starting surface and note the longest copy, missing state, loading state, error state, and narrow or wide target that can expose a defect.
3. **Name the reference.** Invoke design-bank. Search by the same canonical fields, inspect the returned image, record its provenance, and explain which hierarchy or interaction it teaches. An unnamed inspiration is not a reference.
4. **Specify the proposal.** Write the visual hierarchy, content order, states, transitions, and exact copy. Separate what is observed from what is proposed.
5. **Generate the canvas.** Invoke canvas-generation. Produce the editable HTML/CSS source, rendered PNG, manifest, assumptions, and exclusions. Render the principal state and the edge state. Check typography, contrast, overflow, long copy, and spacing.
6. **Pass the human gate.** Present the source and PNG with the reference and the starting capture. Record accepted, revise, or blocked and preserve the exact feedback in the gate record. Do not write product code before accepted.
7. **Implement one visible slice.** After acceptance, change only the agreed surface and states. Use project primitives, tokens, localization, and real data. Keep unrelated work untouched.
8. **Verify the result.** Run the relevant technical checks, capture the implemented surface at the same target dimensions, and use the deterministic image comparator. Inspect the largest divergences rather than hiding them behind a single score.
9. **Close the trace.** Put reference, starting capture, canvas source, canvas PNG, gate record, resulting capture, comparison, and before/after words together. Record unresolved deviations and the reason for each.

## Stop conditions

Stop and ask for a decision when the reference is not authorized, the current direction conflicts with the proposal, the canvas changes product behavior, the required copy is unknown, the gate is revise or blocked, or the target cannot be rendered reliably. Label each result PASS, FAIL, NOT RUN, or BLOCKED; never turn an unrun visual check into a pass.

## Completion

A revamp is complete only when the agreed slice is implemented, the technical checks are reported, the visual comparison is inspectable, the human decision is preserved, and the remaining deviations are explicit. A canvas alone is a proposal; a coded screen without the canvas and gate is not a traceable revamp.
