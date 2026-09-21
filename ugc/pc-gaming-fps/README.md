# Noah — PC gaming / FPS UGC spot (15s, 9:16)

Vertical UGC talking-head for TikTok / Reels / Shorts. No brand kit overlays,
per brief — the only Noah branding on screen is the app's own UI.

## Final video

1080x1920 · 24fps · 15.07s · H.264 + AAC

## How it was made

1. **Noah UI screenshots** — `noah-ui-source.html` recreates the Noah desktop UI
   from the reference screenshots (IMG_0583–0595): same dark theme, gradient card
   edge, section labels, stat tiles, numbered plan rows, and the real Noah mark
   from `brand-pack/svg/noah-mark-dark.svg`. Rendered with Playwright/Chromium at
   2x (2340x1980). Content is fabricated for a GPU-driver/FPS scenario.

   - `noah-a.png` — user message + "Looking into it…"
   - `noah-b.png` — diagnosis (driver rollback, overlay hooks, shader cache)
   - `noah-c.png` — result (47 → 144 fps, clean launches, overlays off)

   Re-render: `node render.js` (needs `npm i playwright`, fonts sit alongside).

2. **Beats** — vent → slump → mouse-jab macro → the idea → typing → slouched
   scrolling his phone while he waits → looks up, sees Noah waiting on his
   go-ahead, clicks → grin and settle. The approval step is the turn, so Noah's
   permission model is on screen rather than implied.

3. **Creator + footage** — Higgsfield: `soul_2` for the creator identity,
   `gpt_image_2` for an 8-slot 21:9 storyboard, `seedream_v5_pro` de-slop pass,
   then `seedance_2_5` (omni_reference, native audio) for the 15s clip — eight
   internal hard cuts at ~1.9s.

4. **UI inserts** — the real screenshots are composited in post rather than
   generated, so the interface is pixel-accurate instead of AI-mangled. Crops are
   taken tight around the live elements so the text stays legible at card size:

   | insert | source crop              | window       | lands on |
   |--------|--------------------------|--------------|----------|
   | 1      | ask + "Looking into it…" | 7.6 – 9.3s   | typing   |
   | 2      | plan + approval CTA      | 9.9 – 11.7s  | scrolling |
   | 3      | "Done." + result tiles   | 12.3 – 14.0s | after the click |

   Insert 2 clears right as he snaps upright, leaving the click beat clean; the
   last ~1s is left clean for the closing line.

## Script (33 words — the 15s density band)

> *[incredulous scoff]* "—kept crashing the second I hit launch. Every single
> time. Told Noah, went back to scrolling. Looked up and it already found the
> driver — just needed my okay. Game's been CLEAN since."
