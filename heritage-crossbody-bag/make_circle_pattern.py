"""Premium circular medallion pattern (seamless) for the heritage crossbody bag.

Usage: python3 make_circle_pattern.py <out_dir>
Outputs (300 DPI):
  circle-pattern-tile_2400.png   8"x8" seamless tile (use with Printful's Pattern fill)
  circle-pattern-sheet_6000.png  20"x20" sheet of the tile
  circle-preview-mockup.png      product-style preview of the bag (not a print file)

Shapes are drawn as color "slots" first, then each slot is painted with its
finish: metallic gold, rich red/green with soft shading, textured black.
"""
import math
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

DPI = 300
SS = 3

# color slots
BG, GOLD, RED, GREEN, CREAM, LINE = range(6)

# refined palette
WARM_BLACK = np.array([20, 17, 15])
LATTICE = np.array([38, 31, 26])
GOLD_DEEP = np.array([150, 102, 30])
GOLD_MID = np.array([214, 163, 66])
GOLD_HI = np.array([252, 226, 150])
RED_DEEP = np.array([110, 14, 22])
RED_MAIN = np.array([176, 30, 38])
GREEN_DEEP = np.array([4, 66, 42])
GREEN_MAIN = np.array([10, 122, 74])
CREAM_C = np.array([244, 230, 198])


def circle(d, cx, cy, r, fill):
    d.ellipse((cx - r, cy - r, cx + r, cy + r), fill=fill)


def ring(d, cx, cy, r, w, fill):
    d.ellipse((cx - r, cy - r, cx + r, cy + r), outline=fill, width=max(1, round(w)))


def around(cx, cy, radius, count, phase=0.0):
    for i in range(count):
        a = phase + 2 * math.pi * i / count
        yield cx + radius * math.cos(a), cy + radius * math.sin(a), a


def petal(d, cx, cy, a, r0, r1, half_angle, fill, steps=24):
    """Pointed petal from radius r0 out to a tip at r1."""
    left, right = [], []
    for k in range(steps + 1):
        t = k / steps
        r = r0 + (r1 - r0) * t
        w = half_angle * (1 - t) ** 0.65 * (0.75 + 0.25 * math.sin(math.pi * t))
        left.append((cx + r * math.cos(a - w), cy + r * math.sin(a - w)))
        right.append((cx + r * math.cos(a + w), cy + r * math.sin(a + w)))
    d.polygon(left + right[::-1], fill=fill)


def diamond(d, cx, cy, h, fill, ratio=0.72):
    d.polygon([(cx, cy - h), (cx + h * ratio, cy), (cx, cy + h), (cx - h * ratio, cy)], fill=fill)


def star4(d, cx, cy, r, fill):
    k = r * 0.22
    d.polygon([(cx, cy - r), (cx + k, cy - k), (cx + r, cy), (cx + k, cy + k),
               (cx, cy + r), (cx - k, cy + k), (cx - r, cy), (cx - k, cy - k)], fill=fill)


