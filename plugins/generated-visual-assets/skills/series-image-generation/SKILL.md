---
name: series-image-generation
description: Produce a coherent, reproducible series of AI-generated illustrations for a product. Use when a catalogue needs cover art or thematic imagery, when generated images look inconsistent between subjects, when a prompt has grown unwieldy and results have turned generic, or when a result must be traceable to the prompt that produced it.
---

# Series image generation

Generating one good image is easy. Generating a hundred that look like they came
off the same press, months apart, by different people, is the actual problem.
This skill is about the second one.

## Build the prompt in three layers

Never write a prompt per image. Write three layers and vary only the last.

| Layer | Scope | Contains |
| --- | --- | --- |
| **House style** | every image, never edited per subject | medium, palette with exact hex values, matter, light, framing |
| **Type recipe** | one per kind of subject | what sort of image this kind calls for, and explicitly **where the model is free** |
| **Subject** | one per image | the real subject, in plain language |

The house style is the only thing keeping the series together. If you find
yourself writing a new prompt for one image, you are about to break the series.
A new image should be one line.

## Pin the rendering to a reference specimen, not to a token list

A palette does not specify a rendering. Name one existing image as the
**reference specimen** and say so in the documentation: it is the standard, and
every new image is judged against it side by side.

The test is literal. Put a new image next to the specimen at final display size.
They must look like the same print run. If one is a rich illustration and the
other a flat symbol, the prompt has drifted whatever the palette says.

## Constrain the craft, not the meaning

This is the split that matters, and it is easy to get backwards.

- **Constrain the craft.** Medium, palette, matter, framing, bleed. These clauses
  are load-bearing. Removing them does not give the model freedom; it drops it
  onto its stock-illustration reflexes.
- **Do not constrain the meaning.** If the interface prints a title over the
  image, the two are read together and the image does not have to state the
  subject alone. Symbolic is fine. Ban only the rebus: two things placed side by
  side for the viewer to connect.
- **Invest in the subject.** This is where the model's latitude actually lives.

A thin, abstract subject line produces stock imagery no matter how many
prohibitions surround it. Enrich the subject before you add a rule.

### The measurement behind this

On a real series: the prompt reached 3823 characters for a 95-character subject,
2.5% of the whole. Halving the house style made the result **worse**. Enriching
the subject alone, touching no constraint, produced the best result.

Length was never the problem. The thinness of the subject was.

## Look at every image the moment it is generated

Never generate a batch and review afterwards. One bad draw tells you which
clause misfired. Five bad draws tell you nothing, because you cannot attribute
any of them.

Generate one or two, judge, continue.

## Draw twice before adding a clause

**The variance between two draws of the same prompt exceeds the effect of most
adjustments you will make.** On an unchanged prompt, one draw produced a dollar
sign and the next a key.

Adding a clause per disappointing image is how a prompt reaches four thousand
characters and starts producing generic work. Draw twice. If the second draw is
fine, the prompt was fine.

## Version a prompt, not a script

A script is edited in place; a prompt must be recoverable long after.

1. **Every run writes a manifest containing the complete prompt**, not a
   summary. The manifest is the version.
2. **The manifest carries a fingerprint of the generator** — a hash of the
   script — so a run ties back to a revision even after the prompt has moved.
3. **A run is committed with the script change that produced it.** An
   uncommitted run has no verifiable prompt.
4. **Runs are never overwritten, and rejections are never deleted.** A rejected
   run records what was tried and why it failed; without it, the next person
   repeats the experiment.

File runs by subject rather than in one flat pile: `runs/<subject>/<label>/`.
Comparing four attempts at the same subject is the common operation.

## Fix mechanically what a model does unreliably

When a model keeps producing an unwanted artefact at the frame edge — a printed
border, a passe-partout, a drop shadow — do not fight it with more prompt. Trim
a small deterministic inset after download. A border disappears; a clean image
merely tightens.

Prefer removing a constraint to adding one. Each clause you add moves the result
somewhere else, and the interactions are not predictable.

## Known failure modes

| Symptom | Cause |
| --- | --- |
| Flat symbols instead of illustrations | A texture or effect system used as a drawing medium. A texture is a state, never a tool |
| Comic look: black outlines, cel shading, halftone dots as pattern | A brightness instruction read as a licence for flat pop. Say where the light comes from — paper glowing through ink — rather than asking for "bright" |
| Printed border or margin | Absorb it with an inset crop, not with a clause |
| Generic stock imagery | The subject line is too thin |
| A human face where the subject is not a person | The type recipe must forbid it explicitly; models default to faces |
| Embedded lettering | Forbid words, captions and slogans. A single universally-read symbol is usually fine and not worth policing |

## Reference

[`references/generate-series.ts`](references/generate-series.ts) is a working
starting point: layered prompt, run folders, manifest with prompt and
fingerprint, deterministic inset, focal-point crops. It runs on Bun against an
OpenAI-compatible images endpoint and uses `sips` for cropping. Replace the
transport and the cropper for another environment; the structure is the point.

For the crop side, see the `image-placement-contract` skill.
