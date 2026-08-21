# pstack

> The canonical marketplace bundle for the selected pstack skills.

This plugin keeps the pstack source identity intact while adapting the useful
skills to Codex and Claude Code. It is selective: Cursor-only routers, model
configuration, and unrelated pstack principles are not copied.

## Included skills

| Skill | Use it when |
|---|---|
| `unslop` | A draft sounds generic, repetitive, over-structured, or obviously AI-written. |
| `how` | A subsystem, flow, or ownership question needs a traced explanation from real code. |
| `why` | A design choice, threshold, regression, or trade-off needs evidence from history and project records. |
| `architect` | A non-trivial change needs caller usage, types, signatures, and module boundaries before implementation. |
| `figure-it-out` | A large or cross-cutting task needs an auditable playbook and verifiable phases. |
| `interrogate` | A diff or design needs independent adversarial review before acceptance. |
| `show-me-your-work` | A long or unattended run needs a compact decision and evidence trail. |
| `reflect` | A completed task or correction contains a durable lesson for future skills. |
| `boundary-discipline` | Validation and error handling cross a system boundary. |
| `idempotent-operations` | A command, job, upload, or mutation can retry or resume after a crash. |
| `verifiable-units` | A multi-step change can be split into independently checked units. |
| `shared-state-separation` | Concurrent actors may write the same mutable target. |
| `build-the-lever` | Repeated manual work would benefit from a small rerunnable tool or check. |

## Install

### Codex

```bash
codex plugin marketplace add suarja/claude-plugins --ref main --sparse .agents/plugins
codex plugin add pstack@suarja-plugins
```

### Claude Code

```bash
claude plugin marketplace add suarja/claude-plugins
claude plugin install pstack@suarja-plugins
```

## Adaptation boundary

The local skills preserve pstack's distinctive decision tests and workflows.
They do not require Cursor slash commands, `.cursor` files, named model slugs,
hidden transcript paths, or a particular multi-model router. Use the
repository's available agents, commands, and evidence sources instead.

## Provenance

The complete source map is in [`UPSTREAM.md`](UPSTREAM.md). The local bundle is
MIT-licensed with the upstream notice in
[`THIRD-PARTY-LICENSE.txt`](THIRD-PARTY-LICENSE.txt).
