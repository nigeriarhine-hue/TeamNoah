"""Every print file for the bag in the flowing design, plus an overview sheet.

Usage: python3 make_flow_pieces.py <fonts_dir> <out_dir>
Run make_flow_pattern.py, make_flow_accent.py and make_flow_labels.py first.

Panel sizes are the bag's sizes plus 0.5" bleed on every side, so the art
can be moved to fit Printful's template without showing an edge.
"""
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

from make_circle_pattern import mockup
from make_flow_pattern import DPI, sheet, tile

IN = DPI
PIECES = {
    # name: (width in, height in, x offset in, y offset in) into the pattern sheet
    "front": (6.7, 8.7, 0.6, 0.4),
    "back": (6.7, 8.7, 4.1, 2.3),
    "pocket": (6.7, 5.0, 2.2, 5.6),
}


def crop(sheet_img, w, h, x, y):
    return sheet_img.crop((round(x * IN), round(y * IN), round((x + w) * IN), round((y + h) * IN)))


def overview(files, mock, fonts, title_text="Falasha \u2014 Silk Flow crossbody bag"):
    W, H = 3000, 2200
    im = Image.new("RGB", (W, H), (236, 228, 214))
    d = ImageDraw.Draw(im)
    title = ImageFont.truetype(str(fonts / "Lobster.ttf"), 90)
    lab = ImageFont.truetype(str(fonts / "Lora-SemiBoldItalic.ttf"), 38)
    d.text((80, 50), title_text, font=title, fill=(30, 25, 22))
    m = mock.resize((1050, 1050), Image.LANCZOS)
    im.paste(m, (60, 220))
    d.text((60 + 525, 1290), "Preview", font=lab, fill=(60, 50, 44), anchor="mt")
    slots = [  # (key, caption, x, y, box w, box h)
        ("front", "Front", 1200, 220, 560, 730),
        ("back", "Back", 1820, 220, 560, 730),
        ("pocket", "Front pocket", 2440, 220, 500, 373),
        ("inside_pocket", "Inside pocket", 2440, 660, 500, 373),
        ("details", "Details (straps, sides, trim)", 1200, 1110, 1180, 472),
        ("label_outside", "Outside label", 2440, 1110, 470, 470),
        ("label_inside", "Inside label", 2440, 1650, 470, 470),
    ]
    for key, cap, x, y, bw, bh in slots:
        img = Image.open(files[key])
        img.thumbnail((bw, bh), Image.LANCZOS)
        im.paste(img, (x, y))
        d.rectangle((x - 2, y - 2, x + img.size[0] + 1, y + img.size[1] + 1), outline=(180, 160, 120), width=3)
        d.text((x, y + img.size[1] + 12), cap, font=lab, fill=(60, 50, 44))
    return im


if __name__ == "__main__":
    fonts, out = Path(sys.argv[1]), Path(sys.argv[2])
    t = Image.open(out / "flow-pattern-tile_2400.png").convert("RGB")
    big = sheet(t, 20)
    files = {}
    for name, (w, h, x, y) in PIECES.items():
        p = out / f"flow-{name}_{round(w * IN)}x{round(h * IN)}.png"
        crop(big, w, h, x, y).save(p, dpi=(DPI, DPI), optimize=True)
        files[name] = p
    # inside pocket: calmer version, fine gold lines only
    lines = sheet(tile(style="lines"), 10)
    p = out / f"flow-inside-pocket_{round(6.7 * IN)}x{round(5.0 * IN)}.png"
    crop(lines, 6.7, 5.0, 1.0, 1.0).save(p, dpi=(DPI, DPI), optimize=True)
    files["inside_pocket"] = p
    files["details"] = out / "flow-accent-details_3000x1200.png"
    files["label_outside"] = out / "flow-outside-label_900x900.png"
    files["label_inside"] = out / "flow-inside-label_900x900.png"
    mock = mockup(t, repeat_in=8.0)
    mock.save(out / "flow-preview-mockup.png")
    overview(files, mock, fonts).save(out / "flow-overview.png")
    print("\n".join(str(v) for v in files.values()))
