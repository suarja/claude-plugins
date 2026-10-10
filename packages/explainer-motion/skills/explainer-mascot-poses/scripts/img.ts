#!/usr/bin/env bun
/**
 * One image through the Vercel AI Gateway.
 *
 *   bun img.ts --out=a.png --prompt-file=p.txt [--ref=ref.png ...] [--model=google/gemini-3-pro-image] [--aspect=1:1]
 *
 * Gemini image models go through chat completions (they accept reference
 * images); the others through images/generations. The prompt is written
 * next to the image.
 */
import { readFileSync, writeFileSync } from "node:fs";

const arg = (n: string) => process.argv.find((a) => a.startsWith(`--${n}=`))?.slice(n.length + 3);
const args = (n: string) => process.argv.filter((a) => a.startsWith(`--${n}=`)).map((a) => a.slice(n.length + 3));
const OUT = arg("out")!;
const PROMPT = readFileSync(arg("prompt-file")!, "utf8");
const MODEL = arg("model") ?? "google/gemini-3-pro-image";
const REFS = args("ref");
const ASPECT = arg("aspect") ?? "1:1";
const token = process.env.AI_GATEWAY_API_KEY ?? process.env.AI_API_GATEWAY;
if (!token) throw new Error("Set AI_GATEWAY_API_KEY (Vercel AI Gateway) — see the skill's Prerequisites");

async function viaChat(): Promise<Buffer> {
  const content: any[] = REFS.map((p) => ({
    type: "image_url",
    image_url: { url: `data:image/png;base64,${readFileSync(p).toString("base64")}` },
  }));
  content.push({ type: "text", text: PROMPT });
  const r = await fetch("https://ai-gateway.vercel.sh/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      model: MODEL,
      modalities: ["text", "image"],
      messages: [{ role: "user", content }],
      providerOptions: { google: { imageConfig: { aspectRatio: ASPECT } } },
    }),
  });
  if (!r.ok) throw new Error(`HTTP ${r.status}: ${await r.text()}`);
  const j: any = await r.json();
  const img = j.choices?.[0]?.message?.images?.[0]?.image_url?.url;
  if (!img) throw new Error("no image: " + JSON.stringify(j).slice(0, 800));
  return Buffer.from(img.split(",")[1], "base64");
}

async function viaImages(): Promise<Buffer> {
  const r = await fetch("https://ai-gateway.vercel.sh/v1/images/generations", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ model: MODEL, prompt: PROMPT, n: 1, size: "1024x1024" }),
  });
  if (!r.ok) throw new Error(`HTTP ${r.status}: ${await r.text()}`);
  const e: any = (await r.json()).data[0];
  if (e.b64_json) return Buffer.from(e.b64_json, "base64");
  return Buffer.from(await (await fetch(e.url)).arrayBuffer());
}

const buf = MODEL.startsWith("google/") ? await viaChat() : await viaImages();
writeFileSync(OUT, buf);
writeFileSync(OUT.replace(/\.png$/, ".prompt.txt"), `model: ${MODEL}\nrefs: ${REFS.join(", ")}\n\n${PROMPT}`);
console.log("✓", OUT, buf.length);
