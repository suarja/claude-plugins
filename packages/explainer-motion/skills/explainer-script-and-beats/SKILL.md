---
name: explainer-script-and-beats
description: Write the 20–45 second voice-over script of a mascot explainer video and its beats.json — which pose, card, title or background lands on which phrase. Use when starting an explainer or app-promo video in the explainer-video-pipeline format, when its rhythm feels flat, or when the script changes and the beats must follow.
---

# Script and beats

## The script

`script.txt`, one line per phrase that deserves its own visual. Lines starting with `#`
are ignored. Aim for 90–130 words (≈ 30 s at 190–245 words/min). The author of the
format sums up what matters, in order: **subject, hook, rhythm**.

Structure that works for a product:

1. **Hook** (first 2 s): a situation the viewer recognises, or a number. "Tu regardes
   un débat politique de quarante minutes…"
2. **Pain**: what goes wrong, in their words. One or two lines.
3. **Reveal**: "Alors on a créé <Product>." — one short line, it gets the title and
   a background change.
4. **How it works**: 3–5 lines, one concrete action each (paste the link, get the
   summary, tap a word…). Each line is a card.
5. **Offer**: the free trial, the price, the first-use gift. One line.
6. **CTA that asks for a comment**, not a like: "Dis-moi en commentaire quelle vidéo
   tu veux décoder." Comments feed the algorithm and the next video.

Rules:

- Spoken language, second person, short words. Read it aloud; cut every line that
  needs a breath in the middle.
- Speak outcomes, not features or internal vocabulary. A domain word the viewer has
  never heard is a defect.
- Every claim about the product must be true today. Mark a target ("in a minute")
  as something to verify before publishing.
- Write numbers in words when the voice must say them ("quarante minutes"); the title
  can show "40 MIN".
- Keep the real spelling of the product name: captions print `script.txt`. If a
  synthetic voice mispronounces it, respell it only in the text sent to the voice
  (see `explainer-voiceover`).

## The beats

`beats.json` is an ordered array. Each beat is anchored on a phrase of the script with
`at` (whole words, punctuation ignored, searched after the previous beat). Never on
seconds: the same beats survive a new voice.

```json
[
  { "at": "Tu regardes", "pose": "ennui", "card": "player", "props": { "tag": "DÉBAT · EN DIRECT", "total": "40:00" } },
  { "at": "quarante minutes", "title": "<em>40</em> MIN" },
  { "at": "et à la fin", "pose": "perdu", "card": null },
  { "at": "créé Presi", "pose": "fier", "title": "PRESI", "bg": "brand" },
  { "at": "Tu colles", "pose": "telephone", "card": "input", "bg": null, "steps": ["YouTube", "TikTok"],
    "props": { "label": "LIEN DE LA VIDÉO", "text": "youtube.com/watch?v=débat", "button": "DÉCODER" } }
]
```

| Key | Effect | Holds until |
| --- | --- | --- |
| `pose` | swaps the mascot sticker (file `character/cut/<pose>.png`) | next `pose` |
| `card` + `props` + `steps` | a card from `explainer-video-pipeline/references/cards.md`; `null` clears | next `card` |
| `title` | a huge word replacing the caption; `<em>` = accent, `<sup>` allowed | next beat of any kind |
| `bg` | `brand`, `accent` or `ink` full-screen background; `null` returns to paper | next `bg` |

Rhythm rules, from the reference videos:

- A new pose, card, title or card step at least every ~1–1.5 s. The build prints the
  longest still stretch; above ~2 s add a pose beat or a step.
- The pose illustrates the words of its phrase, literally: "toi" → pointing at the
  viewer, "offerte" → holding a gift, "bloque" → confused. If no pose fits, add one
  to `character/poses.tsv` rather than reusing a vague one.
- Titles only on 2–4 key nouns or numbers per video, ≤ 9 characters when possible.
- One background change, at the reveal.
- A card needs at least ~0.8 s on screen; shorter, merge it with the next beat.

Then list every pose the beats use: that list is the input of `explainer-mascot-poses`.
