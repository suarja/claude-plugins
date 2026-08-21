# UX Writing Audit

> Audit an existing product's interface copy for clarity, consistency, voice,
> actionability, and localization readiness.

Use this skill for a corpus of user-facing strings: buttons, labels, errors,
empty states, toasts, tooltips, modal titles, and localized variants. It
produces concrete rewrites instead of isolated opinions, while keeping the
product's terminology coherent across surfaces and locales.

## What it delivers

- a complete inventory of the strings in scope and their UI context;
- a scored findings table with `Pass`, `Revise`, or `Rewrite` decisions;
- proposed rewrites for every finding that needs work;
- a terminology glossary with canonical terms and rejected collisions;
- a short voice-and-tone reference;
- a tally by surface and locale, with `NOT RUN` or `BLOCKED` called out when
  evidence is missing.

## Localization pass

Each locale is treated as authored product copy, not as a word-for-word
translation. The audit checks naturalness, register, gender, pluralization,
length, capitalization, and collisions with ordinary user language. It also
separates product-controlled strings from user-authored names and descriptions.

For ambiguous concepts such as `book`, the audit compares the actual product
object and user job before choosing terms such as *album*, *journal*, or
*collection of memories* in each locale. The decision and rejected alternatives
are recorded in the glossary.

## Install

### Codex

```bash
codex plugin marketplace add suarja/claude-plugins --ref main --sparse .agents/plugins
codex plugin add ux-writing-audit@suarja-plugins
```

### Claude Code

Add this repository as a marketplace, then install `ux-writing-audit` from the
plugin catalogue. The same plugin also contains the Claude Code manifest.

## Provenance

The audit procedure comes from the MIT-licensed
[Skill Me `ux-writing-audit` skill](https://github.com/SkillMedev/skills/tree/main/skills/ux-writing-audit).
The upstream skill publishes a `SKILL.md`, not a separate README; this file is
the marketplace presentation for the compatible adapter. The original
procedure is preserved in
[`skills/ux-writing-audit/references/upstream-skill.md`](skills/ux-writing-audit/references/upstream-skill.md),
and the Codex-specific adapter is kept in
[`skills/ux-writing-audit/SKILL.md`](skills/ux-writing-audit/SKILL.md).

See [`UPSTREAM.md`](UPSTREAM.md) and
[`THIRD-PARTY-LICENSE.txt`](THIRD-PARTY-LICENSE.txt) for the source and
license record.
