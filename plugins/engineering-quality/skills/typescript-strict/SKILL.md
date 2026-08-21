---
name: typescript-strict
description: Use when introducing TypeScript, reviewing type safety, or migrating an existing project toward strict mode and hardening flags without creating an unmanageable error wall.
---

# TypeScript Strictness

Treat the compiler as a bug-finding boundary, not an obstacle to silence.
Strictness should make invalid states harder to represent while keeping the
migration reviewable and reversible.

## First inspect

Before proposing flags or edits, inspect the repository's `tsconfig` files,
package scripts, test runners, generated code, and third-party type boundaries.
Determine whether the work is greenfield or a migration. Measure current
errors per flag with the repository's actual compiler command; label estimates
as estimates.

## Target rules

The floor is `strict: true`. Where the project can support them, evaluate these
hardening flags explicitly:

```jsonc
{
  "strict": true,
  "noUncheckedIndexedAccess": true,
  "exactOptionalPropertyTypes": true,
  "noImplicitOverride": true,
  "noImplicitReturns": true,
  "noFallthroughCasesInSwitch": true,
  "noUnusedLocals": true,
  "noUnusedParameters": true,
  "forceConsistentCasingInFileNames": true
}
```

Apply the repository's supported subset; do not copy this block blindly over
generated or vendor configuration.

Prefer:

- `unknown` plus a type guard or schema validation over `any`;
- narrowing over `as`, `!`, or `@ts-ignore`;
- `satisfies` when checking a value without widening it;
- discriminated unions over bags of optional properties;
- explicit return types on exported/public functions;
- exhaustive switches with a `never` check;
- one documented cast inside a validating boundary when a library or
  deserializer genuinely escapes the type system.

## Migration order

1. Stop new violations in changed files with lint or a diff-based CI check.
2. Enable/fix `noImplicitAny` with real types.
3. Enable/fix null safety and function strictness.
4. Consolidate the strict family under `strict: true`.
5. Enable `noUncheckedIndexedAccess`, then
   `exactOptionalPropertyTypes`.
6. Remove obsolete suppressions; every surviving `@ts-expect-error` needs a
   reason and an owner. Scope noisy flags per directory/project reference if
   necessary, and ratchet the boundary tighter rather than growing an allowlist.

## Deliverable

For new code, return strict-compliant changes and the compiler/test proof. For
a migration, return the current error count per flag, enablement order,
scoping/ratchet plan, remaining boundary casts, and the exact commands run.
Never fix a strict error by widening to `any`, adding a bare non-null assertion,
or hiding the error behind an unbounded suppression list.
