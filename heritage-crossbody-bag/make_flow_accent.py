"""Details/trim file (straps, sides, zipper edges) to match the flowing design.

Usage: python3 make_flow_accent.py <out_dir>
Output: flow-accent-details_3000x1200.png (10" x 4" at 300 DPI). Ribbons run
lengthwise and the file repeats seamlessly left to right along a long strap.
"""
import math
import sys
from pathlib import Path

import numpy as np

from make_flow_pattern import TAU, render

W, H = 3000, 1200


def accent_field():
    v, x = np.mgrid[0:H, 0:W].astype(np.float32)
    u, v = x / W, v / H          # whole-number frequencies in u keep left/right seamless
    wv = v + 0.05 * np.sin(TAU * 3 * u) + 0.02 * np.sin(TAU * 7 * u + 1.1)
    phi = 1.2 * wv + 0.1
    swell = 1 + 0.3 * np.sin(TAU * 2 * u + 0.7)
    return u, v, phi, swell


if __name__ == "__main__":
    out = Path(sys.argv[1])
    render(*accent_field()).save(out / "flow-accent-details_3000x1200.png", dpi=(300, 300), optimize=True)
    print("done")
