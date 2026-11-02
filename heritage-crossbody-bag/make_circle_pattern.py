"""Circular medallion pattern (seamless) for the heritage crossbody bag.

Usage: python3 make_circle_pattern.py <out_dir>
Outputs (300 DPI):
  circle-pattern-tile_2400.png   8"x8" seamless tile (use with Printful's Pattern fill)
  circle-pattern-sheet_6000.png  20"x20" sheet of the tile
  circle-preview-mockup.png      rough look of the bag (not a print file)
"""
import math
import sys
from pathlib import Path

from PIL import Image, ImageDraw

from make_pattern import mockup

DPI = 300
SS = 3

BLACK = (14, 13, 12)
RED = (190, 30, 36)
GREEN = (0, 128, 64)
GOLD = (232, 178, 58)
CREAM = (246, 230, 190)


def circle(d, cx, cy, r, fill):
    d.ellipse((cx - r, cy - r, cx + r, cy + r), fill=fill)


def ring_of(d, cx, cy, radius, count, draw_one, phase=0.0):
    for i in range(count):
        a = phase + 2 * math.pi * i / count
        draw_one(cx + radius * math.cos(a), cy + radius * math.sin(a), a)


def big_medallion(d, cx, cy, R):
    circle(d, cx, cy, R, GOLD)
    circle(d, cx, cy, R * 0.94, BLACK)
    # red ring with gold dots
    circle(d, cx, cy, R * 0.88, RED)
    ring_of(d, cx, cy, R * 0.80, 28, lambda x, y, a: circle(d, x, y, R * 0.035, GOLD))
    circle(d, cx, cy, R * 0.72, BLACK)
    # green sunburst: triangles pointing out
    circle(d, cx, cy, R * 0.68, GREEN)

    def ray(x, y, a):
        r0, r1, half = R * 0.36, R * 0.66, math.pi / 18
        pts = [(cx + r0 * math.cos(a - half), cy + r0 * math.sin(a - half)),
               (cx + r1 * math.cos(a), cy + r1 * math.sin(a)),
               (cx + r0 * math.cos(a + half), cy + r0 * math.sin(a + half))]
        d.polygon(pts, fill=BLACK)

    ring_of(d, cx, cy, 0, 18, ray)
    circle(d, cx, cy, R * 0.38, GOLD)
    circle(d, cx, cy, R * 0.32, BLACK)
    # center: red ring, gold diamond
    circle(d, cx, cy, R * 0.24, RED)
    circle(d, cx, cy, R * 0.17, BLACK)
    h = R * 0.13
    d.polygon([(cx, cy - h), (cx + h * 0.75, cy), (cx, cy + h), (cx - h * 0.75, cy)], fill=GOLD)
    h2 = h * 0.4
    d.polygon([(cx, cy - h2), (cx + h2 * 0.75, cy), (cx, cy + h2), (cx - h2 * 0.75, cy)], fill=GREEN)


def small_medallion(d, cx, cy, r):
    circle(d, cx, cy, r, GOLD)
    circle(d, cx, cy, r * 0.82, GREEN)
    ring_of(d, cx, cy, r * 0.62, 10, lambda x, y, a: circle(d, x, y, r * 0.08, GOLD))
    circle(d, cx, cy, r * 0.45, RED)
    circle(d, cx, cy, r * 0.22, CREAM)


def tile(size=2400):
    S = size * SS
    im = Image.new("RGB", (S, S), BLACK)
    d = ImageDraw.Draw(im)
    R = S * 0.29
    # Draw every motif at its wrapped copies too, so the tile edges line up.
    offsets = [(ox, oy) for ox in (-S, 0, S) for oy in (-S, 0, S)]
    for ox, oy in offsets:
        # thin gold rings echoing around the big medallions
        for cx, cy in ((0, 0), (S / 2, S / 2)):
            for k in (1.10, 1.18):
                r = R * k
                d.ellipse((cx + ox - r, cy + oy - r, cx + ox + r, cy + oy + r), outline=GOLD, width=SS * 4)
    for ox, oy in offsets:
        for cx, cy in ((0, 0), (S / 2, S / 2)):
            big_medallion(d, cx + ox, cy + oy, R)
        for cx, cy in ((S / 2, 0), (0, S / 2)):
            small_medallion(d, cx + ox, cy + oy, S * 0.11)
        # tiny dots filling the gaps
        for cx, cy in ((S / 4, S / 4), (3 * S / 4, S / 4), (S / 4, 3 * S / 4), (3 * S / 4, 3 * S / 4)):
            circle(d, cx + ox, cy + oy, S * 0.018, RED)
            ring_of(d, cx + ox, cy + oy, S * 0.045, 6, lambda x, y, a: circle(d, x, y, S * 0.008, GOLD))
    return im.resize((size, size), Image.LANCZOS)


if __name__ == "__main__":
    out = Path(sys.argv[1])
    out.mkdir(parents=True, exist_ok=True)
    t = tile()
    t.save(out / "circle-pattern-tile_2400.png", dpi=(DPI, DPI), optimize=True)
    sheet = Image.new("RGB", (6000, 6000))
    for x in range(0, 6000, 2400):
        for y in range(0, 6000, 2400):
            sheet.paste(t, (x, y))
    sheet.save(out / "circle-pattern-sheet_6000.png", dpi=(DPI, DPI), optimize=True)
    mockup(t).save(out / "circle-preview-mockup.png")
    print("done")
