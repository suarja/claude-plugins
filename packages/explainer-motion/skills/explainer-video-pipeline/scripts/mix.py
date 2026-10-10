"""Synthesize the sound effects and mix them under the rendered voice.

usage: python3 -I mix.py <project dir> <in.mp4> <out.mp4>

Events come from build/sfx.json (written by build.ts). The effects are
synthesized with ffmpeg into build/sfx/ the first time: no sample library, no
licence question. Replace a file in build/sfx/ with a real sample to upgrade it.
"""
import json, os, subprocess, sys

d, src, out = sys.argv[1:4]
sfx_dir = os.path.join(d, "build", "sfx")
os.makedirs(sfx_dir, exist_ok=True)
FF = ["ffmpeg", "-hide_banner", "-loglevel", "error", "-y"]
SYNTH = {
    "pop": ["-f", "lavfi", "-i", "aevalsrc='0.6*sin(2*PI*(900-5200*t)*t)*exp(-28*t)':s=44100:d=0.14"],
    "tick": ["-f", "lavfi", "-i", "aevalsrc='0.35*sin(2*PI*2400*t)*exp(-90*t)':s=44100:d=0.06"],
    "blip": ["-f", "lavfi", "-i", "aevalsrc='0.22*sin(2*PI*(380+900*t)*t)*exp(-30*t)':s=44100:d=0.1"],
    "click": ["-f", "lavfi", "-i", "anoisesrc=d=0.04:c=white:a=0.5", "-af", "afade=t=out:st=0:d=0.04,highpass=f=1500"],
    "whoosh": ["-f", "lavfi", "-i", "anoisesrc=d=0.35:c=pink:a=0.6", "-f", "lavfi", "-i",
               "aevalsrc='0.7*sin(2*PI*(110-120*t)*t)*exp(-14*t)':s=44100:d=0.35", "-filter_complex",
               "[0]bandpass=f=1200:w=900,afade=t=in:d=0.22,afade=t=out:st=0.22:d=0.13[n];[1]adelay=220|220[k];[n][k]amix=inputs=2:normalize=0,volume=1.2",
               "-ar", "44100", "-ac", "1"],
    "swell": ["-f", "lavfi", "-i", "anoisesrc=d=0.6:c=pink:a=0.5", "-af", "lowpass=f=900,afade=t=in:d=0.35,afade=t=out:st=0.35:d=0.25"],
}
for k, a in SYNTH.items():
    p = os.path.join(sfx_dir, k + ".wav")
    if not os.path.exists(p):
        subprocess.run(FF + a + [p], check=True)

ev = json.load(open(os.path.join(d, "build", "sfx.json")))
gain = {"pop": .55, "tick": .45, "blip": .5, "click": .6, "whoosh": .7, "swell": .6}
args = FF + ["-i", src]
for e in ev:
    args += ["-i", os.path.join(sfx_dir, e["kind"] + ".wav")]
f = []
for k, e in enumerate(ev, start=1):
    ms = max(0, int(e["t"] * 1000))
    f.append(f"[{k}]adelay={ms}|{ms},volume={gain[e['kind']]}[s{k}]")
f.append("[0:a]" + "".join(f"[s{k}]" for k in range(1, len(ev) + 1)) + f"amix=inputs={len(ev)+1}:normalize=0:duration=first,alimiter=limit=0.95[a]")
args += ["-filter_complex", ";".join(f), "-map", "0:v", "-map", "[a]", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", out]
subprocess.run(args, check=True)
print("✓", out, len(ev), "sound events")
