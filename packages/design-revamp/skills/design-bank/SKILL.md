---
name: design-bank
description: Organiser et rechercher des références d'interface à partir d'images, de captures ou de liens, puis conserver les leçons, les canevas et les avant/après. Use when a project needs a named design reference before a visual revamp.
---

# Design bank

Use this skill to make a visual reference searchable and traceable before a revamp. The bank is a method and an index, not a copy of a third-party catalogue.

## Boundary

The deterministic project tools ingest, validate, index, rank, compare, and record files. An agent or another vision-capable provider must inspect images and write descriptions. Do not assume Claude, a subscription, a particular API, or a particular operating system.

Never redistribute third-party screenshots or build a competing image repository from a service that does not grant that right. Keep only authorized local assets, our own before/after and canvas outputs, descriptions, provenance, and links when the source terms allow them.

## Shared library on this Mac

When the owner asks for the shared design bank, use `~/Library/Application Support/omni-desktop/design-bank/`. This is a personal folder shared across the owner's projects on this Mac, not an Omni product feature.

- Read the README and JSON index before changing anything. The current index uses the Levels grid v2; each `fichier` value is relative to the bank root and points into `assets/`.
- Open images from this shared root. Do not copy its images or index into a project, commit them, publish them, upload them, or create a second bank.
- A project's own design-bank scripts may use a project-local index. Do not assume they target the shared library: use them for shared-bank work only if they accept an explicit bank root. The current Levels commands target the Levels checkout.
- To find references, use the index's typed fields. Require the same screen type, add one point for each match in visual mass, palette, and axis, add quality divided by three, then sort ties by id. Apply requested component filters before ranking, and inspect the top image files before selecting them.
- To ingest an image, inspect the actual image, check for a duplicate using its file hash, then preserve it under `assets/` and add a record matching an existing index entry. Use the first eight characters of its SHA-256 hash for the id and filename, keep its file path relative to the bank root, retain source/date/note/provider and the full grid, and sort records by date then id. Re-read the index and verify each referenced image exists.
- If the shared folder or its record schema is unavailable, stop and report that; do not silently create another bank, install a database, or upload the images.

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

1. Identify whether the owner means the shared library above or a project's own bank. Use the correct root.
2. Locate the deterministic ingest command for that root and read its help. It should accept a local image, an authorized image URL, a list of links, or a folder, hash the asset, preserve provenance, and be idempotent.
3. List pending assets before describing them. Do not describe an asset that was not actually inspected.
4. Inspect each pending image at a practical size. Describe it in the canonical order above, then validate and persist the record through the command or, for the shared library on this Mac, follow the direct-index procedure above. Never use a filename or URL as a substitute for looking.
5. For a page or gallery, extract only authorized image sources. Do not sign in, scrape around access controls, or retain a source's protected catalogue for redistribution.
6. Commit project-local indexes and assets together. The shared library remains in its local application-support folder and is not committed to a project.

For bulk work, use a provider or sub-agent only when the same schema and the same control examples are used. Record the provider and model so descriptions can be compared later.

## Find

Before a revamp:

1. Look at the screen to revamp (its capture, canvas, or intent) and fill the four ranking fields for it.
2. Search with the deterministic ranker. Require the same screen type when the schema says it is mandatory; use the remaining fields, component filters, text, motifs, and description to narrow results. For the shared library on this Mac, use the ranking procedure above.
3. Open the top results, inspect their actual images, and name the selected reference in the revamp record. If no result is credible, ingest or request an authorized reference; never claim an unnamed visual inspiration.
4. Keep the selected reference beside the later canvas and capture.

## Before/after and canvas trace

After a human accepts a revamp, compose the before and after with the owner's exact words when available. Keep the source capture, resulting capture, rendered canvas, and provenance together.

Every canvas must retain both its editable HTML source and its rendered PNG. Register it through the project's existing trace command when one exists. A PNG without its source or decision is not a complete record.

## Comparison

Use the project's deterministic image comparison after the screen is built. It should report renderer dimensions, broad pixel difference, perceptual distance, and the areas with the largest divergence. Use a model only to name a difference after deterministic measurement; do not use model agreement as the visual gate.

## Provider seam

A local classifier such as Laya may classify an existing text description into closed fields. It cannot replace image inspection, description writing, canvas generation, or the human gate. Keep the provider behind the project's record contract and measure it on accepted examples before switching providers.

