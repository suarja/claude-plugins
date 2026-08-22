# Upstream source

This plugin is a small Codex/Claude Code adapter, not a copy of an unrelated
catalog. The upstream skill is already runtime-portable; the local packaging
adds Codex/Claude manifests, marketplace metadata, and provenance.

- Repository: https://github.com/poteto/plugins
- Source plugin: `cli-for-agent`
- Source skill: `cli-for-agent/skills/cli-for-agents/SKILL.md`
- License: MIT, copyright Cursor

The skill retains the source's decision tests for non-interactive execution,
layered help, examples, stdin/pipelines, actionable errors, idempotency,
dry-run, predictable command structure, and structured success output.
