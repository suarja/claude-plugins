#!/usr/bin/env python3
"""Render store screenshot frames from real captures and a pack.json.

Each frame is a 300-CSS-px-wide HTML page (background, title, phone holding the
real capture, one piece of the capture lifted out and floating over the phone),
screenshotted by headless Chrome at the scale that gives the store size.

Usage:
  python3 render-store-frames.py <pack.json> --target=<target> [--only=a,b] [--out=<dir>]

Targets:
  iphone-6.9    1320 x 2868  App Store, iPhone 6.9" (the one Apple requires)
  iphone-6.5    1284 x 2778  App Store, iPhone 6.5"
  ipad-13       2064 x 2752  App Store, iPad 13"
  play-phone    1080 x 1920  Google Play phone
  play-feature  1024 x  500  Google Play feature graphic (first frame, or "feature" in pack.json)
  board         every frame side by side at 2x, plus board-thumb.png at App Store
                search size, to judge the series before exporting
  WxH           any size, e.g. 1179x2556

Requires Google Chrome (or CHROME=/path/to/chromium) and Pillow.
"""
import html as htmlmod
import json
import os
import shutil
import subprocess
import sys
import tempfile

from PIL import Image

CSS_W = 300
TARGETS = {
    "iphone-6.9": (1320, 2868, "phone"),
    "iphone-6.5": (1284, 2778, "phone"),
    "ipad-13": (2064, 2752, "tablet"),
    "play-phone": (1080, 1920, "android"),
}
# Device shells in CSS px: left, top, width, padding (top, side), outer and screen radius.
# Android's status bar runs into the screen corners: a taller top band keeps the
# clock and icons clear of the shell.
DEVICES = {
    "phone": dict(left=25, top=190, width=250, pad_top=7, pad=7, radius=40, screen_radius=33),
    "android": dict(left=45, top=170, width=210, pad_top=16, pad=7, radius=30, screen_radius=20),
    "tablet": dict(left=30, top=184, width=240, pad_top=8, pad=8, radius=22, screen_radius=14),
}


def chrome():
    for path in (os.environ.get("CHROME"),
                 "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
                 shutil.which("google-chrome"), shutil.which("chromium"), shutil.which("chromium-browser")):
        if path and os.path.exists(path):
            return path
    sys.exit("Chrome not found: install Google Chrome or set CHROME=/path/to/chromium")


def rule(selector, declarations):
    return selector + "{" + declarations + "}\n"


def css(theme, css_h, device, extra=""):
    font = theme.get("font", {})
    family = font.get("family", "system-ui")
    faces = "".join(rule("@font-face", f"font-family:'{family}';font-weight:{w};src:url(file://{path})")
                    for w, path in font.get("files", {}).items())
    d = DEVICES[device]
    title, line = theme.get("titleSize", 38), theme.get("lineSize", 16)
    shadow = "box-shadow:0 18px 40px rgba(0,0,0,.45)"
    return (faces
            + rule("*", "box-sizing:border-box;margin:0")
            + rule("html,body", f"width:{CSS_W}px;height:{css_h:.2f}px;overflow:hidden;background:{theme.get('base', '#000')}")
            + rule(".cadre", f"width:{CSS_W}px;height:{css_h:.2f}px;position:relative;overflow:hidden;background:{theme['background']}")
            + rule(".titre", f"position:absolute;left:20px;right:20px;top:{theme.get('titleTop', 34)}px;"
                             f"text-align:{theme.get('titleAlign', 'center')};font-family:'{family}',system-ui,sans-serif")
            + rule(".titre b", f"display:block;font-weight:{theme.get('titleWeight', 900)};font-size:{title}px;"
                               f"line-height:{title + 1}px;letter-spacing:-.8px;color:{theme['ink']}")
            + rule(".titre b em", f"font-style:normal;color:{theme['accent']}")
            + rule(".ligne", f"font-weight:{theme.get('lineWeight', 800)};font-size:{line}px;line-height:{line + 5}px;"
                             f"margin-top:12px;color:{theme.get('line', theme['ink'])};text-wrap:balance")
            + rule(".tel", f"position:absolute;left:{d['left']}px;top:{d['top']}px;width:{d['width']}px;"
                           f"border-radius:{d['radius']}px;padding:{d['pad_top']}px {d['pad']}px {d['pad']}px;"
                           f"background:{theme.get('shell', '#0b0a09')};box-shadow:0 30px 60px rgba(0,0,0,.45),"
                           f"0 0 0 1.5px {theme.get('shellEdge', '#3a3530')} inset")
            + rule(".tel img", f"display:block;width:100%;border-radius:{d['screen_radius']}px")
            + rule(".extrait", f"position:absolute;overflow:hidden;border-radius:14px;{shadow}")
            + rule(".extrait img", "position:absolute;display:block;max-width:none")
            + rule(".cellule", f"position:absolute;width:116px;padding:14px 0 12px;border-radius:22px;background:#fff;{shadow};"
                               "text-align:center;font:500 15px/18px -apple-system,system-ui,sans-serif;color:#111")
            + rule(".cellule img", "display:block;width:72px;height:72px;border-radius:17px;margin:0 auto 8px")
            + extra)


