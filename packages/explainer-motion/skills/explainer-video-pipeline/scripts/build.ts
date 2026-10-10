#!/usr/bin/env bun
/**
 * Build the HyperFrames composition of an explainer video.
 *
 *   bun build.ts --project=<dir>
 *
 * Reads <dir>/project.json, <dir>/script.txt, <dir>/beats.json, the voice and
 * its word-level transcript, and the cut-out poses. Writes <dir>/build/
 * (index.html, assets, timing.json, sfx.json), ready for `npx hyperframes render`.
 *
 * The script is the source of the words on screen; the transcript only gives
 * their times. Speech-to-text misspells names and numbers, so script words are
 * aligned to transcript words and the captions print the script.
 *
 * A beat is anchored on a phrase of the script, never on seconds: a new voice
 * only needs a new transcript.
 */
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const arg = (n: string) => process.argv.find((a) => a.startsWith(`--${n}=`))?.slice(n.length + 3);
const DIR = arg("project")!;
const HERE = dirname(fileURLToPath(import.meta.url));
const OUTDIR = join(DIR, "build");
const project = JSON.parse(readFileSync(join(DIR, "project.json"), "utf8"));
const theme = { ...JSON.parse(readFileSync(join(HERE, "theme.default.json"), "utf8")), ...(project.theme ?? {}) };
const AUDIO = join(DIR, project.voice?.audio ?? "voice/narration.wav");
const TRANSCRIPT = join(DIR, project.voice?.transcript ?? "voice/transcript.json");
const POSES = join(DIR, project.character?.poses ?? "character/cut");

// ---------- words ----------
type W = { text: string; start: number; end: number };
const norm = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9']/g, "");

const lines = readFileSync(join(DIR, "script.txt"), "utf8").split("\n").map((l) => l.trim()).filter((l) => l && !l.startsWith("#"));
const script: { text: string; line: number }[] = [];
// French spacing isolates "?", ":", "!": glue them to the previous word with a no-break space.
lines.forEach((l, i) => l.split(/\s+/).forEach((t) => {
  if (/^[?!:;»]+$/.test(t) && script.length) script[script.length - 1].text += " " + t;
  else script.push({ text: t, line: i });
}));

const raw = JSON.parse(readFileSync(TRANSCRIPT, "utf8"));
const heard: W[] = Array.isArray(raw) ? raw : raw.words;

function sim(a: string, b: string): number {
  if (a === b) return 1;
  const m = a.length, n = b.length;
  if (!m || !n) return 0;
  const d = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]);
  for (let j = 1; j <= n; j++) d[0][j] = j;
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return 1 - d[m][n] / Math.max(m, n);
}

// Global alignment of script words against heard words.
const S = script.map((w) => norm(w.text)), H = heard.map((w) => norm(w.text));
const n = S.length, m = H.length;
const score = Array.from({ length: n + 1 }, () => new Float64Array(m + 1));
const back = Array.from({ length: n + 1 }, () => new Uint8Array(m + 1));
for (let i = 1; i <= n; i++) { score[i][0] = -i * 0.4; back[i][0] = 1; }
for (let j = 1; j <= m; j++) { score[0][j] = -j * 0.4; back[0][j] = 2; }
for (let i = 1; i <= n; i++)
  for (let j = 1; j <= m; j++) {
    const s = sim(S[i - 1], H[j - 1]);
    const diag = score[i - 1][j - 1] + (s >= 0.5 ? s : -0.6);
    const up = score[i - 1][j] - 0.4, left = score[i][j - 1] - 0.4;
    const best = Math.max(diag, up, left);
    score[i][j] = best;
    back[i][j] = best === diag ? 0 : best === up ? 1 : 2;
  }
