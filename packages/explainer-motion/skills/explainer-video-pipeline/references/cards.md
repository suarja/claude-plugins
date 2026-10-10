# Card library

A beat sets `"card": "<type>"` and its copy in `"props"`. `"steps"` are script phrases
(searched from the beat's anchor onwards) whose start times drive the card's inner
moments. A card stays until the next beat that sets `card` (use `"card": null` to clear).
Missing props fall back to English placeholders — always pass real copy.

| Type | Props | Steps |
| --- | --- | --- |
| `player` | `tag`, `time`, `total`, `image` (thumbnail), `from`, `to` (progress 0–1); for a jump: `jumpTo`, `jumpLabel` | 1: the jump |
| `chips` | `items[]` (≤ 6 floating jargon pills), `highlight` (index in accent), `mark` (e.g. "?") | first: chips pop; last: the mark |
| `input` | `label`, `text` (typed), `button`, `buttonAfter` (label after the click) | last: cursor clicks the button |
| `summary` | `label`, `badge` (e.g. "0:58"), `lines` (widths in %) | — |
| `stack` | `rows[]` of `{label, color}` (color: accent, brand, ink) | one per row: its label appears |
| `quote` | `text` with `*marked part*`, `source` | 1: the marker sweep |
| `glossary` | `sentence` with one `[term]`, `definition` | 1: tap on the term; 2: definition bubble |
| `comment` | `placeholder`, `text` (typed) | 1: typing starts |
| `phone` | `image` (a real app screenshot, listed in project `assets`), `callouts[]` (≤ 3) | one per callout |
| `logos` | `items[]` of `{image, label}` (≤ 3) | one per logo |

Example beat:

```json
{ "at": "Tu colles", "pose": "telephone", "card": "input", "steps": ["YouTube", "TikTok"],
  "props": { "label": "LIEN DE LA VIDÉO", "text": "youtube.com/watch?v=débat", "button": "DÉCODER", "buttonAfter": "DÉCODAGE…" } }
```

For an app promo, prefer `phone` with a real screenshot over a mock card when the
claim is about the product's own screen: viewers trust the real interface.

Adding a card type: one entry in `CARDS` in `scripts/build.ts` (HTML + its GSAP tweens,
transforms and opacity only) and its CSS in `scripts/template.html`, then a row here.
Keep the house rules: 6 px ink border, hard offset shadow, 22 px radius, text ≥ 32 px.
