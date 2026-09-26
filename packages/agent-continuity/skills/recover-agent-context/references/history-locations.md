# History locations and search

These are common local layouts, not a promise that a particular installation uses them. Inspect the host before assuming a path.

## Claude Code

- Typical root: `~/.claude/projects/<encoded-working-directory>/<session-id>.jsonl`.
- Typical children: `~/.claude/projects/<encoded-working-directory>/<session-id>/subagents/agent-*.jsonl`. Other project directories or worktree paths may hold related sessions.
- Inspect JSONL metadata, assistant messages, dispatch tool calls, tool results, and child files. Match a child to the parent using IDs, brief text, timestamps, or parent references rather than a filename alone.
- Search by a rare exact phrase with `rg -l -F '<phrase>' ~/.claude/projects`; scope by project first if known. Use `rg -n -F` only after narrowing and truncate individual lines or parse JSON so that one embedded transcript does not flood context.
- A log may contain queued operations, summaries, retries, or compaction. Reconstruct the sequence by timestamp and event identity, not just file order if they disagree.

## Codex

- Prefer Codex app task tools for task discovery, archived tasks, current status, and recent turns when available.
- Local rollouts commonly live at `~/.codex/sessions/YYYY/MM/DD/rollout-<timestamp>-<id>.jsonl`; archived or other-host history can differ.
- Inspect `session_meta` and `response_item` / `event_msg` records for thread ID, parent thread ID, working directory, model, time, and messages. Follow task creation and agent dispatch records to descendants. Some content may be encrypted or absent locally; mark it unavailable.
- Search an exact excerpt within the narrowest plausible date or project scope; task title or summary is an index, not proof of content.

## Evidence pointers

Record absolute source path plus line number for a local JSONL event, or task ID plus turn/event for an app task. For long JSONL records, extract only the relevant field with a JSON parser and cite the original line. Keep secrets out of output. Search results identify candidates; confirmation comes from parsed records.
