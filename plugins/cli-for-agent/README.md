# CLI for Agents

> A focused skill for command-line tools meant to be driven by coding agents.

This plugin captures the practical patterns that keep CLIs headless,
discoverable, composable, retry-safe, and useful to both agents and humans.

## Included skill

| Skill | Use it when |
|---|---|
| `cli-for-agents` | Building, refactoring, documenting, or reviewing a CLI that coding agents must run reliably. |

The guidance covers non-interactive flags, layered `--help` with real examples,
stdin and pipelines, actionable errors, idempotency, dry-run and confirmation
controls, predictable command structure, and machine-useful success output.

## Install

### Codex

```bash
codex plugin marketplace add suarja/claude-plugins --ref main --sparse .agents/plugins --sparse plugins/cli-for-agent
codex plugin add cli-for-agent@suarja-plugins
```

### Claude Code

```bash
claude plugin marketplace add suarja/claude-plugins
claude plugin install cli-for-agent@suarja-plugins
```

## Adaptation boundary

The local skill is a portable Codex/Claude Code adapter. It has no Cursor-only
router, model configuration, slash command, or hidden runtime dependency.

## Provenance

Source and license details are recorded in [`UPSTREAM.md`](UPSTREAM.md) and
[`THIRD-PARTY-LICENSE.txt`](THIRD-PARTY-LICENSE.txt).
