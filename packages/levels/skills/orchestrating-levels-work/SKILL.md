---
name: orchestrating-levels-work
description: Orchestrate Levels product and development work. Use when resuming the project, choosing a stack, refining a product slice, coordinating agents, creating a spec or plan, implementing an approved slice, reviewing delegated work, validating a web/mobile result, or preparing a handoff.
---

# Orchestrating Levels Work

## Core rule

Remain the context guardian. Own product dialogue, durable documentation, phase
transitions, delegation and final verification. Give other agents bounded tasks;
never let them infer product decisions from an unrecorded conversation.

Build Levels through small visible slices:

> one user gesture → only the modules required for that gesture → an inspectable
> result → user feedback → the next slice.

Do not generalize future sources, renderers or AI capabilities before a second
real case exposes what varies.

## Start every turn

1. Read `AGENTS.md`, `CONTEXT.md`, `docs/PROJECT_BRIEF.md`,
   `docs/chantier.md`, and only the active sources linked there.
2. Reconcile recorded state with Git. Check an active agent only when a
   decision or handoff actually depends on its status; do not poll routine progress.
3. Announce the active slice, phase, gate and next milestone.
4. Do not implement while the current gate is closed.

## Phase machine

Exactly one phase is active in `docs/chantier.md`.

| Phase | Exit gate |
|---|---|
| `ORIENT` | state, sources and current question identified |
| `EXPLORE` | product and technical alternatives evidenced |
| `DECIDE` | material user decisions recorded |
| `DESIGN` | flow, visible result and exclusions approved |
| `BUILD` | approved slice implemented |
| `VERIFY` | proportional checks and visual inspection passed |
| `RECORD` | durable docs, state and handoff updated |

Return to an earlier phase whenever feedback changes the slice. A phase is not
progress if its gate has not been satisfied.

## Slice contract

Before `BUILD`, record:

- the single user-visible gesture;
- the expected inspectable result;
- what is included;
- what is explicitly excluded;
- the modules and data strictly required now;
- how the result will be verified.

Prefer an end-to-end slice over infrastructure. A temporary surface is allowed
when it is the fastest way to inspect real behavior, but label it as such.

## Architecture discipline

- Reuse proven patterns from `../MediumShip`, `../panoptik`,
  `../editia`, and `../Ideo` before inventing one.
- Design deep modules: hide real behavior behind a small interface.
- Do not create an adapter seam for hypothetical variants. Introduce a shared
  interface when a second real implementation proves the variation.
- Share domain types, schemas, backend behavior and tokens when useful; do not
  force web and mobile to share the same renderer.
- Add dependencies and backend infrastructure only for the active slice.
- Read `convex/_generated/ai/guidelines.md` before any Convex change.

## Product and visual gates

- Explain why each product question is needed and what its answer changes.
- Validate material interaction or visual changes with a lightweight mockup
  before product implementation.
- Keep technical correctness and user validation as separate gates.
- Never turn an exploratory document or historical plan into authorization.

## Delegation

| Role | Authority |
|---|---|
| Orchestrator | product dialogue, state, specs, delegation, review, validation |
| Auditor | read-only evidence; no product decisions |
| Researcher | bounded comparison with sources; no product decisions |
| Implementer | approved slice only; exact files and checks reported |
| Reviewer | spec compliance, then code quality; no feature expansion |

The orchestrator remains accountable. Inspect diffs and relevant behavior
before accepting an agent's completion claim. Use an isolated worktree when
concurrent changes require it; protect the assigned checkout and stage exact paths.

## Documentation contract

- `docs/direction/11-presi-2027-le-decodeur.md`: what the product is.
- `CONTEXT.md`: stable ubiquitous language only.
- `docs/PROJECT_BRIEF.md`: living vision, current direction and open questions.
- `docs/foundations/`: validated product foundations.
- `docs/research/`: evidence and landscapes.
- `docs/adr/`: consequential technical decisions.
- `docs/chantier.md`: single operational truth.
- `docs/plans/`: approved designs or plans, not automatic authorization.

Do not create duplicate PRDs or chronological session logs. Route discoveries
according to `docs/agents/memory.md`.

## Verification and close

**Commit early and often.** In authorized work, implementers commit coherent
checkpoints on their assigned branch after proportional checks. The orchestrator
reviews commits and commits any coherent handback left uncommitted. Never defer
committing until user acceptance, native capture, a product gate, or the whole
tranche is finished. Record missing or failing checks. A local commit is a
checkpoint, not product acceptance or permission to push, merge, or deploy.

Keep verification proportional to the slice. Use relevant tests, typecheck and
phone/web/tablet inspection as appropriate; do not run exhaustive matrices by
habit. Before handoff, update the state, link every active source, record open
decisions and ensure a fresh agent can identify the next gate without reading
the full conversation.
