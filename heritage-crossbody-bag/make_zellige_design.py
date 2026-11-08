"""Moroccan zellige tile design for the crossbody bag, in black, gold, green and red.

Usage: python3 make_zellige_design.py <out_dir>
Like a zellige tile wall: fine 24-point rosettes of slim petals, medium
rosettes between every four large ones, small rosettes in the remaining
gaps, set in a star-and-cross mosaic, with thin black grout. No border.

Outputs (300 DPI, each panel = bag size + 0.5" bleed on every side):
  zellige-front_2010x2610.png
  zellige-back_2010x2610.png     (red and green swapped)
  zellige-pocket_2010x1500.png   (lower part of the front, so the pocket lines up)
  zellige-tile_2400.png          plain repeating tile, for any other area
  zellige-preview-mockup.png     product-style preview (not a print file)
"""
import math
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw

from make_circle_pattern import mockup

DPI = 300
SS = 2
TAU = 2 * math.pi

BLACK = (10, 10, 10)
GOLD = (201, 152, 52)   # placeholder while drawing; painted as metallic gold after
GREEN = (0, 122, 61)
RED = (196, 18, 36)
GOLD_DEEP = np.array([150, 104, 30], np.float32)
GOLD_MID = np.array([204, 156, 60], np.float32)
GOLD_HI = np.array([242, 210, 128], np.float32)


def gild(im, period=None):
    """Replace flat gold with metallic gold (soft diagonal sheen).
    With period (px), the sheen repeats every period so a tile stays seamless."""
    arr = np.asarray(im, np.float32)
    w, h = im.size
    mask = np.all(np.abs(arr - np.array(GOLD, np.float32)) < 1, axis=-1)
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    p = period or w * 0.4
    t = 0.55 + 0.18 * np.sin(TAU * (xx + yy) / p) + 0.10 * np.sin(TAU * (2 * xx - yy) / p + 1.0)
    t = np.clip(t, 0, 1)[..., None]
    col = np.where(t < 0.5, GOLD_DEEP + (GOLD_MID - GOLD_DEEP) * (t / 0.5),
                   GOLD_MID + (GOLD_HI - GOLD_MID) * ((t - 0.5) / 0.5))
    arr[mask] = col[mask]
    return Image.fromarray(arr.astype(np.uint8))


def polar(cx, cy, r, a):
    return (cx + r * math.cos(a), cy + r * math.sin(a))


def piece(d, pts, fill, g):
    d.polygon(pts, fill=fill, outline=BLACK, width=g)


