"""Builds print-ready House of Judah Prayer posters (300 DPI) for Printful.

Usage: python3 make_poster.py <fonts_dir> <out_dir>
Fonts needed in <fonts_dir>: Lobster.ttf, Lora-SemiBoldItalic.ttf
"""
import math
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

DPI = 300
SIZES = {"8x10": (8, 10), "11x14": (11, 14), "16x20": (16, 20)}

# African heritage palette
RED = np.array([178, 24, 30]) / 255
RED_DARK = np.array([92, 8, 12]) / 255
GREEN = np.array([0, 122, 61]) / 255
GREEN_DARK = np.array([0, 58, 30]) / 255
BLACK = np.array([10, 9, 8]) / 255
GOLD_DARK = np.array([150, 96, 18]) / 255
GOLD_LIGHT = np.array([255, 214, 110]) / 255
CREAM = np.array([246, 226, 180]) / 255

TITLE = ["The House of Judah", "Prayer"]
SUBTITLE = "“Here O’ Israel”"
PARAGRAPHS = [
    "Lord our God as one. God of Abraham, God of Isaac, God of Jacob. "
    "God of the living but not the dead.",
    "Have mercy on me for I don’t know. I’ve been on the wrong side. "
    "Watch over me for I am your sheep and I hear your voice. Give me knowledge, "
    "wisdom, and understanding that I may walk in Jerusalem just like John.",
    "I love my flag “The Rainbow”. Blessed be the name of my God, God of Jacob. "
    "God of the living but not the dead. Shiloh, War Lord God Almighty, "
    "Ambassador Johnnie M. Smith. Ambassador of the House of Judah. On his white horse. "
    "Pawned in the valley of the Armageddon war. Disturbing the seven seas.",
    "Blessed be the name of my God forever and ever amen. Thank you Shiloh. "
    "Thank you for blessing me. Thank you for blessing me to be in the land of the living. "
    "Please have mercy on me. Give me strength. Give me courage. Give me guidance. "
    "Give me the Will to be strong and protect me from the evil spirit.",
    "Thank you for protecting my soul. Thank you. Thank you. Thank you.",
    "And Thank you Elohim for my health and strength.",
]
CLOSING = "Amen."
SIGNATURE = "Falasha Projects"


def smooth(edge0, edge1, x):
    t = np.clip((x - edge0) / (edge1 - edge0), 0, 1)
    return t * t * (3 - 2 * t)


def value_noise(h, w, cells, rng):
    """Soft cloudy noise in [0,1] made from upscaled random grids."""
    out = np.zeros((h, w), np.float32)
    amp, total = 1.0, 0.0
    for c in cells:
        g = rng.random((c, int(c * w / h) + 1)).astype(np.float32)
        img = Image.fromarray((g * 255).astype(np.uint8)).resize((w, h), Image.BICUBIC)
        out += amp * np.asarray(img, np.float32) / 255
        total += amp
        amp *= 0.55
    return out / total


def gold(t, shimmer):
    """Metallic gold: t in [0,1] across the ribbon, shimmer adds sheen along it."""
    hl = np.clip(1 - np.abs(t - 0.4) * 2.2, 0, 1) ** 1.5
    k = np.clip(0.35 + 0.65 * hl * (0.6 + 0.4 * shimmer), 0, 1)[..., None]
    return GOLD_DARK * (1 - k) + GOLD_LIGHT * k


