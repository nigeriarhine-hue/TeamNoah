"""Inside and outside labels (3"x3" at 300 DPI) to match the flowing abstract design.

Usage: python3 make_flow_labels.py <fonts_dir> <out_dir>
Needs flow-pattern-tile_2400.png in <out_dir> (run make_flow_pattern.py first).
"""
import math
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

PX = 900
SS = 3
BLACK = (18, 15, 14)
GOLD = (214, 163, 66)
RED = (168, 26, 36)
GREEN = (12, 120, 74)
CREAM = (246, 236, 212)


def gold_fill(mask):
    """Fill a mask with a shaded metallic gold, light from the upper left."""
    w, h = mask.size
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    t = np.clip(1.15 - (xx / w * 0.45 + yy / h * 0.8) + 0.12 * np.sin(xx / w * math.pi * 3), 0, 1)[..., None]
    deep, mid, hi = np.array([150, 102, 30]), np.array([214, 163, 66]), np.array([255, 230, 156])
    col = np.where(t < 0.5, deep + (mid - deep) * (t / 0.5), mid + (hi - mid) * ((t - 0.5) / 0.5))
    layer = Image.fromarray(col.astype(np.uint8)).convert("RGBA")
    layer.putalpha(mask)
    return layer


def diamond(d, cx, cy, h, fill, ratio=0.72):
    d.polygon([(cx, cy - h), (cx + h * ratio, cy), (cx, cy + h), (cx - h * ratio, cy)], fill=fill)


def outside(tile, fonts):
    S = PX * SS
    # 3" of the pattern at true print scale
    bg = tile.crop((300, 700, 300 + PX, 700 + PX)).resize((S, S), Image.LANCZOS).convert("RGBA")

    # dark plate with soft shadow
    plate = (S * 0.09, S * 0.27, S * 0.91, S * 0.73)
    sh = Image.new("L", (S, S), 0)
    ImageDraw.Draw(sh).rounded_rectangle((plate[0], plate[1] + S * 0.02, plate[2], plate[3] + S * 0.02), S * 0.05, fill=170)
    bg.alpha_composite(Image.merge("RGBA", (*[Image.new("L", (S, S), 0)] * 3, sh.filter(ImageFilter.GaussianBlur(S * 0.02)))))
    d = ImageDraw.Draw(bg)
    d.rounded_rectangle(plate, S * 0.05, fill=BLACK + (240,))
    pm = Image.new("L", (S, S), 0)
    pd = ImageDraw.Draw(pm)
    pd.rounded_rectangle(plate, S * 0.05, outline=255, width=SS * 7)
    i = S * 0.022
    pd.rounded_rectangle((plate[0] + i, plate[1] + i, plate[2] - i, plate[3] - i), S * 0.035, outline=255, width=SS * 3)

    # name + small diamond above
    f = ImageFont.truetype(str(fonts / "Lobster.ttf"), round(S * 0.19))
    pd.text((S / 2, S * 0.525), "Falasha", font=f, anchor="mm", fill=255)
    bg.alpha_composite(gold_fill(pm))
    d = ImageDraw.Draw(bg)
    diamond(d, S / 2, S * 0.335, S * 0.028, GOLD)
    diamond(d, S / 2, S * 0.335, S * 0.013, GREEN)
    # thin red/green accents under the name
    y = S * 0.645
    d.line((S * 0.32, y, S * 0.47, y), fill=RED, width=SS * 4)
    d.line((S * 0.53, y, S * 0.68, y), fill=GREEN, width=SS * 4)
    diamond(d, S / 2, y, S * 0.012, GOLD)
    return bg.convert("RGB").resize((PX, PX), Image.LANCZOS)


def inside(tile, fonts):
    S = PX * SS
    im = Image.new("RGBA", (S, S), CREAM + (255,))
    # ribbon band across the top, cut from the pattern
    band_h = round(S * 0.17)
    band = tile.crop((900, 400, 900 + PX, 400 + round(PX * 0.17))).resize((S, band_h), Image.LANCZOS)
    im.paste(band, (0, 0))
    d = ImageDraw.Draw(im)
    gm = Image.new("L", (S, S), 0)
    gd = ImageDraw.Draw(gm)
    gd.rectangle((0, band_h, S, band_h + S * 0.012), fill=255)
    # gold frame
    m = S * 0.04
    gd.rectangle((m, band_h + m * 0.8, S - m, S - m), outline=255, width=SS * 4)
    m2 = m + S * 0.018
    gd.rectangle((m2, band_h + m * 0.8 + S * 0.018, S - m2, S - m2), outline=255, width=SS * 2)
    im.alpha_composite(gold_fill(gm))
    d = ImageDraw.Draw(im)

    # logo row in the top area (Printful's logo zone is about 3" x 1.13")
    f = ImageFont.truetype(str(fonts / "Lobster.ttf"), round(S * 0.16))
    cy = S * 0.335
    tw = d.textlength("Falasha", font=f)
    hh, gap = S * 0.055, S * 0.04
    dx = S / 2 - (tw + hh * 1.5 + gap) / 2 + hh * 0.75
    for sc, col in ((1.0, BLACK), (0.68, GOLD), (0.42, GREEN), (0.16, CREAM)):
        diamond(d, dx, cy, hh * sc, col)
    d.text((dx + hh * 0.75 + gap, cy), "Falasha", font=f, anchor="lm", fill=BLACK)
    y = S * 0.47
    d.line((S * 0.29, y, S * 0.475, y), fill=RED, width=SS * 3)
    d.line((S * 0.525, y, S * 0.71, y), fill=GREEN, width=SS * 3)
    diamond(d, S / 2, y, S * 0.012, GOLD)
    # lower area left plain: Printful adds size, material and origin
    return im.convert("RGB").resize((PX, PX), Image.LANCZOS)


if __name__ == "__main__":
    fonts, out = Path(sys.argv[1]), Path(sys.argv[2])
    tile = Image.open(out / "flow-pattern-tile_2400.png").convert("RGB")
    outside(tile, fonts).save(out / "flow-outside-label_900x900.png", dpi=(300, 300), optimize=True)
    inside(tile, fonts).save(out / "flow-inside-label_900x900.png", dpi=(300, 300), optimize=True)
    print("done")
