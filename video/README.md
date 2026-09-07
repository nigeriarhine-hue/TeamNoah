# Noah — short-form video

Vertical 9:16 film built for YouTube Shorts / TikTok / Reels.
Concept, script and timings live in [`SCRIPT.md`](SCRIPT.md).

| | |
|---|---|
| **Output** | `out/noah-mine-has-one.mp4` — 1080×1920, 30fps, 75.9s, H.264 |
| **Audio** | none — the visual track is silent by design; voiceover is added in Clipchamp |
| **Source** | `src/film.html` (structure + type) · `src/film.js` (timeline) · `src/grab.js` (renderer) |

## Why it's built as code, not generated

Both connected video services are gated on this account (Higgsfield: 0 credits; Runway:
no video models available), but more to the point — generative video cannot render legible UI
or exact brand colour, and Noah's brand kit rules out invented UI and fake metrics outright.

So the film is rendered deterministically from HTML: real Plus Jakarta Sans and Instrument
Serif, exact hex values from BRAND.md, the real logo SVG. `render(t)` fully describes the frame
at time `t`, so frame N is byte-identical on every run and any beat can be re-timed by editing
one number.

## Brand rules this film follows

- Aurora gradient appears **once**, on the Approve button — the one primary action.
- Commit teal appears **once**, on the confirmation. Nothing decorative uses either.
- The cleaner beat is rendered in neutral greys — no brand colour — so colour returns with Noah.
- Noah is third person throughout. The word "scan" is only ever what the *cleaner* does.
- The load line overshoots the disc and stays level. Never tilted, recoloured, or cropped.

## Re-rendering

```bash
pip install imageio-ffmpeg          # provides a full ffmpeg with libx264
export FFMPEG_BIN=$(python3 -c "import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())")
export NODE_PATH=/opt/node22/lib/node_modules

cd src
node grab.js --probe    # 19 stills to out/probe — check the design fast
node grab.js            # full render -> out/noah-mine-has-one.mp4
```

Takes ~3 minutes for 2280 frames. Open `src/film.html` directly in a browser to preview
the animation live (it loops).

## Assembling in Clipchamp

1. Drop `out/noah-mine-has-one.mp4` on the timeline as the base track.
2. Generate the voiceover from the block in `SCRIPT.md` → *Clean voiceover*. Calm mid-range
   voice at ~0.9× speed.
3. Line the VO up against the timing table in `SCRIPT.md` — the beats were cut to those marks.
4. Music, if any, should sit very low. The silence around "Nothing runs until you approve"
   is doing work; don't fill it.

The visual timings are the adjustable part. If a read comes in long or short, change the beat
windows at the top of each section in `src/film.js` and re-render rather than stretching clips.
