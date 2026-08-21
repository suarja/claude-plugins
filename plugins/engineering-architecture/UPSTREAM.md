# Upstream sources

This plugin contains one synthesis and one selective adaptation. It does not
ship duplicate copies of the upstream catalogs.

## Design synthesis

- Repository: https://github.com/poteto/plugins
- Source paths:
  - `pstack/skills/architect/SKILL.md`
  - `pstack/skills/how/SKILL.md`
  - `pstack/skills/why/SKILL.md`
- License: MIT, copyright Lauren Tan
- Repository: https://github.com/SkillMedev/skills
- Source path: `skills/technical-spec/SKILL.md`
- License: MIT, copyright Alexander Ouellet
- Local synthesis: `skills/engineering-architecture/SKILL.md`

The local design skill keeps caller-first sketches, explicit module/type
boundaries, re-grounding when implementation disproves the design, and the
technical-spec sections that prevent scope and rollout surprises. The local
`how` skill keeps traced runtime explanations and ownership/layering critique;
the local `why` skill keeps evidence-first historical investigation and
confidence calibration. Model-arena runners, source-specific slash commands,
and framework-specific invocation details were removed.

## Threat modeling

- Repository: https://github.com/SkillMedev/skills
- Source path: `skills/threat-model-stride/SKILL.md`
- License: MIT, copyright Alexander Ouellet
- Local adaptation: `skills/threat-model-stride/SKILL.md`

The STRIDE procedure retains explicit trust boundaries, all six categories,
DREAD-light exploitability/impact scoring, concrete controls, and separate
review for schema/dependency changes.
