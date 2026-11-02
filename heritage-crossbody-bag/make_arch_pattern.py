"""Modern abstract "Arches" pattern (seamless) for the heritage crossbody bag.

Usage: python3 make_arch_pattern.py <out_dir>
Outputs (300 DPI):
  arch-pattern-tile_2400.png   8"x8" seamless tile (use at about a 5" repeat)
  arch-pattern-sheet_6000.png  20"x20" sheet of the tile
  arch-preview-mockup.png      product-style preview of the bag (not a print file)

Mid-century style shapes (half-moons, arches, circles, dot grids, gold lines)
placed on a jittered grid. Every shape is also drawn at its wrapped copies,
and the gold sheen uses whole-number cycles, so the tile repeats seamlessly.
"""
import math
import random
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw

from make_circle_pattern import BG, CREAM, GOLD, GREEN, LINE, RED, mockup

DPI = 300
SS = 3
TAU = 2 * math.pi

WARM_BLACK = np.array([20, 17, 15], np.float32)
GOLD_DEEP = np.array([150, 102, 30], np.float32)
GOLD_MID = np.array([214, 163, 66], np.float32)
GOLD_HI = np.array([252, 226, 150], np.float32)
RED_DEEP = np.array([118, 14, 26], np.float32)
RED_MAIN = np.array([170, 30, 40], np.float32)
GREEN_DEEP = np.array([4, 62, 40], np.float32)
GREEN_MAIN = np.array([12, 116, 74], np.float32)
CREAM_C = np.array([238, 222, 190], np.float32)
LINE_C = np.array([36, 30, 26], np.float32)


# ---------------- shapes (cx, cy = center, r = size, rot = 0..3 quarter turns) ----------------

def half_disc(d, cx, cy, r, rot, col):
    start = 180 + 90 * rot
    d.pieslice((cx - r, cy - r, cx + r, cy + r), start, start + 180, fill=col)


def quarter(d, cx, cy, r, rot, col):
    start = 90 * rot
    d.pieslice((cx - r, cy - r, cx + r, cy + r), start, start + 90, fill=col)


def arch(d, cx, cy, r, rot, col):
    """Nested gold arcs around a solid half-moon."""
    start = 180 + 90 * rot
    lw = max(SS * 3, round(r * 0.035))
    for k in range(4):
        rr = r * (1.0 - k * 0.11)
        d.arc((cx - rr, cy - rr, cx + rr, cy + rr), start, start + 180, fill=GOLD, width=lw)
    rr = r * 0.52
    d.pieslice((cx - rr, cy - rr, cx + rr, cy + rr), start, start + 180, fill=col)


def disc_with_ring(d, cx, cy, r, rot, col):
    d.ellipse((cx - r, cy - r, cx + r, cy + r), fill=col)
    off = r * 0.22
    ox, oy = [(off, -off), (off, off), (-off, off), (-off, -off)][rot]
    rr = r * 1.02
    d.ellipse((cx + ox - rr, cy + oy - rr, cx + ox + rr, cy + oy + rr), outline=GOLD, width=max(SS * 3, round(r * 0.04)))


def dot_grid(d, cx, cy, r, rot, col):
    n = 4
    step = r * 2 / (n - 1)
    for i in range(n):
        for j in range(n):
            x, y = cx - r + i * step, cy - r + j * step
            rr = r * 0.075
            d.ellipse((x - rr, y - rr, x + rr, y + rr), fill=GOLD)


def pill(d, cx, cy, r, rot, col):
    w, h = (r * 0.55, r * 1.25) if rot % 2 else (r * 1.25, r * 0.55)
    d.rounded_rectangle((cx - w, cy - h, cx + w, cy + h), radius=min(w, h), fill=col)


def ring_lines(d, cx, cy, r, rot, col):
    lw = max(SS * 3, round(r * 0.03))
    for k in range(3):
        rr = r * (1.0 - k * 0.18)
        d.ellipse((cx - rr, cy - rr, cx + rr, cy + rr), outline=GOLD, width=lw)
    rr = r * 0.2
    d.ellipse((cx - rr, cy - rr, cx + rr, cy + rr), fill=col)


def gold_stick(d, cx, cy, r, rot, col):
    lw = max(SS * 4, round(r * 0.05))
    if rot % 2:
        d.line((cx, cy - r, cx, cy + r), fill=GOLD, width=lw)
        e = (cx, cy - r)
    else:
        d.line((cx - r, cy, cx + r, cy), fill=GOLD, width=lw)
        e = (cx + r, cy)
    rr = r * 0.16
    d.ellipse((e[0] - rr, e[1] - rr, e[0] + rr, e[1] + rr), fill=col)


SHAPES = [arch, half_disc, disc_with_ring, dot_grid, quarter, pill, ring_lines, gold_stick]


SOLIDS = [half_disc, quarter, pill, half_disc]
LINEWORK = ["ring", "arcs", "stick", "dots"]


def ring_outline(d, cx, cy, r):
    d.ellipse((cx - r, cy - r, cx + r, cy + r), outline=GOLD, width=max(SS * 3, round(r * 0.025)))


