#!/usr/bin/env python3
"""Emit one standalone, hand-editable HTML file per screen of the Noah short.

Every Spanish string that is SPOKEN comes from script/script.es.json, so the
burned-in captions can never drift from the voice-over. UI copy lives here.

Each screen renders at 1080x1920. Screens that sit behind the character inset
paint an opaque background plus a white "plate"; the character video is rounded
with inset-mask.png and overlaid onto that plate by build_video.py.
"""
import json, pathlib, html

ROOT = pathlib.Path(__file__).resolve().parent.parent
UI   = ROOT / "ui"
SCRIPT = json.loads((ROOT / "script" / "script.es.json").read_text())
SHOTS = {s["id"]: s for s in SCRIPT["shots"]}

# Character inset geometry (shared with build_video.py via geometry.json)
INSET = {"plate_x":628,"plate_y":1040,"plate_w":412,"plate_h":452,"ring":10}
INSET["vid_x"] = INSET["plate_x"] + INSET["ring"]
INSET["vid_y"] = INSET["plate_y"] + INSET["ring"]
INSET["vid_w"] = INSET["plate_w"] - 2*INSET["ring"]
INSET["vid_h"] = INSET["plate_h"] - 2*INSET["ring"]

NOAH_MARK = (ROOT/"ui"/"assets"/"noah-mark.svg").read_text().split("\n",0)[0]
NOAH_APPICON = (ROOT/"ui"/"assets"/"noah-appicon.svg").read_text()

def mark(size):
    """Inline the real Noah mark at a given px size (never recoloured)."""
    s = NOAH_MARK.replace('width="120" height="120"', f'width="{size}" height="{size}"')
    # unique gradient ids per use so multiple marks on one page don't collide
    return s

def appicon(size):
    return NOAH_APPICON.replace('width="100" height="100"', f'width="{size}" height="{size}"')

TICK = ('<svg viewBox="0 0 24 24" fill="none" stroke="#0D9488" stroke-width="3.2" '
        'stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>')

def plate():
    i = INSET
    return (f'<div class="bg-only" style="position:absolute;left:{i["plate_x"]}px;top:{i["plate_y"]}px;'
            f'width:{i["plate_w"]}px;height:{i["plate_h"]}px;border-radius:34px;background:#fff;'
            f'box-shadow:0 26px 60px rgba(20,23,28,.24)"></div>')

def page(title, body, transparent=False):
    bg = "" if transparent else '<div class="stage-bg"></div>'
    return f"""<!doctype html>
<html lang="es"><head><meta charset="utf-8">
<title>{html.escape(title)}</title>
<link rel="stylesheet" href="base.css">
</head>
<body><div class="frame">{bg}
{body}
</div></body></html>"""

# ---------------------------------------------------------------- shot 1
def shot1():
    s = SHOTS["s1"]
    body = f"""
  <!-- Transparent overlay: the character video is the full-frame background. -->
  <div style="position:absolute;left:80px;top:140px;right:80px">
    <div class="eyebrow"><span class="dot"></span>Mac · Aviso del sistema</div>
    <div class="headline" style="margin-top:18px;text-shadow:0 4px 28px rgba(255,255,255,.85)">{html.escape(s['headline'])}</div>
  </div>

  <!-- The user's exact words, kept in English exactly as macOS showed them. -->
  <div style="position:absolute;left:160px;top:986px">
    <div class="mac-alert">
      <div class="body">
        <div class="ico">
          <svg viewBox="0 0 100 100" width="104" height="104">
            <defs><linearGradient id="hdd" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stop-color="#F3F4F6"/><stop offset="1" stop-color="#D7DBE2"/>
            </linearGradient></defs>
            <circle cx="50" cy="50" r="46" fill="url(#hdd)" stroke="#C3C8D1" stroke-width="2"/>
            <circle cx="50" cy="50" r="27" fill="none" stroke="#9AA2AE" stroke-width="7"/>
            <circle cx="50" cy="50" r="7" fill="#6B7280"/>
            <path d="M50 4a46 46 0 0 1 46 46h-16a30 30 0 0 0-30-30z" fill="#E0A23C"/>
          </svg>
        </div>
        <div class="t">Storage almost full.</div>
        <div class="m">Save space by optimising storage.</div>
      </div>
      <div class="btns">
        <div class="btn">Details…</div>
        <div class="btn">OK</div>
      </div>
    </div>
  </div>
"""
    return page("Noah short — 0–3s — Mac warning", body, transparent=True)

