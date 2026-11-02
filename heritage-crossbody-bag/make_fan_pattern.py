"""Ankara-style scalloped fan pattern (seamless) for the heritage crossbody bag.

Usage: python3 make_fan_pattern.py <out_dir>
Outputs (300 DPI):
  fan-pattern-tile_2400.png   8"x8" seamless tile (use with Printful's Pattern fill)
  fan-pattern-sheet_6000.png  20"x20" sheet of the tile
  fan-preview-mockup.png      product-style preview of the bag (not a print file)
"""
import math
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw

from make_circle_pattern import mockup

DPI = 300
SS = 3
BG, GOLD, RED, GREEN, CREAM = range(5)

WARM_BLACK = np.array([20, 17, 15])
GOLD_DEEP = np.array([150, 102, 30])
GOLD_MID = np.array([214, 163, 66])
GOLD_HI = np.array([252, 226, 150])
RED_DEEP = np.array([118, 16, 24])
RED_MAIN = np.array([178, 30, 38])
GREEN_DEEP = np.array([4, 70, 44])
GREEN_MAIN = np.array([12, 124, 76])
CREAM_C = np.array([244, 230, 198])


def disc(d, cx, cy, r, fill):
    d.ellipse((cx - r, cy - r, cx + r, cy + r), fill=fill)


def upper_angles(n, start=200, end=340):
    """Angles (radians) spread over the visible top of a fan."""
    return [math.radians(start + (end - start) * (i + 0.5) / n) for i in range(n)]


def ray(d, cx, cy, a, r0, r1, half, fill):
    d.polygon([(cx + r0 * math.cos(a - half), cy + r0 * math.sin(a - half)),
               (cx + r1 * math.cos(a), cy + r1 * math.sin(a)),
               (cx + r0 * math.cos(a + half), cy + r0 * math.sin(a + half))], fill=fill)


def fan(d, cx, cy, r, kind):
    disc(d, cx, cy, r, GOLD)                       # gold rim
    disc(d, cx, cy, r * 0.955, BG)
    if kind == 0:   # ruby bands with gold beads
        disc(d, cx, cy, r * 0.93, RED)
        for a in upper_angles(16, 185, 355):
            disc(d, cx + r * 0.85 * math.cos(a), cy + r * 0.85 * math.sin(a), r * 0.028, GOLD)
        disc(d, cx, cy, r * 0.77, GOLD)
        disc(d, cx, cy, r * 0.75, BG)
        for a in upper_angles(11, 190, 350):
            disc(d, cx + r * 0.66 * math.cos(a), cy + r * 0.66 * math.sin(a), r * 0.045, GOLD)
        disc(d, cx, cy, r * 0.57, RED)
        disc(d, cx, cy, r * 0.45, BG)
    elif kind == 1:  # emerald sunburst
        disc(d, cx, cy, r * 0.93, GREEN)
        for a in upper_angles(22, 182, 358):
            ray(d, cx, cy, a, r * 0.60, r * 0.93, math.radians(3.2), BG)
        disc(d, cx, cy, r * 0.62, GOLD)
        disc(d, cx, cy, r * 0.595, CREAM)
        disc(d, cx, cy, r * 0.53, GREEN)
        for a in upper_angles(8, 195, 345):
            disc(d, cx + r * 0.47 * math.cos(a), cy + r * 0.47 * math.sin(a), r * 0.03, GOLD)
    elif kind == 2:  # black with fine gold arcs
        for k in range(7):
            rr = r * (0.90 - k * 0.075)
            disc(d, cx, cy, rr, GOLD)
            disc(d, cx, cy, rr - r * 0.016, BG)
        disc(d, cx, cy, r * 0.40, RED)
    else:            # gold fan with ruby drops
        disc(d, cx, cy, r * 0.93, GOLD)
        for a in upper_angles(13, 188, 352):
            x, y = cx + r * 0.83 * math.cos(a), cy + r * 0.83 * math.sin(a)
            disc(d, x, y, r * 0.05, RED)
        disc(d, cx, cy, r * 0.73, BG)
        disc(d, cx, cy, r * 0.70, GREEN)
        disc(d, cx, cy, r * 0.62, BG)
        for a in upper_angles(9, 192, 348):
            ray(d, cx, cy, a, r * 0.44, r * 0.60, math.radians(6), GOLD)
        disc(d, cx, cy, r * 0.44, RED)


def slots(S, cols=4):
    im = Image.new("L", (S, S), BG)
    d = ImageDraw.Draw(im)
    r = S / cols / 2 * 1.0          # fan radius
    # 16 rows: the color cycle repeats every 8 rows, so the tile joins seamlessly
    rows = 16
    step_y = S / rows
    # rows drawn top to bottom so each row overlaps the one above
    for j in range(-6, rows + 6):
        y = j * step_y
        off = r if j % 2 else 0
        for i in range(-2, cols + 2):
            x = i * 2 * r + off
            kind = (i + (j // 2) + j) % 4
            fan(d, x, y, r, kind)
    return im, rows


def finish(idx, size):
    arr = np.asarray(idx)
    yy, xx = np.mgrid[0:size, 0:size].astype(np.float32) / size
    grain = np.random.default_rng(5).normal(0, 1, (size, size)).astype(np.float32)
    # soft waves of light across the gold so it reads as metal
    sheen = 0.5 + 0.5 * np.sin((xx * 0.8 + yy) * math.pi * 2 * 3)
    sheen2 = 0.5 + 0.5 * np.sin((xx - yy * 0.6) * math.pi * 2 * 5 + 1.0)
    t = np.clip(0.2 + 0.55 * sheen + 0.25 * sheen2 + grain * 0.02, 0, 1)[..., None]
    gold = np.where(t < 0.55, GOLD_DEEP + (GOLD_MID - GOLD_DEEP) * (t / 0.55),
                    GOLD_MID + (GOLD_HI - GOLD_MID) * ((t - 0.55) / 0.45))
    shade = np.clip(0.55 + 0.45 * sheen, 0, 1)[..., None]
    colors = {
        BG: WARM_BLACK + grain[..., None] * 2.0,
        GOLD: gold,
        RED: RED_DEEP + (RED_MAIN - RED_DEEP) * shade,
        GREEN: GREEN_DEEP + (GREEN_MAIN - GREEN_DEEP) * shade,
        CREAM: CREAM_C + 0 * shade,
    }
    out = np.zeros((size, size, 3), np.float32)
    for k, col in colors.items():
        m = Image.fromarray(((arr == k) * 255).astype(np.uint8)).resize((size, size), Image.BOX)
        out += col * (np.asarray(m, np.float32)[..., None] / 255)
    return Image.fromarray(np.clip(out, 0, 255).astype(np.uint8))


def tile(size=2400):
    idx, rows = slots(size * SS)
    return finish(idx, size)


if __name__ == "__main__":
    out = Path(sys.argv[1])
    out.mkdir(parents=True, exist_ok=True)
    t = tile()
    t.save(out / "fan-pattern-tile_2400.png", dpi=(DPI, DPI), optimize=True)
    sheet = Image.new("RGB", (6000, 6000))
    for x in range(0, 6000, 2400):
        for y in range(0, 6000, 2400):
            sheet.paste(t, (x, y))
    sheet.save(out / "fan-pattern-sheet_6000.png", dpi=(DPI, DPI), optimize=True)
    mockup(t, repeat_in=8.0).save(out / "fan-preview-mockup.png")  # tile at full 8" size
    print("done")
