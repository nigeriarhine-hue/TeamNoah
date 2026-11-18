# Noah × Byte — "My PC Was Acting Weird… So I Tried This"

A ~21-second, 9:16 animated UGC short for Noah (onnoah.app). It stars **Byte**, an original 3D robot
creator. Everything for this video lives in this folder; no earlier videos or files were changed.

## Deliverables (`deliverables/`)

| File | What |
|---|---|
| `noah-byte-animated-ugc.mp4` | Final video: 1080×1920, 30 fps, H.264 + AAC, ~21.5 s, -14 LUFS |
| `noah-byte-character-reference.png` | Official Byte reference (hero pose, 6 expressions, thumbs-up, palette) |
| `noah-byte-ugc-thumbnail.png` | Dedicated 1080×1920 Shorts thumbnail ("WHY IS MY PC DOING THIS?!") |
| `noah-byte-ugc-thumbnail-landscape.png` | 1280×720 YouTube thumbnail |
| `audio/` | Master mix + stems (voice, music, sfx) and the five dialogue lines |

## How it was made

- **Byte is real 3D.** He's built in three.js (`src/byte/Byte.tsx`) with physically based clear-coat
  materials, image-based lighting and soft shadows, and he's rendered frame by frame inside Remotion
  (`@remotion/three`). There is **one** model. Every shot, the facecam, the thumbnails and the reference
  sheet all use the same component, so Byte looks identical everywhere.
  - His face is a glowing screen inside a glossy visor (`src/byte/face.ts`): eyes, lids, brows,
    mouth and blush are drawn per frame, so the expressions animate.
  - Animation is keyframed (`src/byte/poses.ts`, `src/anim.ts`). He has articulated arms, fingers and
    a thumb, plus natural blinks, eye darts, breathing, talking head-bobs and a springy antenna.
  - **Lip sync** is driven by the actual dialogue audio, using a per-frame loudness envelope.
- **Voice:** Kokoro-82M local neural TTS (voice `am_puck`, speed 1.2), one voice for every line.
  Word timings come from faster-whisper, and it transcribes all five lines correctly.
- **Music and SFX** are original, synthesized in `scripts/build_audio.py`. The music ducks under the
  dialogue, and the SFX cues are placed from the word timings.
- **Product UI is genuine.** Scenes 3–4 use the real Noah screenshots from the repo root
  (`IMG_0583/85/86/88/93/94`, copied to `public/ui/`). The only additions are camera zooms,
  highlight boxes and markers, and a pointer moving to the real "Go ahead" button in the real
  "Can Noah do this?" dialog. The flow shown is the recorded one: plan → approval dialog →
  "Approved: Action approved".
- The monitor in the 3D office only shows a generic boot screen, a generic cluttered desktop and the
  real Noah screenshots. The app icons are generic shapes. There are no third-party logos.

### Why not Higgsfield?
The project has a configured Higgsfield MCP, but its balance was **0 credits (free plan)**, so no
images, video or voice could be generated there. The pipeline above needs no credits and keeps Byte
100% consistent. If you'd like generated, film-style footage later, top up Higgsfield and use
`out/stills/ByteReference-0.png` as the single image reference for every image-to-video call.

## Storyboard as built (frames @30 fps)

| Scene | Frames | Content |
|---|---|---|
| 1 Hook | 0–97 | Selfie; frustrated Byte, comedic snap-zoom on "mind of its own" |
| 2 Problem | 98–216 | Whip-pan to the PC: boot, windows pile up, app icons burst out; jump-cut back to confused Byte pointing at it |
| 3 Noah | 217–336 | Byte points at Noah on the monitor, the camera pushes into the screen, then the real UI: checks running → situation explained (Byte facecam below) |
| 4 Control | 337–467 | Real findings → real recommendations → real approval dialog, "Go ahead" clicked → "Approved" |
| 5 CTA | 468–645 | Selfie; sincere → smug → thumbs-up push-in; branded end card (NOAH / FREE PC CHECK / Describe it. Approve it. Done. / onnoah.app) |

## Rebuild

```bash
npm install
# voice (needs ~/.venv-tts with kokoro-onnx + faster-whisper, models in ~/tts-models)
~/.venv-tts/bin/python scripts/gen_voice.py audio-src/voice am_puck 1.2
~/.venv-tts/bin/python scripts/align.py audio-src/voice
~/.venv-tts/bin/python scripts/build_audio.py   # timeline + music + sfx + mix
./scripts/normalize_audio.sh                     # -14 LUFS
npx remotion render src/index.ts NoahByteUGC out/noah-byte-animated-ugc.mp4 --gl=swangle --crf=17 --audio-bitrate=320k
node scripts/render-stills.mjs ThumbnailShorts out/stills 0
node scripts/render-stills.mjs ThumbnailLandscape out/stills 0
node scripts/render-stills.mjs ByteReference out/stills 0
```

`--gl=swangle` is required on GPU-less machines. Preview everything with `npm run studio`.