# ---------------------------------------------------------------- shot 2
def shot2():
    body = f"""
  <div style="position:absolute;left:80px;top:150px;right:80px">
    <div class="eyebrow"><span class="dot"></span>Noah revisó el disco</div>
  </div>

  <div class="win" style="position:absolute;left:40px;top:230px;width:1000px">
    <div class="win-bar">
      {mark(36)}<span class="name">Noah</span>
      <span class="win-dots"><i></i><span class="sq"></span><span class="x"></span></span>
    </div>
    <div class="result">
      <div class="accent"></div>
      <div class="result-head">
        <span class="tick">{TICK}</span>
        <span class="t">Lo que hizo Noah</span><span class="sub">· 41 s</span>
        <span class="work">Ver trabajo ⌄</span>
      </div>
      <div class="result-body">
        <div class="sec">Situación</div>
        <div class="say">Tu Mac <b>no está lleno</b>. El disco tiene
          <b>589 GB libres</b> de 994 GB.</div>
        <div class="sec" style="margin-top:32px">Lo que Noah revisó</div>
        <div class="tiles">
          <div class="tile"><div class="k">Espacio libre</div>
            <div class="v">589 GB</div><div class="d">de 994 GB en total</div></div>
          <div class="tile"><div class="k">Disco usado</div>
            <div class="v navy">41 %</div><div class="d">holgado, sin riesgo</div></div>
          <div class="tile"><div class="k">Escritorio</div>
            <div class="v">82 GB</div><div class="d">carpeta más pesada</div></div>
        </div>
      </div>
    </div>
  </div>
{plate()}
"""
    return page("Noah short — 3–7s — 589 GB libres", body)

# ---------------------------------------------------------------- shot 3
def shot3():
    body = f"""
  <div style="position:absolute;left:80px;top:150px;right:80px">
    <div class="eyebrow"><span class="dot"></span>Posible causa</div>
  </div>

  <div class="win" style="position:absolute;left:40px;top:230px;width:1000px">
    <div class="win-bar">
      {mark(36)}<span class="name">Noah</span>
      <span class="win-dots"><i></i><span class="sq"></span><span class="x"></span></span>
    </div>
    <div class="result">
      <div class="accent"></div>
      <div class="result-head">
        <span class="tick">{TICK}</span>
        <span class="t">Lo que hizo Noah</span><span class="sub">· 41 s</span>
        <span class="work">Ver trabajo ⌄</span>
      </div>
      <div class="result-body">
        <div class="sec">Lo que Noah encontró</div>
        <div class="say"><b>Escritorio sincronizado con iCloud.</b></div>
        <div class="say" style="margin-top:14px">El aviso podría estar relacionado con iCloud,
          no con el disco.</div>
        <div class="status" style="background:rgba(217,119,6,.10);border-color:rgba(217,119,6,.28)">
          <span class="lb" style="color:#9A5B08;font-size:29px;font-weight:700">
            Noah no revisó cuánto espacio tiene tu cuenta de iCloud.</span>
        </div>
      </div>
    </div>
  </div>
{plate()}
"""
    return page("Noah short — 7–11s — iCloud", body)

# ---------------------------------------------------------------- shot 4 (two states)
def shot4(selected):
    sel_a = "choice sel" if selected else "choice"
    status = """
        <div class="status">
          <span class="tick" style="background:rgba(13,148,136,.16)">%s</span>
          <span class="lb">No se realizaron cambios.</span>
        </div>""" % TICK if selected else ""
    body = f"""
  <div style="position:absolute;left:80px;top:150px;right:80px">
    <div class="eyebrow"><span class="dot"></span>Tú decides</div>
  </div>

  <div class="win" style="position:absolute;left:40px;top:230px;width:1000px">
    <div class="win-bar">
      {mark(36)}<span class="name">Noah</span>
      <span class="win-dots"><i></i><span class="sq"></span><span class="x"></span></span>
    </div>
    <div class="result">
      <div class="accent{' ok' if selected else ''}"></div>
      <div class="result-head">
        <span class="tick">{TICK}</span>
        <span class="t">¿Qué quieres hacer?</span>
        <span class="work">Ver trabajo ⌄</span>
      </div>
      <div class="result-body">
        <div class="sec">Elige una opción</div>
        <div class="choices">
          <div class="{sel_a}">
            <span class="rad"></span>
            <span><span class="lb">Mantenerlo donde está</span>
              <span class="hint" style="display:block">Noah no toca ningún archivo</span></span>
          </div>
          <div class="choice">
            <span class="rad"></span>
            <span><span class="lb">Mover el Escritorio al Mac</span>
              <span class="hint" style="display:block">Requiere tu aprobación</span></span>
          </div>
        </div>{status}
      </div>
    </div>
  </div>
{plate()}
"""
    return page(f"Noah short — 11–15s — choice ({'selected' if selected else 'open'})", body)

