"""Render every non-footage layer of the "5 People, One Noah" Short as 1080x1920 RGBA PNGs.

All UI inserts are crops of real Noah screenshots from the repo root; the logo is the
official brand-pack PNG, unmodified. Output goes to ./build/gfx.
"""
import json
import os
from PIL import Image, ImageDraw, ImageFilter, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, "..", ".."))
OUT = os.path.join(HERE, "build", "gfx")
FONTS = os.path.join(HERE, "fonts")
W, H = 1080, 1920

# Noah Aurora dark tokens (brand-kit.html)
NAVY = (26, 29, 97)          # #1A1D61
DEEP = (11, 16, 36)          # #0B1024
INK = (235, 237, 242)        # #EBEDF2
LAV = (199, 203, 255)        # #C7CBFF
BLUE = (91, 155, 213)        # #5B9BD5
INDIGO = (99, 102, 241)      # #6366F1
VIOLET = (139, 92, 246)      # #8B5CF6
HILITE = (167, 180, 255)     # caption keyword tint, AA on the dark caption plate


def font(weight, size):
    return ImageFont.truetype(os.path.join(FONTS, f"PJS-{weight}.ttf"), size)


def gradient(w, h, stops, horizontal=True):
    """Linear gradient through a list of RGB stops."""
    g = Image.new("RGB", (w, h))
    px = g.load()
    n = w if horizontal else h
    for i in range(n):
        t = i / max(1, n - 1) * (len(stops) - 1)
        k = min(int(t), len(stops) - 2)
        f = t - k
        c = tuple(int(stops[k][j] + (stops[k + 1][j] - stops[k][j]) * f) for j in range(3))
        if horizontal:
            for y in range(h):
                px[i, y] = c
        else:
            for x in range(w):
                px[x, i] = c
    return g


def rounded_mask(w, h, r):
    m = Image.new("L", (w, h), 0)
    ImageDraw.Draw(m).rounded_rectangle((0, 0, w - 1, h - 1), r, fill=255)
    return m


def shadowed(card, radius, blur=28, alpha=150, pad=60):
    """Place a rounded card on a transparent canvas with a soft drop shadow (UI card, not the logo)."""
    w, h = card.size
    canvas = Image.new("RGBA", (w + pad * 2, h + pad * 2), (0, 0, 0, 0))
    sh = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    ImageDraw.Draw(sh).rounded_rectangle((pad, pad + 14, pad + w, pad + h + 14), radius, fill=(4, 6, 20, alpha))
    canvas = Image.alpha_composite(canvas, sh.filter(ImageFilter.GaussianBlur(blur)))
    canvas.paste(card, (pad, pad), rounded_mask(w, h, radius))
    return canvas, pad


def save(img, name):
    img.save(os.path.join(OUT, name))


