"""Dot-painting mandala (kaleidoscope) placement design for the crossbody bag.

Usage: python3 make_mandala_design.py <out_dir>
Densely packed layered 3D dots in the African heritage palette (red, black,
green, gold) form scalloped petal bands radiating from a glowing center,
reaching every corner, with a soft luminous glow.

Outputs (300 DPI, each panel = bag size + 0.5" bleed on every side):
  mandala-front_2010x2610.png
  mandala-back_2010x2610.png    (same mandala with the colors swapped around)
  mandala-pocket_2010x1500.png  (lower part of the front, so the pocket lines up)
  mandala-preview-mockup.png    product-style preview (not a print file)
"""
import math
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

from make_circle_pattern import mockup

DPI = 300
SS = 2
TAU = 2 * math.pi

BG = (12, 9, 9)
DEEP_RED = (110, 8, 20)
RED = (200, 24, 40)
RED_L = (244, 84, 70)
AMBER = (236, 140, 28)
GOLD = (246, 192, 60)
GOLD_L = (255, 232, 150)
DEEP_GREEN = (0, 66, 38)
GREEN = (12, 140, 80)
GREEN_L = (70, 206, 126)
CREAM = (252, 244, 222)
WHITE = (255, 252, 240)

# dot "recipes": outer -> inner layers (dot-in-dot painting)
RECIPES = {
    "gold": [AMBER, GOLD, GOLD_L],
    "red": [DEEP_RED, RED, RED_L],
    "green": [DEEP_GREEN, GREEN, GREEN_L],
    "redgold": [RED, GOLD, GOLD_L],
    "greengold": [GREEN, GOLD, GOLD_L],
    "goldred": [GOLD, RED, RED_L],
    "goldgreen": [GOLD, GREEN, GREEN_L],
    "redgreen": [DEEP_RED, GREEN, GREEN_L],
    "greenred": [DEEP_GREEN, RED, RED_L],
}


def dot(d, x, y, r, kind):
    """A painted 3D dot: layered rings plus a small highlight."""
    layers = RECIPES[kind]
    n = len(layers)
    for i, c in enumerate(layers):
        rr = r * (1 - i * 0.30)
        d.ellipse((x - rr, y - rr, x + rr, y + rr), fill=c)
    hr = r * 0.22
    hx, hy = x - r * 0.28, y - r * 0.30
    d.ellipse((hx - hr, hy - hr, hx + hr, hy + hr), fill=WHITE)


def compose(W, H, bands, petals=12, center=(0.5, 0.42), twist=0.0):
    """Dense dot mandala: rings of touching dots out to the corners.
    Petals come from a scalloped band field, so every dot belongs to a petal
    band whose color cycles through `bands`."""
    S = SS
    im = Image.new("RGB", (W * S, H * S), BG)
    d = ImageDraw.Draw(im)
    cx, cy = W * S * center[0], H * S * center[1]
    rmax = max(math.hypot(x - cx, y - cy) for x in (0, W * S) for y in (0, H * S)) + 40 * S
    unit = W * S * 0.5
    r = 0.0
    dot(d, cx, cy, unit * 0.06, "redgold")
    r = unit * 0.06
    ring_i = 0
    while r < rmax:
        size = unit * (0.014 + 0.022 * min(r / unit, 1.6) ** 0.8)
        r += size * 1.05
        n = max(6, int(TAU * r / (size * 2.15)))
        n -= n % petals          # keep the count a multiple of the petal number (symmetry)
        n = max(n, petals)
        phase = (TAU / n) * 0.5 * (ring_i % 2) + twist
        for k in range(n):
            ang = phase + TAU * k / n
            # scalloped petal field: radius shifted by angle, then cut into bands
            scal = abs(math.cos(petals * ang / 2))
            f = r / unit - 0.28 * scal ** 1.5
            band = int(math.floor(f * 4.2))
            kind = bands[band % len(bands)]
            # dots swell in the middle of each petal
            sz = size * (0.82 + 0.25 * (1 - scal))
            dot(d, cx + r * math.cos(ang), cy + r * math.sin(ang), sz, kind)
        r += size * 1.05
        ring_i += 1
    im = im.resize((W, H), Image.LANCZOS)
    # luminous glow: screen a blurred copy over the art
    a = np.asarray(im, np.float32) / 255
    g = np.asarray(im.filter(ImageFilter.GaussianBlur(16)), np.float32) / 255 * 0.5
    out = 1 - (1 - a) * (1 - g)
    return Image.fromarray((np.clip(out, 0, 1) * 255).astype(np.uint8))


if __name__ == "__main__":
    out = Path(sys.argv[1])
    out.mkdir(parents=True, exist_ok=True)
    W, H = 2010, 2610
    front = compose(W, H, ["gold", "red", "greengold", "green", "goldred", "red", "goldgreen", "green"])
    front.save(out / "mandala-front_2010x2610.png", dpi=(DPI, DPI), optimize=True)
    back = compose(W, H, ["gold", "green", "redgold", "red", "goldgreen", "green", "goldred", "red"], twist=0.13)
    back.save(out / "mandala-back_2010x2610.png", dpi=(DPI, DPI), optimize=True)
    pocket = front.crop((0, H - 1500, W, H))
    pocket.save(out / "mandala-pocket_2010x1500.png", dpi=(DPI, DPI), optimize=True)
    mockup(front, front=front, pocket_art=pocket).save(out / "mandala-preview-mockup.png")
    print("done")
