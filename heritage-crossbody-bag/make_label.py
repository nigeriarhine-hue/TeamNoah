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


CREAM = (246, 236, 212)


def inside_label(fonts, px=900):
    """Cream label: logo in the top band (Printful's logo area is about 3" x 1.13"),
    lower area kept plain. Printful adds size, material and origin itself."""
    S = px * SS
    im = Image.new("RGB", (S, S), CREAM)
    d = ImageDraw.Draw(im)
    # thin tricolor stripe at the very top
    y = 0
    for col, h in ((GOLD, 0.012), (RED, 0.03), (GOLD, 0.012), (GREEN, 0.03), (GOLD, 0.012)):
        d.rectangle((0, y, S, y + h * S), fill=col)
        y += h * S
    # double gold frame
    m = S * 0.04
    d.rectangle((m, y + m * 0.6, S - m, S - m), outline=GOLD, width=SS * 4)
    m2 = m + S * 0.018
    d.rectangle((m2, y + m * 0.6 + S * 0.018, S - m2, S - m2), outline=GOLD, width=SS * 2)
    # logo row: diamond + Falasha, inside the top 1.13" band
    cx, cy = S / 2, S * 0.27
    f = ImageFont.truetype(str(fonts / "Lobster.ttf"), round(S * 0.17))
    tw = d.textlength("Falasha", font=f)
    hh = S * 0.06
    gap = S * 0.04
    dx = cx - (tw + hh * 1.6 + gap) / 2 + hh * 0.8
    for sc, col in ((1.0, BLACK), (0.68, GOLD), (0.45, GREEN), (0.18, CREAM)):
        d.polygon([(dx, cy - hh * sc), (dx + hh * 0.8 * sc, cy), (dx, cy + hh * sc), (dx - hh * 0.8 * sc, cy)], fill=col)
    d.text((dx + hh * 0.8 + gap, cy), "Falasha", font=f, anchor="lm", fill=BLACK)
    # small divider under the logo
    yy = S * 0.42
    d.line((cx - S * 0.22, yy, cx - S * 0.025, yy), fill=RED, width=SS * 3)
    d.line((cx + S * 0.025, yy, cx + S * 0.22, yy), fill=RED, width=SS * 3)
    r = S * 0.012
    d.polygon([(cx, yy - r), (cx + r, yy), (cx, yy + r), (cx - r, yy)], fill=RED)
    return im.resize((px, px), Image.LANCZOS)


if __name__ == "__main__":
    fonts, out = Path(sys.argv[1]), Path(sys.argv[2])
    out.mkdir(parents=True, exist_ok=True)
    label(fonts).save(out / "outside-label_900x900.png", dpi=(300, 300), optimize=True)
    inside_label(fonts).save(out / "inside-label_900x900.png", dpi=(300, 300), optimize=True)
    print("done")
