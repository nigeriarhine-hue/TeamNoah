"""Flowing abstract "liquid silk" pattern (seamless) for the heritage crossbody bag.

Usage: python3 make_flow_pattern.py <out_dir>
Outputs (300 DPI):
  flow-pattern-tile_2400.png   8"x8" seamless tile (use with Printful's Pattern fill)
  flow-pattern-sheet_6000.png  20"x20" sheet of the tile
  flow-preview-mockup.png      product-style preview of the bag (not a print file)

The waves come from sine waves with whole-number frequencies over the tile,
bent by more such waves, so every edge meets its opposite edge exactly.
"""
import math
import sys
from pathlib import Path

import numpy as np
from PIL import Image

from make_circle_pattern import mockup

DPI = 300
TAU = 2 * math.pi

BLACK = np.array([18, 15, 14])
RED = np.array([168, 26, 36])
RED_DEEP = np.array([92, 10, 18])
GREEN = np.array([12, 120, 74])
GREEN_DEEP = np.array([3, 58, 36])
GOLD_DEEP = np.array([150, 102, 30])
GOLD_MID = np.array([214, 163, 66])
GOLD_HI = np.array([255, 230, 156])


def field(size):
    v, u = np.mgrid[0:size, 0:size].astype(np.float32) / size
    # periodic warps (whole-number frequencies keep the tile seamless)
    wu = u + 0.11 * np.sin(TAU * (v + 0.15)) + 0.035 * np.sin(TAU * (2 * u + 3 * v) + 1.7)
    wv = v + 0.07 * np.sin(TAU * (u + 0.4)) + 0.03 * np.sin(TAU * (u - 2 * v) + 0.6)
    # one main diagonal wave gives long ribbons; a light second wave makes them swell
    f = 0.85 * np.sin(TAU * (wu + 2 * wv)) + 0.15 * np.sin(TAU * (2 * wu - wv) + 1.3)
    return u, v, f


def gold_at(t):
    t = np.clip(t, 0, 1)[..., None]
    return np.where(t < 0.55, GOLD_DEEP + (GOLD_MID - GOLD_DEEP) * (t / 0.55),
                    GOLD_MID + (GOLD_HI - GOLD_MID) * ((t - 0.55) / 0.45))


def tile(size=2400):
    u, v, f = field(size)
    s = f * 2.9                       # bands; 2.9 keeps wave peaks from starting a tiny new band
    band = np.floor(s).astype(int)
    t = s - band                      # position inside a band, 0..1

    # rounded "satin" shading across each ribbon
    satin = np.sin(math.pi * t)
    sheen = 0.5 + 0.5 * np.sin(TAU * (u * 2 + v * 3))

    kind = band % 6
    out = np.zeros((size, size, 3), np.float32)
    fills = {
        0: BLACK + 0 * satin[..., None],
        1: RED_DEEP + (RED - RED_DEEP) * (0.35 + 0.65 * satin)[..., None],
        2: BLACK * (0.9 + 0.3 * satin)[..., None],
        3: GREEN_DEEP + (GREEN - GREEN_DEEP) * (0.35 + 0.65 * satin)[..., None],
        4: BLACK + 0 * satin[..., None],
        5: gold_at(0.15 + 0.55 * satin + 0.3 * sheen),
    }
    for k, col in fills.items():
        out += col * (kind == k)[..., None]

    # anti-aliased gold lines along every band edge, plus hairlines in black bands
    gy = (np.roll(s, -1, 0) - np.roll(s, 1, 0)) / 2
    gx = (np.roll(s, -1, 1) - np.roll(s, 1, 1)) / 2
    g = np.maximum(np.hypot(gx, gy), 1e-4)        # band units per pixel

    def line(dist_units, half_px):
        return np.clip(half_px - dist_units / g + 0.5, 0, 1)[..., None]

    edge = np.minimum(t, 1 - t)
    gold_line = gold_at(0.25 + 0.5 * sheen + 0.25 * np.sin(TAU * (u * 5 - v * 2)))
    a = line(edge, 3.2) * np.clip(g / (np.median(g) * 0.25), 0, 1)[..., None]
    out = out * (1 - a) + gold_line * a

    hair = np.abs(t - 0.5)
    in_black = ((kind == 0) | (kind == 2) | (kind == 4))[..., None]
    # fade hairlines where the waves flatten out, so no tiny loops or dots appear
    flat = np.clip(g / (np.median(g) * 0.6), 0, 1)[..., None]
    a2 = line(hair, 1.1) * in_black * 0.85 * flat
    out = out * (1 - a2) + gold_line * a2

    grain = np.random.default_rng(9).normal(0, 1.6, (size, size, 1)).astype(np.float32)
    return Image.fromarray(np.clip(out + grain, 0, 255).astype(np.uint8))


if __name__ == "__main__":
    out = Path(sys.argv[1])
    out.mkdir(parents=True, exist_ok=True)
    t = tile()
    t.save(out / "flow-pattern-tile_2400.png", dpi=(DPI, DPI), optimize=True)
    sheet = Image.new("RGB", (6000, 6000))
    for x in range(0, 6000, 2400):
        for y in range(0, 6000, 2400):
            sheet.paste(t, (x, y))
    sheet.save(out / "flow-pattern-sheet_6000.png", dpi=(DPI, DPI), optimize=True)
    mockup(t, repeat_in=6.0).save(out / "flow-preview-mockup.png")
    print("done")