# ---------------------------------------------------------------- shot 5 (two states)
def shot5(with_cta):
    """Splash. The character inset is present while she speaks over the tagline,
    then drops out so the closing CTA and domain are never occluded."""
    if with_cta:
        block = f"""
  <div style="position:absolute;left:0;right:0;top:268px;text-align:center">
    <div style="display:inline-block">{appicon(226)}</div>
    <div style="font-size:74px;font-weight:800;color:#1A1D61;letter-spacing:-.02em;margin-top:30px">Noah</div>
    <div class="tagline" style="margin-top:40px">Describe it.<br>Approve it. Done.</div>
    <div style="width:132px;height:4px;margin:58px auto 0;border-radius:3px;
                background:linear-gradient(90deg,#2563EB,#7C3AED)"></div>
    <div class="sub-cta" style="margin-top:58px">Descarga Noah y pruébalo hoy</div>
    <div class="domain" style="margin-top:26px">onnoah.app</div>
  </div>"""
    else:
        block = f"""
  <div style="position:absolute;left:0;right:0;top:300px;text-align:center">
    <div style="display:inline-block">{appicon(226)}</div>
    <div style="font-size:74px;font-weight:800;color:#1A1D61;letter-spacing:-.02em;margin-top:30px">Noah</div>
    <div class="tagline" style="margin-top:40px">Describe it.<br>Approve it. Done.</div>
  </div>
{plate()}"""
    body = f"""
  <div class="splash-bg"></div>{block}
"""
    return page(f"Noah short — 15–20s — splash{' + CTA' if with_cta else ''}", body)

# ---------------------------------------------------------------- captions
def caption(shot_id):
    s = SHOTS[shot_id]
    txt = html.escape(s["caption"])
    # Highlight the English phrase the Mac showed, which she also says aloud.
    txt = txt.replace("«Storage almost full»", '<span class="en">«Storage almost full»</span>')
    body = f'  <div class="cap"><span class="t">{txt}</span></div>'
    return page(f"Caption — {shot_id}", body, transparent=True)

# ---------------------------------------------------------------- thumbnail
def thumbnail():
    head = html.escape(SCRIPT["thumbnail"]["headline"])
    body = f"""
  <div style="position:absolute;left:0;right:0;top:214px;text-align:center">
    <div style="display:inline-block">{appicon(190)}</div>
  </div>
  <div style="position:absolute;left:74px;right:74px;top:540px;text-align:center">
    <div style="font-size:104px;line-height:1.03;font-weight:800;letter-spacing:-.03em;color:#1A1D61">
      {head}
    </div>
  </div>
  <div style="position:absolute;left:110px;right:110px;top:960px">
    <div class="mac-alert" style="width:auto">
      <div class="body" style="padding:38px 44px 26px">
        <div class="t" style="font-size:44px">Storage almost full.</div>
        <div class="m" style="font-size:26px">Save space by optimising storage.</div>
      </div>
      <div class="btns"><div class="btn">Details…</div><div class="btn">OK</div></div>
    </div>
  </div>
  <div style="position:absolute;left:74px;right:74px;top:1330px;text-align:center">
    <div style="display:inline-flex;align-items:center;gap:22px;padding:30px 52px;border-radius:24px;
                background:#fff;border:1px solid #E3E7EF;box-shadow:0 22px 54px rgba(20,23,28,.14)">
      <span style="font-size:54px;font-weight:800;color:#0B7A70;letter-spacing:-.02em">589 GB libres</span>
    </div>
    <div style="font-size:40px;font-weight:700;color:#5A6272;margin-top:34px">
      Noah revisó el disco antes de tocar nada
    </div>
  </div>
  <div style="position:absolute;left:0;right:0;bottom:180px;text-align:center">
    <div class="domain" style="font-size:48px">onnoah.app</div>
  </div>
"""
    return page("Noah — YouTube Shorts thumbnail 1080x1920", body)

SCREENS = {
    "shot1-frame": shot1(),
    "shot2-frame": shot2(),
    "shot3-frame": shot3(),
    "shot4a-frame": shot4(False),
    "shot4b-frame": shot4(True),
    "shot5a-frame": shot5(False),
    "shot5b-frame": shot5(True),
    "cap-s1": caption("s1"), "cap-s2": caption("s2"), "cap-s3": caption("s3"),
    "cap-s4": caption("s4"), "cap-s5": caption("s5"),
    "thumbnail": thumbnail(),
}

if __name__ == "__main__":
    for name, doc in SCREENS.items():
        (UI / f"{name}.html").write_text(doc)
    (ROOT / "render" / "geometry.json").write_text(json.dumps(INSET, indent=2))
    print(f"wrote {len(SCREENS)} screens to {UI}")
    for n in SCREENS: print("  ", n + ".html")
