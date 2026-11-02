"""Falasha outside label (3"x3" at 300 DPI) for the heritage crossbody bag.

Usage: python3 make_label.py <fonts_dir> <out_dir>
Key content stays in the middle band so it survives if the label is cropped to a strip.
"""
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

BLACK = (14, 13, 12)
RED = (190, 30, 36)
GREEN = (0, 128, 64)
GOLD = (232, 178, 58)
GOLD_LIGHT = (250, 214, 120)
SS = 4


def label(fonts, px=900):
    S = px * SS
    im = Image.new("RGB", (S, S), BLACK)
    d = ImageDraw.Draw(im)

    # tricolor stripes top and bottom
    for y0, ys in ((0, 1), (S, -1)):
        for k, col in enumerate((GOLD, RED, GOLD, GREEN, GOLD)):
            h = S * (0.035 if col != GOLD else 0.012)
            off = sum(S * (0.035 if c != GOLD else 0.012) for c in (GOLD, RED, GOLD, GREEN, GOLD)[:k])
            a, b = y0 + ys * off, y0 + ys * (off + h)
            d.rectangle((0, min(a, b), S, max(a, b)), fill=col)

    cx = S / 2
    # diamond emblem (same motif as the bag)
    cy, hh = S * 0.36, S * 0.075
    for sc, col in ((1.0, GOLD), (0.68, BLACK), (0.45, GREEN), (0.18, GOLD_LIGHT)):
        d.polygon([(cx, cy - hh * sc), (cx + hh * 0.8 * sc, cy), (cx, cy + hh * sc), (cx - hh * 0.8 * sc, cy)], fill=col)

    # name
    f = ImageFont.truetype(str(fonts / "Lobster.ttf"), round(S * 0.21))
    d.text((cx, S * 0.60), "Falasha", font=f, anchor="mm", fill=GOLD)


    return im.resize((px, px), Image.LANCZOS)


if __name__ == "__main__":
    fonts, out = Path(sys.argv[1]), Path(sys.argv[2])
    out.mkdir(parents=True, exist_ok=True)
    label(fonts).save(out / "outside-label_900x900.png", dpi=(300, 300), optimize=True)
    print("done")
