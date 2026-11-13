"""Labels and accent strip for the polka dot bag (black, gold, green, red only).

Usage: python3 make_polka_pieces.py <fonts_dir> <out_dir>
Outputs (300 DPI): polka-accent-details_3000x1200.png (repeats end to end),
polka-outside-label_900x900.png, polka-inside-label_900x900.png,
polka-inside-pocket_2010x1500.png
"""
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

from make_zellige_design import BLACK, GOLD, GREEN, RED, gild

DPI = 300
SS = 3
COLORS = (RED, GOLD, GREEN)


def dot(d, x, y, r, c):
    d.ellipse((x - r, y - r, x + r, y + r), fill=c)


def accent(w=3000, h=1200, step=200, r=52):
    """Same dots as the bag. 15 columns x 12 rows fit exactly, so it repeats seamlessly."""
    W, H = w * SS, h * SS
    im = Image.new("RGB", (W, H), BLACK)
    d = ImageDraw.Draw(im)
    s, rr = step * SS, r * SS
    for j in range(-1, h // (step // 2) + 1):
        off = s / 2 if j % 2 else 0
        for i in range(-1, w // step + 1):
            dot(d, i * s + off, j * s / 2, rr, COLORS[(i + j) % 3])
    return gild(im, period=W / 5).resize((w, h), Image.LANCZOS)


def divider(d, S, y, center=GOLD):
    w = SS * 4
    d.line((S * 0.30, y, S * 0.46, y), fill=RED, width=w)
    d.line((S * 0.54, y, S * 0.70, y), fill=GREEN, width=w)
    dot(d, S / 2, y, S * 0.022, center)


def outside(fonts, px=900):
    S = px * SS
    im = Image.new("RGB", (S, S), BLACK)
    d = ImageDraw.Draw(im)
    n, inset, r = 14, S * 0.07, S * 0.022
    step = (S - 2 * inset) / n
    lo, hi = inset, S - inset
    pts = ([(lo + i * step, lo) for i in range(n)] + [(hi, lo + i * step) for i in range(n)] +
           [(hi - i * step, hi) for i in range(n)] + [(lo, hi - i * step) for i in range(n)])
    for k, (x, y) in enumerate(pts):
        dot(d, x, y, r, COLORS[k % 3])
    f = ImageFont.truetype(str(fonts / "Lobster.ttf"), round(S * 0.19))
    d.text((S / 2, S * 0.47), "Falasha", font=f, anchor="mm", fill=GOLD)
    divider(d, S, S * 0.63)
    return gild(im).resize((px, px), Image.LANCZOS)


def inside(fonts, px=900):
    """Flat gold so Printful's black size/material text stays readable."""
    S = px * SS
    im = Image.new("RGB", (S, S), GOLD)
    d = ImageDraw.Draw(im)
    bh = S * 0.16
    d.rectangle((0, 0, S, bh), fill=BLACK)
    for i in range(12):
        dot(d, (i + 0.5) * S / 12, bh / 2, S * 0.024, COLORS[i % 3])
    m = S * 0.05
    d.rectangle((m, bh + m, S - m, S - m), outline=BLACK, width=SS * 4)
    f = ImageFont.truetype(str(fonts / "Lobster.ttf"), round(S * 0.16))
    d.text((S / 2, S * 0.36), "Falasha", font=f, anchor="mm", fill=BLACK)
    divider(d, S, S * 0.48, center=BLACK)
    # lower area left plain: Printful adds size, material and origin
    top = gild(im.crop((0, 0, S, int(bh))))   # metallic gold only on the dot band
    im.paste(top, (0, 0))
    return im.resize((px, px), Image.LANCZOS)


def inside_pocket(w=2010, h=1500):
    """Lining: smaller dots than the outside (1/6" across, 1/3" apart)."""
    return accent(w, h, step=100, r=25)


if __name__ == "__main__":
    fonts, out = Path(sys.argv[1]), Path(sys.argv[2])
    accent().save(out / "polka-accent-details_3000x1200.png", dpi=(DPI, DPI), optimize=True)
    outside(fonts).save(out / "polka-outside-label_900x900.png", dpi=(DPI, DPI), optimize=True)
    inside(fonts).save(out / "polka-inside-label_900x900.png", dpi=(DPI, DPI), optimize=True)
    inside_pocket().save(out / "polka-inside-pocket_2010x1500.png", dpi=(DPI, DPI), optimize=True)
    print("done")
