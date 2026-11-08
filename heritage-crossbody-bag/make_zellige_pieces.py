"""Remaining print files for the zellige bag, plus an overview sheet.

Usage: python3 make_zellige_pieces.py <fonts_dir> <out_dir>
Run make_zellige_design.py first (front, back, pocket, tile, preview).
Exactly black, gold, green and red; gold is painted as metallic gold.

Outputs (300 DPI):
  zellige-inside-pocket_2010x1500.png   calm lining: star-and-cross mosaic in black and gold
  zellige-accent-details_3000x1200.png  straps/sides/trim strip, repeats end to end
  zellige-outside-label_900x900.png
  zellige-inside-label_900x900.png
  zellige-overview.png                  all pieces on one sheet (not a print file)
"""
import math
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

from make_flow_pieces import overview
from make_zellige_design import BLACK, GOLD, GREEN, RED, gild, rosette, star_and_cross

DPI = 300
SS = 2


def inside_pocket(w=2010, h=1500):
    """Calm lining: offset rows of small rosettes on black."""
    W, H = w * SS, h * SS
    im = Image.new("RGB", (W, H), BLACK)
    d = ImageDraw.Draw(im)
    g = max(2, SS * 2)
    step = 200 * SS
    for j in range(-1, int(H / step) + 2):
        off = step / 2 if j % 2 else 0
        for i in range(-1, int(W / step) + 2):
            mini(d, i * step + off + step / 4, j * step * 0.87 + step / 2, step * 0.32, i + j, g)
    return gild(im).resize((w, h), Image.LANCZOS)


def mosaic_band(d, W, y0, y1, colors, g):
    """A strip of star-and-cross mosaic between two black-edged gold bars."""
    b = (y1 - y0)
    star_and_cross(d, W, y1, b, b / 2, y0 + b / 2, colors, g)
    d.rectangle((0, y0 - g * 4, W, y0), fill=GOLD, outline=BLACK, width=g)
    d.rectangle((0, y1, W, y1 + g * 4), fill=GOLD, outline=BLACK, width=g)


def mini(d, cx, cy, r, k, g):
    """Small 12-petal rosette; k alternates green and red petals."""
    petal, accent = (GREEN, RED) if k % 2 == 0 else (RED, GREEN)
    rosette(d, cx, cy, r, 12, petal, accent, g)


def details(w=3000, h=1200):
    """Row of rosettes (10 across, so it repeats end to end) between mosaic bands."""
    W, H = w * SS, h * SS
    im = Image.new("RGB", (W, H), BLACK)
    d = ImageDraw.Draw(im)
    g = max(2, SS * 2)
    # top and bottom rows of small rosettes on gold bands (24 across, repeats end to end)
    for yc in (0.112, 0.888):
        cy = H * yc
        d.rectangle((-g * 4, cy - H * 0.07, W + g * 4, cy + H * 0.07), fill=GOLD, outline=BLACK, width=g)
        step_s = W / 24
        for i in range(-1, 25):
            mini(d, (i + 0.5) * step_s, cy, H * 0.05, i, g)
    # center row of rosettes on gold discs, alternating red and green
    n = 10
    step = W / n
    for i in range(-1, n + 1):
        petal, accent = (GREEN, RED) if i % 2 == 0 else (RED, GREEN)
        rosette(d, (i + 0.5) * step, H / 2, H * 0.125, 24, petal, accent, g)
    # small rosettes between the big ones
    for i in range(n + 1):
        mini(d, i * step, H / 2, H * 0.04, i + 1, g)
    return gild(im, period=step).resize((w, h), Image.LANCZOS)


def divider(d, S, y, color_line=True):
    w = SS * 4
    d.line((S * 0.30, y, S * 0.465, y), fill=RED, width=w)
    d.line((S * 0.535, y, S * 0.70, y), fill=GREEN, width=w)
    mini(d, S / 2, y, S * 0.03, 0, max(1, SS))


def outside_label(fonts, px=900):
    S = px * SS
    im = Image.new("RGB", (S, S), GOLD)
    d = ImageDraw.Draw(im)
    g = max(2, SS * 2)
    # border of small rosettes all around, black center panel
    n = 12
    step = S / n
    k = 0
    for i in range(n):
        c = (i + 0.5) * step
        for cx, cy in ((c, step / 2), (c, S - step / 2)):
            mini(d, cx, cy, step * 0.44, k, g); k += 1
    for i in range(1, n - 1):
        c = (i + 0.5) * step
        for cx, cy in ((step / 2, c), (S - step / 2, c)):
            mini(d, cx, cy, step * 0.44, k, g); k += 1
    m = S * 0.12
    d.rectangle((m - 6 * SS, m - 6 * SS, S - m + 6 * SS, S - m + 6 * SS), fill=GOLD, outline=BLACK, width=g)
    d.rectangle((m, m, S - m, S - m), fill=BLACK)
    f = ImageFont.truetype(str(fonts / "Lobster.ttf"), round(S * 0.17))
    d.text((S / 2, S * 0.47), "Falasha", font=f, anchor="mm", fill=GOLD)
    divider(d, S, S * 0.63)
    return gild(im).resize((px, px), Image.LANCZOS)


def inside_label(fonts, px=900):
    """Gold label so Printful's black size/material text stays readable."""
    S = px * SS
    im = Image.new("RGB", (S, S), GOLD)
    d = ImageDraw.Draw(im)
    g = max(2, SS * 2)
    bh = S * 0.16
    band = Image.new("RGB", (S, int(bh)), GOLD)
    bd = ImageDraw.Draw(band)
    for i in range(9):
        mini(bd, (i + 0.5) * S / 9, bh / 2, bh * 0.4, i, g)
    im.paste(gild(band), (0, 0))
    d.rectangle((0, bh, S, bh + S * 0.01), fill=BLACK)
    m = S * 0.05
    d.rectangle((m, bh + m, S - m, S - m), outline=BLACK, width=SS * 4)
    f = ImageFont.truetype(str(fonts / "Lobster.ttf"), round(S * 0.16))
    d.text((S / 2, S * 0.36), "Falasha", font=f, anchor="mm", fill=BLACK)
    divider(d, S, S * 0.48)
    # lower area left plain: Printful adds size, material and origin.
    # Flat gold here (no sheen) keeps that printed text easy to read.
    return im.resize((px, px), Image.LANCZOS)


if __name__ == "__main__":
    fonts, out = Path(sys.argv[1]), Path(sys.argv[2])
    files = {
        "front": out / "zellige-front_2010x2610.png",
        "back": out / "zellige-back_2010x2610.png",
        "pocket": out / "zellige-pocket_2010x1500.png",
        "inside_pocket": out / "zellige-inside-pocket_2010x1500.png",
        "details": out / "zellige-accent-details_3000x1200.png",
        "label_outside": out / "zellige-outside-label_900x900.png",
        "label_inside": out / "zellige-inside-label_900x900.png",
    }
    inside_pocket().save(files["inside_pocket"], dpi=(DPI, DPI), optimize=True)
    details().save(files["details"], dpi=(DPI, DPI), optimize=True)
    outside_label(fonts).save(files["label_outside"], dpi=(DPI, DPI), optimize=True)
    inside_label(fonts).save(files["label_inside"], dpi=(DPI, DPI), optimize=True)
    mock = Image.open(out / "zellige-preview-mockup.png")
    overview(files, mock, fonts, "Falasha — Zellige crossbody bag").save(out / "zellige-overview.png")
    print("done")
