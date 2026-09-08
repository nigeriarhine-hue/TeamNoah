# Noah fix video — Mac games stuttering / low FPS

A Remotion project that renders the explainer video for the fix guide at
`onnoah.app/fix/mac-games-stuttering-low-fps`.

- **Master:** 1920×1080, 30 fps, 2130 frames (71 s) — `MacGamesStuttering`
- **Vertical:** 1080×1920, same timeline — `MacGamesStutteringVertical`
- **Surface:** the dark "Lantern" system — night `#0B1024`, cream ink, the mark in
  lit horizon `#C7CBFF`.

## Render

```bash
npm install
npm run render            # 16:9 master → out/
npm run render:vertical   # 9:16
npm run studio            # interactive editor at localhost:3000
```

On a headless box without a Chrome install, point Remotion at one you already have
instead of letting it download (the Chrome-for-Testing bucket is often blocked):

```bash
npx remotion render MacGamesStuttering out/video.mp4 \
  --browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell \
  --concurrency=4
```

## Where the content came from

`onnoah.app` is blocked by this environment's egress policy, so the fix page itself
could not be read. **The script is written from the brand kit plus the standard
causes of frame-pacing problems on macOS — check it against the live page before
publishing.** The four causes, the proposed fix, and the disk-space caution are the
lines most likely to need reconciling with what the guide actually says.

Everything else — structure, voice, colour, type — comes from `../brand-kit.html`.

## Structure

The guide's argument, in the order the brand asks for: symptom → real cause →
approval.

| # | Scene | Frames | Does |
|---|-------|--------|------|
| 1 | `S1Symptom` | 0–160 | The symptom, and the user's own words as a valid bug report |
| 2 | `S2TwoProblems` | 160–540 | Low frame rate vs. stutter, as two frame-time traces |
| 3 | `S3Causes` | 540–1140 | The four causes, each with the thing to actually look at |
| 4 | `S4Approval` | 1140–1770 | What Noah does — ending on the approval gate |
| 5 | `S5Result` | 1770–2130 | The result against the "before" trace, then the close |

Scene lengths live in `src/MacGamesStuttering.tsx`; scenes dissolve into each other
over a constant night ground, so there is no flash between them.

## Brand rules this project is built to

Pulled from `../brand-kit.html`. If you edit the copy, these still hold:

- **Teal confirms, amber cautions.** Neither is decorative, and neither ever appears
  without the words that say what it means.
- **The aurora gradient is only ever the primary action.** In this video it appears
  exactly once, on the Approve button in scene 4. The moment it becomes wallpaper it
  stops meaning anything.
- **Noah is third person.** "Noah will fix it," never "I will fix it."
- **Short declaratives. Name the real thing.** `backupd`, `photoanalysisd`, Rosetta,
  Game Mode — not "some issues were found."
- **Never:** "scan" as the value, "IT", "trial", "free to use", "no subscription",
  hype adjectives, or a number that performs work that isn't happening.
- **The mark:** level waterline, overshooting the disc, no shadow or glow, given room.

The two frame-time charts share one axis in milliseconds so the shapes compare
honestly — no second scale. Each panel carries one series; the "before" and "after"
traces in scene 5 are both direct-labelled, so identity is never colour alone.

## Refitting an existing clip for YouTube Shorts

`ShortsSafe` takes an already-vertical 1080×1920 clip and refits it so a phone
cannot lose any of it. Two different things eat a Shorts frame, and they need
separate room:

- **Hard crop.** Phones taller than 16:9 (19.5:9, 20:9) scale a 9:16 clip up to
  fill the screen height, cropping roughly 10% off each side. Those pixels are
  gone.
- **Occlusion.** The action rail (like / comment / remix / sound) covers the right
  edge; the title, handle, description and scrubber cover the bottom.

The clip is scaled to sit inside the intersection of both, and the freed space is
filled with a blurred, darkened copy of the clip itself — so the padding reads as
deliberate instead of as a letterbox. Audio passes through untouched.

Two presets, in `src/ShortsSafe.tsx`:

| Composition | Picture | Clears |
|---|---|---|
| `ShortsSafeWide` | 860×1529 | the side crop, the action rail, the bottom chrome |
| `ShortsSafe` | 765×1360 | the above plus every last pixel of chrome, at any margin |

`ShortsSafeWideGuides` / `ShortsSafeGuides` render the same layout with YouTube's
chrome drawn over it, for checking the fit at a glance.

```bash
cp your-clip.mp4 public/shorts-source.mp4
npx remotion render ShortsSafeWide out/shorts.mp4 --browser-executable=<chrome>
```

The source clip lives at `public/shorts-source.mp4` and is gitignored — it is an
input, not part of the project. Adjust the margins in `PRESETS` if YouTube's
chrome changes; everything else derives from them.

## Fonts

Plus Jakarta Sans, Instrument Serif and JetBrains Mono are vendored as woff2 into
`public/fonts` (latin + latin-ext) and injected by `src/fonts.ts`, which holds the
render until the faces are rasterisable. A render never touches the network.
