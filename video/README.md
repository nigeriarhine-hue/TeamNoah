# Noah gaming ad — "Is Your Gaming PC Ready for the Next Big Game?"

Remotion (React/TypeScript) motion ad. 1920×1080, 30 fps, 46 s.
Output: `out/noah-gaming-pc-ready.mp4`

```bash
npm install
npm run studio        # live preview
npm run render        # -> out/noah-gaming-pc-ready.mp4
```
In a sandbox without Remotion's Chrome download, pass a local Chromium:
`npx remotion render src/index.ts NoahGamingPCReady out/noah-gaming-pc-ready.mp4 --codec=h264 --crf=18 --timeout=120000 --browser-executable=/path/to/chrome`

## Structure
- `src/timeline.ts` – scene boundaries + voiceover placement (single source of truth)
- `src/NoahGamingAd.tsx` – master timeline (scene cross-dissolves, VO, sound)
- `src/scenes/` – character scenes (1, 2, 12, 13, 15), issues (3), CTA (14)
- `src/noah/` – light Noah UI: window shell + screens for scenes 4–11 (one continuous window)
- `src/components/` – KineticText, GamerCharacterScene (2.5D parallax), MetricCard, CursorClick, FocusZoom, SafeArea, Audio
- `public/` – gamer still + cut-out, brand marks, bundled Plus Jakarta Sans, VO + SFX
- `scripts/` – regenerate voiceover (Kokoro TTS), procedural SFX/music (numpy), cut-out + clean plate, and lip-sync patches (Wav2Lip)

## Lip sync
The gamer speaks on camera in scenes 1, 2, 13 and 15. Wav2Lip (run locally, CPU) generates the mouth
motion from each VO clip; only a feathered mouth/jaw patch (`public/lipsync/*.mp4`) is overlaid on the
cut-out layer, so the eyes and hair stay at full source sharpness and the patch follows every camera move.

## Script & timestamps
| Time | Scene | Voiceover |
|---|---|---|
| 0:00.3 | 1 Opening hook | The next big games, like Grand Theft Auto 6 and Call of Duty, are coming. |
| 0:05.2 | 2 The question | But is your PC actually ready? |
| 0:07.3 | 3 Common issues | Slow startup, background activity, low storage, and extra system load can all affect your gaming experience before you even start playing. |
| 0:16.4 | 4 Tell Noah | Instead of guessing, tell Noah what's happening. |
| 0:19.2 | 5 Noah checks | Noah checks your PC, |
| 0:20.9 | 6 Diagnosis | explains what it finds, |
| 0:22.7 | 7 What Noah checked | (music + UI ticks) |
| 0:25.1 | 8 The plan | shows you what it recommends, |
| 0:27.2 | 9 Approval | and nothing changes until you approve it. |
| 0:30.3 | 10 Taking action | Then Noah gets to work, |
| 0:32.3 | 11 Results | and shows you what changed. |
| 0:35.0 | 12 Gamer reaction | (music) |
| 0:36.4 | 13 Back to gaming | So before your next big download, check your PC first. |
| 0:40.3 | 14 CTA | Free PC Check. |
| 0:41.6 | 14→15 CTA / end | Download Noah, and try it today at onnoah.app. |
