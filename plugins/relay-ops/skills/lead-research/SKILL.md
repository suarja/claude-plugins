---
name: lead-research
description: Find public communities, pages, profiles, and programs that fit a Hub outreach objective; never follow, contact, or publish.
---

# Lead research

Build a short, sourced candidate list for the Relay Hub at `/studio/leads`.

## Inputs

- objective: tester, organizer, photographer, or partner;
- platform or geography, when constrained;
- product context and the reason this audience may care.

## Workflow

1. Search public pages and official directories only.
2. Keep the direct destination URL and a separate source URL.
3. Record platform, type, objective, name, language, and one reason for fit.
4. Mark confidence as `Retenue`, `À vérifier`, or `Écoute / relation` from the
   evidence available; an accessible URL is not permission to promote.
5. Deduplicate by canonical URL and name before returning the list.
6. Add or propose candidates in the Hub without changing any external account.

## Output

Return one row per candidate:

```text
Name:
Platform:
Type:
Objective:
Destination URL:
Source URL:
Language:
Confidence:
Reason:
Next action: qualify in the Hub
```

Do not extract member lists, infer private contact details, or turn search
results into follows, messages, invitations, or publications.
