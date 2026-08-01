# claude-plugins

Personal registry of Claude Code plugins by [@suarja](https://github.com/suarja).

This repository also exposes a Codex-compatible catalogue at
`.agents/plugins/marketplace.json`. The Claude Code catalogue remains at
`.claude-plugin/marketplace.json`; both catalogues reference the same root
plugin in [`suarja/convex-template`](https://github.com/suarja/convex-template).

## Plugins

### [codebase-wiki](./codebase-wiki/) — Karpathy-style codebase wiki

Turn any codebase into a navigable wiki for LLM agents — without RAG.

Inspired by Andrej Karpathy's [wiki pattern](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f): instead of vectorizing everything, maintain a compact `docs/index.md` that agents read first. Progressive disclosure — load only what you need.

**Commands:**
- `/doc-init` — scan the codebase and generate `docs/index.md` (3 depths: `--quick`, default, `--deep`)
- `/doc-update` — update the index after a working session (scoped to changed files only)
- `/doc-audit` — review and rewrite `CLAUDE.md` / `GEMINI.md` using Claude Code best practices

**How it works:**
```
CLAUDE.md          ← always in context (~65 lines max)
  └── @docs/index.md   ← loaded on demand, one-line per component
        └── individual files   ← loaded only when needed
```

→ [Full documentation](./codebase-wiki/README.md)

---

## Install

**Via Claude Code** (recommended):

1. Type `/plugin` in Claude Code
2. Navigate to the **Marketplace** tab (right side)
3. Click **Add Marketplace** and paste:
   ```
   git@github.com:suarja/claude-plugins.git
   ```
4. The plugins appear — install each one individually from the UI

**Via script:**

```bash
git clone git@github.com:suarja/claude-plugins.git ~/claude-plugins
cd ~/claude-plugins && ./install.sh codebase-wiki
```

Then reload in Claude Code:
```
/reload-plugins
```

### Codex

Add the catalogue and install the Convex setup plugin:

```bash
codex plugin marketplace add suarja/claude-plugins --ref main --sparse .agents/plugins
codex plugin add convex-app-setup@suarja-plugins
```

The plugin source is pinned to the `dev` branch of `suarja/convex-template`
until the first tagged release exists.

## Adding a plugin

1. Create a directory: `<plugin-name>/`
2. Add `.claude-plugin/plugin.json` manifest
3. Add components in `commands/`, `skills/`, `agents/`, `hooks/` as needed
4. Add an entry to `.claude-plugin/marketplace.json`
5. Push — the marketplace updates automatically

Plugin structure follows the [Claude Code plugin spec](https://code.claude.com/docs/fr/plugins-reference).