def lifted(frame, cap, cap_w, d, base):
    """The piece of the capture lifted out of the phone, or a redrawn share-sheet cell."""
    if "cell" in frame:
        c = frame["cell"]
        left, top = c.get("at", [150, 395])
        icon = os.path.join(base, c["icon"])
        return (f'<div class="cellule" style="left:{left}px;top:{top}px;transform:rotate({c.get("rotate", 6)}deg)">'
                f'<img src="file://{icon}">{htmlmod.escape(c["label"])}</div>')
    e = frame.get("extract")
    if not e:
        return ""
    x0, y0, x1, y1 = e["box"]
    grow, rot = e.get("grow", 1.1), e.get("rotate", 0)
    k = (d["width"] - 2 * d["pad"]) / cap_w          # capture px -> CSS px inside the shell
    w, h = (x1 - x0) * k * grow, (y1 - y0) * k * grow
    left = d["left"] + d["pad"] + x0 * k - (w - (x1 - x0) * k) / 2
    top = d["top"] + d["pad_top"] + y0 * k - (h - (y1 - y0) * k) / 2
    if "at" in e:
        left, top = e["at"]
    radius = "border-radius:999px;" if e.get("shape") == "pill" else ""
    return (f'<div class="extrait" style="left:{left:.1f}px;top:{top:.1f}px;width:{w:.1f}px;height:{h:.1f}px;{radius}'
            f'transform:rotate({rot}deg)"><img src="file://{cap}" style="width:{cap_w * k * grow:.1f}px;'
            f'left:{-x0 * k * grow:.1f}px;top:{-y0 * k * grow:.1f}px"></div>')


def frame_html(pack, base, frame, css_h, device, lang, extra=""):
    cap = os.path.join(base, pack["captures"], frame["capture"])
    if not os.path.exists(cap):
        sys.exit(f"{frame['id']}: capture missing ({cap}). Capture the real build; never substitute a placeholder.")
    cap_w = Image.open(cap).size[0]
    d = DEVICES[device]
    line = f'<div class="ligne">{frame["line"]}</div>' if frame.get("line") else ""
    return (f'<!doctype html><html lang="{lang}"><head><meta charset="utf-8"><style>{css(pack["theme"], css_h, device, extra)}</style></head>'
            f'<body><div class="cadre"><div class="titre"><b>{frame["title"]}</b>{line}</div>'
            f'<div class="tel"><img src="file://{cap}"></div>{lifted(frame, cap, cap_w, d, base)}</div></body></html>')


