# Noah shorts (Remotion)

Short-form videos for the Noah tech-content series, built in React/TypeScript with Remotion.

## "I Asked Noah One Question" (PC CHECK 101)

| Output | Path |
|---|---|
| Video, 1080×1920, 30 fps, 24 s, −14 LUFS | `../out/noah-one-question-short.mp4` |
| Shorts/TikTok thumbnail, 1080×1920 | `../out/noah-one-question-thumbnail.png` |

```bash
npm install
npm run render:one-question        # Remotion render + loudness master
npm run still:one-question-thumb   # thumbnail
npm run studio                     # preview / scrub
```

In the cloud container, add
`--browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell`
to the `remotion` commands.

### What each layer is

- **Human footage only from Higgsfield.** `public/footage/creator-hook.mp4` is a single 8 s Wan 2.7
  image-to-video clip of the recurring creator (start frame generated from his Soul V2 reference,
  job `728ceeb9…`). Its first 3.9 s is the lip-synced opening line; its tail (glance at the
  monitor, half-smile back to camera) closes the video. `creator-still.jpg` is that start frame,
  used in the thumbnail.
- **All Noah UI is genuine.** `public/ui/*.png` are crops of the real desktop-app screen captures in
  the repo root (`IMG_0583`–`IMG_0595`), made by `scripts/prepare_ui_assets.py`. Two composites sit
  on top in Remotion: the typed question in the real composer and its chat bubble (the capture
  says "My PC feels slow"; the script asks "Why is my PC so slow?"), and the hover/press feedback
  plus pointer on the real "Go ahead" button. The approval modal's body line was re-set in place to
  remove a captured text cursor.
- **Captions, headlines, icons, CTA** are all Remotion (`src/one-question/`). The Noah mark appears
  once, on the CTA, from `brand-pack/svg/noah-mark-dark.svg`.
- **Voice**: the opening line is the clip's own lip-synced audio; the rest of the locked script is
  Higgsfield Seed Audio TTS cloned from the same creator's previous series clip
  (`assets-src/one-question/creator-voice-ref.mp3`), split at natural breaths by
  `scripts/build_audio.py`.
- **Music and SFX** are synthesised from scratch in `scripts/build_audio.py` (original, no licence
  needed).

Timing for every beat, caption and sound lives in `src/one-question/timeline.ts`.

### Rebuilding the inputs

```bash
python3 scripts/prepare_ui_assets.py ..            # UI crops from the repo-root captures
python3 scripts/build_audio.py assets-src/one-question   # voice stems, music bed, SFX
```
