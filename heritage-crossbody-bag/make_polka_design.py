"""Polka dot design for the crossbody bag: black, gold, green and red only.

Usage: python3 make_polka_design.py <out_dir>
Staggered rows of dots on black, colors cycling red, gold, green so they form
diagonal lines. The 8" tile holds whole repeats, so it joins seamlessly.

Outputs (300 DPI): polka-tile_2400.png, polka-front_2010x2610.png,
polka-back_2010x2610.png, polka-pocket_2010x1500.png, polka-preview-mockup.png
"""
import sys
from pathlib import Path

from PIL import Image, ImageDraw

from make_circle_pattern import mockup
from make_zellige_design import BLACK, GOLD, GREEN, RED, gild

DPI = 300
SS = 3
STEP = 200      # 2/3" between dots in a row
RADIUS = 52     # dot diameter about 1/3"


def tile(size=2400, colors=(RED, GOLD, GREEN)):
    S = size * SS
    im = Image.new("RGB", (S, S), BLACK)
    d = ImageDraw.Draw(im)
    step, r = STEP * SS, RADIUS * SS
    rows = size // (STEP // 2)          # rows half a step apart
    cols = size // STEP
    for j in range(-1, rows + 1):
        y = j * step / 2
        off = step / 2 if j % 2 else 0
        for i in range(-1, cols + 1):
            x = i * step + off
            c = colors[(i + j) % 3]
            d.ellipse((x - r, y - r, x + r, y + r), fill=c)
    return gild(im, period=S / 3).resize((size, size), Image.LANCZOS)


def sheet(t, w, h):
    s = Image.new("RGB", (w, h))
    for x in range(0, w, t.size[0]):
        for y in range(0, h, t.size[1]):
            s.paste(t, (x, y))
    return s


if __name__ == "__main__":
    out = Path(sys.argv[1])
    t = tile()
    t.save(out / "polka-tile_2400.png", dpi=(DPI, DPI), optimize=True)
    big = sheet(t, 4800, 4800)
    front = big.crop((100, 100, 2110, 2710))
    front.save(out / "polka-front_2010x2610.png", dpi=(DPI, DPI), optimize=True)
    back = sheet(tile(colors=(GREEN, GOLD, RED)), 4800, 4800).crop((100, 100, 2110, 2710))
    back.save(out / "polka-back_2010x2610.png", dpi=(DPI, DPI), optimize=True)
    pocket = front.crop((0, 2610 - 1500, 2010, 2610))
    pocket.save(out / "polka-pocket_2010x1500.png", dpi=(DPI, DPI), optimize=True)
    mockup(front, front=front, pocket_art=pocket).save(out / "polka-preview-mockup.png")
    print("done")
