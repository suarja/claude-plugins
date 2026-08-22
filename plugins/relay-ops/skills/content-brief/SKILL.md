---
name: content-brief
description: Create a concise channel-agnostic content brief from a campaign objective, audience, evidence, asset, and call to action. Use before drafting or adapting a publication; never publish.
---

# Content brief

Turn a campaign intention into one reusable content brief. Keep the brief
separate from platform-specific copy.

## Inputs

Use the available Hub context first. Required inputs are:

- campaign and objective;
- intended audience;
- one core message;
- evidence or product fact supporting the message;
- available asset;
- call to action and any deadline.

If a required fact is missing, ask for it or mark it `UNKNOWN`. Never invent a
claim, testimonial, metric, feature, deadline, or user reaction.

## Workflow

1. Reduce the campaign to one decision the reader should make.
2. Separate the promise, the proof, and the call to action.
3. Check that the asset actually supports the promise.
4. Record channel constraints without writing the channel variants yet.
5. Return one brief ready to save in Relay.

## Output

Use this compact structure:

```text
Campaign:
Audience:
Objective:
Core message:
Proof:
Asset:
Call to action:
Channel constraints:
Open questions:
Approval: needs review
```

Keep one master message. Do not copy a final sentence across every platform.
Do not add hashtags, emojis, or a second idea unless the brief requires them.
The output is a draft for review, not a publication command.
