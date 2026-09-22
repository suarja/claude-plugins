---
name: design-bank
description: Organiser et rechercher des références d'interface à partir d'images, de captures ou de liens, puis conserver les leçons, les canevas et les avant/après. Use when a project needs a named design reference before a visual revamp.
---

# Design bank

Use this skill to make a visual reference searchable and traceable before a revamp. The bank is a method and an index, not a copy of a third-party catalogue.

## Boundary

The deterministic project tools ingest, validate, index, rank, compare, and record files. An agent or another vision-capable provider must inspect images and write descriptions. Do not assume Claude, a subscription, a particular API, or a particular operating system.

Never redistribute third-party screenshots or build a competing image repository from a service that does not grant that right. Keep only authorized local assets, our own before/after and canvas outputs, descriptions, provenance, and links when the source terms allow them.

## Canonical record

The description is the pivot. Write it first, honestly, from top to bottom. Closed fields must be derived from that description, not guessed independently:

- screen type;
- visual mass;
- palette;
- axis;
- visible components;
- ordered elements;
- visible copy;
- searchable motifs;
- lesson;
- quality;
- platform, app, studio, source, date, and author/provider.

Keep the record schema in the project's design-bank module. Reject unknown vocabulary values instead of silently inventing new ones.

## Ingest

1. Locate the project's deterministic ingest command and read its help. It should accept a local image, an authorized image URL, a list of links, or a folder, hash the asset, preserve provenance, and be idempotent.
2. List pending assets before describing them. Do not describe an asset that was not actually inspected.
3. Inspect each pending image at a practical size. Describe it in the canonical order above, then validate and persist the record through the command. Never use a filename or a URL as a substitute for looking.
4. For a page or gallery, extract only authorized image sources. Do not sign in, scrape around access controls, or retain a source's protected catalogue for redistribution.
5. Commit or otherwise preserve the index and authorized local assets together. Record duplicates and rejected sources.

For bulk work, use a provider or sub-agent only when the same schema and the same control examples are used. Record the provider and model so descriptions can be compared later.

## Find

Before a revamp:

1. Inspect the current screen, capture, or intent and fill the same closed fields.
2. Search with the deterministic ranker. Require the same screen type when the schema says it is mandatory; use the remaining fields, component filters, text, motifs, and description to narrow the results.
3. Open the top results and name the selected reference in the revamp record. If no result is credible, ingest or request an authorized reference; never claim an unnamed visual inspiration.
4. Keep the selected reference beside the later canvas and capture.

## Before/after and canvas trace

After a human accepts a revamp, compose the before and after with the owner's exact words when available. Keep the source capture, resulting capture, rendered canvas, and provenance together.

Every canvas must retain both its editable HTML source and its rendered PNG. Register it through the project's existing trace command when one exists. A PNG without its source or decision is not a complete record.

## Comparison

Use the project's deterministic image comparison after the screen is built. It should report the renderer dimensions, broad pixel difference, perceptual distance, and the areas with the largest divergence. Use a model only to name a difference after the deterministic measurement; do not use model agreement as the visual gate.

## Provider seam

A local classifier such as Laya may classify an existing text description into closed fields. It cannot replace image inspection, description writing, canvas generation, or the human gate. Keep the provider behind the project's record contract and measure it on accepted examples before switching providers.

## Completion

A reference-bank task is complete only when the asset is authorized, described, validated, searchable, linked to its source, and accompanied by the lesson that makes it reusable. An image merely downloaded or an entry merely placed in JSON is incomplete.
