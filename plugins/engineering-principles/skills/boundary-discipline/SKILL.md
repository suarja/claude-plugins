---
name: boundary-discipline
description: Use when wiring validation, parsing, error handling, or framework adapters at a CLI, config, network, storage, or external API boundary.
---

# Boundary Discipline

Validate and normalize data where it enters the system. Keep the core typed,
small, and testable instead of scattering defensive checks through business
logic.

## Apply the boundary

At a boundary such as CLI arguments, configuration, network payloads,
deserialized data, storage, or an external API:

- validate shape, permissions, limits, and failure cases;
- narrow unknown data into an explicit internal type;
- return or translate errors at the boundary;
- keep the adapter thin and mechanical.

Inside the system, trust the validated contract. Keep business rules in pure
functions where possible. Do not repeat the same nil check, parsing, or
framework branching in every caller unless the value crosses a new boundary.

## Check the design

Ask: is this data crossing a system boundary now? If not, is the validation
redundant? Can the logic become a pure transform from typed state to typed
result while the shell handles I/O? Tests should exercise the boundary parser
and the pure core separately.
