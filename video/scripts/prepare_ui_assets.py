"""Crop the genuine Noah desktop screenshots into the panels the Remotion
compositions use. Nothing here invents UI: every output is a crop of a real
screen capture in the repo root, upscaled 2x with Lanczos for 1080p legibility.

The one touch-up: IMG_0593 (the approval modal) was captured with the text
I-beam cursor sitting on top of "your". We paint the modal background over that
single line and re-set the identical string in a matching UI typeface
(Windows renders it in a Segoe-style sans; Inter is the closest open match)
at the same position, so the animated cursor added in
Remotion is the only pointer on screen.

Usage: python3 scripts/prepare_ui_assets.py <repo-root> [font-path]
(font defaults to the system Inter Regular)
"""

import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

SCALE = 2

# (source file, crop box in source pixels, output name)
CROPS = [
    # Idle composer row ("What's broken? Tell Noah and hit go." + send arrow)
    ("IMG_0595.jpeg", (362, 892, 1135, 975), "composer.png"),
    # "Looking into it…" card that appears right after sending
    ("IMG_0583.jpeg", (362, 152, 1142, 240), "looking.png"),
    # Live diagnostic checklist, four successive captures
    ("IMG_0584.jpeg", (362, 150, 1142, 420), "check-1.png"),
    ("IMG_0585.jpeg", (362, 150, 1142, 420), "check-2.png"),
    ("IMG_0586.jpeg", (362, 150, 1142, 420), "check-3.png"),
    ("IMG_0587.jpeg", (362, 150, 1142, 420), "check-4.png"),
    # Diagnosis: Situation / What Noah checked / What Noah would do
    ("IMG_0588.jpeg", (362, 28, 1135, 830), "diagnosis.png"),
    # Result card after approval (stops above the stat row / tooltip)
    ("IMG_0595.jpeg", (362, 180, 1135, 495), "done.png"),
    # Approval modal over the blurred plan (full window, minus title bar)
    ("IMG_0593.jpeg", (0, 30, 1170, 985), "approval.png"),
]

# The approval modal's body line, in IMG_0593 source pixels.
MODAL_LINE_BOX = (366, 494, 642, 523)
MODAL_LINE_TEXT = "Noah needs your OK to continue."
MODAL_LINE_ORIGIN = (370, 500)  # top-left of the ink in the original capture
MODAL_LINE_WIDTH = 263  # ink width in the original capture
MODAL_BG = (32, 37, 41)
MODAL_TEXT = (229, 234, 238)


def fix_modal_line(img: Image.Image, font_path: str) -> Image.Image:
    """Replace the cursor-obscured body line with the same string, same font."""
    img = img.copy()
    draw = ImageDraw.Draw(img)
    draw.rectangle(MODAL_LINE_BOX, fill=MODAL_BG)
    # Find the font size whose ink width matches the capture.
    size = 10
    for candidate in range(10, 40):
        f = ImageFont.truetype(font_path, candidate)
        l, t, r, b = draw.textbbox((0, 0), MODAL_LINE_TEXT, font=f)
        if r - l > MODAL_LINE_WIDTH:
            break
        size = candidate
    # Work at 4x so the anti-aliasing matches a native render, then downsample.
    up = 4
    big = img.resize((img.width * up, img.height * up), Image.LANCZOS)
    bdraw = ImageDraw.Draw(big)
    bfont = ImageFont.truetype(font_path, size * up)
    l, t, _, _ = bdraw.textbbox((0, 0), MODAL_LINE_TEXT, font=bfont)
    x = MODAL_LINE_ORIGIN[0] * up - l
    y = MODAL_LINE_ORIGIN[1] * up - t
    bdraw.text((x, y), MODAL_LINE_TEXT, font=bfont, fill=MODAL_TEXT)
    out = big.resize(img.size, Image.LANCZOS)
    # The capture is a slightly soft screen recording; match its softness.
    soft = out.crop(MODAL_LINE_BOX).filter(ImageFilter.GaussianBlur(0.45))
    out.paste(soft, MODAL_LINE_BOX[:2])
    return out


def main() -> None:
    root = Path(sys.argv[1])
    font_path = sys.argv[2] if len(sys.argv) > 2 else "/usr/share/fonts/opentype/inter/Inter-Regular.otf"
    out_dir = Path(__file__).resolve().parent.parent / "public" / "ui"
    out_dir.mkdir(parents=True, exist_ok=True)

    for src, box, name in CROPS:
        img = Image.open(root / src).convert("RGB")
        if src == "IMG_0593.jpeg":
            img = fix_modal_line(img, font_path)
        crop = img.crop(box)
        crop = crop.resize((crop.width * SCALE, crop.height * SCALE), Image.LANCZOS)
        crop = crop.filter(ImageFilter.UnsharpMask(radius=1.2, percent=60, threshold=2))
        crop.save(out_dir / name)
        print(f"{name}: {crop.width}x{crop.height}")


if __name__ == "__main__":
    main()
