#!/usr/bin/env bun
/**
 * Reference generator: one short motion clip from one approved still.
 *
 * A working starting point, not a library. Copy it, replace MOTION with the
 * language your artwork needs, and keep the two rules the structure encodes:
 *
 *   1. the source is cropped to the requested ratio BEFORE the call — a
 *      mismatch does not letterbox, it makes the model redraw the subject;
 *   2. the manifest carries the full motion prompt beside the file, because a
 *      clip has to stay traceable after the prompt has moved on.
 *
 * No frame of the result is your still: the input is a style reference, not a
 * first frame. Ending on the approved image is the interface's job — play the
 * clip, then cross-fade. See the skill for why reversing does not fix this,
 * and why reversing is still usually worth doing.
 *
 * Usage:
 *   bun run still-to-motion.ts --still=<path> --aspect=9:16
 *   bun run still-to-motion.ts --still=<path> --aspect=3:4 --duration=4
 *
 * Then, to turn the model's habitual dolly-out into a settle-in, and to get the
 * file down to feed weight:
 *   ffmpeg -i clip.mp4 -vf "reverse,scale=540:-2" -an -c:v libx264 -crf 30 out.mp4
 *
 * Environment: VIDEO_API_KEY. Cropping uses `sips` (macOS); swap `crop()`.
 */

import { createGateway, experimental_generateVideo as generateVideo } from "ai";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, join } from "node:path";

const arg = (name: string) =>
  process.argv.find((a) => a.startsWith(`--${name}=`))?.slice(name.length + 3);

const STILL = arg("still");
const ASPECT = (arg("aspect") ?? "9:16") as `${number}:${number}`;
const DURATION = Number(arg("duration") ?? 4);
const MODEL = arg("model") ?? "bytedance/seedance-2.0-mini";
const OUT_ROOT = arg("out") ?? join(process.cwd(), "assets/generated/motion");

/**
 * The difficulty in one paragraph: a video model's instinct is to animate the
 * SURFACE, and on textured artwork the surface is the artwork. Fix the texture
 * explicitly; ask for motion of the subject and of what sits behind it.
 *
 * Replace the texture nouns with your own — grain, halftone, brush, weave.
 */
const MOTION = `A printed poster, gently alive. Almost nothing moves.

The ink must behave like ink on paper: the halftone screen does not swim, crawl or shimmer; the colour separations do not slide or re-register; the paper grain stays fixed, as if the camera were looking at a poster pinned to a wall. Any movement of the texture itself is a failure.

What may move, barely: a slow small drift of the subject — a breath, a settling, the smallest shift of weight — and a slight parallax of the field behind it. That is all.

No camera push-in, no zoom, no pan, no rack focus. No new element enters the frame. No new colour appears. No lettering. No light sweep, no shine, no glow, no particles.

It must read as the same single print throughout.`;

async function sips(args: string[]): Promise<void> {
  await Bun.spawn(["sips", ...args], { stdout: "ignore", stderr: "ignore" }).exited;
}

async function size(path: string): Promise<{ w: number; h: number }> {
  const proc = Bun.spawn(["sips", "-g", "pixelWidth", "-g", "pixelHeight", path], {
    stdout: "pipe",
  });
  const text = await new Response(proc.stdout).text();
  const read = (key: string) => Number(text.match(new RegExp(`${key}: (\\d+)`))?.[1] ?? 0);
  return { w: read("pixelWidth"), h: read("pixelHeight") };
}

/**
 * The largest rectangle of the requested ratio that FITS inside the still.
 * Sizing from the width alone silently pads when the target is taller than the
 * source, and the clip comes back with empty bands.
 */
async function fitToAspect(path: string): Promise<string> {
  const [aw, ah] = ASPECT.split(":").map(Number);
  const { w, h } = await size(path);
  const targetW = Math.round(Math.min(w, (h * aw) / ah));
  const targetH = Math.round((targetW * ah) / aw);
  const out = join(tmpdir(), `fitted-${aw}x${ah}-${basename(path)}`);
  await sips(["-c", String(targetH), String(targetW), path, "--out", out]);
  console.log(`  cropped ${w}x${h} → ${targetW}x${targetH} (${ASPECT})`);
  return out;
}

async function main() {
  const key = process.env.VIDEO_API_KEY;
  if (!key) {
    console.error("✗ VIDEO_API_KEY is not set.");
    process.exit(1);
  }
  if (!STILL) {
    console.error("✗ pass --still=<path to an approved image>");
    process.exit(1);
  }

  const fitted = await fitToAspect(STILL);
  const image = new Uint8Array(readFileSync(fitted));
  const label = basename(STILL, ".png");

  console.log(`Model ${MODEL} · ${DURATION}s · ${ASPECT}\n`);
  const started = Date.now();

  const result = await generateVideo({
    model: createGateway({ apiKey: key }).video(MODEL),
    prompt: { image, text: MOTION },
    // `last_frame` is accepted by some models and honoured by none of them so
    // far. Passing the still as first_frame is what keeps the style anchored.
    frameImages: [{ image, frameType: "first_frame" }],
    duration: DURATION,
    aspectRatio: ASPECT,
  });

  const dir = join(OUT_ROOT, label);
  mkdirSync(dir, { recursive: true });
  const bytes = result.videos[0].uint8Array;
  writeFileSync(join(dir, `${label}.mp4`), bytes);

  writeFileSync(
    join(dir, "manifest.json"),
    JSON.stringify(
      {
        model: MODEL,
        aspectRatio: ASPECT,
        durationSeconds: DURATION,
        still: STILL,
        elapsedSeconds: Math.round((Date.now() - started) / 1000),
        bytes: bytes.byteLength,
        motionPrompt: MOTION,
        warnings: result.warnings,
      },
      null,
      2,
    ) + "\n",
  );

  console.log(`✓ ${join(dir, `${label}.mp4`)}`);
  console.log(`  ${(bytes.byteLength / 1024 / 1024).toFixed(2)} MB`);
  console.log("\nLook at it now. Check the texture first: if it swims, nothing else matters.");
}

main().catch((err) => {
  console.error(`✗ ${err instanceof Error ? err.message : err}`);
  process.exit(1);
});
