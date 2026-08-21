---
name: ux-writing-audit
description: Audit an existing product's user-facing copy across buttons, labels, errors, empty states, toasts, tooltips, and localized strings. Use when reviewing copy consistency, product terminology, voice, or a localization push. Do not use for purely marketing pages or for drafting a single new error message from scratch.
---

# UX Writing Audit

This is a thin Codex adapter around the upstream procedure in
[`references/upstream-skill.md`](references/upstream-skill.md). Read that file
before auditing; keep its four lenses, scoring, findings table, and quality bar.

## Multilingual product pass

When the product has more than one locale, treat each locale as authored product
copy, not as a word-for-word translation.

1. Inventory the source keys, their UI surface, the moment they appear, and all
   available locale values.
2. Separate product-controlled text from user-authored names, descriptions,
   pseudonyms, and other content that must remain verbatim.
3. Build one terminology table per concept with the source term, the proposed
   term in each locale, rejected alternatives, context, and rationale.
4. Check naturalness, meaning, register, grammatical gender, pluralization,
   string length, capitalization, and collisions with ordinary user language.
5. Keep application language separate from any locale snapshot used for server
   content, notifications, or membership-specific behavior when the codebase
   distinguishes them.

Do not settle a product term by literal translation alone. For a concept such
as `book`, compare the actual object and user job in context: a published book,
an album, a keepsake, a journal, or a collection of memories may require
different nouns in French, English, and Spanish. Record the decision and its
rejected alternatives in the glossary before rewriting the strings.

## Deliverable

Return:

- a complete inventory of strings in scope;
- a scored findings table with file/key, surface, locale, original, violated
  lens, score, and proposed rewrite;
- a terminology glossary with canonical terms and rejected collisions;
- a short voice-and-tone reference;
- a tally by surface and locale;
- explicit `NOT RUN` or `BLOCKED` labels for locales or surfaces that were not
  available.
