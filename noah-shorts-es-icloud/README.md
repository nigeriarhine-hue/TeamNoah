# Noah — 20 s vertical short (es-419) · "Storage almost full."

A 1080 × 1920 / 9:16 short for YouTube Shorts and TikTok, built around the real
support case: a Mac showed **"Storage almost full."**, Noah measured ~589 GB free
on the disk and found a large iCloud-synced Desktop, the user chose to keep the
files where they were, and **Noah changed nothing**.

## Status

| Piece | State |
|---|---|
| All Noah screens, Mac alert, splash (light theme, Spanish) | **Done** — `out/screens/` |
| 1080 × 1920 thumbnail | **Done** — `out/screens/thumbnail.png` |
| Spanish captions (SRT + VTT + burned-in) | **Done** — `script/` |
| Frame-exact 20.000 s timeline | **Done** — `render/timeline.json` |
| Timed cut with burned captions, no face/voice | **Done** — `out/noah-mac-espacio-20s-ANIMATIC.mp4` |
| Character footage + voice-over | **Blocked** — see below |
| Final composited video | **Blocked** — needs the footage |

### What is blocked, and why

This session's egress policy denies every Higgsfield media host, so generated
results cannot be pulled back here for compositing:

```
d8j0ntlcm91z4.cloudfront.net   connect_rejected   (generation results)
d2ol7oe51mr4n9.cloudfront.net  connect_rejected   (uploaded media)
cdn.higgsfield.ai              connect_rejected
d1xarpci4ikg0w.cloudfront.net  connect_rejected
higgsfield.ai                  connect_rejected
```

Uploads are fine (a test PUT to the presigned S3 URL returned HTTP 200) — it is
only the download direction that is refused. The agent proxy's own guidance is to
report a policy denial rather than route around it.

Consequence: the character clips can still be **generated** (see *Finishing*),
but they cannot be composited, trimmed to exactly 20 s, caption-checked or
verified from inside this session.

## Finishing the video

Both paths end in the same command.

**A — generate on Higgsfield, download in a browser.** Run the jobs in
`render/character_shots.json`. The TTS job_id feeds the video job as
`audio_references`, so the exact Spanish wording drives the lip sync and nothing
has to round-trip through a local disk. Then download from your Higgsfield
library into:

```
assets/audio/s1.mp3 … s5.mp3         the five voice lines
assets/character/s1.mp4 … s5.mp4     the five 9:16 clips
assets/audio/music.mp3               optional bed, ducked to 10 %
```

**B — allow the CDN hosts above** for a session and the same scripts do the whole
job unattended.

Then:

```bash
python3 render/timeline.py      # re-times from the REAL audio durations
python3 render/make_captions.py # SRT/VTT follow the new timing
python3 render/build_video.py   # full composite, exactly 20.000 s
```

`build_video.py` detects the assets and switches from animatic to full
automatically. Re-run `render/render_screens.sh` after editing any screen.

## Layout

```
script/script.es.json      single source of truth: spoken line, caption, TTS text
script/captions.es.srt|vtt generated from it — never hand-typed
ui/*.html                  one standalone, editable screen per shot (1080×1920)
ui/base.css                light-theme design system; ui/fonts/ embedded brand fonts
ui/assets/                 the genuine Noah mark and app icon from brand-pack/
render/make_screens.py     emits the HTML from the script
render/render_screens.sh   HTML → PNG via headless Chromium
render/timeline.py         fits the five lines into exactly 600 frames @ 30 fps
render/build_video.py      ffmpeg composite
render/character_shots.json exact prompts + params for the five clips
out/screens/               rendered PNGs
```

## Accuracy rules honoured

- The Mac warning reads exactly **"Storage almost full."**, in English, everywhere
  it appears — including the thumbnail.
- Every spoken line is Spanish. No English VO with Spanish subtitles.
- Shot 3 states the iCloud link as a **possible** cause and says on screen
  *"Noah no revisó cuánto espacio tiene tu cuenta de iCloud."* No iCloud quota is
  shown or implied, because none was measured.
- Nothing claims Noah freed space or fixed the warning. Shot 4 ends on
  **"No se realizaron cambios."**
- Captions are the byte-identical `caption` string from the script; the generator
  asserts `caption == spoken` for all five lines and fails the build otherwise.
- Timing spends any deficit on gaps first, then lead-in/tail, and only then a
  uniform tempo nudge capped at 1.05× — a line is never clipped or dropped.

## Type and safe areas

Plus Jakarta Sans (brand) embedded as base64 so the render needs no network.
Critical content sits between y≈140 and y≈1470; captions occupy y≈1500–1660,
clear of both platforms' bottom UI.
