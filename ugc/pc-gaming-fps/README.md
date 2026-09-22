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

   The mouse beat holds his face and his hand in one frame. An earlier cut used
   a disembodied macro of the hand alone; with nothing in frame anchoring
   identity, the model rendered a light-skinned hand on a dark-skinned creator.
   Keeping his face in shot removes the failure mode rather than re-prompting
   around it. Measured: the broken take's hand sat +64 luminance from his face,
   the current one +14 within a single frame.

3. **Creator + footage** — Higgsfield: `soul_2` for the creator identity,
   `gpt_image_2` for an 8-slot 21:9 storyboard, `seedream_v5_pro` de-slop pass,
   then `seedance_2_5` (omni_reference, native audio) for the 15s clip — eight
   internal hard cuts at ~1.9s.

4. **UI inserts** — the real screenshots are composited in post rather than
   generated, so the interface is pixel-accurate instead of AI-mangled. Crops are
   taken tight around the live elements so the text stays legible at card size:

   | insert | source crop              | window        | lands on |
   |--------|--------------------------|---------------|----------|
   | 1      | ask + "Looking into it…" | 6.2 – 8.2s    | right after "Told Noah" |
   | 2      | plan + approval CTA      | 10.9 – 13.0s  | "already found the driver… just needed my OK" |
   | 3      | "Done." + result tiles   | 13.4 – 15.0s  | "Game's been clean since" |

   Insert windows are cut to the transcript, not to planned beats. Insert 1 also
   covers the ~2.6s typing pause so the screen never goes dead while he types.

5. **Subtitles** — burned after compositing, word-grouped from a Whisper
   word-level transcript of the finished audio and aligned against
   `output/script.txt`, so on-screen text can only ever be words that are
   actually in the script. Montserrat ExtraBold, CAPS, bottom 15% safe zone.
   Ships as `final_captioned.mp4`; the un-captioned cut is kept as the master.

## Script (33 words — the 15s density band)

> *[scoff]* "My game kept crashing the second I hit launch. Every single time.
> Told Noah. Went back to scrolling, looked up, and it already found the driver.
> Just needed my OK. Game's been clean since."

The line opens on a complete sentence. An earlier cut started mid-sentence
("—kept crashing…") as a scroll-stopper; it read as a clipped file rather than a
hook, so it was rewritten.
