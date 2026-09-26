# Destination dossier shape

Adapt headings to the project. The reader is the **destination agent**, not the owner.

1. **Mandate and first action** — source conversation ID, project, destination role, confirmed goal and priority. Require independent exploration before the first owner check-in.
2. **Authority and scope** — current instructions and docs in reading order, product boundaries, the decisions that govern this work, and exclusions the owner confirmed.
3. **Trajectory** — why the work began, major lots or tranches and the decisions that changed direction. Prefer a short timeline over a message-by-message account.
4. **Agent tree** — parent and descendants, model when known, delegated brief, handback status, and any child result the parent missed.
5. **Current state** — observed branch/worktree/PR/runtime, completed work and proof, current gate, remaining tasks, and blockers. Label reported-only claims and stale snapshots.
6. **Questions and first exploration route** — issues requiring the owner's decision, source files to inspect first, checks that would resolve uncertainty. Do not decide product direction for the owner.
7. **Evidence index** — raw conversation paths or task IDs and precise anchors, documents and commit/PR links. Link focused extracts separately.

Aim for a compact dossier. If a finding requires a large quote or multiple child messages, put a small, titled extract beside the dossier. Each extract names its raw source and anchor. Avoid duplicating source documents, diffs, and full logs.

The copy-paste prompt is delivered separately in chat once the dossier exists. It tells the destination agent to inspect primary sources and current state before reporting back and confirming direction with the owner.
