""""Royal Sweep" placement design for the crossbody bag, inspired by the
House of Judah prayer wallpaper: silk ribbons sweeping in from two corners.

Usage: python3 make_sweep_design.py <out_dir>
Outputs (300 DPI, each panel = bag size + 0.5" bleed on every side):
  sweep-front_2010x2610.png
  sweep-back_2010x2610.png    (same art turned 180 degrees, so the back mirrors the front)
  sweep-pocket_2010x1500.png  (lower part of the front, so the pocket lines up with it)
  sweep-preview-mockup.png    product-style preview (not a print file)
"""
import math
import sys
from pathlib import Path

import numpy as np
from PIL import Image

from make_circle_pattern import mockup

DPI = 300
TAU = 2 * math.pi

BLACK = np.array([16, 13, 12], np.float32)
EMERALD = (np.array([3, 46, 30]), np.array([8, 108, 70]), np.array([72, 182, 130]))
RUBY = (np.array([66, 6, 14]), np.array([158, 20, 34]), np.array([228, 86, 90]))
GOLD = (np.array([140, 94, 28]), np.array([212, 162, 70]), np.array([255, 234, 170]))


def gold_at(t):
    t = np.clip(t, 0, 1)[..., None]
    d, m, h = (c.astype(np.float32) for c in GOLD)
    return np.where(t < 0.55, d + (m - d) * (t / 0.55), m + (h - m) * ((t - 0.55) / 0.45))


def silk(t, along, colors):
    """Satin shading across a ribbon (t: 0..1), with a highlight that drifts along it."""
    d, m, h = (c.astype(np.float32) for c in colors)
    t = np.clip(t, 0, 1)
    body = np.clip(np.sin(math.pi * t), 0, 1) ** 0.75
    hi_pos = 0.35 + 0.12 * np.sin(along)
    spec = np.exp(-((t - hi_pos) / 0.11) ** 2) * (0.55 + 0.45 * np.cos(along * 0.7))
    return d + (m - d) * body[..., None] + (h - m) * (0.75 * spec)[..., None]


def sweep_distance(u, v, W, H, c0, slope, amp, freq, phase):
    """Signed pixel distance from a flowing curve v = c(u); positive above it."""
    c = c0 + slope * u + amp * np.sin(TAU * freq * u + phase)
    dc = slope + amp * TAU * freq * np.cos(TAU * freq * u + phase)
    return (c - v) * H / np.sqrt(1 + (dc * H / W) ** 2)


