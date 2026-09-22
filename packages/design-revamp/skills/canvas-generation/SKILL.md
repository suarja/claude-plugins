---
name: "canvas-generation"
description: "Produire un canevas visuel éditable en HTML et CSS, le rendre en image, puis faire valider la proposition avant tout code produit. Use when an interface needs a named visual proposal that any harness can replay."
---

# Canvas generation

A canvas is a proposal and a decision record, not production code. Its source is editable HTML/CSS; its proof is a rendered PNG. The skill is harness-neutral: use the project's available browser renderer and file tools, without assuming Claude, a subscription, a specific API, a specific operating system, or a specific upload command.

## Boundary

The canvas answers one bounded visual question for one surface or flow. It does not silently change product mechanics, copy, information architecture, accessibility requirements, or the project's design direction. Do not implement the production screen before the owner accepts the canvas.

Use authorized references and project-owned assets. Do not redistribute protected third-party screenshots or copy a third-party catalogue into the project.

## Inputs

Before drawing, collect:

- the screen or flow to change and its current capture, if it exists;
- the user intent and the single decision the canvas must make visible;
- the named reference selected through the design-bank method;
- the project's tokens, typography, assets, language rules, and real or worst-case copy;
- the required states: loading, empty, error, long copy, narrow and wide target widths when relevant.

If the input is incomplete, record the assumption in the proposal and keep the canvas reversible.

## Workflow

1. Inspect the current surface and the selected reference. Describe the visual hierarchy in plain language: what is seen first, what is grouped, what moves, and what the reader can do.
2. Write a short intent and a state inventory. Name the objects and the reader's actions; do not use internal component names as if they were user-facing concepts.
3. Create an isolated proposal folder. Keep a self-contained canvas.html, its local styles, authorized assets, and a manifest.json containing the intent, reference provenance, target dimensions, renderer, timestamp, and provider or model when an external provider contributed.
4. Build with real project tokens and realistic copy. Show the principal state and the edge state most likely to expose a layout defect. Do not shrink type to force a row to fit.
5. Render canvas.html at the target viewport with the available Chromium-compatible renderer. Keep the exact viewport, device scale, font availability, and renderer in the manifest. Inspect the resulting canvas.png, including long copy, contrast, clipping, overflow, and spacing.
6. Present the PNG together with the intent, reference, assumptions, and exclusions. Ask for one of three decisions: accepted, revise, or blocked. Record the decision and exact words in gate.md.
7. Only after acceptance, use the canvas as the visual contract for implementation. Capture the resulting surface with real data and compare it to the canvas using the project's deterministic comparator. Put the canvas and the capture side by side in the review record.
8. Keep canvas.html, canvas.png, manifest.json, gate.md, the reference provenance, and the resulting before/after together. Register the canvas through the project design-bank trace command when one exists.

## Output contract

A complete canvas produces:

- an editable HTML/CSS source;
- a rendered PNG with known dimensions;
- a manifest with provenance and renderer details;
- a gate record with accepted, revised, or blocked status;
- a short list of states, assumptions, and exclusions;
- after implementation, a capture and a deterministic comparison.

A PNG without its source, provenance, or decision is incomplete.

## Quality gate

Before asking for acceptance, verify that the image is legible at its target size, the type follows the project's scale, spacing follows its tokens, the contrast is deliberate, long copy does not break the composition, and every shown interaction has a visible state. Prefer named project tokens over new one-off values. Report technical renderer failures separately from visual disagreement.

## Portability test

The same brief must be replayable by different harnesses. A portable result is one where another agent can open the source, render it with its available browser, understand the manifest and gate, and reproduce the same visual decision without relying on hidden conversation context.