def shoot(page_html, tmp, name, css_w, css_h, width, height):
    page = os.path.join(tmp, f"{name}.html")
    with open(page, "w") as f:
        f.write(page_html)
    shot = os.path.join(tmp, f"{name}.png")
    subprocess.run([chrome(), "--headless", f"--screenshot={shot}", f"--window-size={css_w},{int(css_h) + 1}",
                    "--hide-scrollbars", f"--force-device-scale-factor={width / css_w:.4f}",
                    "--allow-file-access-from-files", f"file://{page}"],
                   check=True, stderr=subprocess.DEVNULL, stdout=subprocess.DEVNULL)
    img = Image.open(shot).convert("RGB")
    if img.size[0] < width or img.size[1] < height:
        sys.exit(f"{name}: Chrome returned {img.size}, expected at least {width}x{height}")
    return img.crop((0, 0, width, height))


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    opts = dict(a[2:].split("=", 1) for a in sys.argv[1:] if a.startswith("--") and "=" in a)
    if not args or "target" not in opts:
        sys.exit(__doc__)
    pack_path = os.path.abspath(args[0])
    base = os.path.dirname(pack_path)
    pack = json.load(open(pack_path))
    lang = pack.get("lang", "en")
    target = opts["target"]
    frames = pack["frames"]
    if "only" in opts:
        keep = opts["only"].split(",")
        frames = [f for f in frames if f["id"] in keep]
    out = os.path.join(base, opts.get("out", os.path.join(pack.get("out", "exports"), target)))
    os.makedirs(out, exist_ok=True)

    with tempfile.TemporaryDirectory() as tmp:
        if target == "board":
            # Same geometry as the iPhone export, all frames in one row: the owner's gate.
            css_h = CSS_W * 2868 / 1320
            imgs = [shoot(frame_html(pack, base, f, css_h, pack.get("device", "phone"), lang), tmp, f["id"],
                          CSS_W, css_h, 600, round(css_h * 2)) for f in frames]
            gap = 36
            board = Image.new("RGB", (len(imgs) * 600 + (len(imgs) + 1) * gap, imgs[0].size[1] + 2 * gap), "#2a2622")
            for i, img in enumerate(imgs):
                board.paste(img, (gap + i * (600 + gap), gap))
            board.save(os.path.join(out, "board.png"))
            # App Store search results show the first frames at roughly 1/6 of their width.
            thumb = board.resize((board.size[0] // 6, board.size[1] // 6), Image.LANCZOS)
            thumb.save(os.path.join(out, "board-thumb.png"))
            print(os.path.join(out, "board.png"))
            print(os.path.join(out, "board-thumb.png"))
            return

        if target == "play-feature":
            f = dict(frames[0], **pack.get("feature", {}))
            extra = (".cadre{background:" + pack["theme"].get("featureBackground", pack["theme"]["background"]) + "}"
                     ".titre{left:40px;right:220px;top:62px;text-align:left}"
                     ".titre b{font-size:34px;line-height:35px}"
                     ".tel{left:318px;top:34px;width:170px}")
            DEVICES["feature"] = dict(DEVICES["phone"], left=318, top=34, width=170)
            page = frame_html(pack, base, f, 250, "feature", lang, extra).replace(f"width:{CSS_W}px", "width:512px")
            img = shoot(page, tmp, "feature", 512, 250, 1024, 500)
            dest = os.path.join(out, f"feature-graphic-{lang}.png")
            img.save(dest)
            print(dest)
            return

        if target in TARGETS:
            width, height, device = TARGETS[target]
        else:
            width, height = (int(v) for v in target.lower().split("x"))
            device = pack.get("device", "phone")
        device = pack.get("devices", {}).get(target, device)
        css_h = CSS_W * height / width
        for i, f in enumerate(frames, 1):
            img = shoot(frame_html(pack, base, f, css_h, device, lang), tmp, f["id"], CSS_W, css_h, width, height)
            dest = os.path.join(out, f"{i:02d}-{f['id']}.jpg")
            img.save(dest, quality=92)
            print(dest)


if __name__ == "__main__":
    main()
