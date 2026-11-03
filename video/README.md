# Noah Shorts (Remotion)

Short-form Noah videos built in React/TypeScript with Remotion. 1080×1920, 30 fps.

## Series: "Can You Diagnose This PC?"

A quiz format: the host shows a PC problem and three possible causes, the viewer gets ~5 seconds
to guess, then Noah checks the PC and reveals the answer.

| Episode | Answer | Output |
|---|---|---|
| 1 | C: Startup apps (9 launch at boot in this scenario) | `out/noah-can-you-diagnose-this-pc-ep1.mp4` |

### Render

```bash
npm install
npm run render:ep1
```

`npm run studio` opens the Remotion editor for live previews.

### Layout

- `src/episodes/ep1.data.ts`: everything specific to the episode (options, answer, evidence,
  startup apps, captions, timings in frames). **A new episode starts by copying this file.**
- `src/episodes/DiagnoseEp1.tsx`: the timeline. Hook (full-frame host) → quiz board + countdown →
  "Got your answer?" → Noah window reveal → end sting.
- `src/components/NoahWindow.tsx`: light-theme recreation of the Noah app result view.
- `src/components/ui.tsx`: series badge, captions, option cards, countdown ring, icons.
- `public/`: brand marks (from `brand-pack/`), fonts, voice-over, host clips, synthesized SFX.

### What made what

- **Remotion** makes every graphic, caption, the countdown, the Noah UI, and the final edit.
- **Higgsfield** makes the human footage only:
  - Host: the recurring East Asian tech creator. Start image is media `6d403b57-8192-463f-bac3-70c775820c75`
    (from generation `db2b511d-4587-4e73-a8a3-fb9c845ba86c`). Don't generate a new identity.
  - Voice: ElevenLabs preset "Dylan" (`b847bc29-f184-583a-8ad9-d1f1e16d1a60`) via `text2speech_v2`.
  - Lip-sync: Seedance 2.0, start image + the VO mp3 as `audio_references`.
- **SFX/music bed**: synthesized locally with ffmpeg (no licensed audio).

### Lip-sync timing note

Seedance tends to re-pace speech a little. Compare the clip's pauses with the VO
(`ffmpeg -i clip.mp4 -af silencedetect=n=-32dB:d=0.06 -f null -`) and set `hostRateA` / `hostRateB`
in the episode data so the mouth lines up with the voice-over track. The clips are muted; the VO
files are the audio source.
