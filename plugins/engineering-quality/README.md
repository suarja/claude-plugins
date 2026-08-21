# Engineering Quality

> A small, practical quality pack for agents working on real codebases.

This plugin combines the useful, non-runtime-specific parts of two upstream
skill collections. It is deliberately not a mirror of either catalog: each
skill is a Codex/Claude-compatible adapter with the project context and proof
requirements an agent needs to produce an actionable result.

## Included skills

| Skill | Use it when |
|---|---|
| `maintainability-review` | A change works but may add tangled control flow, weak boundaries, duplication, or unnecessary abstraction. |
| `typescript-strict` | New TypeScript or a migration needs strict compiler guarantees without a risky big-bang switch. |
| `coverage-gap-finder` | Coverage exists but the team needs the riskiest missing branches ranked by impact and change frequency. |
| `characterization-test-writer` | Existing behavior must be pinned before a refactor, including behavior that may be a known bug. |
| `flaky-test-detangler` | A test fails intermittently and the hidden timing, ordering, clock, network, or shared-state dependency must be removed. |

The skills intentionally hand off to one another: coverage-gap-finder decides
what deserves a test, characterization-test-writer pins behavior before a
refactor, and flaky-test-detangler protects the evidence. None of them is a
mutation-testing skill or a generic code-review checklist.

## Install

### Codex

```bash
codex plugin marketplace add suarja/claude-plugins --ref main --sparse .agents/plugins
codex plugin add engineering-quality@suarja-plugins
```

### Claude Code

```bash
claude plugin marketplace add suarja/claude-plugins
claude plugin install engineering-quality@suarja-plugins
```

## Provenance and adaptation

The source families and licenses are recorded in [`UPSTREAM.md`](UPSTREAM.md).
The working skill bodies are intentionally rewritten into short, portable
procedures; the original Cursor-only switches, model-arena dependencies, and
unrelated runtime assumptions are not shipped. See
[`THIRD-PARTY-LICENSE.txt`](THIRD-PARTY-LICENSE.txt) for the retained MIT
notices.
