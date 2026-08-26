# Generated Visual Assets

> Produce a coherent series of AI-generated illustrations for a product —
> reproducibly, and traceably.

Generating one good image is easy. Generating a hundred that look like they came
off the same press, months apart, by different people, is the actual problem.
This plugin is about the second one.

## Included skills

| Skill | Use it when |
|---|---|
| `series-image-generation` | A catalogue needs cover art or thematic imagery; generated images look inconsistent between subjects; a prompt has grown unwieldy and results have turned generic; a result must be traceable to the prompt that produced it. |
| `image-placement-contract` | The same image must appear at several aspect ratios; a title has to sit over an image; crops keep losing the subject. |

## What it actually says

**A prompt in three layers.** A house style identical everywhere, one recipe per
kind of subject, and the subject in plain language. Only the last layer varies.
A new image is one line, not a new prompt.

**Constrain the craft, not the meaning.** Medium, palette, matter and framing are
load-bearing — removing them drops the model onto its stock-illustration
reflexes. What the image *means* can stay symbolic, because the interface prints
a title over it. The latitude belongs in the subject, and that is where to
invest: a thin abstract subject produces stock imagery whatever the prohibitions
say.

**Draw twice before adding a clause.** The variance between two draws of the same
prompt exceeds the effect of most adjustments. Adding a rule per disappointing
image is how a prompt reaches four thousand characters and starts producing
generic work.

**The manifest is the version, not the script.** Every run records its complete
prompt and a fingerprint of the generator, and is committed with the change that
produced it. Rejections are kept: they record what was tried and why it failed.

**One source, several placements.** Never ask the image to reserve space for a
title — a model places that reserve differently every time and it vanishes on
re-crop. Constrain the subject to a safe region instead, declare a focal point,
and cut every placement from it deterministically.

## Reference implementation

[`skills/series-image-generation/references/generate-series.ts`](skills/series-image-generation/references/generate-series.ts)
is a working starting point: layered prompt, run folders, manifest with prompt
and fingerprint, deterministic inset, focal-point crops. Bun, an
OpenAI-compatible images endpoint, and `sips` for cropping. Replace the transport
and the cropper elsewhere; the structure is the point.

## Install

### Claude Code

```
/plugin marketplace add suarja/claude-plugins
/plugin install generated-visual-assets@suarja-plugins
```

### Codex

Add the marketplace, then install `generated-visual-assets`.

## Provenance

Extracted from a real series built for a mobile editorial product in August
2026. Every rule here was paid for by a failed run; the failure modes table in
`series-image-generation` lists the ones that cost the most.
