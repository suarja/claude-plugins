# Marketplace Authoring

> The recipe for keeping Suarja skills centralized, routable, and installable.

Use this plugin when creating, importing, or updating a skill that should live
in the shared marketplace. It makes the distinction explicit:

- a skill is a skills/<name>/SKILL.md workflow;
- a plugin is the installable package and namespace;
- a marketplace is the catalog that exposes the package to Codex and Claude;
- a “recipe” is the workflow documented by the skill, not a separate manifest type.

## Included skill

| Skill | Use it when |
|---|---|
| marketplace-skill-contributor | A new or imported skill must be routed, packaged, published, and refreshed through the central marketplace. |

The skill deliberately keeps local ~/.agents/skills or project-local
.agents/skills copies as temporary work only. The final source of truth is
the marketplace repository, with both Codex and Claude catalogues updated.

## Install

### Codex

    codex plugin marketplace add suarja/claude-plugins --ref main --sparse .agents/plugins --sparse plugins
    codex plugin add marketplace-authoring@suarja-plugins

### Claude Code

    claude plugin marketplace add suarja/claude-plugins
    claude plugin install marketplace-authoring@suarja-plugins
