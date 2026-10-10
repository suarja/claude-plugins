"""Produce voice/narration.wav for an explainer project, then its word timings.

usage (always with python3 -I):
  voice.py voicestudio <project> --profile "<name>" [--ref-start S --ref-end S] [--speed 1.1]
                                                         local clone, VoiceStudio app running
  voice.py elevenlabs  <project> --voice-id <id>         needs ELEVENLABS_API_KEY
  voice.py recording   <project> --file take.wav         the user's own read of script.txt
  voice.py say         <project> [--voice Jacques]       macOS placeholder, never published
  voice.py transcribe  <project>                         timings + fidelity check only

Every provider ends with `transcribe`: voice/transcript.json (word-level, via
`npx hyperframes transcribe`) and a fidelity report against script.txt.
The language comes from project.json "lang" (default en).
"""
import argparse, json, os, re, subprocess, sys, unicodedata, urllib.request

def sh(*a, **k):
    return subprocess.run(list(a), check=True, **k)

def project(p):
    cfg = json.load(open(os.path.join(p, "project.json")))
    os.makedirs(os.path.join(p, "voice"), exist_ok=True)
    return cfg

def script_text(p):
    lines = [l.strip() for l in open(os.path.join(p, "script.txt")) if l.strip() and not l.startswith("#")]
    return " ".join(lines)

def spoken_text(p, cfg):
    """script.txt with project.json voice.pronounce respellings (e.g. {"Presi": "Prési"}) for synthetic voices."""
    t = script_text(p)
    for k, v in (cfg.get("voice", {}).get("pronounce") or {}).items():
        t = re.sub(rf"\b{re.escape(k)}\b", v, t)
    return t

def norm(s):
    s = unicodedata.normalize("NFD", s.lower())
    return re.sub(r"[^a-z0-9']", "", "".join(c for c in s if unicodedata.category(c) != "Mn"))

def to_wav(src, dst, rate=44100):
    sh("ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", src, "-ac", "1", "-ar", str(rate), dst)

def words_of(transcript_path):
    d = json.load(open(transcript_path))
    return d if isinstance(d, list) else d["words"]

