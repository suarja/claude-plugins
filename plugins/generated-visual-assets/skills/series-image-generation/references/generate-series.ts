#!/usr/bin/env bun
/**
 * Reference generator for a reproducible image series.
 *
 * A working starting point, not a library. Copy it into a project, replace the
 * three prompt layers and the SUBJECTS list, and keep the discipline:
 *
 *   HOUSE_STYLE    identical everywhere — it is what holds the series together
 *   TYPE_RECIPES   one per kind of subject, and where the model is free
 *   subject        the real subject, in plain language
 *
 * Every run writes its own folder with a manifest carrying the complete prompt
 * and a fingerprint of this file, so a result stays traceable after the prompt
 * has moved on.
 *
 * Usage:
 *   bun run generate-series.ts --run=<label>
 *   bun run generate-series.ts --run=<label> --file=<fragment> --force
 *
 * Environment: IMAGE_API_KEY, and IMAGE_API_URL for an OpenAI-compatible
 * images endpoint. Cropping uses `sips` (macOS); swap `crop()` elsewhere.
 */

import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = process.cwd();
const RUNS_ROOT = join(ROOT, "assets/generated/runs");

const arg = (name: string) =>
  process.argv.find((a) => a.startsWith(`--${name}=`))?.slice(name.length + 3);

const FORCE = process.argv.includes("--force");
const FILE = arg("file");
const ONLY = arg("only");
const MODEL = arg("model") ?? "openai/gpt-image-1";
const API_URL = process.env.IMAGE_API_URL ?? "https://api.openai.com/v1/images/generations";

/** Source geometry. Placements are cut from this; nothing is generated twice. */
const SOURCE_W = 1024;
const SOURCE_H = 1536;

/**
 * Deterministic inset trimmed before placements are cut. Absorbs a printed
 * border or stray edge without adding a prompt clause to fight it.
 */
const INSET_RATIO = 0.04;

/** The placements one source must serve. */
const PLACEMENTS = [
  { name: "hero", w: 1024, h: 1280 },
  { name: "thumb", w: 1024, h: 1024 },
  { name: "banner", w: 1024, h: 512 },
] as const;

// ---------------------------------------------------------------------------
// Layer 1 — the house style. Edit for your product; never edit per subject.
// ---------------------------------------------------------------------------

const HOUSE_STYLE = `Style: <medium, in one confident sentence — what it is made of, not what it is about>.
Palette: <exact hex values>. Build a constructed colour field behind the subject; never an empty background.
Light: <where the light comes from — a physical description beats the word "bright">.
Matter: <what makes it look made rather than rendered — grain, imperfection, the marks of its process>.
Typography: no words, no captions, no slogans, no signage. The interface draws the title itself. A single universally-read symbol is allowed when the subject calls for one.
Framing: one self-contained subject, roughly centred, within the upper square of the frame. The composition must survive being cut to a wide horizontal strip: never spread the subject across opposite corners. Nothing essential in the bottom third or the outer 15% of the left and right edges.
Avoid, on craft: <the rendering failures you have actually seen>.
Avoid, on tone: <the registers that are wrong for this product>.`;

// ---------------------------------------------------------------------------
// Layer 2 — one recipe per kind of subject. Say where the model is free.
// ---------------------------------------------------------------------------

type SubjectKind = "person" | "object" | "idea" | "place";

const TYPE_RECIPES: Record<SubjectKind, string> = {
  person: `A portrait, three-quarter, cropped large in the frame.`,

  object: `A material object, incarnate and lit — held, handled, worn, used. Give it weight and a hand's presence. Never a floating icon.
You choose the object that best fits this particular subject.`,

  idea: `This is for an idea, not a person. Do NOT default to a human face deliberating.
Choose ONE subject the idea is really about and give it the whole frame. The charge comes from what it is and how it is framed, not from an idea assembled out of parts.
The image does not have to state the idea alone — the interface prints a title over it and the two are read together. Symbolic is fine. A rebus is not: never place two things side by side for the viewer to connect.`,

  place: `A place at the moment it means something. Nobody identifiable.
You choose the vantage point from the subject.`,
};

// ---------------------------------------------------------------------------
// Layer 3 — the subjects. This is the only layer that grows.
// ---------------------------------------------------------------------------

interface Spec {
  kind: SubjectKind;
  /** The real subject, in plain language. Invest here, not in prohibitions. */
  subject: string;
  filename: string;
  /** Ratios of the source. Every placement is cut centred on this point. */
  focal: { x: number; y: number };
  /** Optional steer. Omit to leave the model full latitude. */
  hint?: string;
}

const SUBJECTS: Spec[] = [
  {
    kind: "idea",
    subject: "<the subject, with enough concrete world for the model to see something>",
    filename: "example-subject.png",
    focal: { x: 0.5, y: 0.35 },
  },
];

// ---------------------------------------------------------------------------

