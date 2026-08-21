# Upstream sources

This plugin keeps the portable workflow ideas from pstack and rewrites their
runtime edges for Codex and Claude Code. It does not copy the full pstack
router, Cursor commands, or model configuration.

- Repository: https://github.com/poteto/plugins
- Source paths:
  - `pstack/skills/figure-it-out/SKILL.md`
  - `pstack/skills/interrogate/SKILL.md`
  - `pstack/skills/show-me-your-work/SKILL.md`
  - `pstack/skills/reflect/SKILL.md`
- License: MIT, copyright Lauren Tan
- Local adaptations:
  - `skills/figure-it-out/SKILL.md`
  - `skills/interrogate/SKILL.md`
  - `skills/show-me-your-work/SKILL.md`
  - `skills/reflect/SKILL.md`

Removed or rewritten runtime assumptions include Cursor slash commands, named
model lists, Cursor transcript locations, Cursor built-ins, and automatic
skill-file edits without owner approval.