def run_transcribe(audio, out_dir, lang):
    os.makedirs(out_dir, exist_ok=True)
    # Never an ".en" model for another language: it would translate instead of transcribe.
    model = "small.en" if lang == "en" else "small"
    sh("npx", "hyperframes", "transcribe", os.path.abspath(audio), "-d", os.path.abspath(out_dir), "-m", model, "-l", lang,
       stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    return os.path.join(out_dir, "transcript.json")

def transcribe(p, cfg):
    audio = os.path.join(p, "voice", "narration.wav")
    t = run_transcribe(audio, os.path.join(p, "voice"), cfg.get("lang", "en"))
    heard = [norm(w["text"]) for w in words_of(t)]
    said = [norm(w) for w in script_text(p).split() if norm(w)]
    # word error rate by edit distance
    d = list(range(len(heard) + 1))
    for i, a in enumerate(said, 1):
        prev, d[0] = d[0], i
        for j, b in enumerate(heard, 1):
            prev, d[j] = d[j], min(d[j] + 1, d[j - 1] + 1, prev + (a != b))
    wer = d[-1] / max(1, len(said))
    w = words_of(t)
    dur = w[-1]["end"]
    pauses = [(round(a["end"], 2), round(b["start"] - a["end"], 2)) for a, b in zip(w, w[1:]) if b["start"] - a["end"] > 0.6]
    print(f"✓ voice/transcript.json · {len(w)} words · {dur:.1f}s · {len(w) / dur * 60:.0f} words/min")
    print(f"  difference with script.txt: {wer:.0%} (names and numbers spelled differently are normal; above ~15% listen for skipped or invented words)")
    if pauses:
        print(f"  pauses over 0.6s: {pauses} — cut them (recording) or regenerate")

def best_window(words, max_s=18.0, min_s=8.0):
    """Longest run of whole sentences that fits the cloning engine's reference limit."""
    ends = [i for i, w in enumerate(words) if re.search(r"[.!?]$", w["text"])]
    starts = [0] + [i + 1 for i in ends if i + 1 < len(words)]
    best = None
    for s in starts:
        for e in ends:
            if e < s:
                continue
            span = words[e]["end"] - words[s]["start"]
            if min_s <= span <= max_s and (not best or span > best[2]):
                best = (s, e, span)
    if not best:  # no sentence punctuation: take the first max_s seconds of words
        e = max(i for i, w in enumerate(words) if w["end"] - words[0]["start"] <= max_s)
        best = (0, e, words[e]["end"] - words[0]["start"])
    return best

def voicestudio(p, cfg, a):
    base = a.url.rstrip("/")
    try:
        urllib.request.urlopen(base + "/health", timeout=5).read()
    except Exception:
        sys.exit("VoiceStudio is not running: open the app (its backend listens on :3900) and retry.")
    profiles = json.load(urllib.request.urlopen(base + "/profiles"))
    profiles = profiles if isinstance(profiles, list) else profiles.get("profiles", [])
    prof = next((x for x in profiles if x["name"] == a.profile or x["id"] == a.profile), None)
    if not prof:
        sys.exit(f"No VoiceStudio profile named {a.profile!r}. Profiles: {[x['name'] for x in profiles]}")
    v = os.path.join(p, "voice")
    full = os.path.join(v, "reference-full.wav")
    with open(full, "wb") as f:
        f.write(urllib.request.urlopen(f"{base}/profiles/{prof['id']}/audio").read())
    # The engine keeps at most ~20 s of reference and needs that window's exact transcript,
    # or a speech-to-text model selected in the app. Cut a clean window ourselves and send its text.
    rw = words_of(run_transcribe(full, os.path.join(v, "reference"), cfg.get("lang", "en")))
    if a.ref_start is not None and a.ref_end is not None:
        inside = [i for i, w in enumerate(rw) if w["start"] >= a.ref_start - 0.05 and w["end"] <= a.ref_end + 0.05]
        s, e = inside[0], inside[-1]
    else:
        s, e, _ = best_window(rw)
    cands = [(round(rw[i]["start"], 1), round(rw[j]["end"], 1)) for i in range(len(rw)) for j in range(i, len(rw))
             if (i == 0 or re.search(r"[.!?]$", rw[i - 1]["text"])) and re.search(r"[.!?]$", rw[j]["text"])
             and 8 <= rw[j]["end"] - rw[i]["start"] <= 18]
    print(f"  other sentence windows (--ref-start/--ref-end): {cands}")
    t0, t1 = max(0, rw[s]["start"] - 0.15), rw[e]["end"] + 0.25
    ref = os.path.join(v, "reference.wav")
    sh("ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", full, "-ss", str(t0), "-to", str(t1), "-ac", "1", ref)
    ref_text = " ".join(w["text"] for w in rw[s:e + 1])
    print(f"  reference window {t0:.1f}–{t1:.1f}s: “{ref_text[:90]}…”")
    lang_name = {"fr": "French", "en": "English", "es": "Spanish", "de": "German", "it": "Italian", "pt": "Portuguese"}.get(cfg.get("lang", "en"), "Auto")
    out = os.path.join(v, "generated.wav")
    sh("curl", "-sf", "-m", "1200", "-X", "POST", base + "/generate",
       "-F", f"text={spoken_text(p, cfg)}", "-F", f"ref_audio=@{ref}", "-F", f"ref_text={ref_text}",
       "-F", f"language={lang_name}", "-F", f"seed={a.seed}", "-F", f"speed={a.speed}", "-o", out)
    to_wav(out, os.path.join(v, "narration.wav"))
    transcribe(p, cfg)

def elevenlabs(p, cfg, a):
    key = os.environ.get("ELEVENLABS_API_KEY")
    if not key:
        sys.exit("Set ELEVENLABS_API_KEY (ElevenLabs → Profile → API keys).")
    body = json.dumps({"text": spoken_text(p, cfg), "model_id": a.model,
                       "voice_settings": {"stability": 0.45, "similarity_boost": 0.8, "speed": a.speed}}).encode()
    req = urllib.request.Request(f"https://api.elevenlabs.io/v1/text-to-speech/{a.voice_id}?output_format=mp3_44100_128",
                                 data=body, headers={"xi-api-key": key, "Content-Type": "application/json"})
    mp3 = os.path.join(p, "voice", "generated.mp3")
    with open(mp3, "wb") as f:
        f.write(urllib.request.urlopen(req, timeout=300).read())
    to_wav(mp3, os.path.join(p, "voice", "narration.wav"))
    transcribe(p, cfg)

def recording(p, cfg, a):
    # Trim leading/trailing silence and shorten inner silences to 0.25 s; mistakes are cut by hand
    # after reading the fidelity report (or re-read the line).
    sh("ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", a.file, "-af",
       "silenceremove=start_periods=1:start_threshold=-45dB:stop_periods=-1:stop_duration=0.25:stop_threshold=-45dB,loudnorm=I=-16:TP=-1.5",
       "-ac", "1", "-ar", "44100", os.path.join(p, "voice", "narration.wav"))
    transcribe(p, cfg)

def say(p, cfg, a):
    aiff = os.path.join(p, "voice", "placeholder.aiff")
    sh("say", *(["-v", a.voice] if a.voice else []), "-r", str(a.rate), "-o", aiff, spoken_text(p, cfg))
    to_wav(aiff, os.path.join(p, "voice", "narration.wav"))
    print("  placeholder voice: for timing only, never publish it")
    transcribe(p, cfg)

ap = argparse.ArgumentParser()
sub = ap.add_subparsers(dest="cmd", required=True)
x = sub.add_parser("voicestudio"); x.add_argument("project"); x.add_argument("--profile", required=True)
x.add_argument("--ref-start", type=float); x.add_argument("--ref-end", type=float)
x.add_argument("--url", default="http://127.0.0.1:3900"); x.add_argument("--seed", type=int, default=7); x.add_argument("--speed", type=float, default=1.0)
x = sub.add_parser("elevenlabs"); x.add_argument("project"); x.add_argument("--voice-id", required=True)
x.add_argument("--model", default="eleven_multilingual_v2"); x.add_argument("--speed", type=float, default=1.0)
x = sub.add_parser("recording"); x.add_argument("project"); x.add_argument("--file", required=True)
x = sub.add_parser("say"); x.add_argument("project"); x.add_argument("--voice", help="a voice from `say -v '?'` matching the language"); x.add_argument("--rate", type=int, default=230)
x = sub.add_parser("transcribe"); x.add_argument("project")
a = ap.parse_args()
P = os.path.abspath(a.project)
C = project(P)
{"voicestudio": voicestudio, "elevenlabs": elevenlabs, "recording": recording, "say": say,
 "transcribe": lambda p, c, _: transcribe(p, c)}[a.cmd](P, C, a)
