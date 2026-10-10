# A direction that has already passed an owner gate

Presi's App Store pack v2 (25 Sept 2026) went through four boards before the
owner accepted it. Use it as the default starting point for direction 1 of
the three. It is not a rule: the other two directions must still differ from it.

## What his references had in common

Nineteen App Store screenshots he picked on X, plus the live listings of
Eightify, Particle and Ground News. What they share, and what the rejected
first pack (paper background, thin serif title, eight identical frames) lacked:

- a frank background: one saturated colour, or near-black with one vivid accent;
- a 2–4-word title, about twice the size and weight you would first pick;
- one word of the title carried by the accent colour or a label;
- a large phone, cut off by the bottom edge;
- a piece of the interface lifted out of the phone and floating in front of it.

## The recipe (direction "A1, Braise")

| Layer | Choice |
| --- | --- |
| Background | near-black with a radial glow of one warm brand colour behind the phone |
| Title | geometric sans in Black weight, 38 px on a 300 px wide frame, two lines at most, centred; the second half in the accent colour (`<em>`) |
| Line under the title | one sentence, ExtraBold 16 px, light ink, not the accent |
| Phone | upright, 250 of 300 px wide, top at about 30 % of the height, cut by the bottom |
| Lifted extract | one element cut from the real capture (a verdict, a card, a pill button), enlarged 1.1–1.3×, tilted 2–4°, alternating left and right, shadowed. It overflows the phone's edges, and from frame to frame its height on the canvas climbs |
| Series | same layout on every frame; the title, the capture and the extract change |

All values are in the renderer's `pack.json` (see `app-showcase-pipeline`).

## What the owner rejected, and why

- **All phones tilted to the same side** ("ça fait bizarre"). Keep the phone
  upright; the tilt belongs to the floating extract and alternates.
- **An extract that stays inside the phone's margins**: it does not read as
  lifted, it reads as a crooked screen. Cut it to the element's own shape (a
  pill for a button), enlarge it until it clearly crosses the shell.
- **A serif title, thin and large**: elegant at full size, invisible as a
  search-result thumbnail.
- **A subtitle that sounds good but says nothing** ("each sentence that
  matters, at its second"). Every line must state a concrete outcome for the
  reader. Propose three; he picks.
- **Filler phrases describing what happens next** ("the card arrives"). Cut them.
- From a blend of two directions he kept the better whole one rather than the
  mix. Offer a blend when asked, but do not assume it wins.

## Copy that passed

Title = the outcome in 2–4 words, the accent on the payoff:
"La politique, *sous-titrée.*", "Tu vois *les ficelles.*",
"Presque 2 ? *C'est 1,8.*" (a concrete number beats a claim),
"L'interview, *en cartes.*". Long titles were shortened to fit two lines at
the same size on every frame, rather than shrinking one frame's type.

## How the gate was run

1. One board per round: three directions on the first three frames, real captures.
2. His words recorded verbatim under each board, with what he kept and dropped.
3. Copy validated on the chosen direction (two variants: with and without the line).
4. All frames in one row, then the export. Captures that showed stale UI (an
   old icon, prices in dollars) were listed and retaken before export.
