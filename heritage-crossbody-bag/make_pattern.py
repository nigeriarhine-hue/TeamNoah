"""Seamless African heritage pattern for the Printful All-Over Print Utility Crossbody Bag.

Usage: python3 make_pattern.py <out_dir>
Outputs (300 DPI):
  pattern-tile_2400.png        8"x8" seamless tile (use with Printful's Pattern fill)
  pattern-sheet_6000.png       20"x20" sheet of the tile, for placing panels by hand
  accent-details_3000x1200.png black/gold/red/green stripe for straps, sides and trim
  preview-mockup.png           rough look of the bag (not a print file)
"""
import sys
from pathlib import Path

from PIL import Image, ImageDraw

DPI = 300
SS = 3  # supersample for smooth edges

BLACK = (14, 13, 12)
RED = (190, 30, 36)
GREEN = (0, 128, 64)
GOLD = (232, 178, 58)
CREAM = (246, 230, 190)


def tile(size=2400):
    S = size * SS
    im = Image.new("RGB", (S, S), BLACK)
    d = ImageDraw.Draw(im)

    def band(y0, y1, color):
        d.rectangle((0, round(y0 * S), S, round(y1 * S)), fill=color)

    # Each motif repeats a whole number of times across, so the tile joins seamlessly.
    # --- top gold edge + chevrons ---
    band(0.00, 0.025, GOLD)
    y0, y1 = 0.05, 0.19
    n = 8
    w = S / n
    for i in range(n):
        x = i * w
        for k, col in enumerate((GREEN, BLACK, GREEN)):
            off = k * 0.035 * S
            top, h = y0 * S + off, (y1 - y0) * S * 0.45
            d.polygon([(x, top), (x + w / 2, top + h), (x + w, top), (x + w, top + 0.03 * S),
                       (x + w / 2, top + h + 0.03 * S), (x, top + 0.03 * S)], fill=col)
    band(0.205, 0.22, GOLD)

    # --- red band with stacked diamonds ---
    y0, y1 = 0.22, 0.42
    band(y0, y1, RED)
    n = 6
    w = S / n
    cy = (y0 + y1) / 2 * S
    hh = (y1 - y0) / 2 * S * 0.82
    for i in range(n + 1):
        cx = i * w
        for scale, col in ((1.0, BLACK), (0.68, GOLD), (0.38, GREEN), (0.14, CREAM)):
            hw, hv = w * 0.42 * scale, hh * scale
            d.polygon([(cx, cy - hv), (cx + hw, cy), (cx, cy + hv), (cx - hw, cy)], fill=col)
    # half-step small diamonds between
    for i in range(n):
        cx = i * w + w / 2
        hw, hv = w * 0.08, hh * 0.25
        d.polygon([(cx, cy - hv), (cx + hw, cy), (cx, cy + hv), (cx - hw, cy)], fill=GOLD)
    band(0.42, 0.435, GOLD)

    # --- sawtooth row ---
    y0, y1 = 0.445, 0.50
    n = 24
    w = S / n
    for i in range(n):
        x = i * w
        d.polygon([(x, y1 * S), (x + w / 2, y0 * S), (x + w, y1 * S)], fill=GOLD)
    band(0.50, 0.51, GOLD)

    # --- mudcloth-style field: dots and crosses ---
    y0, y1 = 0.51, 0.69
    n = 12
    w = S / n
    rows = 2
    rh = (y1 - y0) * S / rows
    for r in range(rows):
        cy = y0 * S + rh * (r + 0.5)
        for i in range(n):
            cx = i * w + (w / 2 if r % 2 else 0) + w / 4
            if (i + r) % 2 == 0:
                rr = w * 0.12
                d.ellipse((cx - rr, cy - rr, cx + rr, cy + rr), fill=GOLD)
                rr2 = w * 0.05
                d.ellipse((cx - rr2, cy - rr2, cx + rr2, cy + rr2), fill=BLACK)
            else:
                a, t = w * 0.16, w * 0.05
                d.rectangle((cx - a, cy - t, cx + a, cy + t), fill=GREEN)
                d.rectangle((cx - t, cy - a, cx + t, cy + a), fill=GREEN)
    band(0.69, 0.705, RED)

    # --- green band with alternating triangles ---
    y0, y1 = 0.705, 0.85
    band(y0, y1, GREEN)
    n = 10
    w = S / n
    for i in range(n):
        x = i * w
        d.polygon([(x, y1 * S), (x + w / 2, y0 * S + 0.02 * S), (x + w, y1 * S)], fill=BLACK)
        d.polygon([(x + w * 0.3, y1 * S), (x + w / 2, y0 * S + 0.07 * S), (x + w * 0.7, y1 * S)], fill=GOLD)
    band(0.85, 0.865, GOLD)

    # --- bottom: red and gold pinstripes on black ---
    for k, col in enumerate((RED, GOLD, RED, GREEN, RED)):
        y = 0.885 + k * 0.022
        band(y, y + 0.011, col)
    band(0.985, 1.0, GOLD)

    # every motif sits on a whole-number period, so the tile joins seamlessly
    return im.resize((size, size), Image.LANCZOS)


