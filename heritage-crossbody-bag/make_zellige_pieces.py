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
from make_zellige_design import (BLACK, GOLD, GREEN, RED, gild, polar, rosette, star_and_cross)

DPI = 300
SS = 2


def inside_pocket(w=2010, h=1500):
    W, H = w * SS, h * SS
    im = Image.new("RGB", (W, H), GOLD)
    d = ImageDraw.Draw(im)
    star_and_cross(d, W, H, 100 * SS, 50 * SS, 50 * SS, [BLACK], max(2, SS * 2))
    return gild(im).resize((w, h), Image.LANCZOS)


def mosaic_band(d, W, y0, y1, colors, g):
    """A strip of star-and-cross mosaic between two black-edged gold bars."""
    b = (y1 - y0)
    star_and_cross(d, W, y1, b, b / 2, y0 + b / 2, colors, g)
    d.rectangle((0, y0 - g * 4, W, y0), fill=GOLD, outline=BLACK, width=g)
    d.rectangle((0, y1, W, y1 + g * 4), fill=GOLD, outline=BLACK, width=g)


def details(w=3000, h=1200):
    """Row of rosettes (6 across, so it repeats end to end) between mosaic bands."""
    W, H = w * SS, h * SS
    im = Image.new("RGB", (W, H), BLACK)
    d = ImageDraw.Draw(im)
    g = max(2, SS * 2)
    # top and bottom mosaic bands (band height divides the width: 3000 / 125 = 24)
    for y0 in (0.06, 0.835):
        top = H * y0
        band = Image.new("RGB", (W, int(125 * SS)), GOLD)
        bd = ImageDraw.Draw(band)
        star_and_cross(bd, W, band.size[1], 125 * SS, 62.5 * SS, 62.5 * SS, [GREEN, RED, BLACK], g)
        im.paste(band, (0, int(top)))
        d.rectangle((0, top - 6 * SS, W, top), fill=GOLD)
        d.rectangle((0, top + band.size[1], W, top + band.size[1] + 6 * SS), fill=GOLD)
    # center row of rosettes on gold discs, alternating red and green
    n = 6
    step = W / n
    for i in range(-1, n + 1):
        petal, accent = (GREEN, RED) if i % 2 == 0 else (RED, GREEN)
        rosette(d, (i + 0.5) * step, H / 2, H * 0.205, 24, petal, accent, g)
    # small gold 8-point stars between rosettes
    for i in range(n + 1):
        cx = i * step
        pts = [polar(cx, H / 2, H * 0.06 if k % 2 == 0 else H * 0.03, math.tau * k / 16) for k in range(16)]
        d.polygon(pts, fill=GOLD, outline=BLACK, width=g)
    return gild(im, period=step).resize((w, h), Image.LANCZOS)


def divider(d, S, y, color_line=True):
    w = SS * 4
    d.line((S * 0.30, y, S * 0.465, y), fill=RED, width=w)
    d.line((S * 0.535, y, S * 0.70, y), fill=GREEN, width=w)
    r = S * 0.025
    pts = [polar(S / 2, y, r if k % 2 == 0 else r * 0.45, math.tau * k / 16) for k in range(16)]
    d.polygon(pts, fill=GOLD, outline=BLACK, width=SS)


def outside_label(fonts, px=900):
    S = px * SS
    im = Image.new("RGB", (S, S), GOLD)
    d = ImageDraw.Draw(im)
    g = max(2, SS * 2)
    # mosaic border all around, black center panel
    star_and_cross(d, S, S, S / 12, S / 24, S / 24, [GREEN, RED, BLACK], g)
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
    star_and_cross(ImageDraw.Draw(band), S, int(bh), bh / 2, bh / 4, bh / 4, [GREEN, RED, BLACK], g)
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