def background(w, h, seed=7):
    rng = np.random.default_rng(seed)
    v, u = np.mgrid[0:h, 0:w].astype(np.float32)
    u /= w
    v /= h
    aa = 1.5 / w  # anti-alias width

    tex = value_noise(h, w, [6, 14, 40, 110], rng)
    shimmer = 0.5 + 0.5 * np.sin(u * 9 + v * 5 + tex * 4)

    img = BLACK + (tex[..., None] - 0.5) * 0.06  # textured black base

    def paint(color, mask):
        nonlocal img
        img = img * (1 - mask[..., None]) + color * mask[..., None]

    def shadow(mask, strength=0.55):
        nonlocal img
        img = img * (1 - strength * mask[..., None])

    # ---- top-right sweep: distance above a flowing curve ----
    curve = 0.55 * u - 0.02 + 0.06 * np.sin(u * 5.0 + 0.6)
    d = (curve - v) * (0.9 + 0.5 * u)  # >0 above the curve
    widen = 1 + 0.6 * u
    bands_top = [  # (start, end, kind)
        (0.000, 0.010, "gold"),
        (0.010, 0.075, "green"),
        (0.075, 0.105, "gold"),
        (0.105, 9.000, "red"),
    ]
    shadow(smooth(-0.05, 0.0, d) * (1 - smooth(0.0, 0.004, d)))
    for a, b, kind in bands_top:
        a, b = a * widen, b * widen
        m = smooth(a - aa, a + aa, d) * (1 - smooth(b - aa, b + aa, d))
        t = np.clip((d - a) / np.maximum(b - a, 1e-4), 0, 1)
        if kind == "gold":
            paint(gold(t, shimmer), m)
        elif kind == "green":
            c = GREEN_DARK + (GREEN - GREEN_DARK) * (0.4 + 0.6 * tex[..., None]) * (0.7 + 0.3 * np.sin(t * math.pi)[..., None])
            paint(c, m)
        else:
            c = RED_DARK + (RED - RED_DARK) * np.clip(0.3 + 0.9 * tex[..., None], 0, 1.2)
            paint(c, m)

    # ---- bottom-left sweep: distance below a flowing curve ----
    curve2 = 0.42 + 0.50 * u + 0.05 * np.sin(u * 4.2 + 1.3)
    d2 = (v - curve2) * (1.3 - 0.4 * u)  # >0 below the curve
    widen2 = 1.4 - 0.5 * u
    bands_bot = [
        (0.000, 0.008, "gold"),
        (0.008, 0.050, "red"),
        (0.050, 0.075, "gold"),
        (0.075, 0.115, "green"),
        (0.115, 0.140, "gold"),
        (0.140, 9.000, "cream"),
    ]
    shadow(smooth(-0.05, 0.0, d2) * (1 - smooth(0.0, 0.004, d2)))
    for a, b, kind in bands_bot:
        a, b = a * widen2, b * widen2
        m = smooth(a - aa, a + aa, d2) * (1 - smooth(b - aa, b + aa, d2))
        t = np.clip((d2 - a) / np.maximum(b - a, 1e-4), 0, 1)
        if kind == "gold":
            paint(gold(t, shimmer), m)
        elif kind == "green":
            c = GREEN_DARK + (GREEN - GREEN_DARK) * (0.4 + 0.6 * tex[..., None])
            paint(c, m)
        elif kind == "red":
            c = RED_DARK + (RED - RED_DARK) * np.clip(0.3 + 0.9 * tex[..., None], 0, 1.2)
            paint(c, m)
        else:
            c = GOLD_DARK * 0.5 + CREAM * 0.5 + (CREAM - GOLD_DARK) * 0.5 * (tex[..., None] - 0.3)
            paint(c, m)

    # thin accent gold lines floating in the black field
    for off, amp, ph, wdt in [(0.10, 0.06, 0.0, 0.0018), (0.80, 0.05, 2.0, 0.0015)]:
        line = off + 0.25 * u + amp * np.sin(u * 3.5 + ph) if off < 0.5 else off - 0.15 * u + amp * np.sin(u * 3 + ph)
        dist = np.abs(v - line)
        paint(gold(np.full_like(u, 0.4), shimmer), (1 - smooth(wdt * 0.5, wdt, dist)) * 0.8)

    # vignette
    r = np.sqrt((u - 0.5) ** 2 + (v - 0.5) ** 2)
    img *= (1 - 0.25 * smooth(0.45, 0.8, r))[..., None]

    return Image.fromarray((np.clip(img, 0, 1) * 255).astype(np.uint8))


def rounded_panel(size, box, radius, fill):
    layer = Image.new("RGBA", size, (0, 0, 0, 0))
    ImageDraw.Draw(layer).rounded_rectangle(box, radius, fill=fill)
    return layer


