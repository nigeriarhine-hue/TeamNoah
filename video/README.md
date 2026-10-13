# Noah technology-content videos (Remotion)

Current composition: **What Actually Happens When Noah Checks Your PC?**: 1080×1920, 30 fps, 45 s.

## Commands

```bash
npm install
npm run audio      # regenerate SFX + music bed (scripts/make-audio.py, deterministic)
npm run studio     # preview
npm run render     # → ../out/noah-what-happens-when-noah-checks-pc.mp4 (loudness-normalised to -14 LUFS)
npm run thumb      # → ../out/noah-what-happens-thumbnail.png, ../out/noah-what-happens-thumbnail-16x9.png
```

In the cloud container, add `--browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell` to the `remotion` commands.

## Assets

| Path | Source |
|---|---|
| `public/host/host-reference-ram-video.png` | The recurring host. It's the exact start image used for the RAM video (Higgsfield image job `db2b511d…`, uploaded as media `6d403b57…`) |
| `public/host/host-open.mp4`, `host-close.mp4` | Seedance 2.0 image-to-video from that same start image, lip-synced to `public/audio/vo/hostA/B-audio.mp3` |
| `public/audio/vo/*` | Higgsfield text2speech_v2 / ElevenLabs, preset voice **Dylan** (`b847bc29-f184-583a-8ad9-d1f1e16d1a60`), the same voice as the RAM video |
| `public/brand/*`, `public/fonts/*` | `../brand-pack` and the fonts embedded in `../brand-kit.html` |
| UI copy | Taken word for word from the real Noah screenshots `../IMG_0583–0595.jpeg` |

## Reusable components (`src/components`)

`NoahWorkflowStep`, `EnhancedLightNoahScreen` (+ `UserBubble`, `Eyebrow`, `AuroraCard`), `NoahProgressCard`,
`NoahDiagnosticCard`, `NoahPlanCard`, `NoahApprovalFocus` (`NoahApprovalModal`, `SpotlightDim`), `NoahResultState`,
`WorkflowTimeline`, `TechHostScene`, `CaptionTrack`, `ShortsSafeArea`, `Cursor`, `NoahLogo`, `Icons`.

All timing lives in `src/timeline.ts` (scenes, VO cues, captions, SFX).