def accent(w=3000, h=1200):
    S = SS
    im = Image.new("RGB", (w * S, h * S), BLACK)
    d = ImageDraw.Draw(im)
    H = h * S
    stripes = [(0.10, 0.16, GOLD), (0.22, 0.34, RED), (0.40, 0.60, GREEN), (0.66, 0.78, RED), (0.84, 0.90, GOLD)]
    for a, b, c in stripes:
        d.rectangle((0, a * H, w * S, b * H), fill=c)
    return im.resize((w, h), Image.LANCZOS)


def mockup(t, size=1400):
    """Rough flat preview of the bag front with a pocket and strap."""
    bg = Image.new("RGB", (size, size), (236, 232, 224))
    # bag is 5.7" wide = 740 px here, so a 4" repeat is about 520 px
    rep = 520
    big = Image.new("RGB", (size + rep, size + rep))
    small = t.resize((rep, rep), Image.LANCZOS)
    for x in range(0, size + rep, rep):
        for y in range(0, size + rep, rep):
            big.paste(small, (x, y))
    pat = big.crop((0, 0, size, size))
    d = ImageDraw.Draw(bg)
    # strap
    d.line((420, 330, 200, 0), fill=BLACK, width=60)
    d.line((980, 330, 1200, 0), fill=BLACK, width=60)
    body = (330, 300, 1070, 1260)
    mask = Image.new("L", (size, size), 0)
    ImageDraw.Draw(mask).rounded_rectangle(body, 90, fill=255)
    shadow = Image.new("L", (size, size), 0)
    ImageDraw.Draw(shadow).rounded_rectangle((body[0] + 18, body[1] + 24, body[2] + 18, body[3] + 24), 90, fill=90)
    bg.paste((80, 70, 60), (0, 0), shadow)
    bg.paste(pat, (0, 0), mask)
    d.rounded_rectangle(body, 90, outline=BLACK, width=8)
    # zipper line
    d.line((body[0] + 60, 380, body[2] - 60, 380), fill=(30, 30, 30), width=14)
    d.ellipse((body[2] - 120, 360, body[2] - 80, 400), fill=GOLD)
    # front pocket with its own offset pattern
    pocket = (400, 760, 1000, 1190)
    pm = Image.new("L", (size, size), 0)
    ImageDraw.Draw(pm).rounded_rectangle(pocket, 50, fill=255)
    shifted = big.crop((130, 260, 130 + size, 260 + size))
    bg.paste(shifted, (0, 0), pm)
    d.rounded_rectangle(pocket, 50, outline=BLACK, width=6)
    d.line((pocket[0] + 40, pocket[1] + 40, pocket[2] - 40, pocket[1] + 40), fill=(30, 30, 30), width=10)
    return bg


if __name__ == "__main__":
    out = Path(sys.argv[1])
    out.mkdir(parents=True, exist_ok=True)
    t = tile()
    t.save(out / "pattern-tile_2400.png", dpi=(DPI, DPI), optimize=True)
    sheet = Image.new("RGB", (6000, 6000))
    for x in range(0, 6000, 2400):
        for y in range(0, 6000, 2400):
            sheet.paste(t, (x, y))
    sheet.save(out / "pattern-sheet_6000.png", dpi=(DPI, DPI), optimize=True)
    accent().save(out / "accent-details_3000x1200.png", dpi=(DPI, DPI), optimize=True)
    mockup(t).save(out / "preview-mockup.png")
    print("done")
