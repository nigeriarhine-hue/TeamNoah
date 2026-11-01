# Noah edu series — "Why Restarting Your PC Helps — And Why It Doesn't Fix Everything"

## Outputs
- `out/noah-why-restarting-your-pc-helps.mp4` — 1080x1920, 30 fps, 40.0 s, H.264/AAC, −15.6 LUFS
- `out/noah-restarting-pc-thumbnail.png` — 1080x1920 Shorts thumbnail
- `out/noah-restarting-pc-thumbnail-16x9.png` — 1280x720 YouTube thumbnail

## Recurring host (new character)
- Reference image: `public/characters/tech-host-ethan-reference.png` (Higgsfield `gpt_image_2_5`, 9:16).
  Reuse this exact file for every future clip of this host.
- Clips: Higgsfield **Intone** (lip-sync image-to-video), 1080p, 9:16, same reference image passed as
  both the character and the location reference, audio = slices of the final VO.
  - `public/video/host-a.mp4` (opening line) / `host-b.mp4` ("So if you keep restarting…")
  - `*-sync.mp4`: retimed to the final VO with `scripts/sync_host_clip.py` (Intone slows speech ~5–10%).

## Voice
Higgsfield `seed_audio`, preset voice "Mark" (male), speech_rate +6. Pauses tightened and +5% tempo with
`scripts/build_voiceover.py`, which also writes phrase timings to `src/restart/voTimings.json` (captions + scene timing).

## Music & SFX
All synthesized locally by `scripts/build_audio.py` (no samples, no licensing).

## Noah UI source of truth
Root screenshots IMG_0583–0595 (Windows Noah app). All labels, findings, plan items and approval text are
transcribed in `src/components/noahScreenData.ts`. The light UI is a vertical, enlarged recreation of those screens.

## Render
```bash
npm install
export REMOTION_BROWSER=/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell
npx remotion render src/index.ts WhyRestartingHelps out/noah-why-restarting-your-pc-helps.mp4 --browser-executable=$REMOTION_BROWSER --concurrency=4
npx remotion still src/index.ts RestartThumbnail out/noah-restarting-pc-thumbnail.png --browser-executable=$REMOTION_BROWSER
npx remotion still src/index.ts RestartThumbnail16x9 out/noah-restarting-pc-thumbnail-16x9.png --browser-executable=$REMOTION_BROWSER
```
(On a normal machine, drop `--browser-executable`; Remotion downloads its own browser.)

## Reusable components (`src/components/`)
RestartLoop, EducationalSection (+PageBackground), TechExplainerCard, RecurringProblemDiagram, TechHostScene,
EnhancedLightNoahScreen, NoahDiagnosticFocus, NoahApprovalFocus, KineticHeadline (+Eyebrow), CaptionTrack,
ShortsSafeArea, EducationalCTA, Icons.
