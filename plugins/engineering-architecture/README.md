# Engineering Architecture

> A focused RFC and security-modeling pack for implementation decisions.

The pstack-derived walkthrough, rationale, and architecture-sketch skills live
in the canonical `pstack` plugin. This plugin keeps the distinct Skill Me
adaptations that remain useful alongside it.

## Included skills

| Skill | Use it when |
|---|---|
| `technical-spec` | A change needs an implementation-ready RFC with goals, non-goals, requirements, alternatives, failure modes, rollout, and open questions. |
| `threat-model-stride` | A design touches authentication, private data, uploads, storage, webhooks, external services, or privilege boundaries. |

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

The source paths and licenses are recorded in [`UPSTREAM.md`](UPSTREAM.md).
The local skills are concise portable adapters and do not require a particular
model arena, slash command, language, framework, or security scanner. See
[`THIRD-PARTY-LICENSE.txt`](THIRD-PARTY-LICENSE.txt) for the MIT notices.