def big_medallion(d, cx, cy, R):
    # dotted halo
    for x, y, _ in around(cx, cy, R * 1.17, 60):
        circle(d, x, y, R * 0.012, GOLD)
    for x, y, _ in around(cx, cy, R * 1.17, 12, math.pi / 12):
        circle(d, x, y, R * 0.026, GOLD)
    # sun petals with dot tips
    for _, _, a in around(cx, cy, 0, 24):
        petal(d, cx, cy, a, R * 0.80, R * 1.05, math.radians(6.2), GOLD)
    for _, _, a in around(cx, cy, 0, 24, math.pi / 24):
        petal(d, cx, cy, a, R * 0.80, R * 0.93, math.radians(3.6), RED)
    circle(d, cx, cy, R * 0.84, BG)
    ring(d, cx, cy, R * 0.83, R * 0.018, GOLD)
    # red band with gold beads
    circle(d, cx, cy, R * 0.79, RED)
    for x, y, _ in around(cx, cy, R * 0.735, 40):
        circle(d, x, y, R * 0.017, GOLD)
    circle(d, cx, cy, R * 0.69, BG)
    ring(d, cx, cy, R * 0.68, R * 0.014, GOLD)
    # green band with slim black rays and gold sparks
    circle(d, cx, cy, R * 0.645, GREEN)
    for _, _, a in around(cx, cy, 0, 32):
        petal(d, cx, cy, a, R * 0.40, R * 0.645, math.radians(3.4), BG)
    for x, y, _ in around(cx, cy, R * 0.60, 32, math.pi / 32):
        circle(d, x, y, R * 0.011, GOLD)
    circle(d, cx, cy, R * 0.43, GOLD)
    circle(d, cx, cy, R * 0.405, BG)
    # inner flower
    for _, _, a in around(cx, cy, 0, 8, math.pi / 8):
        petal(d, cx, cy, a, R * 0.10, R * 0.37, math.radians(17), GOLD)
    for _, _, a in around(cx, cy, 0, 8):
        petal(d, cx, cy, a, R * 0.10, R * 0.28, math.radians(12), GREEN)
    circle(d, cx, cy, R * 0.13, RED)
    ring(d, cx, cy, R * 0.13, R * 0.014, GOLD)
    diamond(d, cx, cy, R * 0.075, GOLD)
    circle(d, cx, cy, R * 0.022, CREAM)


def small_medallion(d, cx, cy, r):
    for _, _, a in around(cx, cy, 0, 12):
        petal(d, cx, cy, a, r * 0.70, r * 1.0, math.radians(11), GOLD)
    circle(d, cx, cy, r * 0.74, BG)
    ring(d, cx, cy, r * 0.72, r * 0.035, GOLD)
    circle(d, cx, cy, r * 0.64, GREEN)
    for x, y, _ in around(cx, cy, r * 0.52, 12):
        circle(d, x, y, r * 0.045, GOLD)
    circle(d, cx, cy, r * 0.40, RED)
    for _, _, a in around(cx, cy, 0, 6):
        petal(d, cx, cy, a, r * 0.05, r * 0.34, math.radians(20), CREAM)
    circle(d, cx, cy, r * 0.09, GOLD)


def slots(S):
    """Index image: which color slot each (supersampled) pixel belongs to."""
    im = Image.new("L", (S, S), BG)
    d = ImageDraw.Draw(im)
    R = S * 0.235
    offsets = [(ox, oy) for ox in (-S, 0, S) for oy in (-S, 0, S)]
    big = [(0, 0), (S / 2, S / 2)]
    small = [(S / 2, 0), (0, S / 2)]
    # faint diamond lattice in the background
    step = S / 8
    for k in range(-8, 17):
        d.line((k * step, 0, k * step + S, S), fill=LINE, width=SS * 2)
        d.line((k * step, 0, k * step - S, S), fill=LINE, width=SS * 2)
    for ox, oy in offsets:
        for cx, cy in big:
            circle(d, cx + ox, cy + oy, R * 1.24, BG)  # clear lattice around medallions
        for cx, cy in small:
            circle(d, cx + ox, cy + oy, S * 0.105, BG)
    for ox, oy in offsets:
        for cx, cy in big:
            big_medallion(d, cx + ox, cy + oy, R)
        for cx, cy in small:
            small_medallion(d, cx + ox, cy + oy, S * 0.085)
        for cx, cy in ((S / 4, S / 4), (3 * S / 4, S / 4), (S / 4, 3 * S / 4), (3 * S / 4, 3 * S / 4)):
            star4(d, cx + ox, cy + oy, S * 0.03, GOLD)
            for x, y, _ in around(cx + ox, cy + oy, S * 0.05, 4, math.pi / 4):
                circle(d, x, y, S * 0.006, GOLD)
    return im


