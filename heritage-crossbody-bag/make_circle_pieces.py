"""Every print file for the bag in the premium circle (medallion) design.

Usage: python3 make_circle_pieces.py <fonts_dir> <out_dir>
Run make_circle_pattern.py first (needs circle-pattern-tile_2400.png).

The 8" tile is used at a 4" repeat, the size shown in the preview.
Panels are the bag's sizes plus 0.5" bleed on every side.
"""
import math
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

from make_circle_pattern import (BG, CREAM, GOLD, GREEN, LINE, RED, SS, around, circle,
                                 mockup, ring, small_medallion, star4)
from make_flow_labels import gold_fill
from make_flow_pieces import crop, overview

DPI = 300
IN = DPI
REPEAT = 1200  # 4" repeat at 300 DPI

PIECES = {"front": (6.7, 8.7, 0.3, 0.2), "back": (6.7, 8.7, 2.3, 1.2), "pocket": (6.7, 5.0, 1.3, 2.3)}

WARM_BLACK = np.array([20, 17, 15], np.float32)
LATTICE = np.array([38, 31, 26], np.float32)
GOLD_DEEP = np.array([150, 102, 30], np.float32)
GOLD_MID = np.array([214, 163, 66], np.float32)
GOLD_HI = np.array([252, 226, 150], np.float32)
RED_DEEP = np.array([110, 14, 22], np.float32)
RED_MAIN = np.array([176, 30, 38], np.float32)
GREEN_DEEP = np.array([4, 66, 42], np.float32)
GREEN_MAIN = np.array([10, 122, 74], np.float32)
CREAM_C = np.array([244, 230, 198], np.float32)


def finish_any(idx, w, h, bg=WARM_BLACK):
    """Paint a slot image of any shape: metallic gold with a soft diagonal sheen."""
    arr = np.asarray(idx)
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    # whole-number cycles across the width, so a file that repeats end to end stays seamless
    kx1, kx2 = max(1, round(w / 1630)), max(1, round(w / 1070))
    sheen = 0.5 + 0.5 * np.sin(2 * math.pi * kx1 * xx / w + yy / 260.0)
    sheen2 = 0.5 + 0.5 * np.sin(2 * math.pi * kx2 * xx / w - 0.6 * yy / 170.0 + 1.0)
    grain = np.random.default_rng(4).normal(0, 1, (h, w)).astype(np.float32)
    t = np.clip(0.2 + 0.5 * sheen + 0.3 * sheen2 + grain * 0.02, 0, 1)[..., None]
    gold = np.where(t < 0.55, GOLD_DEEP + (GOLD_MID - GOLD_DEEP) * (t / 0.55),
                    GOLD_MID + (GOLD_HI - GOLD_MID) * ((t - 0.55) / 0.45))
    shade = np.clip(0.55 + 0.45 * sheen, 0, 1)[..., None]
    colors = {BG: bg + grain[..., None] * 2.0, GOLD: gold,
              RED: RED_DEEP + (RED_MAIN - RED_DEEP) * shade,
              GREEN: GREEN_DEEP + (GREEN_MAIN - GREEN_DEEP) * shade,
              CREAM: CREAM_C + 0 * shade, LINE: LATTICE + 0 * shade}
    out = np.zeros((h, w, 3), np.float32)
    for k, col in colors.items():
        m = Image.fromarray(((arr == k) * 255).astype(np.uint8)).resize((w, h), Image.BOX)
        out += col * (np.asarray(m, np.float32)[..., None] / 255)
    return Image.fromarray(np.clip(out, 0, 255).astype(np.uint8))


def lattice(d, W, H, step):
    for k in range(-int(H / step) - 2, int(W / step) + 2):
        d.line((k * step, 0, k * step + H, H), fill=LINE, width=SS * 2)
        d.line((k * step + H, 0, k * step, H), fill=LINE, width=SS * 2)


def inside_pocket(w=2010, h=1500):
    """Calm lining: faint lattice with small gold stars."""
    W, H = w * SS, h * SS
    im = Image.new("L", (W, H), BG)
    d = ImageDraw.Draw(im)
    step = 150 * SS
    lattice(d, W, H, step)
    for j in range(-1, int(H / step) + 2):
        for i in range(-1, int(W / step) + 2):
            cx, cy = i * step + (step / 2 if j % 2 else 0), j * step
            if (i + j) % 2 == 0:
                star4(d, cx, cy, step * 0.13, GOLD)
            else:
                circle(d, cx, cy, step * 0.025, GOLD)
    return finish_any(im, w, h)


def details(w=3000, h=1200):
    """Straps/sides/trim: a row of small medallions between gold bands.
    3000 px holds exactly 6 repeats, so it joins seamlessly end to end."""
    W, H = w * SS, h * SS
    im = Image.new("L", (W, H), BG)
    d = ImageDraw.Draw(im)
    lattice(d, W, H, 150 * SS)
    for y0, col, th in ((0.08, GOLD, 0.02), (0.13, RED, 0.012), (0.16, GOLD, 0.006),
                        (0.84, GOLD, 0.006), (0.875, GREEN, 0.012), (0.90, GOLD, 0.02)):
        d.rectangle((0, y0 * H, W, (y0 + th) * H), fill=col)
    n = 6
    step = W / n
    for i in range(-1, n + 1):
        cx = i * step + step / 2
        circle(d, cx, H / 2, H * 0.20, BG)
        small_medallion(d, cx, H / 2, H * 0.16)
        sx = i * step
        star4(d, sx, H / 2, H * 0.06, GOLD)
        for x, y, _ in around(sx, H / 2, H * 0.1, 4, math.pi / 4):
            circle(d, x, y, H * 0.012, GOLD)
    return finish_any(im, w, h)


