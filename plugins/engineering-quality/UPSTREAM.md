# Upstream sources

This plugin is a selective adaptation, not a verbatim catalog copy. The local
skill files retain the distinctive procedures that are useful in Codex and
Claude Code, while removing source-specific invocation flags and runtime
assumptions.

## Maintainability

- Repository: https://github.com/poteto/plugins
- Source path: `cursor-team-kit/skills/thermo-nuclear-code-quality-review/SKILL.md`
- License: MIT, copyright Cursor
- Local adaptation: `skills/maintainability-review/SKILL.md`

Retained ideas include code-judo simplification, file-size/decomposition
pressure, canonical ownership boundaries, direct code over magic wrappers,
type cleanliness, and scrutiny of non-atomic or unnecessarily sequential
orchestration. Cursor-only frontmatter and the original product naming were
removed.

## TypeScript, tests, and coverage

- Repository: https://github.com/SkillMedev/skills
- Source paths:
  - `skills/typescript-strict/SKILL.md`
  - `skills/coverage-gap-finder/SKILL.md`
  - `skills/characterization-test-writer/SKILL.md`
  - `skills/flaky-test-detangler/SKILL.md`
- License: MIT, copyright Alexander Ouellet
- Local adaptations:
  - `skills/typescript-strict/SKILL.md`
  - `skills/coverage-gap-finder/SKILL.md`
  - `skills/characterization-test-writer/SKILL.md`
  - `skills/flaky-test-detangler/SKILL.md`

The adaptations preserve the source skills' boundaries: risk-ranked branch
gaps are not mutation testing, characterization is not behavior design, and a
flaky-test fix is not a retry. Commands are described in terms of the current
repository rather than assuming one language, test runner, or hosted CI.
