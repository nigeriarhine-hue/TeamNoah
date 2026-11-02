"""Kaleidoscope placement design for the crossbody bag.

Usage: python3 make_kaleido_design.py <out_dir> [source_tile]
Mirrors a slice of the Royal Sweep artwork (sweep-front_2010x2610.png by
default: silk ribbons + gold line lattice) around the panel center, like a
real kaleidoscope: 12 mirrored slices make a ruby/emerald star in a gold web.

Outputs (300 DPI, each panel = bag size + 0.5" bleed on every side):
  kaleido-front_2010x2610.png
  kaleido-back_2010x2610.png    (same idea, turned so it is not a copy of the front)
  kaleido-pocket_2010x1500.png  (lower part of the front, so the pocket lines up)
  kaleido-preview-mockup.png    product-style preview (not a print file)
"""
import math
import sys
from pathlib import Path

import numpy as np
from PIL import Image

from make_circle_pattern import mockup

DPI = 300


def sample_wrap(src, x, y):
    """Bilinear sample of a repeating tile at float coords."""
    h, w = src.shape[:2]
    x0, y0 = np.floor(x).astype(int), np.floor(y).astype(int)
    fx, fy = (x - x0)[..., None], (y - y0)[..., None]
    x0 %= w
    y0 %= h
    x1, y1 = (x0 + 1) % w, (y0 + 1) % h
    a = src[y0, x0] * (1 - fx) + src[y0, x1] * fx
    b = src[y1, x0] * (1 - fx) + src[y1, x1] * fx
    return a * (1 - fy) + b * fy


def reflect(c, n):
    """Mirror coordinates back into 0..n-1 so sampling past an edge stays seamless."""
    c = np.mod(c, 2 * (n - 1))
    return np.where(c > n - 1, 2 * (n - 1) - c, c)


def kaleido(src, W, H, slices=8, origin=(900, 700), turn=0.35, scale=1.0, center=None):
    cx, cy = center or (W / 2, H / 2)
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    dx, dy = xx - cx, yy - cy
    r = np.hypot(dx, dy) * scale
    a = np.arctan2(dy, dx)
    wedge = math.pi / slices
    # fold every angle into one mirrored wedge
    f = np.mod(a, 2 * wedge)
    f = np.where(f > wedge, 2 * wedge - f, f)
    sx = origin[0] + r * np.cos(f + turn)
    sy = origin[1] + r * np.sin(f + turn)
    h, w = src.shape[:2]
    out = sample_wrap(src, reflect(sx, w), reflect(sy, h))
    # soft spotlight on the center
    rr = np.hypot(dx / W, dy / H)
    out = out * (1.08 - 0.25 * np.clip(rr / 0.75, 0, 1))[..., None]
    return Image.fromarray(np.clip(out, 0, 255).astype(np.uint8))


if __name__ == "__main__":
    out = Path(sys.argv[1])
    src_path = Path(sys.argv[2]) if len(sys.argv) > 2 else out / "sweep-front_2010x2610.png"
    src = np.asarray(Image.open(src_path).convert("RGB"), np.float32)
    W, H = 2010, 2610
    look = dict(slices=6, origin=(700, 1500), scale=0.8)
    front = kaleido(src, W, H, turn=0.9, **look)
    front.save(out / "kaleido-front_2010x2610.png", dpi=(DPI, DPI), optimize=True)
    back = kaleido(src, W, H, turn=1.15, **look)
    back.save(out / "kaleido-back_2010x2610.png", dpi=(DPI, DPI), optimize=True)
    pocket = front.crop((0, H - 1500, W, H))
    pocket.save(out / "kaleido-pocket_2010x1500.png", dpi=(DPI, DPI), optimize=True)
    mockup(front, front=front, pocket_art=pocket).save(out / "kaleido-preview-mockup.png")
    print("done")
