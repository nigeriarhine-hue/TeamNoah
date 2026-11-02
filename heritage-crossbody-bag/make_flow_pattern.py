"""Flowing abstract "silk ribbons" pattern (seamless) for the heritage crossbody bag.

Usage: python3 make_flow_pattern.py <out_dir>
Outputs (300 DPI):
  flow-pattern-tile_2400.png   8"x8" seamless tile
  flow-pattern-sheet_6000.png  20"x20" sheet of the tile

A wave "phase" runs diagonally across the tile; it is bent by sine waves with
whole-number frequencies, so every edge meets its opposite edge exactly.
Ribbons and gold lines sit at fixed places along that phase, so each one
appears once per wave and flows unbroken.
"""
import math
import sys
from pathlib import Path

import numpy as np
from PIL import Image

DPI = 300
TAU = 2 * math.pi

BLACK = np.array([16, 13, 12], np.float32)
EMERALD_D = np.array([2, 48, 32], np.float32)
EMERALD = np.array([8, 110, 72], np.float32)
EMERALD_HI = np.array([70, 180, 128], np.float32)
RUBY_D = np.array([70, 6, 16], np.float32)
RUBY = np.array([160, 20, 36], np.float32)
RUBY_HI = np.array([226, 84, 88], np.float32)
GOLD_DEEP = np.array([140, 94, 28], np.float32)
GOLD_MID = np.array([212, 162, 70], np.float32)
GOLD_HI = np.array([255, 232, 166], np.float32)


def field(w, h, periods=(1, 2)):
    """Seamless wave phase over a w x h tile (in pixels)."""
    v, x = np.mgrid[0:h, 0:w].astype(np.float32)
    u, v = x / w, v / h
    wu = u + 0.09 * np.sin(TAU * (v + 0.15)) + 0.025 * np.sin(TAU * (2 * u + 3 * v) + 1.7)
    wv = v + 0.06 * np.sin(TAU * (u + 0.4)) + 0.02 * np.sin(TAU * (u - 2 * v) + 0.6)
    phi = periods[0] * wu + periods[1] * wv
    # slow swelling so ribbons widen and taper as they travel
    swell = 1 + 0.38 * np.sin(TAU * (u - v) + 0.7) + 0.12 * np.sin(TAU * (2 * u + v) + 2.0)
    return u, v, phi, swell


def gold_at(t):
    t = np.clip(t, 0, 1)[..., None]
    return np.where(t < 0.55, GOLD_DEEP + (GOLD_MID - GOLD_DEEP) * (t / 0.55),
                    GOLD_MID + (GOLD_HI - GOLD_MID) * ((t - 0.55) / 0.45))


def silk(t, deep, mid, hi):
    """Satin shading across a ribbon: dark edges, soft highlight off-center."""
    t = np.clip(t, 0, 1)
    body = np.clip(np.sin(math.pi * t), 0, 1) ** 0.8
    spec = np.exp(-((t - 0.38) / 0.12) ** 2)
    c = deep + (mid - deep) * body[..., None]
    return c + (hi - mid) * (0.7 * spec)[..., None]


def render(u, v, phi, swell, style="ribbons"):
    """Paint ribbons and gold lines along the phase field."""
    h, w = phi.shape
    gy, gx = np.gradient(phi)
    g = np.maximum(np.hypot(gx, gy), 1e-6)            # phase units per pixel
    p = phi - np.floor(phi)                           # 0..1 within each wave
    sheen = 0.5 + 0.5 * np.sin(TAU * (u * 2 + v * 3))

    # very soft background light so the black isn't flat
    out = BLACK * (0.9 + 0.25 * (0.5 + 0.5 * np.sin(TAU * (u + v) + 0.4)))[..., None]
    out = np.broadcast_to(out, (h, w, 3)).copy()

    def dist_px(center, half):
        """Signed distance in pixels from a ribbon edge (negative = inside)."""
        d = np.abs(((p - center + 0.5) % 1.0) - 0.5)
        return (d - half) / g

    def cover(dpx, soft=0.8):
        return np.clip(0.5 - dpx / soft, 0, 1)[..., None]

    def over(col, a):
        nonlocal out
        out = out * (1 - a) + col * a

    def gold_line(center, half_px, alpha=1.0, light=0.0):
        d = np.abs(((p - center + 0.5) % 1.0) - 0.5) / g
        a = np.clip(half_px - d + 0.5, 0, 1)[..., None] * alpha
        over(gold_at(0.25 + 0.5 * sheen + light), a)

    def ribbon(center, half, deep, mid, hi):
        hw = half * swell
        dpx = dist_px(center, hw)
        # soft colored glow around the ribbon
        glow = np.exp(-np.maximum(dpx, 0) / 55.0)[..., None] * 0.22
        over(mid, glow * (dpx > 0)[..., None])
        # silk body
        t = (((p - center + 0.5) % 1.0) - 0.5) / (2 * hw) + 0.5
        over(silk(t, deep, mid, hi), cover(dpx))
        # fine gold edges
        for side in (-1, 1):
            gold_line((center + side * hw) % 1.0, 1.6, 1.0, 0.1)

    if style == "lines":
        for k in range(12):
            gold_line(k / 12, 1.0, 0.55 + 0.25 * (k % 3 == 0))
        return finish(out, h, w)

    # fine gold line bundles in the open black
    for k in range(7):
        c = 0.22 + k * 0.018
        gold_line(c, 0.9, 0.35 + 0.55 * math.sin(math.pi * (k + 0.5) / 7))
    for k in range(5):
        c = 0.78 + k * 0.022
        gold_line(c, 0.9, 0.3 + 0.5 * math.sin(math.pi * (k + 0.5) / 5))

    ribbon(0.06, 0.070, EMERALD_D, EMERALD, EMERALD_HI)     # wide emerald silk
    ribbon(0.43, 0.020, GOLD_DEEP, GOLD_MID, GOLD_HI)       # slim gold ribbon
    ribbon(0.60, 0.050, RUBY_D, RUBY, RUBY_HI)              # ruby silk
    return finish(out, h, w)


def finish(out, h, w):
    grain = np.random.default_rng(9).normal(0, 1.4, (h, w, 1)).astype(np.float32)
    return Image.fromarray(np.clip(out + grain, 0, 255).astype(np.uint8))


def tile(size=2400, style="ribbons"):
    return render(*field(size, size), style=style)


def sheet(t, inches=20):
    n = inches * DPI
    s = Image.new("RGB", (n, n))
    for x in range(0, n, t.size[0]):
        for y in range(0, n, t.size[1]):
            s.paste(t, (x, y))
    return s


if __name__ == "__main__":
    out = Path(sys.argv[1])
    out.mkdir(parents=True, exist_ok=True)
    t = tile()
    t.save(out / "flow-pattern-tile_2400.png", dpi=(DPI, DPI), optimize=True)
    sheet(t).save(out / "flow-pattern-sheet_6000.png", dpi=(DPI, DPI), optimize=True)
    print("done")
