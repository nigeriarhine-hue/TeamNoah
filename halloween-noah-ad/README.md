# Noah Halloween Ad — "More Treats Than Tricks"

YouTube spot, 1920×1080 (16:9), 30 fps, 49.1 s. It's cut to the supplied vocal + music track
(`audio/music/noah_music_halloween_nikki.mp3`), which is the length of that track.

**v3 (current):** the witch is a stylized 3D animated character, lip-synced to the vocal on every
talking shot, and the voice is 20% lower (×0.8 amplitude, −1.9 dB) with the music unchanged.

- **Vocal isolation:** the supplied beat file is sample-aligned to the music in the mix (lag 1201 samples at 44.1 kHz,
  gain 0.78). Subtracting it leaves the vocal alone, with the music cancelled to about 28 dB below the mix.
  The remix is `mix − 0.2 × vocal`, so the music stays unchanged and the voice sits at 80%.
- **Lip sync:** the talking shots (w1, w2, w4, w5, w6, w9) are Wan 2.7 renders. Each gets the 3D key frame plus
  that shot's slice of the isolated vocal, starting at the scene's start time. Each clip is cut in at `in = 0`,
  so the mouth matches the soundtrack frame for frame. The embedded audio was checked to align at 0 ms offset.
- **Silent shots:** the reaction (k3), the mouse click (k7) and the look-back (k8) are Kling 3.0 Pro.

## Folder map

| Path | Contents |
|---|---|
| `character/` | Links to the locked 3D witch reference sheet and 3D room master (plus the earlier photoreal versions) (`character/README.md`) |
| `voice/` | `nikki_vocal_words.json`: word-level timings of the supplied vocal (faster-whisper). `align.py` and `final_voiceover_words.json` are from the earlier generated-voice version, kept for reference |
| `audio/beat_map.json` | Beat analysis: 99.4 BPM, drop at 9.68 s, strong kicks, silence break 39.9–40.9 s, ending about 49 s |
| `audio/music/` | Supplied tracks (git-ignored) |
| `audio/sound_effects/` | Sound design is synthesized by `build/audio.py`; the build writes its stem to `sfx/sound_design_stem.wav` |
| `ui/01…08_*.png` | The eight product screens and the splash as standalone 1920×1080 assets |
| `ui/stage.html` | Noah UI recreated 1:1 from the app screenshots in the repo root, plus the problem screens, diagnostic visual, typography overlays, captions and splash. Deterministic `render(scene, t)` |
| `ui/render.mjs` | Playwright renderer (frames, overlays, captions, stills) |
| `captions/captions.json` | Burned-in captions, one per spoken phrase, following the supplied vocal |
| `timeline.json` | The edit: 24 segments with their scene id, in-points and overlays, plus the sound-design cue times |
| `build/composite.py` | Green-screen compositor: tracks the chroma-green monitor per frame and perspective-warps the rendered screen into it |
| `build/audio.py` | Final mix: supplied track plus chaos→control sound design, at −14 LUFS |
| `build/build.sh` | End-to-end build: `SRC=/path/to/halloween-noah-ad bash build/build.sh` |
| `build/sources.json` | URLs of the Higgsfield renders (witch shots) and the uploaded audio |

## Edit (seconds)

| Time | Scene | What's on screen |
|---|---|---|
| 0.00–5.90 | scene_01 | Wide: witch beside her home gaming PC. MORE TREATS. (warm glow on "treats") / LESS TRICKS. (glitch on "tricks") |
| 5.90–11.86 | scene_02 | Witch gestures to the PC. Her monitor freezes (composited), then full-screen hang, spinner and glitch |
| 11.86–16.40 | scene_03 | CRASHING APPS, SPOTTY WI-FI, STORAGE WARNING, each on its word |
| 16.40–17.10 | scene_04 | Witch mock-horror reaction |
| 17.10–20.00 | scene_05 | Lag and stutter screen, then witch deadpan with NIGHTMARE FUEL and a bass hit on "nightmare" |
| 20.00–28.20 | scene_06 | Magic gesture with a purple trail, a push into the screen, then the abstract diagnostic visual |
| 28.20–29.90 | scene_07 | "That's where Noah comes in": the chaos stops, the witch relaxes, and MEET NOAH appears with the real icon |
| 29.90–36.90 | scene_08 | Noah UI: typing the problem, checks running, CAUSE FOUND, RECOMMENDED ACTION |
| 36.90–38.72 | scene_09 | Approval dialog: NOTHING HAPPENS UNTIL YOU APPROVE, then the click close-up |
| 38.72–41.95 | scene_10 | NO MYSTERY FIXES (action log), then NO SCARY SURPRISES (witch checks behind her), then Done |
| 41.95–43.90 | scene_11 | Witch relaxed, PC healthy. DON'T LET BAD SOFTWARE / HAUNT YOUR PC. |
| 43.90–49.10 | scene_12 | End card: real icon, NOAH, DESCRIBE IT. APPROVE IT. DONE., DOWNLOAD NOAH, onnoah.app |

## QA checklist (final render)

1. 1920×1080, SAR 1:1, 16:9, H.264 High / AAC 48 kHz. Verified with ffprobe.
2. 49.10 s, 1,473 frames. This is the length of the supplied track.
3. The same witch in every shot: every key frame references one locked character sheet.
4. One voice throughout: the supplied vocal.
5. The real Noah icon (`brand-pack/svg/noah-appicon-dark.svg`) is used unaltered.
6. All Noah screens are dark and rendered as real text, with no generated gibberish.
7. The flow runs describe → investigate → cause → recommended action → approval → action log → done. The approval click happens before any change.
8. No hardware repair and no performance claims. The result card says only what was changed and that it's reversible.
9. `onnoah.app` is spelled correctly. The tagline is exactly "Describe it. Approve it. Done."
10. An automated scan checks every frame for leftover chroma green, and loudness is checked with ebur128.
