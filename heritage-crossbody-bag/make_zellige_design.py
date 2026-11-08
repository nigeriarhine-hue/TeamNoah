"""Moroccan zellige tile design for the crossbody bag, in black, gold, green and red.

Usage: python3 make_zellige_design.py <out_dir>
16-point star rosettes built from separate tile pieces with black grout
between them, 8-point stars in the gaps, and a gold stepped border that
splits the panel into a large-tile zone and a small-tile zone.

Outputs (300 DPI, each panel = bag size + 0.5" bleed on every side):
  zellige-front_2010x2610.png
  zellige-back_2010x2610.png
  zellige-pocket_2010x1500.png   (lower part of the front, so the pocket lines up)
  zellige-tile_2400.png          plain repeating tile (no border), for any other area
  zellige-preview-mockup.png     product-style preview (not a print file)
"""
import math
import sys
from pathlib import Path

from PIL import Image, ImageDraw

from make_circle_pattern import mockup

DPI = 300
SS = 2
TAU = 2 * math.pi

BLACK = (10, 10, 10)
GOLD = (232, 178, 40)
GREEN = (0, 122, 61)
RED = (196, 18, 36)


def polar(cx, cy, r, a):
    return (cx + r * math.cos(a), cy + r * math.sin(a))


def piece(d, pts, fill, grout):
    d.polygon(pts, fill=fill, outline=BLACK, width=grout)


def rosette(d, cx, cy, R, scheme, grout):
    """16-point zellige rosette. Pieces fill the disc edge to edge; only the
    black grout outlines separate them, like set mosaic tiles."""
    petal, inner_bg, kite, ring_bg = scheme
    n = 16
    w = math.pi / n

    def disc(r, fill):
        d.ellipse((cx - r, cy - r, cx + r, cy + r), fill=fill, outline=BLACK, width=grout)

    # outer ring: background, then kites
    disc(R, ring_bg)
    for i in range(n):
        u = TAU * i / n + w
        piece(d, [polar(cx, cy, R * 0.66, u), polar(cx, cy, R * 0.82, u - w * 0.98),
                  polar(cx, cy, R * 0.98, u), polar(cx, cy, R * 0.82, u + w * 0.98)], kite, grout)
    # inner field and petals
    disc(R * 0.66, inner_bg)
    for i in range(n):
        t = TAU * i / n
        piece(d, [polar(cx, cy, R * 0.16, t), polar(cx, cy, R * 0.40, t - w * 0.98),
                  polar(cx, cy, R * 0.65, t), polar(cx, cy, R * 0.40, t + w * 0.98)], petal, grout)
    # 16-point star center filling the space between the petal bases
    pts = []
    for i in range(n):
        t = TAU * i / n
        pts += [polar(cx, cy, R * 0.16, t), polar(cx, cy, R * 0.40, t + w)]
    piece(d, pts, GOLD if inner_bg != GOLD else RED, grout)
    disc(R * 0.08, petal)


def star8(d, cx, cy, r, outer, inner, grout):
    pts = []
    for i in range(16):
        pts.append(polar(cx, cy, r if i % 2 == 0 else r * 0.62, TAU * i / 16 + math.pi / 8))
    piece(d, pts, outer, grout)
    oct_ = [polar(cx, cy, r * 0.42, TAU * i / 8 + math.pi / 8) for i in range(8)]
    piece(d, oct_, inner, grout)


def diamond(d, cx, cy, r, fill, grout):
    piece(d, [(cx, cy - r), (cx + r * 0.55, cy), (cx, cy + r), (cx - r * 0.55, cy)], fill, grout)
    piece(d, [(cx - r, cy), (cx, cy - r * 0.55), (cx + r, cy), (cx, cy + r * 0.55)], fill, grout)


# (petal, inner background, outer kites, outer ring background)
SCHEMES = [(RED, GOLD, GOLD, GREEN), (GREEN, GOLD, GOLD, RED)]