def label_outside(fonts, px=900):
    S = px * SS
    base = Image.new("L", (S, S), BG)
    d = ImageDraw.Draw(base)
    lattice(d, S, S, 150 * SS)
    img = finish_any(base, px, px).convert("RGBA").resize((S, S), Image.LANCZOS)
    m = Image.new("L", (S, S), 0)
    md = ImageDraw.Draw(m)
    md.rectangle((S * 0.04, S * 0.04, S * 0.96, S * 0.96), outline=255, width=SS * 7)
    md.rectangle((S * 0.065, S * 0.065, S * 0.935, S * 0.935), outline=255, width=SS * 3)
    f = ImageFont.truetype(str(fonts / "Lobster.ttf"), round(S * 0.20))
    md.text((S / 2, S * 0.48), "Falasha", font=f, anchor="mm", fill=255)
    img.alpha_composite(gold_fill(m))
    d = ImageDraw.Draw(img)
    y = S * 0.63
    d.line((S * 0.32, y, S * 0.47, y), fill=(176, 30, 38), width=SS * 4)
    d.line((S * 0.53, y, S * 0.68, y), fill=(10, 122, 74), width=SS * 4)
    star4(d, S / 2, y, S * 0.026, (232, 184, 84))
    return img.convert("RGB").resize((px, px), Image.LANCZOS)


def label_inside(fonts, strip, px=900):
    S = px * SS
    im = Image.new("RGBA", (S, S), (246, 236, 212, 255))
    band_h = round(S * 0.17)
    # top strip: the medallion row from the details file
    sw = strip.resize((S, round(strip.size[1] * S / strip.size[0])), Image.LANCZOS)
    top = (sw.size[1] - band_h) // 2
    band = sw.crop((0, top, S, top + band_h))
    im.paste(band, (0, 0))
    gm = Image.new("L", (S, S), 0)
    gd = ImageDraw.Draw(gm)
    gd.rectangle((0, band_h, S, band_h + S * 0.012), fill=255)
    m = S * 0.04
    gd.rectangle((m, band_h + m * 0.8, S - m, S - m), outline=255, width=SS * 4)
    m2 = m + S * 0.018
    gd.rectangle((m2, band_h + m * 0.8 + S * 0.018, S - m2, S - m2), outline=255, width=SS * 2)
    im.alpha_composite(gold_fill(gm))
    f = ImageFont.truetype(str(fonts / "Lobster.ttf"), round(S * 0.16))
    d = ImageDraw.Draw(im)
    d.text((S / 2, S * 0.335), "Falasha", font=f, anchor="mm", fill=(18, 15, 14))
    y = S * 0.47
    d.line((S * 0.29, y, S * 0.475, y), fill=(176, 30, 38), width=SS * 3)
    d.line((S * 0.525, y, S * 0.71, y), fill=(10, 122, 74), width=SS * 3)
    star4(d, S / 2, y, S * 0.022, (214, 163, 66))
    return im.convert("RGB").resize((px, px), Image.LANCZOS)


if __name__ == "__main__":
    fonts, out = Path(sys.argv[1]), Path(sys.argv[2])
    t = Image.open(out / "circle-pattern-tile_2400.png").convert("RGB")
    small = t.resize((REPEAT, REPEAT), Image.LANCZOS)
    big = Image.new("RGB", (REPEAT * 6, REPEAT * 6))
    for x in range(0, big.size[0], REPEAT):
        for y in range(0, big.size[1], REPEAT):
            big.paste(small, (x, y))
    files = {}
    for name, (w, h, x, y) in PIECES.items():
        p = out / f"circle-{name}_{round(w * IN)}x{round(h * IN)}.png"
        crop(big, w, h, x, y).save(p, dpi=(DPI, DPI), optimize=True)
        files[name] = p
    files["inside_pocket"] = out / "circle-inside-pocket_2010x1500.png"
    inside_pocket().save(files["inside_pocket"], dpi=(DPI, DPI), optimize=True)
    files["details"] = out / "circle-accent-details_3000x1200.png"
    details().save(files["details"], dpi=(DPI, DPI), optimize=True)
    files["label_outside"] = out / "circle-outside-label_900x900.png"
    label_outside(fonts).save(files["label_outside"], dpi=(DPI, DPI), optimize=True)
    files["label_inside"] = out / "circle-inside-label_900x900.png"
    label_inside(fonts, Image.open(files["details"]).convert("RGB")).save(files["label_inside"], dpi=(DPI, DPI), optimize=True)
    mock = mockup(t, repeat_in=4.0)
    mock.save(out / "circle-preview-mockup.png")
    overview(files, mock, fonts, "Falasha — Royal Medallion crossbody bag").save(out / "circle-overview.png")
    print("\n".join(str(v) for v in files.values()))