## Completion

A reference-bank task is complete only when the asset is authorized, described, validated, searchable, linked to its source, and accompanied by the lesson that makes it reusable. An image merely downloaded or an entry merely placed in JSON is incomplete.

## Levels repository adapter

Use this addition only when working in the Levels repository and the owner wants its repository-local design bank. If the owner asks for the shared library on this Mac, follow the shared-library workflow above; the Levels scripts below write to the Levels checkout, not to the shared library.

The Levels grid lives in design-bank/grille.ts. Its scripts are design-bank/ingest.ts, design-bank/find.ts, design-bank/avant-apres.ts, design-bank/canevas.ts, and design-bank/comparer.ts. The local index is design-bank/index.json, versioned together with design-bank/images/.

### Ingest in Levels

1. Run:
   ~~~sh
   bun run design-bank/ingest.ts <source>... --note "<studio or app>"
   ~~~
   A source may be an image file, an authorized image URL, a text file of links (one per line; lines beginning with # are comments), or a folder. The command hashes the asset, stores it as images/<sha8>.<ext>, and creates a pending entry.
2. Run bun run design-bank/ingest.ts --en-attente to list pending ids and grid fields.
3. Inspect every actual image before describing it. For a batch, create a 640 px scratchpad copy with sips -Z 640. Describe in this order: description; ecran; masse (one visual mass); palette; axe; composants (all visible items from the vocabulary, with extras in autresComposants); elements in top-to-bottom order separated by « · »; visible texte; searchable motifs; one-sentence lecon; qualite (0 blurred or paywalled, 1 legible, 2 clean, 3 reference); app, studio, avantApres, and plateforme (mobile, tablette, web, desktop, montre).
4. Write the JSON to a scratch file, then run:
   ~~~sh
   bun run design-bank/ingest.ts --decrire <id> --grille "<json>"
   ~~~
   Zod rejects unknown values. A component found three times in autresComposants may enter the vocabulary only with the owner's approval. The description is the pivot: --manque <field> lists missing values, and --completer <field>=<value> <ids...> fills them from existing descriptions without reopening images.
5. For more than twenty pending images, delegate a batch using this skill and its pending ids; the agent must inspect and describe them with --par agent.
6. For a page such as an X post or gallery, inspect it in the built-in browser and use only authorized image sources. A page behind sign-in is for the owner to fetch; never sign in or work around access controls. Re-encoded duplicates may have different hashes, so inspect before describing and remove duplicates deliberately.
7. Commit the local index.json and its images together.

### Find and record revamps in Levels

For the local Levels bank, run:
~~~sh
bun run design-bank/find.ts --grille '{"ecran":"paywall","masse":"nombre","palette":"nuit","axe":"centre"}' [--n 4] [--composants offre,benefices] [--mot "free trial"]
~~~
The same ecran is mandatory; award one point for each matching masse, palette, and axe, then use quality/3 as a tiebreaker and id for deterministic ties. Apply component filters before ranking. --mot searches visible text, motifs, and description. A plain-language request can provide the same four fields. Inspect top result images, name selected references in the revamp record, and copy them beside the tranche captures in docs/captures/<tranche>/. If no result is credible, ingest or ask for authorized references.

For each accepted revamp gate, compose the before and after using the owner's exact words when available:
~~~sh
bun run design-bank/avant-apres.ts <name> <before.png> <after.png> --ecran paywall --mots "owner's words"
~~~
This records the pair in avant-apres/paires.json and ingests it with avantApres: true; then describe it like any other image.

Record each editable canvas and rendered PNG when created:
~~~sh
bun run design-bank/canevas.ts <slug> <canvas.html> --ecran <screen> --mots "..."
~~~
This records it in canevas/index.json and ingests the PNG. Keep its source, render, and decision together.

At the comparison step:
~~~sh
bun run design-bank/comparer.ts <capture.png> <canvas-column.png> [--diff diff.png]
~~~
It resamples to 402 px wide and reports mean pixel gap, diverging-pixel share, dHash distance, and the most divergent 40 pt bands. A diff map is optional. Use deterministic measurements to locate a difference; a model may name it afterwards. The crop used by the current Levels canvas is c.crop(((40+442*i)*2, 80, (40+442*i)*2+804, 80+1748)).

The optional API description route (--par api --modele haiku|sonnet) is not built. The par field records which route described an entry for possible future comparisons.
