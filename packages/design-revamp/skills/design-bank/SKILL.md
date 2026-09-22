---
name: design-bank
description: The house's bank of design references — ingest an image, a link, a list of links or a folder, fill its grid by looking at it, and find the references that match a screen before a revamp. Use when the owner gives design images or links, says « banque », « références », « ingère », or before step 2 of revamping-a-screen.
---

# The design bank

A bank of design references indexed by one grid of **typed questions**
(the Jev paradigm: an instruction and one sentence per value,
`design-bank/grille.ts`, versioned), so that the reference of a screen
is **searched**, not remembered
(`docs/plans/2026-09-20-la-banque-de-design.md`). The scripts are
deterministic and never call a model; **the looking is done by an agent
on the subscription** — you, or a Sonnet subagent for a batch of twenty.

**The `description` is the pivot.** Write it first, honestly, top to
bottom, in sentences: every closed question (ecran, masse, composants,
motifs…) is answered from it, so a question added to the grid later is
answered from the descriptions already there — never by looking at the
images again (`ingest.ts --manque <champ>` lists the gaps to fill).

Files: `design-bank/grille.ts` (the grid, the only place a value is
added), `design-bank/ingest.ts`, `design-bank/find.ts`,
`design-bank/index.json` (versioned with `design-bank/images/`).

## Ingest — when he gives images or links

1. `bun run design-bank/ingest.ts <source>… --note "<studio or app>"` —
   a source is an image file, an image URL, a `.txt` of links (one per
   line, `#` comments), or a folder. It downloads with a browser UA and
   Referer (screensdesign refuses otherwise), hashes, stores
   `images/<sha8>.<ext>`, and writes a **pending** entry. Idempotent.
2. `bun run design-bank/ingest.ts --en-attente` — lists the pending ids
   with the grid in plain words.
3. **Look at each pending image** (Read the file; make a 640 px copy in
   the scratchpad first with `sips -Z 640` to keep it cheap) and fill the
   grid: `description` first (the pivot), then `ecran`, `masse` (the one
   visual mass), `palette`, `axe`, `composants` (every visible one, from
   the vocabulary; the rest in `autresComposants`), `elements` (top to
   bottom, « · » between, the way the revamping skill lists them),
   `texte` (the visible copy), `motifs` (short queryable tags), `lecon`
   (one sentence: what the image teaches whoever copies it), `qualite`
   (0 blurred or behind a paywall, 1 legible, 2 clean, 3 a reference),
   `app`, `studio`, `avantApres`, `plateforme` (mobile, tablette, web,
   desktop, montre). Write the JSON to a scratch file and:
   `bun run design-bank/ingest.ts --decrire <id> --grille "$(cat g.json)"`.
   Zod validates; an unknown value is refused — a component seen three
   times in `autresComposants` enters the vocabulary, with his yes.
   A question added to the grid: `--manque <champ>` lists the entries
   without it, `--completer <champ>=<valeur> <id>…` answers it from
   their descriptions, no re-look.
4. More than twenty pending: dispatch a Sonnet subagent with this skill
   and the list of ids; it looks and describes, `--par agent`.
5. A page rather than an image (an X post, a gallery): open it in the
   built-in browser and read the `pbs.twimg.com/media/…` sources off the
   DOM (`name=large` for the file), then ingest those URLs; a site behind
   a sign-in (paywallstudio.app) is his to fetch — never sign in.
   The sha does not see the same image re-encoded: look before
   describing, and drop a duplicate by hand (`trouvailles.md`).
6. Commit `index.json` and the images together.

## Find — before a revamp

1. Look at the screen to revamp (its capture, or its canvas) and fill
   the four ranking fields for it.
2. `bun run design-bank/find.ts --grille '{"ecran":"paywall","masse":"nombre","palette":"nuit","axe":"centre"}' [--n 4] [--composants offre,benefices] [--mot "free trial"]`
   — same `ecran` is mandatory, then one point per equal field (masse,
   palette, axe), the quality out of 3 as a tiebreaker; `--composants`
   keeps the entries that have them all, `--mot` searches the text, the
   motifs and the description. A request in plain words with no image
   (« un paywall nuit avec un nombre et deux offres ») is the same grid
   filled from the sentence, then the same call.
3. Open the top results, and take them into `revamping-a-screen` step 2
   as the named references — copy them into the tranche's
   `docs/captures/<tranche>/` beside the captures, as the skill asks.
   An empty result means: ingest first, ask him for links.

## The before/after bank — our own revamps

`bun run design-bank/avant-apres.ts <nom> <avant.png> <apres.png> --ecran paywall --mots "ses mots"`
composes `design-bank/avant-apres/<nom>.jpg` (before | after), records the
pair in `avant-apres/paires.json` with his words, and ingests the composed
image into the bank (`avantApres: true`, note « Ninon, avant/après ») —
then describe it like any image. Owner, 20 September: « commencer à avoir
une banque d'avant/après… pour réutiliser plus tard ». Do it at every gate,
from the « before » capture the revamp started with.

## The trace of every canvas

`bun run design-bank/canevas.ts <slug> <canevas.html> --ecran <ecran> --mots "…"`
copies the canvas (HTML + PNG) into `design-bank/canevas/<slug>/`, records
it in `canevas/index.json` and ingests the PNG (note « Ninon, canevas »).
Every canvas an agent draws goes there, the moment he has spoken on it.

## Compare without a model — the capture against the canvas

`bun run design-bank/comparer.ts <capture.png> <canevas-colonne.png> [--diff diff.png]`
resamples both to 402 wide (sips → BMP, read by Bun), and prints the mean
pixel gap, the share of diverging pixels, the dHash distance (0–5 same
composition, 6–15 close, beyond: another thing) and the three 40 pt bands
that diverge most; `--diff` writes a map (grey where equal, terracotta
where not). Run it at step 6 of `revamping-a-screen`: the bands tell where
to look, the map shows it, and a model that sees is only needed afterwards
to name the difference. Cut a canvas column with Pillow:
`c.crop(((40+442*i)*2, 80, (40+442*i)*2+804, 80+1748))`.

## The api path (later)

`--par api --modele haiku|sonnet` will fill the grid through the gateway
for bulk ingestion (≈ 0.4 ¢ an image with Haiku). Not built; the field
`par` already records which path described an entry so the two can be
benchmarked on the same ten control images.
