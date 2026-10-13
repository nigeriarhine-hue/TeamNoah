# Noah tech-content videos (Remotion)

Educational Shorts/TikTok series. All typography, captions, UI animation and
final assembly are done here in Remotion; Higgsfield is used for the human
creator footage only.

## Video 3 — "Before You Buy More RAM… Check This First"

| Output | Command (run from `video/`) |
|---|---|
| `out/noah-before-you-buy-more-ram.mp4` | `npx remotion render BeforeYouBuyMoreRam ../out/noah-before-you-buy-more-ram.mp4 --codec=h264 --crf=16 --audio-bitrate=320k` |
| `out/noah-before-you-buy-more-ram-thumbnail.png` | `npx remotion still RamThumbnail ../out/noah-before-you-buy-more-ram-thumbnail.png` |
| `out/noah-before-you-buy-more-ram-thumbnail-16x9.png` | `npx remotion still RamThumbnail16x9 ../out/noah-before-you-buy-more-ram-thumbnail-16x9.png` |

1080x1920, 30 fps, 37.5 s. Preview with `npx remotion studio`.

### Assets
- `public/characters/tech-host-asian-male-reference.png` — identity reference for the recurring
  tech host (Higgsfield `gpt_image_2_5`). Use it as the start image for every future clip.
- `public/characters/tech-host-asian-male-cutout.png` — background-removed version for thumbnails.
- `public/host/host-clip-raw.mp4` — single Higgsfield `seedance_2_0` image-to-video clip (10 s).
  `scripts/retime_host.py` cuts it into `host-hook/clarify/transition.mp4`, retimed so lip
  movement matches the narration.
- `public/audio/vo.wav` — narration (ElevenLabs via Higgsfield TTS, voice "Dylan"), tightened from
  `vo-take1.mp3` (pauses trimmed, 1.22x tempo).
- `public/audio/music-bed.wav`, `sfx-*.wav` — procedurally synthesised by `scripts/make_audio.py`.
- `public/noah-ui/` — genuine Noah app screenshots; `public/brand/` — official Noah marks.
- `public/fonts/` — Inter (SIL OFL), bundled so renders don't need network fonts.

## Reusable components (`src/tech/`)
`TechHostScene`, `EducationalNumber`, `TechExplainerCard`, `KineticHeadline`, `MemoryGauge`,
`ResourceCard`, `AppVsSystem`, `NoahUIFocus`, `ApprovalModalFocus`, `EducationalCTA`,
`ShortsSafeArea`, `CaptionTrack`, `RamStick`, `icons`, plus design tokens in `theme.ts`.