def rosette(d, cx, cy, R, n, petal, accent, g):
    """Zellige rosette: n slim petals radiating from a small star-flower center."""
    w = math.pi / n
    # gold disc with a thin black rim, so the background mosaic stops at the rosette
    d.ellipse((cx - R * 1.05, cy - R * 1.05, cx + R * 1.05, cy + R * 1.05), fill=GOLD, outline=BLACK, width=g)
    # long slim petals; the gold field shows between them like the white tile in zellige
    for i in range(n):
        t = TAU * i / n
        piece(d, [polar(cx, cy, R * 0.30, t), polar(cx, cy, R * 0.62, t - w * 0.82),
                  polar(cx, cy, R * 1.0, t), polar(cx, cy, R * 0.62, t + w * 0.82)], petal, g)
        # small accent drop between petal tips
        u = t + w
        piece(d, [polar(cx, cy, R * 0.74, u), polar(cx, cy, R * 0.88, u - w * 0.55),
                  polar(cx, cy, R * 1.0, u), polar(cx, cy, R * 0.88, u + w * 0.55)], accent, g)
    # center: black ring of small gold petals around a red/gold core
    d.ellipse((cx - R * 0.30, cy - R * 0.30, cx + R * 0.30, cy + R * 0.30), fill=BLACK)
    m = 12
    for i in range(m):
        t = TAU * i / m
        piece(d, [polar(cx, cy, R * 0.12, t), polar(cx, cy, R * 0.20, t - math.pi / m * 0.8),
                  polar(cx, cy, R * 0.28, t), polar(cx, cy, R * 0.20, t + math.pi / m * 0.8)], GOLD, max(1, g // 2))
    d.ellipse((cx - R * 0.15, cy - R * 0.15, cx + R * 0.15, cy + R * 0.15), fill=accent, outline=BLACK, width=g)
    d.ellipse((cx - R * 0.05, cy - R * 0.05, cx + R * 0.05, cy + R * 0.05), fill=GOLD)


def star_and_cross(d, W, H, b, ox, oy, colors, g):
    """Classic star-and-cross tiling: 8-point stars touching at their tips,
    gold crosses showing between them. Spacing b divides the rosette grid."""
    i0, j0 = -int(ox / b) - 2, -int(oy / b) - 2
    i1, j1 = int((W - ox) / b) + 2, int((H - oy) / b) + 2
    r = b * 0.5
    for j in range(j0, j1):
        for i in range(i0, i1):
            cx, cy = ox + i * b, oy + j * b
            pts = [polar(cx, cy, r if k % 2 == 0 else r * 0.62, TAU * k / 16 + math.pi / 4) for k in range(16)]
            piece(d, pts, colors[(i + j) % len(colors)], g)


def field(W, H, a, ox=0.0, oy=0.0, swap=False):
    """Zellige wall: large rosettes on a square grid of spacing a, medium ones
    at cell centers, small ones on cell edges, gold field with black grout."""
    main, alt = (RED, GREEN) if swap else (GREEN, RED)
    im = Image.new("RGB", (W, H), GOLD)
    d = ImageDraw.Draw(im)
    g = max(2, round(a * 0.008))
    star_and_cross(d, W, H, a / 8, ox + a / 16, oy + a / 16, [main, alt, BLACK], g)
    i0, j0 = -int(ox / a) - 2, -int(oy / a) - 2
    i1, j1 = int((W - ox) / a) + 2, int((H - oy) / a) + 2
    for j in range(j0, j1):
        for i in range(i0, i1):
            x, y = ox + i * a, oy + j * a
            # small rosettes on cell edges (between two large and two medium)
            rosette(d, x + a / 2, y, a * 0.12, 12, alt, main, g)
            rosette(d, x, y + a / 2, a * 0.12, 12, alt, main, g)
    for j in range(j0, j1):
        for i in range(i0, i1):
            x, y = ox + i * a, oy + j * a
            rosette(d, x + a / 2, y + a / 2, a * 0.29, 16, alt, main, g)   # medium: red petals
            rosette(d, x, y, a * 0.37, 24, main, alt, g)                   # large
    return im


def compose(W, H, swap=False, a=760):
    S = SS
    im = field(W * S, H * S, a * S, ox=W * S / 2, oy=H * S * 0.33, swap=swap)
    return gild(im).resize((W, H), Image.LANCZOS)


if __name__ == "__main__":
    out = Path(sys.argv[1])
    out.mkdir(parents=True, exist_ok=True)
    W, H = 2010, 2610
    front = compose(W, H)
    front.save(out / "zellige-front_2010x2610.png", dpi=(DPI, DPI), optimize=True)
    back = compose(W, H, swap=True)
    back.save(out / "zellige-back_2010x2610.png", dpi=(DPI, DPI), optimize=True)
    pocket = front.crop((0, H - 1500, W, H))
    pocket.save(out / "zellige-pocket_2010x1500.png", dpi=(DPI, DPI), optimize=True)
    # plain repeating tile: 8" = 3 cells of 800 px, sheen repeats every 800 px
    t = field(2400 * SS, 2400 * SS, 800 * SS)
    gild(t, period=800 * SS).resize((2400, 2400), Image.LANCZOS).save(
        out / "zellige-tile_2400.png", dpi=(DPI, DPI), optimize=True)
    mockup(front, front=front, pocket_art=pocket).save(out / "zellige-preview-mockup.png")
    print("done")
