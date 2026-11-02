"""Royal crown pattern (seamless) for the heritage crossbody bag.

Usage: python3 make_crown_pattern.py <out_dir>
Outputs (300 DPI):
  crown-pattern-tile_2400.png   8"x8" seamless tile (use with Printful's Pattern fill)
  crown-pattern-sheet_6000.png  20"x20" sheet of the tile
  crown-preview-mockup.png      product-style preview of the bag (not a print file)
"""
import math
import sys
from pathlib import Path

from PIL import Image, ImageDraw

from make_circle_pattern import BG, CREAM, GOLD, GREEN, LINE, RED, around, circle, finish, mockup, star4

DPI = 300
SS = 3


def diamond(d, cx, cy, h, fill, ratio=0.7):
    d.polygon([(cx, cy - h), (cx + h * ratio, cy), (cx, cy + h), (cx - h * ratio, cy)], fill=fill)


def crown(d, cx, cy, w):
    """Crown centred on (cx, cy), w = overall width."""
    def P(x, y):
        return (cx + x * w, cy + y * w)

    # red velvet cap behind the points
    d.ellipse((*P(-0.34, -0.30), *P(0.34, 0.20)), fill=RED)
    # crown body with five points
    xs = [-0.46, -0.23, 0.0, 0.23, 0.46]
    tops = [-0.16, -0.27, -0.40, -0.27, -0.16]
    body = [P(-0.40, 0.17)]
    for i, (x, t) in enumerate(zip(xs, tops)):
        body.append(P(x, t))
        if i < len(xs) - 1:
            body.append(P((x + xs[i + 1]) / 2, -0.02))
    body.append(P(0.40, 0.17))
    d.polygon(body, fill=GOLD)
    # cut-out windows inside each point with a jewel
    for i, (x, t) in enumerate(zip(xs, tops)):
        x = max(min(x, 0.38), -0.38)
        hgt = (0.13 - t) * 0.45
        wy = t + hgt * 0.95
        d.polygon([P(x, wy - hgt * 0.75), P(x + 0.045, wy), P(x, wy + hgt * 0.75), P(x - 0.045, wy)], fill=BG)
        jewel = GREEN if i in (0, 2, 4) else RED
        circle(d, *P(x, wy), w * 0.026, jewel)
    # ball tips
    for x, t in zip(xs, tops):
        circle(d, *P(x, t), w * 0.042, GOLD)
        circle(d, *P(x - 0.012, t - 0.012), w * 0.012, CREAM)
    # top finial: diamond on the centre point
    diamond(d, *P(0, -0.50), w * 0.065, GOLD)
    diamond(d, *P(0, -0.50), w * 0.035, GREEN)
    # band
    d.rounded_rectangle((*P(-0.44, 0.15), *P(0.44, 0.33)), radius=w * 0.03, fill=GOLD)
    d.rounded_rectangle((*P(-0.41, 0.18), *P(0.41, 0.30)), radius=w * 0.02, fill=BG)
    # band jewels: green centre oval, red rounds, cream pearls
    d.ellipse((*P(-0.06, 0.19), *P(0.06, 0.29)), fill=GREEN)
    d.ellipse((*P(-0.03, 0.215), *P(0.0, 0.245)), fill=CREAM)
    for x in (-0.27, 0.27):
        circle(d, *P(x, 0.24), w * 0.04, RED)
    for x in (-0.36, -0.165, 0.165, 0.36):
        circle(d, *P(x, 0.24), w * 0.017, CREAM)
    # base rim
    d.rounded_rectangle((*P(-0.46, 0.34), *P(0.46, 0.375)), radius=w * 0.015, fill=GOLD)


def laurel(d, cx, cy, r, count=9):
    """Dotted arc under a crown, like a wreath."""
    for x, y, _ in around(cx, cy, r, 40, 0):
        a = math.atan2(y - cy, x - cx)
        if 0.15 * math.pi < a < 0.85 * math.pi:
            circle(d, x, y, r * 0.022, GOLD)


def slots(S):
    im = Image.new("L", (S, S), BG)
    d = ImageDraw.Draw(im)
    offsets = [(ox, oy) for ox in (-S, 0, S) for oy in (-S, 0, S)]
    big = [(0, 0), (S / 2, S / 2)]
    small = [(S / 2, 0), (0, S / 2)]
    W = S * 0.33
    # faint diamond lattice
    step = S / 8
    for k in range(-8, 17):
        d.line((k * step, 0, k * step + S, S), fill=LINE, width=SS * 2)
        d.line((k * step, 0, k * step - S, S), fill=LINE, width=SS * 2)
    for ox, oy in offsets:
        for cx, cy in big:
            circle(d, cx + ox, cy + oy, W * 0.78, BG)
        for cx, cy in small:
            circle(d, cx + ox, cy + oy, W * 0.36, BG)
    for ox, oy in offsets:
        for cx, cy in big:
            # dotted halo + wreath
            for x, y, _ in around(cx + ox, cy + oy, W * 0.70, 56):
                circle(d, x, y, W * 0.008, GOLD)
            laurel(d, cx + ox, cy + oy + W * 0.02, W * 0.58)
            crown(d, cx + ox, cy + oy + W * 0.02, W)
        for cx, cy in small:
            crown(d, cx + ox, cy + oy + S * 0.012, S * 0.13)
        for cx, cy in ((S / 4, S / 4), (3 * S / 4, S / 4), (S / 4, 3 * S / 4), (3 * S / 4, 3 * S / 4)):
            star4(d, cx + ox, cy + oy, S * 0.026, GOLD)
            for x, y, _ in around(cx + ox, cy + oy, S * 0.045, 4, math.pi / 4):
                circle(d, x, y, S * 0.006, GOLD)
    return im


def tile(size=2400):
    return finish(slots(size * SS), size, lighting="linear")


if __name__ == "__main__":
    out = Path(sys.argv[1])
    out.mkdir(parents=True, exist_ok=True)
    t = tile()
    t.save(out / "crown-pattern-tile_2400.png", dpi=(DPI, DPI), optimize=True)
    sheet = Image.new("RGB", (6000, 6000))
    for x in range(0, 6000, 2400):
        for y in range(0, 6000, 2400):
            sheet.paste(t, (x, y))
    sheet.save(out / "crown-pattern-sheet_6000.png", dpi=(DPI, DPI), optimize=True)
    mockup(t, repeat_in=3.5).save(out / "crown-preview-mockup.png")
    print("done")