const times: ({ start: number; end: number } | null)[] = Array(n).fill(null);
for (let i = n, j = m; i > 0 || j > 0; ) {
  const b = back[i][j];
  if (i > 0 && j > 0 && b === 0) {
    if (sim(S[i - 1], H[j - 1]) >= 0.5) times[i - 1] = { start: heard[j - 1].start, end: heard[j - 1].end };
    i--; j--;
  } else if (i > 0 && (j === 0 || b === 1)) i--;
  else j--;
}
let interpolated = 0;
for (let i = 0; i < n; ) {
  if (times[i]) { i++; continue; }
  let k = i; while (k < n && !times[k]) k++;
  const a = i > 0 ? times[i - 1]!.end : 0;
  const b = k < n ? times[k]!.start : heard[m - 1].end;
  const step = (b - a) / (k - i);
  for (let x = i; x < k; x++) { times[x] = { start: a + step * (x - i), end: a + step * (x - i + 1) }; interpolated++; }
  i = k;
}
const words = script.map((w, i) => ({ ...w, ...times[i]! }));
const AUDIO_END = Number(
  Bun.spawnSync(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", AUDIO]).stdout.toString(),
);
const END = Math.ceil((AUDIO_END + 0.6) * 10) / 10;

// ---------- beats ----------
type Beat = { at: string; pose?: string; card?: string | null; props?: any; title?: string; bg?: string | null; steps?: string[] };
const beats: Beat[] = JSON.parse(readFileSync(join(DIR, "beats.json"), "utf8"));
const poseFiles = new Set(readdirSync(POSES).filter((f) => f.endsWith(".png")).map((f) => f.slice(0, -4)));
let cursor = 0;
function find(phrase: string, from: number): number {
  const p = phrase.split(/\s+/).map(norm).filter(Boolean);
  for (let i = from; i <= n - p.length; i++) if (p.every((t, k) => S[i + k] === t)) return i;
  throw new Error(`beats.json: anchor "${phrase}" not found in script.txt after word ${from} ("${script[from]?.text}")`);
}
const resolved = beats.map((b) => {
  const i = find(b.at, cursor);
  cursor = i;
  if (b.pose && !poseFiles.has(b.pose)) throw new Error(`beats.json: pose "${b.pose}" has no ${POSES}/${b.pose}.png`);
  const steps = (b.steps ?? []).map((s) => words[find(s, i)].start);
  return { ...b, t: words[i].start, word: i, stepTimes: steps };
});

function spans<K extends keyof Beat>(key: K) {
  const out: { value: any; start: number; end: number; beat: (typeof resolved)[number] }[] = [];
  resolved.forEach((b, i) => {
    if (!(key in b)) return;
    const next = resolved.slice(i + 1).find((x) => key in x);
    const v = (b as any)[key];
    if (v !== null && v !== undefined) out.push({ value: v, start: b.t, end: next ? next.t : END, beat: b });
  });
  return out;
}

// ---------- html ----------
const r3 = (x: number) => Math.round(x * 1000) / 1000;
const esc = (s: string) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
let clipId = 0;
const id = (p: string) => `${p}${++clipId}`;
const html: string[] = [];
const js: string[] = [];

// Card library. Each card: (id, start, step times, props) => inner HTML, pushing its tweens to js.
// Defaults are placeholders; real copy comes from beats.json "props". See references/cards.md.
const enter = (i: string, t: number, from = "y:60, opacity:0") => js.push(`tl.from("#${i} .card", {${from}, duration:.25, ease:"back.out(2)"}, ${t});`);
const typeIn = (i: string, text: string, t: number, per = 0.035) => {
  [...text].forEach((_, k) => js.push(`tl.set("#${i} .ch${k}", {opacity:1}, ${r3(t + k * per)});`));
  return [...text].map((c, k) => `<span class="ch ch${k}">${c === " " ? "&nbsp;" : esc(c)}</span>`).join("");
};
const CARDS: Record<string, (i: string, t: number, st: number[], p: any) => string> = {
  player: (i, t, st, p) => {
    enter(i, t);
    if (p.jumpTo === undefined) js.push(`tl.fromTo("#${i} .bar-fill", {scaleX:${p.from ?? 0}}, {scaleX:${p.to ?? 0.06}, duration:3, ease:"none"}, ${r3(t + 0.2)});`);
    else {
      const at = st[0] ?? t + 1;
      js.push(`tl.fromTo("#${i} .bar-fill", {scaleX:${p.from ?? 0.08}}, {scaleX:${p.jumpTo}, duration:.35, ease:"power3.inOut", immediateRender:false}, ${r3(at)});`);
      js.push(`tl.from("#${i} .jump", {scale:0, duration:.25, ease:"back.out(3)"}, ${r3(at + 0.1)});`);
    }
    return `<div class="card player"><div class="screen">${p.image ? `<img class="shot" src="${esc(p.image)}">` : ""}<div class="play">▶</div>${p.tag ? `<div class="tag">${esc(p.tag)}</div>` : ""}${p.jumpLabel ? `<div class="jump">${esc(p.jumpLabel)}</div>` : ""}</div><div class="bar"><div class="bar-fill"></div></div><div class="row"><span>${esc(p.time ?? "0:12")}</span><span>${esc(p.total ?? "40:00")}</span></div></div>`;
  },
  chips: (i, t, st, p) => {
    const items: string[] = p.items ?? ["jargon", "acronym", "buzzword"];
    js.push(`tl.from("#${i} .chip", {scale:0, opacity:0, duration:.22, ease:"back.out(3)", stagger:.12}, ${r3(st[0] ?? t)});`);
    if (p.mark) js.push(`tl.from("#${i} .qmark", {scale:0, rotation:-30, duration:.3, ease:"back.out(3)"}, ${r3(st[st.length - 1] ?? t + 1)});`);
    return `<div class="chips">${items.map((c, k) => `<span class="chip c${k % 6}${k === (p.highlight ?? 2) ? " hot" : ""}">${esc(c)}</span>`).join("")}${p.mark ? `<div class="qmark">${esc(p.mark)}</div>` : ""}</div>`;
  },
  input: (i, t, st, p) => {
    enter(i, t);
    const field = typeIn(i, p.text ?? "example.com", t + 0.25);
    const click = r3((st[st.length - 1] ?? t + 1.2) + 0.1);
    js.push(`tl.fromTo("#${i} .cursor", {x:260, y:180, opacity:0}, {x:0, y:0, opacity:1, duration:.35, ease:"power2.out"}, ${r3(click - 0.4)});`);
    js.push(`tl.to("#${i} .btn", {scale:.9, duration:.06}, ${click}); tl.to("#${i} .btn", {scale:1, duration:.18, ease:"back.out(3)"}, ${r3(click + 0.06)});`);
    if (p.buttonAfter) js.push(`tl.set("#${i} .btn", {backgroundColor:"var(--brand)"}, ${click}); tl.set("#${i} .btn-label", {textContent:${JSON.stringify(p.buttonAfter)}}, ${click});`);
    sfx.push({ t: click, kind: "click" });
    return `<div class="card input"><div class="label">${esc(p.label ?? "LINK")}</div><div class="field">${field}<span class="caret"></span></div><div class="btn"><span class="btn-label">${esc(p.button ?? "GO")}</span><div class="cursor">➤</div></div></div>`;
  },
  summary: (i, t, st, p) => {
    enter(i, t);
    js.push(`tl.from("#${i} .line", {scaleX:0, duration:.3, ease:"power2.out", stagger:.12}, ${r3(t + 0.3)});`);
    js.push(`tl.from("#${i} .pill", {scale:0, duration:.25, ease:"back.out(3)"}, ${r3(t + 0.2)});`);
    const widths = p.lines ?? [92, 78, 86, 54];
    return `<div class="card summary"><div class="head"><span class="label">${esc(p.label ?? "SUMMARY")}</span>${p.badge ? `<span class="pill">${esc(p.badge)}</span>` : ""}</div>${widths.map((w: number) => `<div class="line" style="width:${w}%"></div>`).join("")}</div>`;
  },
  stack: (i, t, st, p) => {
    const rows: { label: string; color?: string }[] = p.rows ?? [{ label: "ONE" }, { label: "TWO" }, { label: "THREE" }];
    js.push(`tl.from("#${i} .row-card", {x:-80, opacity:0, duration:.24, ease:"back.out(2)", stagger:.1}, ${t});`);
    rows.forEach((_, k) => {
      const at = r3(st[k] ?? t + 0.4 + k * 0.6);
      js.push(`tl.from("#${i} .r${k} .lbl", {scale:.5, opacity:0, duration:.2, ease:"back.out(3)"}, ${at});`);
      js.push(`tl.from("#${i} .r${k} .dot", {scale:0, duration:.2, ease:"back.out(3)"}, ${at});`);
      js.push(`tl.to("#${i} .r${k} .skel", {opacity:0, duration:.1}, ${at});`);
    });
    return `<div class="stack">${rows.map((r, k) => `<div class="card row-card r${k}"><span class="dot" style="background:var(--${r.color ?? ["accent", "brand", "ink"][k % 3]})"></span><span class="skel"></span><span class="lbl">${esc(r.label)}</span></div>`).join("")}</div>`;
  },
  quote: (i, t, st, p) => {
    enter(i, t, "scale:.7, opacity:0");
    js.push(`tl.fromTo("#${i} mark", {backgroundSize:"0% 100%"}, {backgroundSize:"100% 100%", duration:.4, ease:"power2.out"}, ${r3(st[0] ?? t + 0.6)});`);
    const text = esc(p.text ?? "A sentence with *the key part* highlighted.").replace(/\*([^*]+)\*/g, "<mark>$1</mark>");
    return `<div class="card quote"><div class="qm">“</div><p>${text}</p>${p.source ? `<div class="src">${esc(p.source)}</div>` : ""}</div>`;
  },
  glossary: (i, t, st, p) => {
    enter(i, t);
    const tap = st[0] ?? t + 0.8;
    js.push(`tl.fromTo("#${i} .ripple", {scale:0, opacity:.8}, {scale:2.4, opacity:0, duration:.45, ease:"power2.out"}, ${r3(tap)});`);
    js.push(`tl.from("#${i} .tip", {y:-20, scale:.6, opacity:0, duration:.28, ease:"back.out(2.4)"}, ${r3(st[1] ?? tap + 0.5)});`);
    const sentence = esc(p.sentence ?? "A sentence with a [hard term] in it.").replace(/\[([^\]]+)\]/, '<u>$1<span class="ripple"></span></u>');
    const term = (p.sentence ?? "[hard term]").match(/\[([^\]]+)\]/)?.[1] ?? "";
    return `<div class="card gloss"><p>${sentence}</p><div class="tip"><b>${esc(term)}</b> : ${esc(p.definition ?? "a plain-words definition.")}</div></div>`;
  },
  comment: (i, t, st, p) => {
    enter(i, t);
    const s = (st[0] ?? t) + 0.3;
    js.push(`tl.set("#${i} .ph", {opacity:0}, ${r3(s)});`);
    const typed = typeIn(i, p.text ?? "Great video!", s, 0.045);
    return `<div class="card comment"><div class="avatar"></div><div class="field"><span class="ph">${esc(p.placeholder ?? "Add a comment…")}</span>${typed}</div></div>`;
  },
  phone: (i, t, st, p) => {
    js.push(`tl.from("#${i} .phone", {y:120, rotation:-6, opacity:0, duration:.35, ease:"back.out(1.8)"}, ${t});`);
    (p.callouts ?? []).forEach((_: string, k: number) => js.push(`tl.from("#${i} .callout${k}", {scale:0, duration:.25, ease:"back.out(3)"}, ${r3(st[k] ?? t + 0.5 + k * 0.5)});`));
    return `<div class="phone-wrap"><div class="phone"><img src="${esc(p.image)}"></div>${(p.callouts ?? []).map((c: string, k: number) => `<div class="callout callout${k}">${esc(c)}</div>`).join("")}</div>`;
  },
  logos: (i, t, st, p) => {
    const items: { image?: string; label: string }[] = p.items ?? [];
    items.forEach((_, k) => js.push(`tl.from("#${i} .logo${k}", {scale:0, rotation:-8, duration:.25, ease:"back.out(3)"}, ${r3(st[k] ?? t + k * 0.25)});`));
    return `<div class="logos">${items.map((l, k) => `<div class="logo logo${k}"><div class="tile card">${l.image ? `<img src="${esc(l.image)}">` : ""}</div><div class="logo-label">${esc(l.label)}</div></div>`).join("")}</div>`;
  },
};