# ---------------------------------------------------------------- kicker pills
def kicker(text, name, y=250):
    f = font(800, 50)
    tw = f.getbbox(text)[2]
    pw, ph = tw + 84, 104
    pill = gradient(pw, ph, [BLUE, INDIGO, VIOLET]).convert("RGBA")
    d = ImageDraw.Draw(pill)
    d.text((pw // 2, ph // 2 + 2), text, font=f, fill=(255, 255, 255), anchor="mm")
    card, pad = shadowed(pill, ph // 2, blur=18, alpha=120, pad=40)
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    img.alpha_composite(card, ((W - card.width) // 2, y - pad))
    save(img, name)


# ---------------------------------------------------------------- opening title
def title():
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    # soft top scrim so white type holds over a bright room
    scrim = Image.new("L", (W, 900), 0)
    sd = ImageDraw.Draw(scrim)
    for y in range(900):
        sd.line((0, y, W, y), fill=int(175 * (1 - y / 900) ** 1.6))
    img.paste(Image.new("RGBA", (W, 900), DEEP + (255,)), (0, 0), scrim)
    d = ImageDraw.Draw(img)
    lines = [("5 PEOPLE.", INK), ("5 PC WINS.", INK), ("ONE NOAH.", None)]
    f = font(800, 118)
    y = 250
    for text, col in lines:
        if col:
            d.text((W // 2, y), text, font=f, fill=col, anchor="mt")
        else:  # brand gradient fill for the payoff line
            bb = f.getbbox(text)
            tw, th = bb[2], bb[3]
            m = Image.new("L", (tw, th + 10), 0)
            ImageDraw.Draw(m).text((0, 0), text, font=f, fill=255)
            g = gradient(tw, th + 10, [(140, 190, 255), LAV, (180, 150, 255)]).convert("RGBA")
            img.paste(g, ((W - tw) // 2, y), m)
        y += 140
    # small official mark under the title
    mark = Image.open(os.path.join(REPO, "brand-pack/png/noah-mark-dark-512.png")).convert("RGBA")
    mark = mark.resize((150, 150), Image.LANCZOS)
    img.alpha_composite(mark, ((W - 150) // 2, y + 10))
    save(img, "title.png")


# ---------------------------------------------------------------- UI inserts (real screenshots)
UI_Y = 1030      # card top; faces sit in the upper-middle third
UI_MAX_H = 400   # card (title bar + crop) must end above the caption strip


def ui_card(src, box, name, width=940, label=None):
    shot = Image.open(os.path.join(REPO, src)).convert("RGB").crop(box)
    width = min(width, int(shot.width * (UI_MAX_H - 64) / shot.height))
    s = width / shot.width
    shot = shot.resize((width, int(shot.height * s)), Image.LANCZOS)
    # thin title bar with the official app icon, so the insert reads as "the Noah app"
    bar_h = 64
    card = Image.new("RGB", (width, shot.height + bar_h), (20, 23, 28))
    d = ImageDraw.Draw(card)
    icon = Image.open(os.path.join(REPO, "brand-pack/png/noah-appicon-dark-512.png")).convert("RGBA").resize((38, 38), Image.LANCZOS)
    card.paste(icon, (22, 13), icon)
    d.text((72, bar_h // 2), label or "Noah", font=font(700, 28), fill=INK, anchor="lm")
    d.line((0, bar_h - 1, width, bar_h - 1), fill=(40, 44, 52), width=2)
    card.paste(shot, (0, bar_h))
    framed, pad = shadowed(card.convert("RGBA"), 30)
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    img.alpha_composite(framed, ((W - framed.width) // 2, UI_Y - pad))
    save(img, name)
    return card.height


def ui_inserts():
    # P1 — describe it in plain words
    ui_card("IMG_0583.jpeg", (372, 44, 1140, 236), "ui1.png")
    # P2 — Noah running its checks
    ui_card("IMG_0585.jpeg", (372, 160, 1140, 352), "ui2.png")
    # P3 — the real approval gate
    ui_card("IMG_0593.jpeg", (338, 382, 836, 636), "ui3.png", width=860)
    # P4 — the cause behind the lag (situation + what Noah checked)
    ui_card("IMG_0591.jpeg", (378, 118, 1124, 436), "ui4.png")
    # P5 — see the plan, then approve it
    ui_card("IMG_0591.jpeg", (378, 456, 1124, 822), "ui5a.png")
    ui_card("IMG_0593.jpeg", (338, 382, 836, 636), "ui5b.png", width=860)


# ---------------------------------------------------------------- captions
CAP_Y = 1650  # caption plate bottom; keeps clear of the Shorts UI zone (bottom ~270px)


def caption(words, name, hi=()):
    """words: list of tokens; tokens whose lowercase stripped form is in `hi` get the accent colour."""
    f = font(800, 54)
    space = f.getlength(" ")
    maxw = W - 160
    lines, cur, curw = [], [], 0
    for w_ in words:
        ww = f.getlength(w_)
        if cur and curw + space + ww > maxw:
            lines.append(cur)
            cur, curw = [], 0
        cur.append(w_)
        curw += (space if curw else 0) + ww
    if cur:
        lines.append(cur)
    lh = 72
    plate_h = lh * len(lines) + 40
    widest = max(sum(f.getlength(t) for t in l) + space * (len(l) - 1) for l in lines)
    plate_w = int(widest + 72)
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    top = CAP_Y - plate_h
    plate = Image.new("RGBA", (plate_w, plate_h), (10, 12, 30, 200))
    img.paste(plate, ((W - plate_w) // 2, top), rounded_mask(plate_w, plate_h, 26))
    d = ImageDraw.Draw(img)
    y = top + 20
    for l in lines:
        lw = sum(f.getlength(t) for t in l) + space * (len(l) - 1)
        x = (W - lw) / 2
        for t in l:
            key = t.lower().strip(".,!?—'’\"").replace("’s", "").replace("'s", "")
            d.text((x, y), t, font=f, fill=HILITE if key in hi else (255, 255, 255))
            x += f.getlength(t) + space
        y += lh
    save(img, name)


# ---------------------------------------------------------------- splash
def splash():
    bg = gradient(W, H, [DEEP, (18, 22, 70), NAVY], horizontal=False).convert("RGBA")
    # aurora wash: soft indigo/violet glows (background only; the mark itself stays effect-free)
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    gd.ellipse((-200, 1150, 900, 2050), fill=INDIGO + (70,))
    gd.ellipse((380, 1250, 1400, 2150), fill=VIOLET + (60,))
    bg = Image.alpha_composite(bg, glow.filter(ImageFilter.GaussianBlur(160)))
    d = ImageDraw.Draw(bg)
    mark = Image.open(os.path.join(REPO, "brand-pack/png/noah-mark-dark-1024.png")).convert("RGBA").resize((330, 330), Image.LANCZOS)
    bg.alpha_composite(mark, ((W - 330) // 2, 280))
    d.text((W // 2, 640), "Noah", font=font(800, 84), fill=INK, anchor="mt")
    f = font(800, 124)
    y = 830
    for t in ("DESCRIBE IT.", "APPROVE IT.", "DONE."):
        d.text((W // 2, y), t, font=f, fill=(255, 255, 255), anchor="mt")
        y += 150
    # CTA pill in the app's own button gradient
    cta = "Download and install Noah to try it today"
    fc = font(700, 40)
    pw, ph = int(fc.getlength(cta)) + 90, 104
    pill = gradient(pw, ph, [BLUE, INDIGO, VIOLET]).convert("RGBA")
    ImageDraw.Draw(pill).text((pw // 2, ph // 2 + 1), cta, font=fc, fill=(255, 255, 255), anchor="mm")
    bg.paste(pill, ((W - pw) // 2, 1340), rounded_mask(pw, ph, ph // 2))
    d.text((W // 2, 1500), "onnoah.app", font=font(700, 60), fill=LAV, anchor="mt")
    bg.convert("RGB").save(os.path.join(OUT, "splash.png"))


# ---------------------------------------------------------------- thumbnail overlay
def thumb_overlay():
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    scrim = Image.new("L", (W, 1000), 0)
    sd = ImageDraw.Draw(scrim)
    for y in range(1000):
        sd.line((0, y, W, y), fill=int(215 * (1 - y / 1000) ** 1.3))
    img.paste(Image.new("RGBA", (W, 1000), DEEP + (255,)), (0, 0), scrim)
    d = ImageDraw.Draw(img)
    mark = Image.open(os.path.join(REPO, "brand-pack/png/noah-mark-dark-512.png")).convert("RGBA").resize((140, 140), Image.LANCZOS)
    img.alpha_composite(mark, ((W - 140) // 2, 120))
    f = font(800, 150)
    d.text((W // 2, 300), "5 PEOPLE", font=f, fill=(255, 255, 255), anchor="mt")
    d.text((W // 2, 465), "TRIED NOAH", font=f, fill=LAV, anchor="mt")
    fs = font(800, 56)
    sub = "HERE’S WHAT HAPPENED"
    pw, ph = int(fs.getlength(sub)) + 90, 110
    pill = gradient(pw, ph, [BLUE, INDIGO, VIOLET]).convert("RGBA")
    ImageDraw.Draw(pill).text((pw // 2, ph // 2 + 2), sub, font=fs, fill=(255, 255, 255), anchor="mm")
    img.paste(pill, ((W - pw) // 2, 660), rounded_mask(pw, ph, ph // 2))
    save(img, "thumb_overlay.png")


def main():
    os.makedirs(OUT, exist_ok=True)
    spec = json.load(open(os.path.join(HERE, "timeline.json")))
    title()
    for b in spec["beats"]:
        if "kicker" in b:
            kicker(b["kicker"], f"kicker_{b['id']}.png")
        for i, c in enumerate(b.get("captions", [])):
            caption(c["text"].split(), f"cap_{b['id']}_{i}.png", set(spec["highlight"]))
    ui_inserts()
    splash()
    thumb_overlay()
    print("graphics ->", OUT)


if __name__ == "__main__":
    main()