def gold_text_layer(size, draw_fn):
    """Draws text as a mask, then fills it with a vertical metallic gold gradient."""
    mask = Image.new("L", size, 0)
    draw_fn(ImageDraw.Draw(mask))
    h = size[1]
    ramp = np.linspace(0, 1, h, dtype=np.float32)[:, None]
    bbox = mask.getbbox() or (0, 0, size[0], h)
    y0, y1 = bbox[1], bbox[3]
    t = np.clip((ramp * h - y0) / max(y1 - y0, 1), 0, 1)
    k = 0.5 + 0.5 * np.cos((t - 0.35) * math.pi * 1.6)
    col = np.array([214, 160, 52]) / 255 * (1 - k)[..., None] + np.array([255, 236, 170]) / 255 * k[..., None]
    col = np.broadcast_to(col, (h, size[0], 3))
    rgb = Image.fromarray((col * 255).astype(np.uint8))
    layer = Image.new("RGBA", size, (0, 0, 0, 0))
    layer.paste(rgb, (0, 0), mask)
    return layer, mask


def wrap(text, font, max_w, draw):
    words, lines, cur = text.split(), [], ""
    for wd in words:
        trial = f"{cur} {wd}".strip()
        if draw.textlength(trial, font=font) <= max_w:
            cur = trial
        else:
            lines.append(cur)
            cur = wd
    lines.append(cur)
    return lines