for (const b of resolved) if (b.card && !CARDS[b.card]) throw new Error(`beats.json: unknown card "${b.card}" (known: ${Object.keys(CARDS).join(", ")})`);

// sound events, mixed after the render (mix.py)
const sfx: { t: number; kind: string }[] = [];
const poses = spans("pose");
const cards = spans("card");
const bgs = spans("bg");
const titles = resolved
  .map((b, i) => (b.title ? { value: b.title, start: b.t, end: resolved[i + 1]?.t ?? END } : null))
  .filter(Boolean) as { value: string; start: number; end: number }[];
if (poses.length) poses[0].start = 0;

// captions: script lines cut in groups of <= 4 words
type G = { words: typeof words; start: number; end: number };
const groups: G[] = [];
let cur: typeof words = [];
words.forEach((w, i) => {
  cur.push(w);
  const next = words[i + 1];
  const punct = /[,.:;?!…]$/.test(w.text);
  if (!next || next.line !== w.line || cur.length === 4 || (punct && cur.length >= 2)) { groups.push({ words: cur, start: cur[0].start, end: 0 }); cur = []; }
});
groups.forEach((g, i) => (g.end = groups[i + 1]?.start ?? END));
groups[0].start = Math.min(groups[0].start, 0.05);

// backgrounds
bgs.forEach((b) => {
  const i = id("bg");
  html.push(`<div id="${i}" class="clip bg bg-${b.value}" data-start="${r3(b.start)}" data-duration="${r3(b.end - b.start)}" data-track-index="1"></div>`);
  js.push(`tl.fromTo("#${i}", {clipPath:"circle(0% at 50% 62%)"}, {clipPath:"circle(150% at 50% 62%)", duration:.45, ease:"power3.out"}, ${r3(b.start)});`);
  sfx.push({ t: b.start, kind: "swell" });
});

