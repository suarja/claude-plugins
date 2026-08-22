---
name: marketplace-skill-contributor
description: >-
  Creates, imports, or updates a Codex/Claude skill in the central Suarja
  marketplace. Use when a skill must be routed to the right existing plugin or
  a new plugin, recorded in both marketplace manifests, validated, published,
  and refreshed in the installed cache instead of remaining local.
---

# Marketplace skill contributor

Use this as the marketplace recipe. A local skill file is a staging artifact;
the central marketplace repository is the source of truth.

## Model the package

- A skill is one focused skills/<skill-name>/SKILL.md.
- A plugin is the installable namespace that owns one or more related skills.
- A marketplace is the catalogue that exposes plugins to Codex and Claude.
- “Recipe” is an informal name for this workflow, not another plugin manifest type.

## Find the source of truth

Use the configured marketplace repository at
https://github.com/suarja/claude-plugins. Find or create a checked-out clone
and verify its remote before writing. Do not make ~/.agents/skills,
~/.codex/skills, or a project's .agents/skills the final destination.
Those locations may be used only for temporary experiments or the installed
cache.

Inspect first:

- .agents/plugins/marketplace.json for Codex;
- .claude-plugin/marketplace.json for Claude Code;
- existing plugins/*/.codex-plugin/plugin.json;
- existing skill names and upstream provenance;
- the repository README and current Git status.

Preserve unrelated work. Never reset, clean, stash, or overwrite another
contributor's changes.

## Route before creating

Search for an existing owner before creating a plugin or skill.

- If an existing plugin owns the source family, add the skill there.
- Keep pstack-derived skills under plugins/pstack.
- Keep CLI-for-agent guidance under plugins/cli-for-agent.
- Keep product-copy auditing under plugins/ux-writing-audit.
- Keep engineering quality and architecture skills in their existing packs.
- Create a new plugin only when no existing plugin has a clear ownership boundary.

Do not create a second skill with the same name or copy an existing skill into a
new plugin just to make it easier to find. Source identity and a single
canonical owner are more important than functional grouping.

## Adapt and package

Read the upstream skill and retain only the useful, portable guidance. Remove
Cursor-only hooks, hidden transcript paths, named model configuration, slash
commands, and runtime assumptions unless they have a real Codex equivalent.
Preserve the upstream source path and license in UPSTREAM.md and a
THIRD-PARTY-LICENSE.txt when adapting third-party material.

For a new plugin, provide:

- .codex-plugin/plugin.json;
- .claude-plugin/plugin.json;
- skills/<skill-name>/SKILL.md;
- a concise README.md;
- provenance and license files when the content is adapted.

For an existing plugin, change only the bounded skill, metadata, documentation,
and catalogue entries required by the request.

## Update both catalogues

Add or update one entry in each catalogue:

- .agents/plugins/marketplace.json with source.path,
  policy.installation, policy.authentication, and category;
- .claude-plugin/marketplace.json with the matching plugin path, version,
  description, and author.

Update the root README's plugin list and install commands when the marketplace
surface changes. Keep plugin names, paths, and versions consistent across
manifests and catalogues.

## Validate the package

Before publication:

1. Parse every changed JSON manifest with python3 -m json.tool.
2. Check each SKILL.md starts with valid YAML frontmatter containing the
   matching name and a discriminating description.
3. Run the bundled plugin-creator and skill-creator validators when their
   dependencies are available. If a validator is blocked, report NOT RUN
   and perform a lightweight frontmatter, placeholder, file-existence, and
   catalogue check.
4. Run git diff --check.
5. Stage only the exact plugin, catalogue, README, and provenance paths, then
   inspect the staged diff.

Do not claim publication from a green local validator. Publication, remote
push, marketplace refresh, installation, and skill discovery are separate
proofs.

## Publish and refresh

When the owner has authorized publication:

1. Commit a small, coherent change and record the commit.
2. Push the intended branch or main according to the owner's instruction.
3. Refresh the configured Codex marketplace:

       codex plugin marketplace upgrade suarja-plugins --json

   If the marketplace was installed with a sparse checkout that omits the new
   plugin, re-add the configured source with .agents/plugins and plugins
   sparse paths before installing. Do not hand-edit Codex's global config.
4. Install or reinstall the plugin:

       codex plugin add <plugin-name>@suarja-plugins --json

5. Verify installed: true, enabled: true, the expected version, the source
   path, and the expected cached SKILL.md.
6. Start a new Codex conversation before relying on newly added skills.

For Claude Code, refresh the marketplace and install the same plugin using its
CLI or UI. Report Codex and Claude states separately.

## Deliverable

Report the canonical plugin and skill path, routing decision, upstream
adaptation boundary, changed catalogues, validation results, commit and push
state, installed cache evidence, and any NOT RUN or BLOCKED checks.