def field(W, H, a, ox=0.0, oy=0.0, scheme_shift=0):
    """Fill a W x H image with the zellige grid of spacing a (pixels)."""
    im = Image.new("RGB", (W, H), BLACK)
    d = ImageDraw.Draw(im)
    g = max(2, round(a * 0.012))
    R = a * 0.5
    i0, j0 = -int(ox / a) - 2, -int(oy / a) - 2
    i1, j1 = int((W - ox) / a) + 2, int((H - oy) / a) + 2
    for j in range(j0, j1):
        for i in range(i0, i1):
            cx, cy = ox + i * a, oy + j * a
            # 8-point star in the gap between four rosettes
            star8(d, cx + a / 2, cy + a / 2, a * 0.215, GOLD, (RED if (i + j) % 2 else GREEN), g)
    for j in range(j0, j1):
        for i in range(i0, i1):
            rosette(d, ox + i * a, oy + j * a, R * 0.995, SCHEMES[(i + j + scheme_shift) % 2], g)
    return im


def stepped_border(W, H, top_y, step, depth):
    """Outline of a Moroccan stepped (merlon) arch running across the panel."""
    pts = [(0, top_y)]
    x = 0.0
    cx = W / 2
    # stepped rise toward the middle, a pointed arch, then mirrored steps
    levels = [0, -1, -2, -3]
    for k, lv in enumerate(levels):
        x0, x1 = k * step, (k + 1) * step
        pts += [(x0, top_y + lv * depth), (x1, top_y + lv * depth)]
    peak = top_y - 5.2 * depth
    pts += [(cx - step * 0.3, top_y - 3.6 * depth), (cx, peak), (cx + step * 0.3, top_y - 3.6 * depth)]
    for k, lv in reversed(list(enumerate(levels))):
        x0, x1 = W - (k + 1) * step, W - k * step
        pts += [(x0, top_y + lv * depth), (x1, top_y + lv * depth)]
    pts.append((W, top_y))
    return pts


def compose(W, H, top_y=0.56, flip_schemes=False):
    S = SS
    w, h = W * S, H * S
    big = field(w, h, 330 * S, ox=w / 2, oy=h * 0.30, scheme_shift=1 if flip_schemes else 0)
    small = field(w, h, 190 * S, ox=w / 2, oy=h * 0.80, scheme_shift=0 if flip_schemes else 1)
    border = stepped_border(w, h, h * top_y, w * 0.115, h * 0.035)
    mask = Image.new("L", (w, h), 0)
    ImageDraw.Draw(mask).polygon(border + [(w, 0), (0, 0)], fill=255)
    im = Image.composite(big, small, mask)
    d = ImageDraw.Draw(im)
    # gold-red-gold band along the border
    for width, col in ((int(h * 0.016), BLACK), (int(h * 0.012), GOLD), (int(h * 0.005), RED)):
        d.line(border, fill=col, width=width, joint="curve")
    return im.resize((W, H), Image.LANCZOS)


if __name__ == "__main__":
    out = Path(sys.argv[1])
    out.mkdir(parents=True, exist_ok=True)
    W, H = 2010, 2610
    front = compose(W, H)
    front.save(out / "zellige-front_2010x2610.png", dpi=(DPI, DPI), optimize=True)
    back = compose(W, H, flip_schemes=True)
    back.save(out / "zellige-back_2010x2610.png", dpi=(DPI, DPI), optimize=True)
    pocket = front.crop((0, H - 1500, W, H))
    pocket.save(out / "zellige-pocket_2010x1500.png", dpi=(DPI, DPI), optimize=True)
    # plain repeating tile: 8" holds a whole number of cells (300 px spacing)
    tile = field(2400 * SS, 2400 * SS, 300 * SS).resize((2400, 2400), Image.LANCZOS)
    tile.save(out / "zellige-tile_2400.png", dpi=(DPI, DPI), optimize=True)
    mockup(front, front=front, pocket_art=pocket).save(out / "zellige-preview-mockup.png")
    print("done")
