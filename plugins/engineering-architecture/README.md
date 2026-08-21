# Engineering Architecture

> Make the shape of a non-trivial change reviewable before code makes it
> expensive to change.

This plugin is a small synthesis of design-first architecture and threat
modeling practices. It does not duplicate the repository-specific Convex,
mobile, or visual-validation skills already available in this marketplace.

## Included skills

| Skill | Use it when |
|---|---|
| `how` | A subsystem, flow, or ownership question needs a traced explanation from the real code. |
| `why` | A design choice, threshold, regression, or trade-off needs evidence from history and project records. |
| `engineering-architecture` | A feature or refactor crosses module, data, or runtime boundaries and needs a concrete sketch/RFC before implementation. |
| `threat-model-stride` | A design touches authentication, private data, uploads, storage, webhooks, external services, or privilege boundaries. |

`how` and `why` are the grounding pair for `engineering-architecture`:
understand the current runtime shape, then verify the forces that shaped it.
`engineering-architecture` combines a caller-first type/module sketch with
the useful review structure of a technical spec: constraints, non-goals,
interfaces, alternatives, failure modes, rollout, rollback, and open
questions. `threat-model-stride` is deliberately design-time security work; it
does not replace a line-by-line secure-code review after implementation.

## Install

### Codex

```bash
codex plugin marketplace add suarja/claude-plugins --ref main --sparse .agents/plugins
codex plugin add engineering-architecture@suarja-plugins
```

### Claude Code

```bash
claude plugin marketplace add suarja/claude-plugins
claude plugin install engineering-architecture@suarja-plugins
```

## Provenance and adaptation

The source families and licenses are recorded in [`UPSTREAM.md`](UPSTREAM.md).
The local skills are rewritten as portable adapters: they do not require a
particular model arena, slash command, language, framework, or security
scanner. See [`THIRD-PARTY-LICENSE.txt`](THIRD-PARTY-LICENSE.txt) for the
retained MIT notices.
