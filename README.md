# claude-plugins

Personal registry of Claude Code plugins by [@suarja](https://github.com/suarja).

This repository also exposes a Codex-compatible catalogue at
`.agents/plugins/marketplace.json`. The Claude Code catalogue remains at
`.claude-plugin/marketplace.json`; both catalogues reference the same root
plugin in [`suarja/convex-template`](https://github.com/suarja/convex-template).

## Plugins

### [pstack](./plugins/pstack) — selected engineering toolkit

Use the selected pstack family in one install: `unslop`, `how`, `why`,
`architect`, auditable workflows, adversarial review, decision trails, and
portable engineering principles.

### [ux-writing-audit](./plugins/ux-writing-audit) — product copy audit

Audit interface copy across buttons, labels, errors, empty states, toasts,
tooltips, and locales. Produces scored findings, rewrites, a terminology
glossary, and a voice-and-tone reference.

### [engineering-quality](./plugins/engineering-quality) — clean code and proof

Review maintainability, migrate TypeScript strictness safely, rank coverage
gaps by risk, pin behavior before refactors, and remove the root causes of
flaky tests.

### [engineering-architecture](./plugins/engineering-architecture) — design before code

Sketch module and type boundaries, write implementation-ready technical specs,
and threat-model security-sensitive designs with STRIDE and concrete controls.

### [cli-for-agent](./plugins/cli-for-agent) — agent-friendly CLI design

Design and review CLIs that agents can run reliably: non-interactive flags,
layered help with examples, stdin and pipelines, actionable errors,
idempotency, dry-run, predictable structure, and machine-useful output.

### [marketplace-authoring](./plugins/marketplace-authoring) — central skill publishing

Route new skills to the right plugin, maintain both marketplace catalogues,
preserve provenance, validate the package, publish it, and refresh the Codex
cache instead of leaving skills only in local agent directories.

### [relay-ops](./plugins/relay-ops) — editorial and publication preparation

Prepare channel-specific content, attach verified product media, and stage
human-reviewed publications for a social control plane. The skills never make
the final publication click.

### [mobile-visual-validation](./plugins/mobile-visual-validation/) — evidence and showcase production

Validate responsive/native surfaces with the strongest available evidence and
use `app-showcase-pipeline` to produce localized App Store/Play Store captures
and vertical app demo videos from one source manifest. The pipeline keeps the
phone shell, screen recording, text, logo, and background as independent
layers, preflights safe-area collisions, and records the locale/device/source
provenance for every export.

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

**Via Claude Code CLI:**

```bash
claude plugin marketplace add suarja/claude-plugins
claude plugin install pstack@suarja-plugins
claude plugin install ux-writing-audit@suarja-plugins
claude plugin install engineering-quality@suarja-plugins
claude plugin install engineering-architecture@suarja-plugins
claude plugin install cli-for-agent@suarja-plugins
claude plugin install marketplace-authoring@suarja-plugins
claude plugin install relay-ops@suarja-plugins
```

Refresh an existing Claude Code marketplace before installing an update:

```bash
claude plugin marketplace update suarja-plugins
```

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

Add the catalogue and install the plugins you need:

```bash
codex plugin marketplace add suarja/claude-plugins --ref main --sparse .agents/plugins --sparse plugins
codex plugin add convex-app-setup@suarja-plugins
codex plugin add pstack@suarja-plugins
codex plugin add ux-writing-audit@suarja-plugins
codex plugin add engineering-quality@suarja-plugins
codex plugin add engineering-architecture@suarja-plugins
codex plugin add cli-for-agent@suarja-plugins
codex plugin add marketplace-authoring@suarja-plugins
codex plugin add relay-ops@suarja-plugins
```

Refresh the marketplace snapshot later with:

```bash
codex plugin marketplace upgrade suarja-plugins
```

All marketplace plugins expose Codex-compatible manifests alongside their
Claude Code manifests. The imported skills are selective: `pstack` keeps only
the pstack family that earns its place, `ux-writing-audit` keeps one audit
adapter, and the engineering packs keep only distinct quality, technical-spec,
and security procedures. Their upstream sources and MIT notices remain
documented without copying unrelated catalogs or runtime-specific commands.

The plugin source is pinned to the `dev` branch of `suarja/convex-template`
until the first tagged release exists.

## Adding a plugin

1. Create a directory: `<plugin-name>/`
2. Add `.claude-plugin/plugin.json` manifest
3. Add components in `commands/`, `skills/`, `agents/`, `hooks/` as needed
4. Add an entry to `.claude-plugin/marketplace.json`
5. Push — the marketplace updates automatically

Plugin structure follows the [Claude Code plugin spec](https://code.claude.com/docs/fr/plugins-reference).