// mascot: static wrapper that shrinks under cards; poses are clips inside
const poseHtml = poses.map((p) => {
  const i = id("pose");
  js.push(`tl.fromTo("#${i}", {scale:.9, y:18}, {scale:1, y:0, duration:.2, ease:"back.out(3)"}, ${r3(p.start)});`);
  return `<img id="${i}" class="clip pose" src="assets/poses/${p.value}.png" data-start="${r3(p.start)}" data-duration="${r3(p.end - p.start)}" data-track-index="2" />`;
});
html.push(`<div id="mascot"><div id="breath">${poseHtml.join("")}</div></div>`);
js.push(`tl.to("#breath", {scaleY:1.018, scaleX:.992, duration:.8, ease:"sine.inOut", yoyo:true, repeat:${Math.ceil(END / 0.8) - 1}}, 0);`);
const busy = [...cards, ...titles].map((c) => [c.start, c.end]).sort((a, b) => a[0] - b[0]);
const merged: number[][] = [];
busy.forEach(([a, b]) => (merged.length && a <= merged[merged.length - 1][1] + 0.05 ? (merged[merged.length - 1][1] = Math.max(merged[merged.length - 1][1], b)) : merged.push([a, b])));
merged.forEach(([a, b]) => {
  js.push(`tl.to("#mascot", {y:20, scale:${theme.mascotScaleUnderCard}, duration:.3, ease:"back.out(1.6)"}, ${r3(a)});`);
  if (b < END - 0.1) js.push(`tl.to("#mascot", {y:0, scale:1, duration:.3, ease:"back.out(1.6)"}, ${r3(b)});`);
});