def finish(idx, size, lighting="radial"):
    """Paint each slot with its finish and anti-alias down to final size.

    lighting="radial" shades round motifs around their centers;
    "linear" lights each motif evenly from the upper left (for non-round shapes).
    """
    S = idx.size[0]
    arr = np.asarray(idx)
    yy, xx = np.mgrid[0:size, 0:size].astype(np.float32) / size

    # angle to the nearest big medallion center (they sit on a half-drop grid)
    centers = [(0, 0), (1, 0), (0, 1), (1, 1), (0.5, 0.5)]
    if lighting == "linear":
        centers += [(0.5, 0), (0.5, 1), (0, 0.5), (1, 0.5)]
    best_d = np.full((size, size), 9.0, np.float32)
    ndx = np.zeros((size, size), np.float32)
    ndy = np.zeros((size, size), np.float32)
    for cx, cy in centers:
        dx, dy = xx - cx, yy - cy
        dd = dx * dx + dy * dy
        m = dd < best_d
        best_d = np.where(m, dd, best_d)
        ndx = np.where(m, dx, ndx)
        ndy = np.where(m, dy, ndy)
    rng = np.random.default_rng(3)
    grain = rng.normal(0, 1, (size, size)).astype(np.float32)

    # metallic gold: light from the upper left, plus a soft diagonal sheen
    if lighting == "linear":
        light = np.clip(0.55 - (ndx + ndy) * 2.2, 0, 1)
    else:
        light = 0.5 + 0.5 * np.cos(np.arctan2(ndy, ndx) + 3 * math.pi / 4)
    sheen = 0.5 + 0.5 * np.sin((xx + yy) * math.pi * 6)
    t = np.clip(0.15 + 0.6 * light + 0.25 * sheen + grain * 0.02, 0, 1)[..., None]
    gold = np.where(t < 0.55, GOLD_DEEP + (GOLD_MID - GOLD_DEEP) * (t / 0.55),
                    GOLD_MID + (GOLD_HI - GOLD_MID) * ((t - 0.55) / 0.45))

    shade = np.clip(0.55 + 0.45 * light, 0, 1)[..., None]
    red = RED_DEEP + (RED_MAIN - RED_DEEP) * shade
    green = GREEN_DEEP + (GREEN_MAIN - GREEN_DEEP) * shade
    bg = WARM_BLACK + grain[..., None] * 2.0
    colors = {BG: bg, GOLD: gold, RED: red, GREEN: green, CREAM: CREAM_C + 0 * bg, LINE: LATTICE + 0 * bg}

    out = np.zeros((size, size, 3), np.float32)
    for k, col in colors.items():
        m = Image.fromarray(((arr == k) * 255).astype(np.uint8)).resize((size, size), Image.BOX)
        a = np.asarray(m, np.float32)[..., None] / 255
        out += col * a
    return Image.fromarray(np.clip(out, 0, 255).astype(np.uint8))


def tile(size=2400):
    return finish(slots(size * SS), size)


# ---------------- product mockup ----------------

