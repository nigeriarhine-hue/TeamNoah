# PC CHECK 101 · "Why Is My PC Slow? 5 Things to Check First"

Educational tech short for Noah's YouTube Shorts / TikTok. Built with Remotion +
React/TypeScript. **1080×1920 · 9:16 · 30 fps · 53.9 s · H.264 + AAC · −15.7 LUFS**

| Output | Path |
| --- | --- |
| Video | `out/noah-why-is-my-pc-slow.mp4` |
| Thumbnail | `out/noah-why-is-my-pc-slow-thumbnail.png` |

## Render

```bash
cd videos/why-is-my-pc-slow
npm install
export REMOTION_BROWSER_EXECUTABLE=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell

npx remotion render WhyIsMyPcSlow ../../out/noah-why-is-my-pc-slow.mp4 --codec=h264 --crf=17
npx remotion still  Thumbnail     ../../out/noah-why-is-my-pc-slow-thumbnail.png
```

Spot-check frames without a full render: `node scripts/preview-frames.mjs <dir> 2.5 12 40`.

## Structure (≈76% teaching, ≈24% product)

Every boundary is computed from the measured voice-over (`src/timeline.json`).

| Time | Scene | On screen |
| --- | --- | --- |
| 0:00–0:05.7 | Hook | Illustrated slow PC (app stuck loading, CPU pegged). `WHY IS YOUR PC / SO SLOW?`, "Deleting random files" struck out, `5 THINGS TO CHECK FIRST` and the five chapter icons |
| 0:05.7–0:14 | 01 Startup apps | `WINDOWS STARTS → five apps launching` with load bars, then `TOO MUCH AT ONCE.` |
| 0:14–0:19.7 | 02 Background apps | "On your screen: just your browser" vs. "Still running in the background" with live CPU/memory, then `NOT OPEN / DOESN'T ALWAYS MEAN / NOT RUNNING.` |
| 0:19.7–0:25.8 | 03 Free storage | C: gauge fills to 93%, `WHAT'S USING YOUR STORAGE?`, breakdown of Apps / Downloads / Old installers / Temporary files, and "Review it first, not everything should go." |
| 0:25.8–0:32.8 | 04 CPU + memory | Live CPU graph and memory meter, a process table where one process climbs to the top, "A quick spike is normal…", then `LOOK FOR THE OUTLIER.` |
| 0:32.8–0:40.6 | 05 One app or whole PC? | Split diagnostic: ONE APP → *Troubleshoot that app*; WHOLE PC → *Investigate the system* (links back to 01–04) |
| 0:40.6–0:43 | Bridge | `DON'T WANT TO / CHECK ALL 5 / MANUALLY?` over the five-item checklist. **This is the first time Noah appears.** |
| 0:43–0:46 | Noah checks | Real UI: "My PC feels slow" plus live diagnostics, then Noah's own step list. Steps are tagged with the chapter numbers 04, 01 and 03. `WHAT NOAH CHECKED` result tiles are tagged 01, 03 and 02 |
| 0:46–0:49.5 | Plan + approval | `WHAT NOAH WOULD DO` (real plan), `YOU SEE THE PLAN.`, then the real *Can Noah do this?* modal, cursor → Go ahead, `YOU DECIDE.` |
| 0:49.5–0:53.9 | End card | Noah mark (its only branded use), `FREE PC CHECK`, *See what's slowing your PC.*, `onnoah.app`, *Describe it. Approve it. Done.* |

## Script

Locked and used verbatim. `scripts/build-audio.py` splits it only at its own
punctuation and asserts that the segments rejoin to the exact script. A Whisper
pass over the final mix transcribes it back word for word.

## Voice

**Kokoro-82M** (`kokoro-onnx`), run locally. Higgsfield was not used. The voice
blends `am_michael` (0.55, warm and clear) with `am_puck` (0.45, younger and
livelier) at 1.06× speed. The product lines use the same voice and speed as the
lesson, so the delivery doesn't change into an announcer read at the end.
"onnoah.app" is spoken as "on Noah dot app".

```bash
pip install kokoro-onnx soundfile numpy faster-whisper
mkdir -p /tmp/voices && cd /tmp/voices
curl -LO https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/kokoro-v1.0.onnx
curl -LO https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/voices-v1.0.bin
cd - && python3 scripts/build-audio.py   # → public/audio/mix.wav + src/timeline.json
```

## Sound

Everything is synthesized in `build-audio.py` with numpy, so there is nothing to
license:

- **Music:** a calm 96 BPM bed (Fmaj9–Am7–Dm9–Bbmaj7 pad, a soft pluck
  arpeggio, a light kick and shaker). It ducks under the voice.
- **Effects:** a soft whoosh on each chapter change, a blip when each number
  lands, ticks as apps launch, blips for resources and graph sweeps, storage
  fill ticks, a cursor click and a two-note chime on approval. There are no
  arcade or explosion sounds.

## Assets reused

- **No on-screen character.** The video and thumbnail use illustrations and real UI only.
- **Noah UI:** the real product screenshots `IMG_0585`, `0586`, `0588` and
  `0593` from the repo root, upscaled 2× with Lanczos into `public/noah-ui/`.
  Nothing in the UI
  is redrawn. The camera moves over the screenshots, and rings and chapter
  badges are laid on top.
- **Noah mark:** geometry from `brand-pack/svg/noah-mark-*.svg`, unmodified.
  It appears as a logo only on the end card. The screenshots show the app's own
  title bar.
- **Figtree:** local woff2 files, the same typeface the product uses.

## Product claims (all from the real screenshots)

Noah inspects the PC (diagnostics, processes, startup programs, disk space). It
explains what it found (the *Situation* text and *What Noah checked* tiles). It
shows *What Noah would do*, and it asks *Can Noah do this?* before it acts. The
video doesn't claim a memory tile, because the real interface doesn't show one;
the CPU / system-load link goes through Noah's own "Listing processes" step.

## Reusable series kit: `src/edu/`

| File | What it gives you |
| --- | --- |
| `theme.ts` | PC CHECK 101 tokens: light "publication" surfaces, ink, accent gradient, phone safe area |
| `motion.ts` | `ramp`, `pop`, `inOut`, `lerp`: second-based easing helpers |
| `Series.tsx` | `SeriesTag` (small editorial identifier), `ChapterRail` (01–05 progress), `ChapterHeader` (gradient numeral + icon + title) |
| `TipLayout.tsx` | A full numbered-chapter layout. You supply `n`, `title`, `icon` and a diagram |
| `Kinetic.tsx` | `KineticLines` (masked line reveals), `Takeaway` (end-of-chapter lesson stamp), `Label` |
| `SlowPC.tsx` | Animated monitor illustration: an app stuck loading, busy cursor, pegged CPU meter |
| `Captions.tsx` | Phrase captions. The words always come from the script and the timing from the VO |
| `Stage.tsx` | Light or dark stage with a blueprint grid, drifting glow and camera push, plus a diagram `Card` |
| `icons.tsx` | Generic line icons (startup, layers, drive, chip, split, …) and app glyphs. No vendor logos |

`src/noah/Shot.tsx` is a camera for real screenshots. You give it rectangles in
original screenshot pixels, and `toView` maps points so annotations follow the
zoom.

To make a new episode: write the script into `SEGMENTS` in `build-audio.py`,
rebuild the audio, update `SCENES` in `src/timeline.ts`, and write one diagram
per chapter inside `<TipLayout>`.
