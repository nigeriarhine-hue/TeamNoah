# Noah Shorts (Remotion)

Short-form Noah videos built in React/TypeScript with Remotion. 1080×1920, 30 fps.

## Series: "Can You Diagnose This PC?"

A quiz format: the host shows a PC problem and three possible causes, the viewer gets ~5 seconds
to guess, then Noah checks the PC and reveals the answer.

| Episode | Case | Answer | Output |
|---|---|---|---|
| 1 | Windows 11 PC, 16 GB RAM, 512 GB SSD — slow every time it starts | C: Startup apps (9 launching at startup in this scenario) | `out/noah-can-you-diagnose-this-pc-ep1.mp4`, `out/noah-can-you-diagnose-this-pc-ep1-thumbnail.png` |

### Render

```bash
npm install
npm run vo:ep1      # only when VO lines change: rebuilds public/vo/vo_full.wav + lip-sync tracks
npm run render:ep1  # video (Remotion render + loudness master to -14 LUFS)
npm run thumb:ep1   # 9:16 thumbnail
```

`npm run studio` opens the Remotion editor for live previews.

### Layout

- `src/series/types.ts`: the episode data shape (case, PC specs, symptom, options, evidence, answer, timings).
- `src/episodes/ep1.data.ts`: Episode 1's data. **A new episode starts by copying this file.**
- `src/series/DiagnoseEpisode.tsx`: the series timeline, driven entirely by episode data:
  symptom hook on the real PC ("THIS PC" tag + big symptom text) → "CAN YOU DIAGNOSE IT?" →
  case file (PC + specs + symptom) with A/B/C and countdown → "Got your answer?" (A/B/C pulse) →
  Noah checks each option on this PC → "The answer" + why → "Did you get it right? Comment A, B or C".
- `src/series/Thumbnail.tsx`: 9:16 thumbnail (host + the actual PC + question + A/B/C, never the answer).
- `src/components/PcGraphics.tsx`: drawn Windows 11-style PC (generic, no logos), case-file panel, generic app icons.
- `src/components/NoahWindow.tsx`: light-theme Noah result view with per-option evidence cards.
- `src/components/ui.tsx`: series badge, captions, option cards, countdown ring, icons.
- `tools/build_vo.py`: trims, speeds up and places the TTS lines into one VO track and writes `public/vo/timing.json`.
- `public/`: brand marks (from `brand-pack/`), fonts, VO, host clips, synthesized SFX.

### What made what

- **Remotion** makes every graphic, caption, the countdown, the Noah UI, and the final edit.
- **Higgsfield** makes the human footage only:
  - Host: the recurring East Asian tech creator. Original start image: media `6d403b57-8192-463f-bac3-70c775820c75`
    (from generation `db2b511d-4587-4e73-a8a3-fb9c845ba86c`). Episode 1 v2 uses a minimal edit of it with a
    plain matte-black tower (image job `669dd329-da6f-4afe-919d-c4b3326aa3ef`). Don't generate a new identity.
  - Voice: ElevenLabs preset "Dylan" (`b847bc29-f184-583a-8ad9-d1f1e16d1a60`) via `text2speech_v2`.
  - Lip-sync: Seedance 2.0, start image + the VO mp3 as `audio_references`.
- **SFX/music bed**: synthesized locally with ffmpeg (no licensed audio).

### Lip-sync timing note

Seedance tends to re-pace speech a little, and not always evenly. Compare the clip's pauses with the
lip-sync track (`ffmpeg -i clip.mp4 -af silencedetect=n=-32dB:d=0.06 -f null -`) and set
`hostSegmentsA` / `hostSegmentsB` in the episode data: each segment maps a stretch of the timeline to
a start point and playback rate in the clip. Put segment boundaries inside pauses. The clips are muted;
`public/vo/vo_full.wav` is the audio source.