def composition(d, cx, cy, r, solid, col, line, rot, accent):
    """One cluster: a bold solid shape layered with fine gold linework."""
    solid(d, cx, cy, r, rot, col)
    ox, oy = [(1, -1), (1, 1), (-1, 1), (-1, -1)][rot]
    if line == "ring":
        ring_outline(d, cx + ox * r * 0.35, cy + oy * r * 0.35, r * 0.85)
    elif line == "arcs":
        start = 180 + 90 * ((rot + 2) % 4)
        lw = max(SS * 3, round(r * 0.022))
        for k in range(5):
            rr = r * (0.55 + k * 0.1)
            d.arc((cx - rr, cy - rr, cx + rr, cy + rr), start, start + 180, fill=GOLD, width=lw)
    elif line == "stick":
        gold_stick(d, cx + ox * r * 0.6, cy - oy * r * 0.9, r * 0.7, rot, accent)
    else:
        dot_grid(d, cx + ox * r * 0.75, cy + oy * r * 0.75, r * 0.35, rot, accent)
    # small accent circle tucked against the shape
    rr = r * 0.16
    ax, ay = cx - ox * r * 0.75, cy - oy * r * 0.55
    d.ellipse((ax - rr, ay - rr, ax + rr, ay + rr), fill=accent)


def slots(S, cells=3, seed=7):
    rng = random.Random(seed)
    im = Image.new("L", (S, S), BG)
    d = ImageDraw.Draw(im)
    cell = S / cells
    offsets = [(ox, oy) for ox in (-S, 0, S) for oy in (-S, 0, S)]
    palette = [GREEN, RED, CREAM, RED, GREEN, GOLD]
    accents = {GREEN: GOLD, RED: CREAM, CREAM: RED, GOLD: GREEN}
    items = []
    k = 0
    for j in range(cells):
        for i in range(cells):
            # half-drop: every other column shifts down half a cell
            cx = (i + 0.5) * cell + rng.uniform(-0.06, 0.06) * cell
            cy = (j + 0.5 + (0.5 if i % 2 else 0)) * cell + rng.uniform(-0.06, 0.06) * cell
            col = palette[k % len(palette)]
            items.append((cx, cy, cell * rng.uniform(0.26, 0.31), SOLIDS[(k * 2 + j) % len(SOLIDS)], col,
                          LINEWORK[(k + j) % len(LINEWORK)], rng.randrange(4), accents[col]))
            k += 1
    # a light scatter of gold dots, kept clear of the clusters
    dots = []
    while len(dots) < cells * cells * 3:
        x, y = rng.uniform(0, S), rng.uniform(0, S)
        def wrapped(a, b):
            dx = abs(a[0] - b[0]) % S
            dy = abs(a[1] - b[1]) % S
            return math.hypot(min(dx, S - dx), min(dy, S - dy))
        if all(wrapped((x, y), (it[0], it[1])) > it[2] * 1.45 for it in items) and \
           all(wrapped((x, y), q) > cell * 0.22 for q in dots):
            dots.append((x, y))
    for ox, oy in offsets:
        for n, (x, y) in enumerate(dots):
            rr = cell * (0.012 if n % 3 else 0.02)
            d.ellipse((x + ox - rr, y + oy - rr, x + ox + rr, y + oy + rr), fill=GOLD)
    for ox, oy in offsets:
        for cx, cy, r, solid, col, line, rot, acc in items:
            composition(d, cx + ox, cy + oy, r, solid, col, line, rot, acc)
    return im


def finish(idx, size):
    arr = np.asarray(idx)
    yy, xx = np.mgrid[0:size, 0:size].astype(np.float32) / size
    grain = np.random.default_rng(6).normal(0, 1, (size, size)).astype(np.float32)
    sheen = 0.5 + 0.5 * np.sin(TAU * (2 * xx + 3 * yy))
    sheen2 = 0.5 + 0.5 * np.sin(TAU * (5 * xx - 2 * yy) + 1.0)
    t = np.clip(0.2 + 0.5 * sheen + 0.3 * sheen2 + grain * 0.02, 0, 1)[..., None]
    gold = np.where(t < 0.55, GOLD_DEEP + (GOLD_MID - GOLD_DEEP) * (t / 0.55),
                    GOLD_MID + (GOLD_HI - GOLD_MID) * ((t - 0.55) / 0.45))
    shade = np.clip(0.6 + 0.4 * sheen, 0, 1)[..., None]
    colors = {
        BG: WARM_BLACK + grain[..., None] * 2.0,
        GOLD: gold,
        RED: RED_DEEP + (RED_MAIN - RED_DEEP) * shade,
        GREEN: GREEN_DEEP + (GREEN_MAIN - GREEN_DEEP) * shade,
        CREAM: CREAM_C * (0.94 + 0.06 * shade),
        LINE: LINE_C + 0 * shade,
    }
    out = np.zeros((size, size, 3), np.float32)
    for k, col in colors.items():
        m = Image.fromarray(((arr == k) * 255).astype(np.uint8)).resize((size, size), Image.BOX)
        out += col * (np.asarray(m, np.float32)[..., None] / 255)
    return Image.fromarray(np.clip(out, 0, 255).astype(np.uint8))


def tile(size=2400):
    return finish(slots(size * SS), size)


if __name__ == "__main__":
    out = Path(sys.argv[1])
    out.mkdir(parents=True, exist_ok=True)
    t = tile()
    t.save(out / "arch-pattern-tile_2400.png", dpi=(DPI, DPI), optimize=True)
    sheet = Image.new("RGB", (6000, 6000))
    for x in range(0, 6000, 2400):
        for y in range(0, 6000, 2400):
            sheet.paste(t, (x, y))
    sheet.save(out / "arch-pattern-sheet_6000.png", dpi=(DPI, DPI), optimize=True)
    mockup(t, repeat_in=5.0).save(out / "arch-preview-mockup.png")
    print("done")
