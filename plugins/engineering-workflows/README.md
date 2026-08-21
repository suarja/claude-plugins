# Engineering Workflows

> A small set of workflows for engineering work that must remain trustworthy
> after the agent stops.

These skills adapt the portable parts of pstack's long-run and review workflows
to Codex and Claude Code. They do not assume Cursor commands, named model
slugs, hidden transcript paths, or a particular agent-orchestration product.

## Included skills

| Skill | Use it when |
|---|---|
| `figure-it-out` | The task is large, cross-cutting, multi-phase, or will be reviewed later and no narrower workflow is enough. |
| `interrogate` | A diff, design, or implementation needs independent adversarial review before acceptance. |
| `show-me-your-work` | A long or unattended run needs a compact, reviewable decision and evidence trail. |
| `reflect` | A correction, failure, or completed complex task contains a reusable lesson that should become a durable skill change. |

`figure-it-out` can use `show-me-your-work` when the work merits a committed
trail. `interrogate` never edits the reviewed code automatically. `reflect`
surfaces proposed skill changes and waits for explicit approval before applying
them.

## Install

### Codex

```bash
codex plugin marketplace add suarja/claude-plugins --ref main --sparse .agents/plugins
codex plugin add engineering-workflows@suarja-plugins
```

### Claude Code

```bash
claude plugin marketplace add suarja/claude-plugins
claude plugin install engineering-workflows@suarja-plugins
```

## Provenance and adaptation

The upstream paths and licenses are recorded in [`UPSTREAM.md`](UPSTREAM.md).
The local skill bodies are concise adaptations, not a copy of pstack's full
router and playbook catalog. See
[`THIRD-PARTY-LICENSE.txt`](THIRD-PARTY-LICENSE.txt) for the MIT notice.
