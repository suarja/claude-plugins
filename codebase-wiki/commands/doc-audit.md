Audit and rewrite the root CLAUDE.md (and optionally GEMINI.md/AGENTS.md) following Claude Code best practices, then sync with docs/index.md.

## What to do

### Step 1 — Read the current state
1. Read the root CLAUDE.md
2. Read docs/index.md (the codebase map)

### Step 2 — Apply best practices filter

**KEEP in CLAUDE.md:**
- Bash commands agents can't guess (build, test, type-check)
- Code style rules that differ from defaults
- Architectural decisions specific to this project
- Common gotchas and non-obvious behaviors (things that would cause mistakes if missing)
- Testing instructions and preferred test runners
- Repo conventions (commits, branches, PRs)
- Critical rules (e.g. "never write to user_usage from mobile")
- The `@docs/index.md` import pointer

**REMOVE from CLAUDE.md (move or cut):**
- File-by-file or sub-project descriptions → already in docs/index.md
- Architecture flow diagrams that duplicate the spec → link to docs/ instead
- Information that changes frequently
- Anything Claude can figure out by reading the code
- Standard language conventions
- Content over ~100 lines that isn't a critical rule

**Test for each line:** "Would removing this cause Claude to make mistakes?" If no → cut.

### Step 3 — Rewrite
Rewrite CLAUDE.md with only what passed the filter. Keep the same language (fr/en) as the original. Use `@docs/index.md` for the codebase map. Link to specific docs files for detailed architecture (e.g. `@docs/superpowers/specs/...`).

### Step 4 — Sync GEMINI.md
Apply the same pass to GEMINI.md / AGENTS.md if they exist. Keep them consistent with CLAUDE.md (same conventions, same pointers).

### Step 5 — Report
Show a before/after line count and list what was cut/moved/kept.
