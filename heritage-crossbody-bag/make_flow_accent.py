"""Details/trim file (straps, sides, zipper edges) to match the flowing design.

Usage: python3 make_flow_accent.py <out_dir>
Output: flow-accent-details_3000x1200.png (10" x 4" at 300 DPI). Ribbons run
lengthwise and the file repeats seamlessly left to right, so it can be tiled
along a long strap.
"""
import math
import sys
from pathlib import Path

import numpy as np

from make_flow_pattern import render

TAU = 2 * math.pi
W, H, PAD = 3000, 1200, 4


def accent_field():
    v, x = np.mgrid[-PAD:H + PAD, 0:W].astype(np.float32)
    u = x / W            # whole-number frequencies in u keep left/right seamless
    v = v / H
    wv = v + 0.07 * np.sin(TAU * 3 * u) + 0.035 * np.sin(TAU * 7 * u + 1.1)
    f = 0.85 * np.sin(TAU * (1.5 * wv) + 0.3) + 0.15 * np.sin(TAU * (5 * u + wv) + 1.3)
    return u, v, f


if __name__ == "__main__":
    out = Path(sys.argv[1])
    img = render(*accent_field())
    img = img.crop((0, PAD, W, PAD + H))  # trim the rows used for edge smoothing
    img.save(out / "flow-accent-details_3000x1200.png", dpi=(300, 300), optimize=True)
    print("done")
