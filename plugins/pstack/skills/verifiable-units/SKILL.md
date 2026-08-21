---
name: verifiable-units
description: Use when executing a migration, sweep, multi-phase change, or stack of commits that can be split into independently checked units.
---

# Verifiable Units

Break work into units that each end in a state a reviewer or script can check.
The same discipline applies to execution and delivery.

## Sequence

1. Establish a known-good baseline and the predicate for the next unit.
2. Pick the smallest independently meaningful change.
3. Make only that change.
4. Run the targeted test, type check, diff check, or real artifact inspection.
5. Record `PASS`, `FAIL`, `NOT RUN`, or `BLOCKED` with the evidence.
6. Advance only after the unit is green, or stop and repair the gate.

Order units so the riskiest unknown and the strongest proof appear early. Stack
commits so a reviewer can replay the argument, such as baseline/test first and
fix second, or scaffold first and behavior second. Never batch a large sweep
and defer all verification to the end.

## Deliverable

Return the unit list, the check for each unit, the evidence, and the exact unit
where work stopped if the sequence is not complete. A green final command does
not erase an unverified intermediate unit.
