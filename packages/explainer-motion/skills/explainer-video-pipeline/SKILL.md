---
name: explainer-video-pipeline
description: Produce a vertical "faceless" explainer or app-promo video in which a mascot sticker changes pose on every phrase, captions light up word by word, and UI cards pop in sync with a voice-over — rendered from HTML with HyperFrames, no video-generation model. Use when the user wants a TikTok/Reels/Shorts video for a product, app or idea in this mascot-and-voice style, wants to set up a project for it, check its prerequisites, or rebuild one after changing the script, voice or beats.
---

# Explainer video pipeline

The format: one 9:16 screen. A character sticker sits at the bottom and swaps pose on
every phrase. A 2–4-word caption sits in the top third and the spoken word turns to the
accent colour. On key nouns a huge title replaces the caption. UI cards (a player, a
link being pasted, a summary, a quote, a phone screenshot…) pop in the middle, and the
mascot shrinks under them. Hard cuts and pops, not crossfades. A sound event is synced
to every entrance.

What makes it work, measured on the reference videos (Oct 2026): a visual change
about every 1.1 s, changes landing on stressed words, a pose bank whose gestures
illustrate the words ("you" → pointing at the viewer, "costs" → money on fire), and
a small, constant card vocabulary per art direction. Without the pose bank it reads
as a slideshow.

## Stages

| # | Stage | Skill | Output |
| --- | --- | --- | --- |
| 0 | Prerequisites | this one | checklist below all green |
| 1 | Script and beats | `explainer-script-and-beats` | `script.txt`, `beats.json` |
| 2 | Character and poses | `explainer-mascot-poses` | `character/ref.png`, `character/cut/*.png` |
| 3 | Voice | `explainer-voiceover` | `voice/narration.wav`, `voice/transcript.json` |
| 4 | Build, render, review | this one | `out/<label>.mp4` |

Stages 2 and 3 are independent and can run in parallel once the script exists. The
pose list in stage 2 comes from the beats in stage 1, so write the beats first.

**Gates that belong to the user**: the character design (show 3–4 directions with
2 test poses each, they pick), the script, the voice choice and whether the clone
sounds like them. Never decide taste for them; recommend, then wait.

## 0. Prerequisites

Check each before starting; say what is missing and how to get it.

- `bun`, `ffmpeg`/`ffprobe`, `node`/`npx`, `python3`.
- HyperFrames CLI: `npx hyperframes --version` (renders, transcribes, removes backgrounds;
  `npx hyperframes doctor` diagnoses the environment). First use downloads Whisper and
  the background-removal model.
- Image generation for the character: a Vercel AI Gateway key in `AI_GATEWAY_API_KEY`
  (default model `google/gemini-3-pro-image`, which keeps a character consistent across
  poses from one reference image). If the user has no key, they can bring their own
  character image and pose images; stage 2 then only cuts them out.
- Voice, one of: the user's own recording, VoiceStudio (free, local clone, Apple
  Silicon/NVIDIA), ElevenLabs (`ELEVENLABS_API_KEY`), or a macOS `say` placeholder for
  timing only. See `explainer-voiceover`.
- Optional: app screenshots (`assets/`) for the `phone` card, logos for `logos`.

## Project layout

```
<project>/
  project.json        lang, theme overrides, voice and character paths, extra assets
  script.txt          one line per beat-sized phrase (see explainer-script-and-beats)
  beats.json          poses, cards, titles, backgrounds anchored on script phrases
  character/          ref.png, poses.tsv, raw/, cut/
  voice/              narration.wav, transcript.json (+ provider leftovers)
  assets/             screenshots, logos, fonts referenced by project.json "assets"
  build/              generated HyperFrames project (never edit by hand)
  out/                <label>.mp4 + <label>.sheet.png
```

`project.json`:

```json
{
  "lang": "fr",
  "theme": { "accent": "#d9623b", "brand": "#7e9461", "brandDeep": "#5d7346",
             "serifFont": "Newsreader", "serifFontFile": "assets/fonts/Newsreader.ttf" },
  "voice": { "provider": "voicestudio", "audio": "voice/narration.wav", "transcript": "voice/transcript.json" },
  "character": { "poses": "character/cut" },
  "assets": ["assets/home.png"]
}
```

Theme keys and defaults are in `scripts/theme.default.json` (paper, ink, accent,
brand, brandDeep, card, muted, displayFont, serifFont, serifFontFile, grid,
mascotScaleUnderCard). Pick the accent and brand from the product, not from this file.
The display font must be a HyperFrames built-in (Outfit, Sora, Syne, Poppins…) or a
file listed in `assets`.

## 4. Build, render, review

```bash
<skill>/scripts/render.sh <project> v1
```

That builds `build/` from the project, renders 1080×1920 at 30 fps, mixes the
synthesized sound effects under the voice (`mix.py`), and writes `out/v1.mp4` plus
`out/v1.sheet.png` (one frame per second). A 30 s video renders in about 30 s on an M4.

`build.ts` aligns the script to the transcript, so captions print the script's spelling
even when speech-to-text writes "Prezi" or "40". It fails loudly on an anchor missing
from the script, an unknown card, or a pose without a cut-out. It prints the longest
stretch without a new pose, card, title or step: keep it at or under about 2 s.

**Review the render, not the data.** Open the contact sheet first, then grab exact
frames for anything doubtful (`ffmpeg -ss <t> -i out/v1.mp4 -frames:v 1 f.png`); a
1 fps sheet misses short events, so check a "missing" element at its step time before
calling it broken. Look for:

- a caption leaking under a title, text overflowing a card or the frame;
- a title too long for one line (shorten it, or the `long` size applies above 9 characters);
- a pose that contradicts the words, or two poses in a row that look identical;
- a card visible for less than ~0.8 s (merge the beats or move the anchor earlier);
- the mascot hidden or cropped.

Fix in `beats.json`, `script.txt` or the theme, then re-run `render.sh`. Never edit
`build/` — it is regenerated. A new voice needs no beat change: re-run stage 3, then 4.

Hand over with what to watch: pose changes on every phrase, the spoken word turning
to the accent colour, every card arriving with a pop, titles replacing the caption.

## Known traps

| Symptom | Cause / fix |
| --- | --- |
| Caption visible under a title (after editing `build.ts`) | The caption's pop tween and its hide share one element. Keep the split: the pop animates `.cap-in`, the hide sets the outer `.caption` |
| A tween seems ignored | Two tweens on the same property overlap (e.g. a slow progress fill and a jump). One property, one tween at a time |
| `hyperframes lint` warns `nested_structure_needs_subcomposition` and `timeline_track_too_dense` | Expected for this single-scene format; errors must be zero, these warnings are fine |
| Render slower than real time | The sticker outline uses `filter: drop-shadow`, which disables fast capture. Accepted |
| Placeholder voice published | `say` voices are for timing only |
