#!/usr/bin/env bun
/**
 * Draw a pose bank from one character reference, then cut each pose out.
 *
 *   bun poses.ts --dir=<project>/character [--only=name,name] [--force] [--concurrency=4] [--model=...]
 *
 * Reads <dir>/ref.png and <dir>/poses.tsv (one "name<TAB>description" per line).
 * Writes <dir>/raw/<name>.png (+ .prompt.txt) and <dir>/cut/<name>.png
 * (transparent, via `npx hyperframes remove-background`). Existing files are
 * kept unless --force: a pose bank is reviewed pose by pose, never regenerated
 * wholesale.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const arg = (n: string) => process.argv.find((a) => a.startsWith(`--${n}=`))?.slice(n.length + 3);
const DIR = arg("dir")!;
const ONLY = arg("only")?.split(",");
const FORCE = process.argv.includes("--force");
const CONC = Number(arg("concurrency") ?? 4);
const MODEL = arg("model") ?? "google/gemini-3-pro-image";
const IMG = join(dirname(fileURLToPath(import.meta.url)), "img.ts");

if (!existsSync(join(DIR, "ref.png"))) throw new Error(`${DIR}/ref.png missing: create the character first`);
const rows = readFileSync(join(DIR, "poses.tsv"), "utf8")
  .split("\n").map((l) => l.trim()).filter((l) => l && !l.startsWith("#"))
  .map((l) => { const [name, ...d] = l.split("\t"); return { name, desc: d.join(" ") }; })
  .filter((r) => !ONLY || ONLY.includes(r.name));
mkdirSync(join(DIR, "raw"), { recursive: true });
mkdirSync(join(DIR, "cut"), { recursive: true });

const prompt = (desc: string) => `The attached image is the character reference. Draw THE SAME character — identical design, proportions, colours, materials, face, clothing and rendering style — in a new pose. The pose must be big, exaggerated and readable at a glance on a phone, like a cartoon key frame.

New pose: ${desc}

Full body, centred with a margin, plain pure white background, soft contact shadow under the feet, no text, no other characters.`;

async function one(r: { name: string; desc: string }) {
  const raw = join(DIR, "raw", `${r.name}.png`), cut = join(DIR, "cut", `${r.name}.png`);
  if (!existsSync(raw) || FORCE) {
    const pf = join(DIR, "raw", `${r.name}.txt`);
    writeFileSync(pf, prompt(r.desc));
    const p = Bun.spawn(["bun", IMG, `--out=${raw}`, `--prompt-file=${pf}`, `--ref=${join(DIR, "ref.png")}`, `--model=${MODEL}`], { stdout: "inherit", stderr: "inherit" });
    if ((await p.exited) !== 0) { console.error(`✗ ${r.name}`); return; }
  }
  if (!existsSync(cut) || FORCE) {
    const p = Bun.spawn(["npx", "hyperframes", "remove-background", raw, "-o", cut], { stdout: "ignore", stderr: "ignore" });
    await p.exited;
    console.log(existsSync(cut) ? `✓ cut ${r.name}` : `✗ cut ${r.name}`);
  }
}

// CONC poses at a time, each drawn then cut.
const queue = [...rows];
await Promise.all(Array.from({ length: CONC }, async () => { while (queue.length) await one(queue.shift()!); }));
console.log(`done: ${rows.length} pose(s) in ${DIR}`);
