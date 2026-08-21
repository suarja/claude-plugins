---
name: how
description: Use when explaining how a subsystem, feature flow, or module works, or deciding where code should live and which layer owns it.
---

# How

Build a working mental model from the real code before proposing a change.
Explain the flow and ownership clearly enough that a new engineer can make a
safe edit without reading the whole repository.

## Explore

State your interpretation of the question and its scope. For a simple utility,
trace it directly. For a cross-cutting flow, split the investigation into
non-overlapping paths such as data model/state, entry point/call chain, and
configuration/operational behavior. Read actual symbols and follow callers,
callees, types, and side effects; do not infer architecture from filenames.

Trace from trigger to observable result, including authorization, persistence,
errors, retries, concurrency, and external boundaries. Record the files and
symbols inspected and stop only when the path no longer contains hand-waving.

## Explain

Return the smallest structure that answers the question:

- **Overview:** what the subsystem does and why it exists, based on evidence;
- **Key concepts:** the few types, modules, and boundaries a reader needs;
- **How it works:** the trigger-to-result sequence and decision points;
- **Where it lives:** relevant files and ownership boundaries;
- **Gotchas:** non-obvious behavior, historical constraints, and untested or
  surprising edges;
- **Evidence:** exact paths, symbols, commands, and `NOT RUN`/`BLOCKED` gaps.

If asked to critique, explain the current shape first, then separate findings
into `Act on`, `Consider`, `Noted`, and `Dismissed`. Prefer architectural
problems over stylistic preferences. Do not change files unless requested.
