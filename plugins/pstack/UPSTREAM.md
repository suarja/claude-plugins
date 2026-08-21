# Upstream sources

This is the canonical marketplace adapter for the selected skills from the
upstream pstack plugin. The local files are selective adaptations, not a
verbatim copy of the full Cursor catalog.

- Repository: https://github.com/poteto/plugins
- Source paths:
  - `pstack/skills/unslop/SKILL.md`
  - `pstack/skills/how/SKILL.md`
  - `pstack/skills/why/SKILL.md`
  - `pstack/skills/architect/SKILL.md`
  - `pstack/skills/figure-it-out/SKILL.md`
  - `pstack/skills/interrogate/SKILL.md`
  - `pstack/skills/show-me-your-work/SKILL.md`
  - `pstack/skills/reflect/SKILL.md`
  - `pstack/skills/principle-boundary-discipline/SKILL.md`
  - `pstack/skills/principle-make-operations-idempotent/SKILL.md`
  - `pstack/skills/principle-sequence-verifiable-units/SKILL.md`
  - `pstack/skills/principle-separate-before-serializing-shared-state/SKILL.md`
  - `pstack/skills/principle-build-the-lever/SKILL.md`
- License: MIT, copyright Lauren Tan

The local adapters remove Cursor-only frontmatter, slash commands, model
configuration, transcript paths, built-in skill dependencies, and automatic
skill-file edits without owner approval. The selected skills remain together
under `plugins/pstack` so installing pstack installs the pstack family once.
