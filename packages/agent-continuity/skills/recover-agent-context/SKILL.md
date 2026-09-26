---
name: "recover-agent-context"
description: "Use when a user gives a Claude Code or Codex conversation path, session ID, quoted message, or a few clues and wants to find that conversation, trace its subagents, reconstruct the project context, and prepare an agent-facing continuation dossier and copy-paste prompt."
---

# Recover agent context

Reconstruct a past agent's work for a new agent. The dossier is a navigation aid, not a substitute for primary evidence. Work read-only until the user confirms the objective and direction; creating the dossier after that confirmation is part of this skill.

## 1. Find the conversation

1. Identify the input: exact path or ID, a Codex task, a message excerpt, or sparse clues. Record distinctive phrases, project, dates, named files, agents, and models. If no provider is specified, search Claude Code and Codex.
2. Search likely project and date scopes first. Use `rg -l -F` for exact phrases in local logs; return file paths and counts, not whole JSONL lines. Widen the search only if needed. For Codex tasks accessible through the app, use its task listing and read tools as well. See [history-locations.md](references/history-locations.md) for local layouts and parsing.
3. Verify a candidate with at least two independent anchors when available: a distinctive user or assistant passage, session metadata, working directory, timestamp, file or branch references. Quote a short proof and give the exact file and line or event ID. If several candidates remain, show the competing IDs and the ambiguity to the user.
4. Establish the root session and time range. A log's last message shows where recording stopped; determine live status separately from the task UI or process state.

Done when one root conversation is identified with evidence and alternatives are either excluded or named.

## 2. Reconstruct the agent tree

1. Scan dispatches and returns in the root log; follow child IDs, parent IDs, task names, nested child logs, and any separate task records. Inspect **every relevant child**, including children whose final report never reached the parent.
2. For each node, record source file or task ID, parent, model if observed, brief, responsibility, last visible action, result or blocker, and status confidence. Distinguish complete, interrupted, still running, and unknown using current evidence. Do not infer a running agent from an unfinished transcript.
3. Classify role from the brief, responsibilities, and behavior, then corroborate with the model. In this user's vocabulary, architecte L1 maps to GPT-6 Astra, orchestrateur L2 to GPT-6 Sol, and implementer to GPT-6 Luna for a Codex continuation; a model name alone does not prove a role. Trace what the parent saw and what a child did after the parent's final synthesis.

Done when the root and relevant descendants form a concise, sourced tree and any missing handback is surfaced.

## 3. Rebuild the wider context

1. Read the original objective and early decisions, the middle milestones and user corrections, and the latest work. Recover the trajectory across lots or tranches, rather than projecting the last messages backward.
2. Read the repository's current instructions and authority map (for example AGENTS.md, CONTEXT, direction, roadmap, plans, ADRs), then the documents actually cited in the conversation. Treat dated plans as history unless current instructions say otherwise.
3. Inspect relevant Git branches, worktrees, commits, PRs, files, and recent artifacts read-only. Check whether reported work exists in the current checkout and whether a source may have drifted since the conversation. Separate technical tests, product review, device or runtime evidence, and release status.
4. Maintain an evidence ledger: **observed now**, **reported in a log**, **inferred**, **unknown**. Attach source pointers and dates to consequential claims. Preserve disagreements instead of resolving them by guesswork. Keep credentials and personal data out of excerpts.

Done when the larger goal, current gate, verified work, open decisions, risks, and source authority are clear enough to brief a new agent.

## 4. Check direction with the user before writing

Give the user a short, evidence-based point: identified conversation and role tree, recovered objective and trajectory, verified present state, and the orientation you propose for the destination agent. Ask them to confirm or correct the **goal, priority, and destination role**. Explain any uncertainty that changes the handoff. Wait for the answer before creating the destination dossier. Continue independent read-only investigation while waiting when useful. An existing user decision in this conversation counts as an answer; do not ask it again.

Done when the user has confirmed or corrected the orientation.

## 5. Write the destination dossier

Create the artifact in the appropriate project documentation location. Address it **to the destination agent** and follow [dossier-shape.md](references/dossier-shape.md). It must give the agent enough context to act without reciting the transcript.

Use three layers:
- **Dossier**: compact mission, history and decisions, role tree, verified current state, unresolved choices, first exploration route.
- **Focused extracts** when needed: only high-signal child reports, user corrections, gate results, or hidden findings too long for the dossier. Link each extract back to its exact source.
- **Raw history**: stable absolute paths or task IDs, with line ranges, event IDs, or search anchors. Always retain these pointers, even when an extract exists.

State which sources were read, which were only indexed, and what has not been checked. Never silently promote a child's claim or an old document into current truth. Keep the dossier navigable as source logs grow.

Done when every material assertion has a traceable source and the destination agent can find the raw evidence without loading an entire transcript.

## 6. Deliver the continuation prompt

After the dossier exists, give the user a **separate copy-paste prompt in the conversation**. Name the destination agent role and link the dossier. Tell the new agent to inspect the raw conversation, relevant child logs, current docs, and Git or runtime state **independently before its first point with the owner**. Then it should explain what it confirmed, what differs from the dossier, and ask the owner to confirm the orientation before operational work. The dossier is an index, not the sole basis of its first reply.

Create or message a Codex task only if the user explicitly requested that action. Do not relaunch a provider the user has ruled out. Report the dossier path, extract paths if any, raw source pointers, and the prompt.
