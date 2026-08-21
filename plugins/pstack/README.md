# pstack

> A focused Codex adapter for pstack's `unslop` writing pass.

I'm [poteto](https://x.com/poteto). I care about shipping less, higher-quality
work: remove the tells of generated writing without flattening the author's
meaning, voice, or intent.

This marketplace entry brings the upstream `unslop` skill to Codex. It is
intentionally scoped: the full Cursor-oriented pstack catalog is not copied
here, and runtime-specific commands such as `/poteto-mode` remain upstream.

## Included skill

| Skill | Use it when |
|---|---|
| `unslop` | A draft sounds generic, over-structured, repetitive, or obviously AI-written. |

The skill edits prose in place conceptually: it identifies AI tells, removes
unnecessary scaffolding, and preserves the underlying message and tone.

## Install

### Codex

```bash
codex plugin marketplace add suarja/claude-plugins --ref main --sparse .agents/plugins
codex plugin add pstack@suarja-plugins
```

### Claude Code

Add this repository as a marketplace, then install `pstack` from the plugin
catalogue. The same plugin also contains the Claude Code manifest.

## Provenance

The `unslop` skill is extracted from the original
[`poteto/plugins`](https://github.com/poteto/plugins/tree/main/pstack) checkout
and remains MIT-licensed. See [`UPSTREAM.md`](UPSTREAM.md) and
[`THIRD-PARTY-LICENSE.txt`](THIRD-PARTY-LICENSE.txt) for the source and
license record.

The full upstream presentation and catalog are available in the
[original pstack README](https://github.com/poteto/plugins/blob/main/pstack/README.md).