const slug = (s: Spec) => s.filename.split("-")[0];
const runLabel = () => {
  const explicit = arg("run");
  if (explicit) return explicit.replace(/[^a-zA-Z0-9._-]/g, "-");
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}-${p(d.getMinutes())}`;
};
const RUN = runLabel();
const runDir = (s: Spec) => join(RUNS_ROOT, slug(s), RUN);

function buildPrompt(spec: Spec): string {
  return `${TYPE_RECIPES[spec.kind]}

Subject: ${spec.subject}
${spec.hint ? `Direction: ${spec.hint}\n` : ""}
${HOUSE_STYLE}

This image must look as if it came from the same series as the rest of the catalogue.`;
}

/** Hash of this generator, recorded with every run. */
async function fingerprint(): Promise<string> {
  const bytes = await Bun.file(fileURLToPath(import.meta.url)).arrayBuffer();
  return new Bun.CryptoHasher("sha256").update(bytes).digest("hex").slice(0, 16);
}

async function crop(args: string[]): Promise<void> {
  await Bun.spawn(["sips", ...args], { stdout: "ignore", stderr: "ignore" }).exited;
}

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

/** Trim the inset, then cut each placement centred on the focal point. */
async function cutPlacements(spec: Spec): Promise<void> {
  const dir = join(runDir(spec), "crops");
  mkdirSync(dir, { recursive: true });

  const inset = Math.round(SOURCE_W * INSET_RATIO);
  const w = SOURCE_W - inset * 2;
  const h = SOURCE_H - inset * 2;
  const trimmed = join(dir, spec.filename.replace(/\.png$/, "-source.png"));
  await crop(["-c", String(h), String(w), join(runDir(spec), spec.filename), "--out", trimmed]);

  for (const p of PLACEMENTS) {
    const tw = Math.min(p.w, w);
    const th = Math.round((tw * p.h) / p.w);
    const left = clamp(Math.round(spec.focal.x * w - tw / 2), 0, w - tw);
    const top = clamp(Math.round(spec.focal.y * h - th / 2), 0, Math.max(0, h - th));
    const out = join(dir, spec.filename.replace(/\.png$/, `-${p.name}.png`));
    await crop(["-c", String(th), String(tw), "--cropOffset", String(top), String(left), trimmed, "--out", out]);
    console.log(`  ${p.name.padEnd(6)} ${tw}x${th} @ top ${top}`);
  }
}

async function generate(spec: Spec, key: string): Promise<boolean> {
  const out = join(runDir(spec), spec.filename);
  if (existsSync(out) && !FORCE) {
    console.log(`✓ skip ${spec.filename} (exists — use --force)`);
    return true;
  }
  mkdirSync(dirname(out), { recursive: true });
  console.log(`→ ${spec.kind.padEnd(7)} ${spec.filename}`);

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: MODEL,
        prompt: buildPrompt(spec),
        n: 1,
        size: `${SOURCE_W}x${SOURCE_H}`,
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);

    const entry = (await res.json()).data[0];
    const bytes = entry.b64_json
      ? Buffer.from(entry.b64_json, "base64")
      : Buffer.from(await (await fetch(entry.url)).arrayBuffer());

    writeFileSync(out, bytes);
    console.log(`  wrote ${(bytes.byteLength / 1024).toFixed(0)} KB`);
    await cutPlacements(spec);
    return true;
  } catch (err) {
    console.error(`✗ ${spec.filename}: ${err instanceof Error ? err.message : err}`);
    return false;
  }
}

async function main() {
  const key = process.env.IMAGE_API_KEY;
  if (!key) {
    console.error("✗ IMAGE_API_KEY is not set.");
    process.exit(1);
  }

  const specs = SUBJECTS.filter(
    (s) => (!ONLY || s.kind === ONLY) && (!FILE || s.filename.includes(FILE)),
  );
  if (specs.length === 0) {
    console.error(`✗ no subject matches --only=${ONLY} --file=${FILE}`);
    process.exit(1);
  }

  console.log(`Model ${MODEL} · run ${RUN} · ${specs.length} image(s)\n`);
  let failed = 0;
  for (const spec of specs) if (!(await generate(spec, key))) failed += 1;

  // The manifest is the version of the prompt — not this file.
  writeFileSync(
    join(runDir(specs[0]), "manifest.json"),
    JSON.stringify(
      {
        run: RUN,
        generatorSha256: await fingerprint(),
        model: MODEL,
        size: `${SOURCE_W}x${SOURCE_H}`,
        insetRatio: INSET_RATIO,
        placements: PLACEMENTS,
        houseStyle: HOUSE_STYLE,
        images: specs.map((s) => ({
          filename: s.filename,
          kind: s.kind,
          subject: s.subject,
          focal: s.focal,
          prompt: buildPrompt(s),
        })),
      },
      null,
      2,
    ) + "\n",
  );

  console.log(`\nDone — ${specs.length - failed}/${specs.length}.`);
  console.log(`Output: ${runDir(specs[0])}`);
  console.log("Look at every image now, before generating more.");
  if (failed > 0) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