def mockup(t, size=1600, repeat_in=4.0):
    W = H = size
    v, u = np.mgrid[0:H, 0:W].astype(np.float32)
    # warm studio backdrop
    r = np.sqrt(((u - W * 0.5) / W) ** 2 + ((v - H * 0.42) / H) ** 2)
    bgc = np.array([238, 228, 212]) * (1 - 0.35 * np.clip(r, 0, 1))[..., None]
    img = Image.fromarray(bgc.astype(np.uint8)).convert("RGBA")

    body = (430, 470, 1170, 1440)  # ~5.7 x 7.7 proportions
    rad = 110
    bw, bh = body[2] - body[0], body[3] - body[1]

    # pattern at real scale: bag is 5.7" wide
    rep = round(bw / 5.7 * repeat_in)
    small = t.resize((rep, rep), Image.LANCZOS)

    def tiled(dx, dy):
        p = Image.new("RGB", (bw + rep, bh + rep))
        for x in range(0, bw + rep, rep):
            for y in range(0, bh + rep, rep):
                p.paste(small, (x, y))
        return p.crop((dx, dy, dx + bw, dy + bh))

    # strap (behind body) with buckle
    strap = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    sd = ImageDraw.Draw(strap)
    for x0, x1 in ((body[0] + 120, 250), (body[2] - 120, W - 250)):
        sd.line((x0, body[1] + 40, x1, -40), fill=(24, 22, 21, 255), width=70)
        sd.line((x0, body[1] + 40, x1, -40), fill=(40, 37, 35, 255), width=10)
    bx, by = (body[2] - 120 + W - 250) / 2 + 20, body[1] / 2 - 10
    sd.rounded_rectangle((bx - 52, by - 30, bx + 52, by + 30), 10, outline=(200, 160, 80, 255), width=10)
    img.alpha_composite(strap)

    # drop shadow
    sh = Image.new("L", (W, H), 0)
    ImageDraw.Draw(sh).rounded_rectangle((body[0] + 25, body[1] + 45, body[2] + 25, body[3] + 45), rad, fill=150)
    sh = sh.filter(ImageFilter.GaussianBlur(35))
    img.alpha_composite(Image.merge("RGBA", (*[Image.new("L", (W, H), 30)] * 3, sh)))

    # body fabric with pillow shading
    fab = np.asarray(tiled(rep // 3, rep // 5), np.float32)
    yy, xx = np.mgrid[0:bh, 0:bw].astype(np.float32)
    ex = np.minimum(xx, bw - xx) / bw
    ey = np.minimum(yy, bh - yy) / bh
    edge = np.clip(np.minimum(ex * 6, ey * 5), 0, 1)
    lightv = 1.08 - 0.25 * (xx / bw) * 0.5 - 0.2 * (yy / bh)
    fab = fab * (0.62 + 0.38 * edge)[..., None] * lightv[..., None]
    hl = np.exp(-(((xx - bw * 0.3) / (bw * 0.35)) ** 2 + ((yy - bh * 0.25) / (bh * 0.3)) ** 2))
    fab = fab + 28 * hl[..., None]
    bodyimg = Image.fromarray(np.clip(fab, 0, 255).astype(np.uint8))
    mask = Image.new("L", (bw, bh), 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, bw - 1, bh - 1), rad, fill=255)
    img.paste(bodyimg, body[:2], mask)

    d = ImageDraw.Draw(img)
    # piping edge
    d.rounded_rectangle(body, rad, outline=(18, 16, 15, 255), width=10)
    # stitching
    def stitched_round_rect(box, rr, col, dash=14, gap=10, w=3):
        x0, y0, x1, y1 = box
        path = []
        n = 400
        per = 2 * (x1 - x0 - 2 * rr) + 2 * (y1 - y0 - 2 * rr) + 2 * math.pi * rr
        segs = [("l", (x0 + rr, y0), (x1 - rr, y0)), ("a", (x1 - rr, y0 + rr), -90),
                ("l", (x1, y0 + rr), (x1, y1 - rr)), ("a", (x1 - rr, y1 - rr), 0),
                ("l", (x1 - rr, y1), (x0 + rr, y1)), ("a", (x0 + rr, y1 - rr), 90),
                ("l", (x0, y1 - rr), (x0, y0 + rr)), ("a", (x0 + rr, y0 + rr), 180)]
        for s in segs:
            if s[0] == "l":
                (ax, ay), (bx_, by_) = s[1], s[2]
                L = math.hypot(bx_ - ax, by_ - ay)
                k = max(2, int(L / 2))
                path += [(ax + (bx_ - ax) * i / k, ay + (by_ - ay) * i / k) for i in range(k)]
            else:
                (ccx, ccy), a0 = s[1], s[2]
                k = max(2, int(math.pi * rr / 4))
                path += [(ccx + rr * math.cos(math.radians(a0 + 90 * i / k)), ccy + rr * math.sin(math.radians(a0 + 90 * i / k))) for i in range(k)]
        acc, on, last = 0.0, True, path[0]
        for p in path[1:]:
            seg = math.hypot(p[0] - last[0], p[1] - last[1])
            if on:
                d.line((last, p), fill=col, width=w)
            acc += seg
            if acc >= (dash if on else gap):
                acc, on = 0.0, not on
            last = p

    stitched_round_rect((body[0] + 26, body[1] + 26, body[2] - 26, body[3] - 26), rad - 26, (230, 196, 120, 230))

    # main zipper
    zy = body[1] + 95
    d.rounded_rectangle((body[0] + 70, zy - 14, body[2] - 70, zy + 14), 12, fill=(16, 15, 14, 255))
    for x in range(body[0] + 82, body[2] - 82, 12):
        d.rectangle((x, zy - 6, x + 6, zy + 6), fill=(196, 160, 86, 255))
    pull = (body[2] - 190, zy)
    d.rounded_rectangle((pull[0] - 22, pull[1] - 20, pull[0] + 22, pull[1] + 22), 8, fill=(214, 176, 96, 255))
    d.rounded_rectangle((pull[0] - 12, pull[1] + 18, pull[0] + 12, pull[1] + 95), 10, fill=(206, 168, 88, 255))
    d.rounded_rectangle((pull[0] - 5, pull[1] + 60, pull[0] + 5, pull[1] + 85), 4, fill=(120, 92, 40, 255))

    # front pocket
    pocket = (body[0] + 70, body[1] + 520, body[2] - 70, body[3] - 70)
    pw, ph = pocket[2] - pocket[0], pocket[3] - pocket[1]
    psh = Image.new("L", (W, H), 0)
    ImageDraw.Draw(psh).rounded_rectangle((pocket[0], pocket[1] + 10, pocket[2], pocket[3] + 14), 60, fill=140)
    img.alpha_composite(Image.merge("RGBA", (*[Image.new("L", (W, H), 10)] * 3, psh.filter(ImageFilter.GaussianBlur(14)))))
    pf = np.asarray(tiled(rep // 2 + 40, rep // 2 + 60).crop((0, 0, pw, ph)), np.float32)
    py, px = np.mgrid[0:ph, 0:pw].astype(np.float32)
    pe = np.clip(np.minimum(np.minimum(px, pw - px) / pw * 7, np.minimum(py, ph - py) / ph * 6), 0, 1)
    pf = pf * (0.7 + 0.3 * pe)[..., None] * (1.05 - 0.15 * py / ph)[..., None]
    pm = Image.new("L", (pw, ph), 0)
    ImageDraw.Draw(pm).rounded_rectangle((0, 0, pw - 1, ph - 1), 60, fill=255)
    img.paste(Image.fromarray(np.clip(pf, 0, 255).astype(np.uint8)), pocket[:2], pm)
    d = ImageDraw.Draw(img)
    d.rounded_rectangle(pocket, 60, outline=(18, 16, 15, 255), width=8)
    stitched_round_rect((pocket[0] + 18, pocket[1] + 18, pocket[2] - 18, pocket[3] - 18), 42, (230, 196, 120, 220), dash=12, gap=9, w=3)
    pz = pocket[1] + 55
    d.rounded_rectangle((pocket[0] + 50, pz - 11, pocket[2] - 50, pz + 11), 10, fill=(16, 15, 14, 255))
    for x in range(pocket[0] + 60, pocket[2] - 60, 11):
        d.rectangle((x, pz - 5, x + 5, pz + 5), fill=(196, 160, 86, 255))
    pp = (pocket[0] + 130, pz)
    d.rounded_rectangle((pp[0] - 18, pp[1] - 16, pp[0] + 18, pp[1] + 18), 7, fill=(214, 176, 96, 255))
    d.rounded_rectangle((pp[0] - 10, pp[1] + 14, pp[0] + 10, pp[1] + 75), 8, fill=(206, 168, 88, 255))

    return img.convert("RGB")


if __name__ == "__main__":
    out = Path(sys.argv[1])
    out.mkdir(parents=True, exist_ok=True)
    t = tile()
    t.save(out / "circle-pattern-tile_2400.png", dpi=(DPI, DPI), optimize=True)
    sheet = Image.new("RGB", (6000, 6000))
    for x in range(0, 6000, 2400):
        for y in range(0, 6000, 2400):
            sheet.paste(t, (x, y))
    sheet.save(out / "circle-pattern-sheet_6000.png", dpi=(DPI, DPI), optimize=True)
    mockup(t).save(out / "circle-preview-mockup.png")
    print("done")