// captions, hidden under a title
groups.forEach((g) => {
  const i = id("cap");
  const spansHtml = g.words.map((w, k) => `<span id="${i}w${k}">${esc(w.text)}</span>`).join(" ");
  html.push(`<div id="${i}" class="clip caption" data-start="${r3(g.start)}" data-duration="${r3(g.end - g.start)}" data-track-index="3"><div class="cap-in">${spansHtml}</div></div>`);
  js.push(`tl.from("#${i} .cap-in", {y:14, opacity:0, duration:.14, ease:"power2.out"}, ${r3(g.start)});`);
  g.words.forEach((w, k) => {
    js.push(`tl.set("#${i}w${k}", {color:"var(--accent)"}, ${r3(w.start)});`);
    const next = g.words[k + 1];
    if (next) js.push(`tl.set("#${i}w${k}", {color:"var(--ink)"}, ${r3(next.start)});`);
  });
  titles.forEach((t) => {
    if (t.start < g.end && t.end > g.start) {
      js.push(`tl.set("#${i}", {opacity:0}, ${r3(Math.max(t.start, g.start) - 0.001)});`);
      if (t.end < g.end) js.push(`tl.set("#${i}", {opacity:1}, ${r3(t.end)});`);
    }
  });
});

// titles: big words that replace the caption (HTML allowed: <em> accent, <sup>)
titles.forEach((t) => {
  const i = id("title");
  const long = t.value.replace(/<[^>]+>/g, "").length > 9;
  html.push(`<div id="${i}" class="clip title" data-start="${r3(t.start)}" data-duration="${r3(t.end - t.start)}" data-track-index="4"><div class="title-in${long ? " long" : ""}">${t.value}</div></div>`);
  js.push(`tl.from("#${i} .title-in", {scale:.4, opacity:0, rotation:-4, duration:.28, ease:"back.out(2.4)"}, ${r3(t.start)});`);
  sfx.push({ t: t.start, kind: "whoosh" });
});

