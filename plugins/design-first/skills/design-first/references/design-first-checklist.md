# Design-first checklist

## Direction handoff

- [ ] The design question is one sentence and has a named host route/screen.
- [ ] The canonical visual source, repository path, and verification date are
      recorded.
- [ ] Theme tokens, typography, responsive helpers, and existing components
      were read before adding new values.
- [ ] Mockup states cover the relevant happy, loading, empty, error, auth, and
      unknown-kind cases.
- [ ] The selected direction, rejected variants, exclusions, and target
      surfaces are recorded after owner approval.
- [ ] Production code was not written before that approval (read-only research
      and marked prototypes are the only exceptions).
- [ ] A mapping exists from mockup primitives to production theme tokens,
      layout constraints, and public behavior seams.

## Validation matrix

| Surface | Direction gate | Production checkpoint |
| --- | --- | --- |
| Web | Browser at target desktop/mobile widths | Browser or Computer Use, with state evidence |
| Expo mobile | Browser mockup at phone/tablet widths | Native iPhone and iPad when available; `serve-sim` is preferred |
| Authenticated flow | Mocked or fixture identity states | Real account/session checkpoint when required |
| Responsive layout | Overflow, text expansion, safe-area assumptions | Phone and tablet screenshots or explicit `VALIDATE` limitation |

Typecheck and behavior tests complement pixel evidence; they do not replace it.
If a simulator or authenticated state is unavailable, record the exact surface,
tool, device/state, and missing checkpoint instead of claiming completion.
Evidence must be from the changed production route and current commit, not only
from the HTML mockup. A browser fallback does not prove native behavior.

## State minimums

For supported surfaces, check the longest relevant locale strings, light/dark
themes, auth transitions, and text scaling/accessibility paths. Mark a state
`not applicable` only when the product contract explicitly excludes it.

## Source patterns

This skill consolidates the validated design policy from Panoptik/Bandaa and
MediumShip, plus the variant-prototyping pattern used by Levels. The upstream
`prototype` and `serve-sim` skills remain independent dependencies; this skill
only defines when to use them and how to close the visual gate.
