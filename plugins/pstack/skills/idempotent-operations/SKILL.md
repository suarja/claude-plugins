---
name: idempotent-operations
description: Use when designing commands, lifecycle steps, scheduled jobs, uploads, or mutations that may be retried, restarted, or resumed after a partial crash.
---

# Idempotent Operations

Make repeated or interrupted execution converge to the same correct end state.
Every state-mutating operation must answer what happens when it runs twice and
when it crashes after each external side effect.

## Design questions

Trace the operation's phases and identify the durable state after each one.
Then check:

1. Does a second run recognize completed work instead of duplicating it?
2. Can a restart reconcile stale, partial, or orphaned state?
3. Are keys, writes, cleanup, and scheduling based on stable identity/content
   rather than creation order or an in-memory flag?
4. Does a retry preserve authorization, quotas, and ownership?
5. Is the terminal state observable and safe for callers to resume from?

Prefer upserts with stable keys, explicit state transitions, reconciliation,
leases with expiry, and atomic compare-and-set where appropriate. Do not call an
operation idempotent merely because it catches an error or ignores a duplicate.

## Proof

Test a fresh run, an immediate repeat, a retry after each meaningful failure
point, stale state recovery, and concurrent duplicate requests when those paths
are possible. Record the convergent end state and any intentionally non-repeatable
side effect.
