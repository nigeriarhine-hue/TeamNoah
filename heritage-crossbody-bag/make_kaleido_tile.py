"""Kaleidoscope tessellation (seamless) for the crossbody bag.

Usage: python3 make_kaleido_tile.py <out_dir>
Like looking through a real kaleidoscope: art is mirrored into 12-fold
rosettes that sit on a hexagonal grid and fit together like stained glass.
The tile is 1200 x 2078 px (4" wide, two rosettes), which repeats seamlessly.
Outputs (300 DPI): kaleido-tile_1200x2078.png, kaleido-pattern-sheet_6000.png,
kaleido-front/back_2010x2610.png, kaleido-pocket_2010x1500.png, kaleido-preview-mockup.png
"""
import math
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageEnhance

DPI = 300
SQ3 = math.sqrt(3)


def sample(src, x, y):
    """Bilinear sample, mirroring at the source edges so nothing jumps."""
    h, w = src.shape[:2]

    def refl(c, n):
        c = np.mod(c, 2 * (n - 1))
        return np.where(c > n - 1, 2 * (n - 1) - c, c)

    x, y = refl(x, w), refl(y, h)
    x0, y0 = np.floor(x).astype(int), np.floor(y).astype(int)
    x1, y1 = np.minimum(x0 + 1, w - 1), np.minimum(y0 + 1, h - 1)
    fx, fy = (x - x0)[..., None], (y - y0)[..., None]
    a = src[y0, x0] * (1 - fx) + src[y0, x1] * fx
    b = src[y1, x0] * (1 - fx) + src[y1, x1] * fx
    return a * (1 - fy) + b * fy


def hex_fold(W, H, a):
    """For every pixel: distance and folded angle (0..30 deg) to the nearest
    hexagonal-grid center. Grid spacing a; the tile W x H holds whole cells."""
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    sy = H / (a * SQ3)                       # whole rows of the grid fit the tile height
    best = np.full((H, W), 1e18, np.float32)
    bdx = np.zeros((H, W), np.float32)
    bdy = np.zeros((H, W), np.float32)
    rows = round(H / (a * SQ3 / 2))
    row_h = H / rows
    for j in range(-1, rows + 2):
        cy = j * row_h
        off = a / 2 if j % 2 else 0.0
        for i in range(-1, round(W / a) + 2):
            cx = i * a + off
            dx, dy = xx - cx, (yy - cy) * (a * SQ3 / 2) / row_h
            dd = dx * dx + dy * dy
            m = dd < best
            best = np.where(m, dd, best)
            bdx = np.where(m, dx, bdx)
            bdy = np.where(m, dy, bdy)
    r = np.sqrt(best)
    t = np.mod(np.arctan2(bdy, bdx), math.pi / 3)
    t = np.where(t > math.pi / 6, math.pi / 3 - t, t)
    return r, t


def kaleido_tile(src, W=1200, a=600, origin=(800, 800), turn=0.5, scale=1.0, boost=1.25):
    H = round(W * SQ3)
    r, t = hex_fold(W, H, a)
    rr = r * scale
    out = sample(src, origin[0] + rr * np.cos(t + turn), origin[1] + rr * np.sin(t + turn))
    img = Image.fromarray(np.clip(out, 0, 255).astype(np.uint8))
    img = ImageEnhance.Color(img).enhance(boost)
    return ImageEnhance.Contrast(img).enhance(1.08)


def sheet(t, w, h):
    s = Image.new("RGB", (w, h))
    for x in range(0, w, t.size[0]):
        for y in range(0, h, t.size[1]):
            s.paste(t, (x, y))
    return s


if __name__ == "__main__":
    from make_circle_pattern import mockup

    out = Path(sys.argv[1])
    src = np.asarray(Image.open(out / "fan-pattern-tile_2400.png").convert("RGB"), np.float32)
    t = kaleido_tile(src, W=1200, a=600, origin=(800, 800), turn=0.5, scale=1.0)
    t.save(out / "kaleido-tile_1200x2078.png", dpi=(DPI, DPI), optimize=True)
    big = sheet(t, 6000, 6000)
    big.save(out / "kaleido-pattern-sheet_6000.png", dpi=(DPI, DPI), optimize=True)
    # ready-to-upload panels (bag size + 0.5" bleed); the back starts at another spot
    front = big.crop((300, 200, 300 + 2010, 200 + 2610))
    back = big.crop((900, 720, 900 + 2010, 720 + 2610))
    pocket = front.crop((0, 2610 - 1500, 2010, 2610))
    front.save(out / "kaleido-front_2010x2610.png", dpi=(DPI, DPI), optimize=True)
    back.save(out / "kaleido-back_2010x2610.png", dpi=(DPI, DPI), optimize=True)
    pocket.save(out / "kaleido-pocket_2010x1500.png", dpi=(DPI, DPI), optimize=True)
    mockup(front, front=front, pocket_art=pocket).save(out / "kaleido-preview-mockup.png")
    print("done")
