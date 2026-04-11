# File Conventions for codebase-wiki

These conventions apply to any markdown file that will be indexed by `docs/index.md`.

---

## Frontmatter spec

Every markdown file in `docs/` (outside `archive/`) should have this frontmatter:

```yaml
---
description: One line — what this file contains (< 80 chars)
status: active | legacy | archive | reference
last_updated: YYYY-MM-DD
---
```

| Field | Required | Notes |
|-------|----------|-------|
| `description` | yes | Used directly in docs/index.md — keep it concise |
| `status` | yes | Tells agents whether to read or skip |
| `last_updated` | yes | ISO date, update whenever you modify the file |

### Status values

- **active** — currently used, agent should read when relevant
- **reference** — important reference doc, read before working on this area
- **legacy** — kept for historical context, don't extend
- **archive** — old pivot / superseded, don't read unless explicitly needed

---

## File naming

- Use lowercase kebab-case: `business-product-builder.md`, not `BusinessProductBuilder.md`
- Prefix with date for specs/plans: `2026-04-11-feature-name.md`
- One topic per file — if a file grows beyond ~150 lines, split it

---

## Header structure (progressive disclosure)

Structure files so an agent reading only the first 10 lines gets the essential context:

```markdown
---
description: ...
status: active
last_updated: 2026-04-11
---

# Title — one line that says exactly what this is

> One sentence summary for agents scanning quickly.

[rest of content]
```

The `>` blockquote after the title is the TL;DR — always include it for files over 30 lines.

---

## What goes in docs/ vs CLAUDE.md

| Content type | Where it goes |
|-------------|---------------|
| Codebase map / component index | `docs/index.md` |
| Architectural decisions & specs | `docs/` files (linked from index) |
| Project conventions & gotchas | `CLAUDE.md` (root) |
| Sub-project specific rules | `<subproject>/CLAUDE.md` |
| Historical / superseded docs | `docs/archive/` |
| Active plans | `docs/plans/` |

---

## docs/archive/ rules

Files in `docs/archive/` are exempt from frontmatter requirements. They exist to preserve history. Never modify archive files — if content is needed again, copy it to a new active file.
