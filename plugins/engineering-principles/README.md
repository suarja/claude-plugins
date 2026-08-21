# Engineering Principles

> A compact selection of pstack principles that add real engineering signal
> without reproducing the full catalog.

These are reusable lenses, not a global instruction dump. Invoke one when its
trigger is present and explain the concrete decision it changed.

## Included skills

| Skill | Use it when |
|---|---|
| `boundary-discipline` | Validation, parsing, error handling, or framework adapters cross a system boundary. |
| `idempotent-operations` | A command, lifecycle step, job, or mutation can be retried or resume after a crash. |
| `verifiable-units` | A migration, sweep, multi-phase task, or commit sequence can be split into independently checked units. |
| `shared-state-separation` | Concurrent actors may write the same file, branch, key, or mutable state object. |
| `build-the-lever` | Non-trivial work is being repeated by hand and a small script, generator, or check would make it rerunnable. |

Other pstack principles were omitted because they are already represented by
the repository instructions or the existing quality and architecture plugins,
or because they are product/runtime-specific. This plugin is intentionally
small.

## Install

### Codex

```bash
codex plugin marketplace add suarja/claude-plugins --ref main --sparse .agents/plugins
codex plugin add engineering-principles@suarja-plugins
```

### Claude Code

```bash
claude plugin marketplace add suarja/claude-plugins
claude plugin install engineering-principles@suarja-plugins
```

## Provenance and adaptation

The source paths and license are recorded in [`UPSTREAM.md`](UPSTREAM.md).
The local skills preserve the distinct decision tests while removing pstack's
Cursor-only invocation metadata and cross-skill router assumptions.
