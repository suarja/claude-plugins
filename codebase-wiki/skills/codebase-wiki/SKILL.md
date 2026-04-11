---
name: codebase-wiki
description: Creates and maintains a Karpathy-style docs/index.md for any codebase — a compact, agent-readable wiki that enables progressive disclosure. Use this skill when the user invokes /doc-init, /doc-update, /doc-audit, or mentions "initialise la doc", "mets à jour l'index", "scanne la codebase", "crée un index de la codebase". Also trigger when docs/index.md is missing or stale. Slash commands /doc-init, /doc-update, /doc-audit are the primary entry points — this skill provides the detailed instructions for each.
---

# codebase-wiki

This skill creates a **docs/index.md** — a compact Karpathy-style wiki index that lets any LLM agent navigate a codebase without scanning everything every session. Think of it as replacing RAG with a human-maintained, structured map.

The architecture mirrors how Claude Code skills work:
- `CLAUDE.md` → always loaded, contains project conventions + pointer to the index
- `docs/index.md` → loaded on demand, one-line summary per component/doc
- Individual files → loaded only when the agent needs the detail

Read `references/file-conventions.md` before creating or editing any doc files.

---

## Commands

### `/doc init` — Initialize the wiki (three depths)

Choose the depth based on codebase size and available time.

#### `--quick` (fastest, ~1-2 min)
**Use when**: large codebase, just want an arborescence, first pass.

Steps:
1. Run a recursive directory listing of the project root (exclude `node_modules`, `.git`, build dirs, binary files)
2. Identify the top-level directories and any `CLAUDE.md` / `README.md` at each level
3. Read only the first 3 lines of each `CLAUDE.md` you find (for status/description)
4. Build `docs/index.md` with: arborescence table + status column (`active` / `legacy` / `archive` / `unknown`)
5. Leave description cells blank — mark them `<!-- todo -->`

#### default (balanced, ~5-10 min)
**Use when**: medium codebase, starting a new project, first real working session.

Steps:
1. Run the quick scan first (step 1-2 above)
2. For each active sub-project or significant directory: read its `CLAUDE.md` or `README.md` (first 20 lines max)
3. For each file in `docs/` (excluding `archive/`): read its frontmatter only (first 5 lines)
4. Build `docs/index.md` with descriptions filled in from what you read
5. Add frontmatter to any `docs/` file that doesn't have one yet (see `references/file-conventions.md`)
6. Add `@docs/index.md` import to root `CLAUDE.md` if it's not already there

#### `--deep` (comprehensive, ~15-30 min)
**Use when**: onboarding to an unfamiliar codebase, doing a full audit, creating the definitive index.

Steps:
1. Run the default scan first
2. For each active sub-project: read its full `CLAUDE.md` and the first 30 lines of its main entry point (e.g., `index.ts`, `app.tsx`, `main.py`)
3. For each file in `docs/` (excluding `archive/`): read the full file
4. Build a richer `docs/index.md` — add a "notes" column with key architectural decisions or gotchas
5. Cross-reference: if two files mention the same concept, add a "see also" note
6. Identify gaps: note in the index what's missing documentation

---

### `/doc update` — Update the wiki after a session

**Use when**: end of a working session, after adding/modifying files, when the user asks to "update the index".

Steps:
1. Look at what changed in this session: modified files, new files, deleted files (use `git diff --name-only HEAD` or recall from session context)
2. For each changed file that has an entry in `docs/index.md`: update its description and `last_updated`
3. For each new file that should be indexed: add an entry + add frontmatter to the file if it's a markdown doc
4. For each deleted file: remove or mark its entry as `archived`
5. Update `docs/index.md` header line: `Last updated: YYYY-MM-DD`
6. If the root `CLAUDE.md` was changed: verify the `@docs/index.md` import is still present

Keep the update scoped — don't rescan the whole codebase. Only touch what changed.

---

## docs/index.md format

Always use this exact structure:

```markdown
# Codebase Index
Last updated: YYYY-MM-DD

## Active

| Path | Description | Status |
|------|-------------|--------|
| `web/` | Next.js app, main product surface | active |
| `server-analyzer/` | TikTok scraping + GPT analysis | active |
| `docs/superpowers/specs/2026-04-11-*.md` | Product spec, read first | reference |

## Sub-project docs

| Path | Description | Status |
|------|-------------|--------|
| `web/CLAUDE.md` | Web conventions, routing, i18n rules | active |
| `server-analyzer/CLAUDE.md` | API endpoints, LLM model config | active |

## Legacy / Archive

| Path | Description | Status |
|------|-------------|--------|
| `server-primary/` | Old backend, do not extend | legacy |
| `editia-core/` | Shared package, migrating to Convex | legacy |
| `docs/archive/` | Previous pivot docs | archive |
```

Rules:
- Maximum 40 rows total — if more, group into sections
- Descriptions must fit on one line (< 80 chars)
- Paths are relative to project root
- Keep the `## Legacy / Archive` section — it tells agents what NOT to touch

---

## CLAUDE.md integration

After running `/doc init`, add this line near the top of the root `CLAUDE.md`, right after the project description:

```markdown
For codebase navigation: @docs/index.md
```

This uses Claude Code's `@import` syntax — the index is pulled into context on demand, not always. The root `CLAUDE.md` stays minimal (conventions, commands, gotchas only — see best practices below).

---

## What makes a good CLAUDE.md (apply to all agent files)

Based on Claude Code best practices — use this when creating or reviewing any `CLAUDE.md`, `GEMINI.md`, or `AGENTS.md`:

**Include:**
- Bash commands agents can't guess (build, test, type-check commands)
- Code style rules that differ from defaults
- Architectural decisions specific to this project
- Common gotchas and non-obvious behaviors
- Testing instructions and preferred test runners
- Repo etiquette (branch naming, PR conventions, commit format)

**Exclude:**
- Anything the agent can figure out by reading the code
- Standard language conventions
- Detailed API documentation (link to docs instead)
- File-by-file descriptions of the codebase ← that's what `docs/index.md` is for
- Information that changes frequently

**The test**: for each line in CLAUDE.md, ask: *"Would removing this cause the agent to make mistakes?"* If not, cut it.

**Size**: if CLAUDE.md is over ~100 lines, critical rules get lost. Use `@import` to split into topic files. Never put the codebase map in CLAUDE.md — keep it in `docs/index.md`.

---

## File conventions

See `references/file-conventions.md` for the frontmatter spec and naming rules.
