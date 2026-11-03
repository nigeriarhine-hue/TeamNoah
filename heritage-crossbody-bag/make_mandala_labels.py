"""Inside and outside labels (3"x3" at 300 DPI) for the dot mandala design.

Usage: python3 make_mandala_labels.py <fonts_dir> <out_dir>
Uses exactly the mandala's four colors: black, gold, green, red.
"""
import math
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

from make_mandala_design import BLACK, GOLD, GREEN, RED, dot

PX = 900
SS = 4
TAU = 2 * math.pi


def dot_ring(d, cx, cy, radius, count, r, kinds, phase=0.0):
    for i in range(count):
        a = phase + TAU * i / count
        dot(d, cx + radius * math.cos(a), cy + radius * math.sin(a), r, kinds[i % len(kinds)])


def dot_border(d, S, inset, r, kinds):
    """Square border of dots; colors cycle evenly around the whole loop."""
    n = int((S - 2 * inset) / (r * 2.4))
    step = (S - 2 * inset) / n
    lo, hi = inset, S - inset
    pts = ([(lo + i * step, lo) for i in range(n)] + [(hi, lo + i * step) for i in range(n)] +
           [(hi - i * step, hi) for i in range(n)] + [(lo, hi - i * step) for i in range(n)])
    for k, (x, y) in enumerate(pts):
        dot(d, x, y, r, kinds[k % len(kinds)])


def divider(d, S, y, r, center="goldred"):
    """Red line, center dot-in-dot, green line."""
    w = SS * 4
    d.line((S * 0.30, y, S / 2 - r * 1.8, y), fill=RED, width=w)
    d.line((S / 2 + r * 1.8, y, S * 0.70, y), fill=GREEN, width=w)
    dot(d, S / 2, y, r, center)


def outside(fonts):
    S = PX * SS
    im = Image.new("RGB", (S, S), BLACK)
    d = ImageDraw.Draw(im)
    dot_border(d, S, S * 0.06, S * 0.022, ["red", "gold", "green", "gold"])
    # small dot mandala above the name
    cx, cy = S / 2, S * 0.33
    dot(d, cx, cy, S * 0.03, "redgold")
    dot_ring(d, cx, cy, S * 0.065, 8, S * 0.014, ["gold"])
    dot_ring(d, cx, cy, S * 0.105, 12, S * 0.017, ["green", "red"], math.pi / 12)
    dot_ring(d, cx, cy, S * 0.148, 16, S * 0.016, ["gold"])
    f = ImageFont.truetype(str(fonts / "Lobster.ttf"), round(S * 0.17))
    d.text((S / 2, S * 0.64), "Falasha", font=f, anchor="mm", fill=GOLD)
    divider(d, S, S * 0.78, S * 0.022)
    return im.resize((PX, PX), Image.LANCZOS)


def inside(fonts):
    """Gold label so Printful's black size/material text stays readable."""
    S = PX * SS
    im = Image.new("RGB", (S, S), GOLD)
    d = ImageDraw.Draw(im)
    # black band of dots across the top
    bh = S * 0.17
    d.rectangle((0, 0, S, bh), fill=BLACK)
    n = 14
    for i in range(n):
        dot(d, (i + 0.5) * S / n, bh / 2, S * 0.026, ["redgold", "greengold"][i % 2])
    d.rectangle((0, bh, S, bh + S * 0.012), fill=RED)
    d.rectangle((0, bh + S * 0.012, S, bh + S * 0.024), fill=GREEN)
    # black frame
    m = S * 0.05
    d.rectangle((m, bh + m, S - m, S - m), outline=BLACK, width=SS * 4)
    f = ImageFont.truetype(str(fonts / "Lobster.ttf"), round(S * 0.16))
    d.text((S / 2, S * 0.36), "Falasha", font=f, anchor="mm", fill=BLACK)
    divider(d, S, S * 0.48, S * 0.024, center="redgold")
    # lower area left plain: Printful adds size, material and origin
    return im.resize((PX, PX), Image.LANCZOS)


if __name__ == "__main__":
    fonts, out = Path(sys.argv[1]), Path(sys.argv[2])
    outside(fonts).save(out / "mandala-outside-label_900x900.png", dpi=(300, 300), optimize=True)
    inside(fonts).save(out / "mandala-inside-label_900x900.png", dpi=(300, 300), optimize=True)
    print("done")
