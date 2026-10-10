# Static store pack: pack.json and the renderer

`scripts/render-store-frames.py` turns real captures and one `pack.json` into
store-size images. Each frame is a 300-CSS-px-wide HTML page (background, title,
device shell holding the capture, one piece of the capture lifted out and
floating), screenshotted by headless Chrome at the scale that gives the target
size. Needs Google Chrome (or `CHROME=/path/to/chromium`) and Pillow.

```bash
python3 render-store-frames.py store/pack.apple.fr.json --target=board        # the owner's gate
python3 render-store-frames.py store/pack.apple.fr.json --target=iphone-6.9   # 1320 x 2868
python3 render-store-frames.py store/pack.play.fr.json  --target=play-phone   # 1080 x 1920
python3 render-store-frames.py store/pack.play.fr.json  --target=play-feature # 1024 x 500
```

Other targets: `iphone-6.5` (1284 × 2778), `ipad-13` (2064 × 2752), or any
`WxH` (a contest asking 1179 × 2556). `--only=id1,id2` renders some frames, and
`--out=dir` overrides the output folder. `board` writes `board.png` (all frames in a row
at 2×) and `board-thumb.png` at roughly search-result size: judge the thumbnail.

Reproduced Presi's accepted v2 pack (8 iPhone frames, 6 Play frames, the
feature graphic) to under 1/255 mean pixel difference. A render takes about 2 s
per frame.

## One pack per capture set

Box coordinates are in capture pixels, so a pack covers one platform and one
locale's captures. Keep `pack.apple.fr.json`, `pack.play.fr.json` and so on side
by side. A second locale may reuse the first one's captures when the app
itself is not localised, but only if the capture catalogue declares it.

```json
{
  "lang": "fr",
  "captures": "captures/apple/iphone/fr",
  "out": "exports/v2",
  "theme": {
    "background": "radial-gradient(120% 60% at 50% 72%, #7A2E12 0%, rgba(122,46,18,.25) 38%, #0F0D0C 70%)",
    "base": "#0F0D0C",
    "ink": "#FFF8F1", "accent": "#F0B24A", "line": "#E9DFD2",
    "font": { "family": "Figtree", "files": { "800": "fonts/Figtree-ExtraBold.ttf", "900": "fonts/Figtree-Black.ttf" } }
  },
  "frames": [
    { "id": "feed-card", "capture": "feed-card.png",
      "title": "La politique, <em>sous-titrée.</em>",
      "line": "Ce qu'ils disent, et ce que ça veut dire.",
      "extract": { "box": [60, 1875, 1260, 2115], "rotate": -3, "grow": 1.1 } },
    { "id": "share-sheet", "capture": "share-sheet.png",
      "title": "Une vidéo&nbsp;? <em>Partage-la.</em>", "line": "Depuis YouTube et TikTok.",
      "cell": { "icon": "../app/icon.png", "label": "Presi", "rotate": 6, "at": [150, 395] } },
    { "id": "mirror", "capture": "mirror.png",
      "title": "Et toi, <em>tu penches où&nbsp;?</em>", "line": "Tes cartes le disent.",
      "extract": { "box": [78, 1233, 1241, 1388], "rotate": -4, "grow": 1.3, "shape": "pill" } }
  ],
  "feature": { "extract": { "box": [58, 1536, 1024, 1733], "rotate": -3, "grow": 1.15, "at": [262, 150] } }
}
```

Paths are relative to the pack file. Optional theme keys:

- `featureBackground`, `titleAlign`, `titleTop`, `titleSize` (38), `lineSize` (16);
- `titleWeight` (900), `lineWeight` (800), `shell`, `shellEdge`.

`devices` maps a target to another shell (`phone`, `android`, `tablet`).

- **`title`**: HTML. `<em>` takes the accent colour. `<br>` is allowed only
  for a deliberate two-line split. `&nbsp;` before French `?` and `:`.
- **`extract.box`**: `[x0, y0, x1, y1]` in capture pixels. Find the element's
  bounds on the capture (open it, or crop-test with Pillow). The extract is
  placed over its own position on the screen, enlarged by `grow` around its
  centre, then rotated. `at: [left, top]` in CSS px overrides the position.
  `shape: "pill"` cuts it to a capsule.
- **`cell`**: the app's icon and name redrawn as a share-sheet cell, used
  instead of an extract for the share frame.

## Store sizes and their traps

| Store / slot | Size | Note |
| --- | --- | --- |
| App Store iPhone 6.9" | 1320 × 2868 | the one size Apple requires; it scales down for smaller phones |
| App Store iPad 13" | 2064 × 2752 | needs iPad captures; the `tablet` shell is not yet owner-reviewed |
| Google Play phone | 1080 × 1920 | Android captures; the `android` shell has a 16 pt top band |
| Google Play feature graphic | 1024 × 500 | title left, phone right, extract lifted above the fold |

- **The app icon in a share-sheet capture prints soft** once enlarged (it is
  ~170 px in the capture). Redraw the cell from the icon file (`cell`).
- **Prices only show the store currency from the store itself**: a TestFlight
  or sandbox build signed into an account of that country. RevenueCat's Test
  Store shows dollars. Retake the paywall capture there.
- **Android's status bar runs into the screen corners**: inside a drawn shell,
  the clock and icons slide under the frame without a top band.
- **A capture shows UI that changed since** (old icon, old price wording,
  a card that no longer exists): list it as capture-required and retake it on
  a current build before exporting, even if the composition is approved.
- **Keep the board's copy as the export's copy**: titles and lines live in
  `pack.json` only, never retyped into a second file.
