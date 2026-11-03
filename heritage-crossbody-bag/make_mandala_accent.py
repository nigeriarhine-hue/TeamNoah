"""Details/trim strip (straps, sides, zipper edges) for the dot mandala design.

Usage: python3 make_mandala_accent.py <out_dir>
Output: mandala-accent-details_3000x1200.png (10" x 4" at 300 DPI).
Exactly black, gold, green and red. Every dot row's count divides the width
evenly and is a multiple of its color cycle, so the strip repeats seamlessly end to end.
"""
import sys
from pathlib import Path

from PIL import Image, ImageDraw

from make_mandala_design import BLACK, GOLD, GREEN, RED, dot

W, H, SS = 3000, 1200, 3


def row(d, y, count, r, kinds, offset=0.0):
    step = W * SS / count
    for i in range(-1, count + 1):
        dot(d, (i + 0.5 + offset) * step, y, r, kinds[i % len(kinds)])


def strip():
    S = SS
    im = Image.new("RGB", (W * S, H * S), BLACK)
    d = ImageDraw.Draw(im)
    h = H * S
    # thin edge stripes: gold, red | green, gold
    for y0, y1, c in ((0.06, 0.08, GOLD), (0.10, 0.12, RED), (0.88, 0.90, GREEN), (0.92, 0.94, GOLD)):
        d.rectangle((0, y0 * h, W * S, y1 * h), fill=c)
    # small dot rows near the edges
    row(d, 0.20 * h, 48, 0.022 * h, ["gold", "red", "gold", "green"])
    row(d, 0.80 * h, 48, 0.022 * h, ["gold", "green", "gold", "red"])
    # medium dots between
    row(d, 0.33 * h, 24, 0.04 * h, ["green", "red"], 0.5)
    row(d, 0.67 * h, 24, 0.04 * h, ["red", "green"], 0.5)
    # big dot-in-dot row in the middle
    row(d, 0.50 * h, 12, 0.085 * h, ["redgold", "greengold", "goldred", "goldgreen"])
    return im.resize((W, H), Image.LANCZOS)


if __name__ == "__main__":
    out = Path(sys.argv[1])
    strip().save(out / "mandala-accent-details_3000x1200.png", dpi=(300, 300), optimize=True)
    print("done")