def compose(W, H):
    v, x = np.mgrid[0:H, 0:W].astype(np.float32)
    u, v = x / W, v / H
    grain = np.random.default_rng(12).normal(0, 1, (H, W)).astype(np.float32)
    sheen = 0.5 + 0.5 * np.sin(TAU * (1.3 * u + 0.8 * v))
    # black with a soft pool of light in the middle
    r = np.hypot(u - 0.5, (v - 0.5) * 0.8)
    out = (BLACK * (1.15 - 0.45 * np.clip(r / 0.7, 0, 1))[..., None]) + grain[..., None] * 1.5

    def over(col, a):
        nonlocal out
        out = out * (1 - a) + col * a

    def line(D, at, half=1.6, alpha=1.0, light=0.0):
        a = np.clip(half - np.abs(D - at) + 0.5, 0, 1)[..., None] * alpha
        over(gold_at(0.3 + 0.5 * sheen + light), a)

    def ribbon(D, a, b, colors, along, edge=True, glow=True):
        inside = np.clip(np.minimum(D - a, b - D) + 0.5, 0, 1)[..., None]
        if glow:
            dist = np.where(D < a, a - D, D - b)
            g = (np.exp(-np.maximum(dist, 0) / 45.0) * 0.25)[..., None] * (inside == 0)
            over(colors[1].astype(np.float32), g)
        t = (D - a) / np.maximum(b - a, 1)
        over(silk(t, along, colors), inside)
        if edge:
            line(D, a, 1.8, 1.0, 0.1)
            if np.isfinite(b).all():
                line(D, b, 1.8, 1.0, 0.1)

    def folds(D, a, colors, along, fold):
        """Corner fill: soft repeating silk folds instead of one flat color."""
        inside = np.clip(D - a + 0.5, 0, 1)[..., None]
        t = ((D - a) / fold) % 1.0
        c = silk(t, along + D / fold * 0.9, colors)
        mid = colors[1].astype(np.float32)
        over(c * 0.6 + mid * 0.4, inside)
        line(D, a, 1.8, 1.0, 0.1)

    px = DPI  # 1 inch in pixels

    # ---- top-right sweep ----
    D1 = sweep_distance(u, v, W, H, -0.16, 0.80, 0.045, 0.8, 0.6)
    sw1 = 1 + 0.35 * np.sin(TAU * 0.9 * u + 0.4)         # ribbons swell along their length
    along1 = u * 9
    for k in range(6):                                    # fine gold lines in the black
        line(D1, -0.10 * px - k * 0.07 * px, 1.0, 0.25 + 0.12 * (5 - k) / 5)
    ribbon(D1, 0.00 * px, 0.11 * px * sw1, GOLD, along1)
    ribbon(D1, 0.19 * px * sw1, 0.78 * px * sw1, EMERALD, along1)
    ribbon(D1, 0.86 * px * sw1, 0.96 * px * sw1, GOLD, along1)
    ribbon(D1, 1.04 * px * sw1, 1.60 * px * sw1, RUBY, along1)
    ribbon(D1, 1.68 * px * sw1, 1.76 * px * sw1, GOLD, along1)
    folds(D1, 1.84 * px * sw1, EMERALD, along1, 0.55 * px)

    # ---- bottom-left sweep (distance measured below its curve) ----
    D2 = -sweep_distance(u, v, W, H, 0.52, 0.66, 0.04, 0.7, 2.2)
    sw2 = 1 + 0.3 * np.sin(TAU * 0.8 * u + 2.0)
    along2 = u * 8 + 2
    for k in range(6):
        line(D2, -0.10 * px - k * 0.07 * px, 1.0, 0.25 + 0.12 * (5 - k) / 5)
    ribbon(D2, 0.00 * px, 0.50 * px * sw2, RUBY, along2)
    ribbon(D2, 0.58 * px * sw2, 0.70 * px * sw2, GOLD, along2)
    ribbon(D2, 0.78 * px * sw2, 1.36 * px * sw2, EMERALD, along2)
    ribbon(D2, 1.44 * px * sw2, 1.54 * px * sw2, GOLD, along2)
    folds(D2, 1.62 * px * sw2, RUBY, along2, 0.55 * px)

    # scattered gold sparkles in the open black
    rng = np.random.default_rng(3)
    img = np.clip(out, 0, 255)
    for _ in range(40):
        sx, sy = rng.uniform(0.1, 0.9) * W, rng.uniform(0.2, 0.8) * H
        uu, vv = sx / W, sy / H
        d1 = sweep_distance(np.float32(uu), np.float32(vv), W, H, -0.16, 0.80, 0.045, 0.8, 0.6)
        d2 = -sweep_distance(np.float32(uu), np.float32(vv), W, H, 0.52, 0.66, 0.04, 0.7, 2.2)
        if d1 > -0.6 * px or d2 > -0.6 * px:
            continue
        rr = rng.uniform(3, 7)
        yy0, yy1, xx0, xx1 = int(sy - 12), int(sy + 13), int(sx - 12), int(sx + 13)
        gy, gx = np.mgrid[yy0:yy1, xx0:xx1].astype(np.float32)
        a = np.clip(rr - np.hypot(gx - sx, gy - sy) + 0.5, 0, 1)[..., None]
        patch = img[yy0:yy1, xx0:xx1]
        img[yy0:yy1, xx0:xx1] = patch * (1 - a) + gold_at(np.full(a.shape[:2], 0.7)) * a
    return Image.fromarray(img.astype(np.uint8))


if __name__ == "__main__":
    out = Path(sys.argv[1])
    out.mkdir(parents=True, exist_ok=True)
    W, H = 2010, 2610
    front = compose(W, H)
    front.save(out / "sweep-front_2010x2610.png", dpi=(DPI, DPI), optimize=True)
    front.rotate(180).save(out / "sweep-back_2010x2610.png", dpi=(DPI, DPI), optimize=True)
    # pocket sits on the lower part of the front: reuse that area so the art lines up
    pocket = front.crop((0, H - 1500, W, H))
    pocket.save(out / "sweep-pocket_2010x1500.png", dpi=(DPI, DPI), optimize=True)
    mockup(front, front=front, pocket_art=pocket).save(out / "sweep-preview-mockup.png")
    print("done")
