# codebase-wiki

A Claude Code plugin that generates and maintains a **Karpathy-style `docs/index.md`** — a compact, agent-readable wiki that replaces RAG for codebase navigation.

> Inspired by Andrej Karpathy's [wiki pattern](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f): instead of vectorizing everything, maintain a structured map that agents read first.

## The Problem

Every new Claude Code session, the agent has to re-discover your codebase from scratch. It reads too much, misses context, or asks what files to look at. RAG is overkill for most projects.

## The Solution

A three-layer progressive disclosure system:

```
CLAUDE.md               ← always loaded (~65 lines, critical rules only)
  └── @docs/index.md    ← loaded on demand (one-line per component, ~40 rows max)
        └── files       ← loaded only when the agent needs the detail
```

The agent reads `CLAUDE.md` first, knows to load `docs/index.md` for navigation, and only digs into individual files when working on them. Context stays lean.

## Commands

### `/doc-init` — Initialize the wiki

Scans the codebase and generates `docs/index.md`. Three depths:

| Flag | Time | Use case |
|------|------|----------|
| `--quick` | ~1-2 min | First pass, large codebase |
| *(default)* | ~5-10 min | Starting a new project or session |
| `--deep` | ~15-30 min | Full onboarding, unfamiliar codebase |

Also adds `@docs/index.md` import to your root `CLAUDE.md`.

### `/doc-update` — Update after a session

Scoped update — looks at what changed (git diff), updates only affected entries. Doesn't rescan the whole codebase.

### `/doc-audit` — Audit and clean CLAUDE.md

Reviews your `CLAUDE.md` (and `GEMINI.md` / `AGENTS.md` if present) against Claude Code best practices:

- Removes: file descriptions, architecture diagrams, anything the agent can infer from code
- Keeps: build commands, gotchas, conventions, non-obvious behaviors
- Reports before/after line count

## docs/index.md format

```markdown
# Codebase Index
Last updated: YYYY-MM-DD

## Active

| Path | Description | Status |
|------|-------------|--------|
| `web/` | Next.js app, main product surface | active |
| `server/` | API + background jobs | active |

## Legacy / Archive

| Path | Description | Status |
|------|-------------|--------|
| `mobile/` | React Native app — frozen | legacy |
| `docs/archive/` | Previous pivot docs | archive |
```

## Install

Via Claude Code:
1. Type `/plugin` → go to the **Marketplace** tab
2. Click **Add Marketplace** → paste `git@github.com:suarja/claude-plugins.git`
3. Install **codebase-wiki** from the list

Or manually:
```bash
cd ~/claude-plugins && ./install.sh codebase-wiki
# then /reload-plugins in Claude Code
```
