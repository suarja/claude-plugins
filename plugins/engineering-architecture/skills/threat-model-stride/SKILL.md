---
name: threat-model-stride
description: Use when threat-modeling a feature or design that touches authentication, private data, uploads, storage, webhooks, external services, or privilege boundaries before code is written.
---

# Threat Model STRIDE

Find security failures while they are still design decisions. Do not list vague
threats before the actors, assets, data flows, and trust boundaries are named.

## Gather inputs

Collect the feature in three to five sentences, actors and roles, assets and
sensitivity, deployment exposure, existing controls, and compliance scope.
Include anonymous users, authenticated users, internal services, operators,
and external providers when relevant. Label missing information as an
assumption rather than inventing certainty.

## Map the flow first

Write the data flow in prose or a compact diagram. Name every actor, component,
data asset, and trust boundary, including client/server, service/database,
internal/external network, storage, queue, and webhook boundaries. Name the
authentication and authorization decision at each entry point.

## Apply STRIDE per boundary

For each boundary-crossing component, evaluate all six categories and state
when no credible threat remains:

- **Spoofing:** impersonated actor, session, token, or service;
- **Tampering:** modified input, record, payload, or in-flight data;
- **Repudiation:** sensitive action without actor/timestamp evidence;
- **Information disclosure:** ownership leak through data, errors, logs,
  caches, URLs, or signed credentials;
- **Denial of service:** unbounded uploads, work, queues, retries, or resource
  exhaustion;
- **Elevation of privilege:** a role or token crossing an authorization
  boundary it should not cross.

Score each threat with two explicit axes:

- exploitability: 3 anonymous/public, 2 low-privilege account or non-trivial
  setup, 1 insider/physical access or chained flaw;
- impact: 3 credential theft, code execution, regulated-data exposure, or full
  account takeover; 2 single-user exposure or degraded service; 1 nuisance.

Sum the axes: 6 Critical, 5 High, 4 Medium, and 3 or below Low. Omit Low rows
unless they chain into a higher risk.

## Recommend controls

For every Critical and High threat, give one concrete control and owner. Prefer
platform primitives over custom security code. Examples: verify a webhook
signature before parsing, scope a signed URL to one object and its expiry,
enforce membership at every query/mutation, cap upload size, rate-limit public
entry points, or log actor/time/scope for sensitive operations.

Flag controls that require schema changes, new dependencies, key rotation,
operational configuration, or a migration for separate review.

## Deliverable

Return the prose data flow and named trust boundaries, then a concise table with
STRIDE category, component, attack scenario, exploitability plus impact,
severity, concrete control, and owner. State category absences explicitly.
Mark assumptions, unresolved questions, and `NOT RUN` or `BLOCKED` evidence.
This model does not clear written code; pair it with the repository's secure
code review after implementation.
