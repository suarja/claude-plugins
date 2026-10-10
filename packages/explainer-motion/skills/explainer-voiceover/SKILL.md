---
name: explainer-voiceover
description: Produce the voice-over of a mascot explainer video and its word-level timings — from the user's own recording, a free local voice clone in VoiceStudio, ElevenLabs, or a macOS placeholder — then check it says the script. Use when an explainer-video-pipeline project needs its narration, when the user wants to clone their voice, change provider, fix a mispronounced name, or speed the delivery up.
---

# Voice-over

Every provider writes `voice/narration.wav`, then the same step transcribes it word by
word (`voice/transcript.json`) and compares it with `script.txt`. The video build only
reads those two files, so changing provider never touches the beats.

```bash
python3 -I <skill>/scripts/voice.py <provider> <project> [options]
```

## Choose with the user

| Provider | Cost | Quality / effort | Use when |
| --- | --- | --- | --- |
| `recording` | free | best, their real voice; needs a quiet room and one clean read | they are fine speaking; the format's author uses his own voice |
| `voicestudio` | free, local | a clone of their voice from ~15 s of reference; 2–4 min per generation on Apple Silicon | they want their voice without re-recording each script |
| `elevenlabs` | paid API | studio clone or stock voice, fast | they already have an ElevenLabs voice or want a stock voice |
| `say` | free | robotic | placeholder to build and time the video before the real voice exists. Never publish |

Clone only a voice the user owns or has permission to use.

## recording

Ask for one read of `script.txt` in a quiet room, phone or USB mic 15–20 cm away, a
bit faster and more energetic than conversation. Then:

```bash
python3 -I voice.py recording <project> --file take.m4a
```

Silences are shortened to 0.25 s and loudness normalised. Mistakes and retakes stay:
read the fidelity report, cut them by hand (`ffmpeg -ss/-to` and concat) or re-read
the line, then `voice.py transcribe <project>`.

## voicestudio (local clone)

Setup, once (the user's machine, with their consent for each download):

1. Download `VoiceStudio-Electron-<version>-mac-arm64.dmg` from
   github.com/debpalash/VoiceStudio/releases (≈ 250 MB), compare its SHA-256 with the
   release's `SHA256SUMS.txt`, copy `VoiceStudio.app` to `/Applications`. It is not
   notarised: first launch is right-click → Open. Leave the analytics prompt to them.
2. In the app, accept the clone model install (OmniVoice, ≈ 2.4 GB; ≈ 10 GB in all
   with its Python runtime). Intel Macs cannot run the backend.
3. The user records a profile in **Voice cloning**: 30–60 s of natural speech, ideally
   in the tone of the videos. They tell you its name.

Generate:

```bash
python3 -I voice.py voicestudio <project> --profile "Jason 1" [--speed 1.1]
```

The backend listens on `http://127.0.0.1:3900`. The engine keeps at most ~20 s of
reference and needs the exact transcript of that window (or an STT model selected in
the app, otherwise `/generate` fails with "Automatic reference transcription needs an
installed speech-to-text model"). The script handles it: it downloads the profile's
audio, transcribes it, cuts a window of whole sentences (8–18 s) into
`voice/reference.wav`, and sends it with its text.

**The window changes the result.** Measured on one profile: an automatic 15 s window
gave 145 words/min and 16 % divergence from the script (words changed); a hand-picked
13 s sentence spoken fluently gave 188 words/min and 4 %. The script prints the
candidate windows; when the report is above ~10 % or the pace drags, retry with
another one:

```bash
python3 -I voice.py voicestudio <project> --profile "Jason 1" --ref-start 34.5 --ref-end 47.4
```

Pick a sentence said in one breath, with no restart or hesitation.

## elevenlabs

```bash
export ELEVENLABS_API_KEY=...
python3 -I voice.py elevenlabs <project> --voice-id <id> [--model eleven_multilingual_v2] [--speed 1.1]
```

The voice id is in the ElevenLabs voice library (their cloned voice or a stock one).
`eleven_multilingual_v2` handles French and most languages.

## say (placeholder)

```bash
python3 -I voice.py say <project> --voice Jacques     # `say -v '?'` lists voices per language
```

Use it to build and review the video while the real voice is pending.

## Pronunciation and pace

- A name said wrong by a synthetic voice: add a respelling in `project.json`,
  `"voice": { "pronounce": { "Presi": "Prési" } }`. It changes only the text sent to the
  voice; captions keep the script's spelling.
- Pace: the reference videos run 190–245 words/min. The report prints the rate; use
  `--speed 1.1`–`1.2` (VoiceStudio, ElevenLabs) when it drags.

## The report

```
✓ voice/transcript.json · 98 words · 30.4s · 193 words/min
  difference with script.txt: 4%
  pauses over 0.6s: [...]
```

Names and numbers spelled differently by speech-to-text are normal (the build aligns
them back to the script). Above ~15 %, listen: words were skipped, changed or invented.
Then let the user listen before rendering the final: whether a clone sounds like them
is their call, not the report's.