// cards
cards.forEach((c) => {
  const i = id("card");
  const inner = CARDS[c.value](i, r3(c.start), c.beat.stepTimes, c.beat.props ?? {});
  html.push(`<div id="${i}" class="clip zone" data-start="${r3(c.start)}" data-duration="${r3(c.end - c.start)}" data-track-index="5">${inner}</div>`);
  sfx.push({ t: c.start, kind: "pop" });
  c.beat.stepTimes.forEach((x: number) => sfx.push({ t: x, kind: "tick" }));
});
poses.slice(1).forEach((p) => { if (!sfx.some((e) => Math.abs(e.t - p.start) < 0.25)) sfx.push({ t: p.start, kind: "blip" }); });

// ---------- write ----------
mkdirSync(join(OUTDIR, "assets/poses"), { recursive: true });
const used = new Set(poses.map((p) => p.value));
for (const name of used) {
  const dst = join(OUTDIR, "assets/poses", `${name}.png`);
  Bun.spawnSync(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", join(POSES, `${name}.png`), "-vf", "scale='min(1024,iw)':-1", dst]);
}
copyFileSync(AUDIO, join(OUTDIR, "assets", basename(AUDIO)));
// project-relative assets referenced by cards (images, fonts) are copied as-is
for (const rel of [...(project.assets ?? []), theme.serifFontFile].filter(Boolean)) {
  mkdirSync(dirname(join(OUTDIR, rel)), { recursive: true });
  copyFileSync(join(DIR, rel), join(OUTDIR, rel));
}
if (!existsSync(join(OUTDIR, "hyperframes.json")))
  writeFileSync(join(OUTDIR, "hyperframes.json"), JSON.stringify({ $schema: "https://hyperframes.heygen.com/schema/hyperframes.json", paths: { assets: "assets" }, media: { autoProxy: true } }, null, 2));

const vars = Object.entries(theme).filter(([k]) => typeof theme[k] === "string" && theme[k].startsWith("#")).map(([k, v]) => `--${k.replace(/[A-Z]/g, (c) => "-" + c.toLowerCase())}: ${v};`).join(" ");
const fontFace = theme.serifFontFile ? `@font-face { font-family: "${theme.serifFont}"; src: url("${theme.serifFontFile}"); }` : "";
const tpl = readFileSync(join(HERE, "template.html"), "utf8");
writeFileSync(
  join(OUTDIR, "index.html"),
  tpl
    .replace("/*__THEME__*/", `${fontFace} :root { ${vars} --display: "${theme.displayFont}"; --serif: "${theme.serifFont}"; }`)
    .replace("__LANG__", project.lang ?? "en")
    .replaceAll("__END__", String(END))
    .replace("__ROOTCLASS__", theme.grid ? "grid" : "")
    .replace("__AUDIO__", `<audio id="voice" src="assets/${basename(AUDIO)}" data-start="0" data-duration="${r3(AUDIO_END)}" data-track-index="0" data-volume="1"></audio>`)
    .replace("__CLIPS__", html.join("\n      "))
    .replace("__JS__", js.join("\n      ")),
);
writeFileSync(join(OUTDIR, "timing.json"), JSON.stringify({ words: words.map(({ text, start, end }) => ({ text, start, end })), beats: resolved.map(({ at, t }) => ({ at, t: r3(t) })) }, null, 1));
writeFileSync(join(OUTDIR, "sfx.json"), JSON.stringify(sfx.sort((a, b) => a.t - b.t).map((e) => ({ ...e, t: r3(e.t) }))));

// rhythm report: the longest stretch without a new pose, card, title or step
const events = [0, ...poses.map((p) => p.start), ...cards.map((c) => c.start), ...titles.map((t) => t.start), ...cards.flatMap((c) => c.beat.stepTimes), END].sort((a, b) => a - b);
const gaps = events.slice(1).map((e, k) => [events[k], e - events[k]]).sort((a, b) => b[1] - a[1]);
console.log(`✓ ${OUTDIR}/index.html · ${END}s · ${words.length} words (${interpolated} interpolated) · ${poses.length} poses · ${cards.length} cards · ${titles.length} titles · ${groups.length} captions`);
console.log(`  longest still stretch: ${gaps[0][1].toFixed(1)}s from ${gaps[0][0].toFixed(1)}s (aim ≤ 2s; captions keep moving underneath)`);