def build(name, w_in, h_in, fonts_dir, out_dir):
    W, H = w_in * DPI, h_in * DPI
    lobster = str(fonts_dir / "Lobster.ttf")
    lora = str(fonts_dir / "Lora-SemiBoldItalic.ttf")

    # background drawn at half size (it is soft), then grain at full size
    bg = background(W // 2, H // 2).resize((W, H), Image.LANCZOS)
    grain = np.random.default_rng(1).normal(0, 4, (H, W, 1)).astype(np.float32)
    canvas = Image.fromarray(np.clip(np.asarray(bg, np.float32) + grain, 0, 255).astype(np.uint8)).convert("RGBA")

    # framed reading panel
    mx = round(W * 0.095)
    my = round(H * 0.06)
    box = (mx, my, W - mx, H - my)
    rad = round(W * 0.03)
    shadow = rounded_panel((W, H), (box[0] + W * 0.006, box[1] + W * 0.01, box[2] + W * 0.006, box[3] + W * 0.01), rad, (0, 0, 0, 170))
    canvas.alpha_composite(shadow.filter(ImageFilter.GaussianBlur(W * 0.012)))
    canvas.alpha_composite(rounded_panel((W, H), box, rad, (8, 7, 6, 200)))

    d = ImageDraw.Draw(canvas)
    lw = max(2, round(W * 0.0022))
    d.rounded_rectangle(box, rad, outline=(212, 160, 55, 255), width=lw * 2)
    ins = round(W * 0.012)
    d.rounded_rectangle((box[0] + ins, box[1] + ins, box[2] - ins, box[3] - ins), max(rad - ins, 4), outline=(212, 160, 55, 200), width=lw)
    # corner diamonds
    for cx, cy in [(box[0] + ins, box[1] + ins), (box[2] - ins, box[1] + ins), (box[0] + ins, box[3] - ins), (box[2] - ins, box[3] - ins)]:
        s = round(W * 0.008)
        d.polygon([(cx, cy - s), (cx + s, cy), (cx, cy + s), (cx - s, cy)], fill=(240, 196, 90, 255))

    inner_l = box[0] + round(W * 0.065)
    inner_r = box[2] - round(W * 0.065)
    text_w = inner_r - inner_l
    cx = W // 2

    # ---- title ----
    y = box[1] + round(H * 0.035)
    tsize = round(W * 0.095)
    tfont = ImageFont.truetype(lobster, tsize)
    while max(d.textlength(t, font=tfont) for t in TITLE) > text_w and tsize > 20:
        tsize -= 4
        tfont = ImageFont.truetype(lobster, tsize)
    t_lh = round(tsize * 1.12)
    title_y = y

    def draw_title(dr, offset=(0, 0)):
        for i, t in enumerate(TITLE):
            dr.text((cx + offset[0], title_y + i * t_lh + offset[1]), t, font=tfont, anchor="mt", fill=255)

    shadow_mask = Image.new("L", (W, H), 0)
    draw_title(ImageDraw.Draw(shadow_mask), (round(W * 0.002), round(W * 0.003)))
    sh = Image.new("RGBA", (W, H), (0, 0, 0, 255))
    sh.putalpha(shadow_mask.filter(ImageFilter.GaussianBlur(W * 0.003)))
    canvas.alpha_composite(sh)
    title_layer, _ = gold_text_layer((W, H), draw_title)
    canvas.alpha_composite(title_layer)
    y = title_y + len(TITLE) * t_lh + round(H * 0.012)

    # ---- divider ----
    d = ImageDraw.Draw(canvas)
    dw = round(text_w * 0.36)
    s = round(W * 0.014)
    gold_c = (222, 172, 64, 255)
    d.line((cx - dw, y, cx - s * 1.8, y), fill=gold_c, width=lw)
    d.line((cx + s * 1.8, y, cx + dw, y), fill=gold_c, width=lw)
    d.polygon([(cx, y - s * 1.4), (cx + s * 0.35, y - s * 0.35), (cx + s * 1.4, y), (cx + s * 0.35, y + s * 0.35),
               (cx, y + s * 1.4), (cx - s * 0.35, y + s * 0.35), (cx - s * 1.4, y), (cx - s * 0.35, y - s * 0.35)], fill=(245, 205, 105, 255))
    for sx in (cx - dw, cx + dw):
        r = round(s * 0.35)
        d.polygon([(sx, y - r), (sx + r, y), (sx, y + r), (sx - r, y)], fill=gold_c)
    y += round(H * 0.018)

    # ---- subtitle ----
    ssize = round(W * 0.052)
    sfont = ImageFont.truetype(lobster, ssize)
    d.text((cx, y), SUBTITLE, font=sfont, anchor="mt", fill=(244, 200, 96, 255))
    y += round(ssize * 1.35)

    # ---- body: largest size that fits ----
    sig_size = round(W * 0.03)
    bottom = box[3] - round(H * 0.03) - round(sig_size * 1.6)
    avail = bottom - y

    def layout(size):
        f = ImageFont.truetype(lora, size)
        lh = round(size * 1.42)
        gap = round(size * 0.85)
        blocks = [wrap(p, f, text_w, d) for p in PARAGRAPHS]
        total = sum(len(b) * lh for b in blocks) + gap * len(blocks) + lh
        return f, lh, gap, blocks, total

    lo, hi = 10, round(W * 0.05)
    while lo < hi:
        mid = (lo + hi + 1) // 2
        if layout(mid)[4] <= avail:
            lo = mid
        else:
            hi = mid - 1
    bfont, lh, gap, blocks, total = layout(lo)
    y += max(0, (avail - total) // 2)
    body_fill = (244, 200, 96, 255)
    for b in blocks:
        for line in b:
            d.text((cx, y), line, font=bfont, anchor="mt", fill=body_fill)
            y += lh
        y += gap
    afont = ImageFont.truetype(lobster, round(lo * 1.25))
    d.text((cx, y - round(lh * 0.2)), CLOSING, font=afont, anchor="mt", fill=(255, 226, 140, 255))

    # ---- signature ----
    gfont = ImageFont.truetype(lobster, sig_size)
    d.text((inner_r, box[3] - round(H * 0.025)), SIGNATURE, font=gfont, anchor="rb", fill=(230, 185, 85, 255))

    out = canvas.convert("RGB")
    path = out_dir / f"house-of-judah-prayer_{name}_{W}x{H}.png"
    out.save(path, dpi=(DPI, DPI), optimize=True)
    print(path, "body font px:", lo)
    return path


if __name__ == "__main__":
    fonts_dir, out_dir = Path(sys.argv[1]), Path(sys.argv[2])
    out_dir.mkdir(parents=True, exist_ok=True)
    only = sys.argv[3:] or list(SIZES)
    for n in only:
        build(n, *SIZES[n], fonts_dir, out_dir)
