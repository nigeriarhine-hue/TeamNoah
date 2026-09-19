# Asset manifest — which real Noah capture appears in each scene

Every Noah surface in the film is a region of a real screen capture. Nothing is
a mock-up, and no UI label has been re-typed or re-drawn. This file records the
provenance of each frame so the claims in the ad can be checked against source.

## Source captures

Eleven screenshots of one continuous Noah session on Windows, captured
2026-09-12, living at the repository root:

| File | What it shows |
|---|---|
| `IMG_0583.jpeg` | User message "My PC feels slow"; Noah replies "Looking into it…" |
| `IMG_0584.jpeg` | Checks running: Searching knowledge ✓, Running diagnostics |
| `IMG_0585.jpeg` | Four checks done, Checking disk space in progress |
| `IMG_0586.jpeg` | Disk-consumer checks done, "Thinking…" |
| `IMG_0587.jpeg` | All checks done, "Thinking… 5s" |
| `IMG_0588.jpeg` | The plan: SITUATION, WHAT NOAH CHECKED, WHAT NOAH WOULD DO, action button |
| `IMG_0591.jpeg` | Same screen, pointer hovering the action button |
| `IMG_0592.jpeg` | The plan changed in words instead: "stop teams from auto starting and clear temp files" |
| `IMG_0593.jpeg` | Permission dialog: "Can Noah do this? / Noah needs your OK to continue." |
| `IMG_0594.jpeg` | Button now "✓ Sent"; "Approved: Action approved"; execution starts |
| `IMG_0595.jpeg` | RESULT "Done.", with the same measurements taken again |

`Photos-1-001 (5)/` holds duplicates of 0587, 0591 and 0594 and is unused.

Brand files come from `brand-pack/` — the shipped Noah mark and app icon, used
as vector SVG and never re-drawn, recoloured or stretched.

## Scene → asset map

| Time | Scene | Real Noah asset on screen | Source |
|---|---|---|---|
| 0.00–4.40 | Hook | none — typography and an abstract wait spinner | — |
| 4.40–8.30 | The old way | none — anonymous browser windows, no real site depicted | — |
| 8.30–10.80 | Enter Noah | app icon; `crop-bubble`; `card-listening` | brand-pack, IMG_0583 |
| 10.80–13.60 | Investigation | `card-listening` → `card-checks-2` → `card-checks-4` → `card-thinking` → `card-thinking-5s` | IMG_0583–0587 |
| 13.60–16.50 | The real cause | `crop-situation`; `tile-startup`, `tile-background`, `tile-disk`, `tile-installers` | IMG_0588 |
| 16.50–21.20 | The trust moment | `plan-item-1…4`; `crop-cta-hover`; `crop-talk-note`; `crop-typed`; `crop-dialog`; `crop-sent` | IMG_0588, 0591, 0592, 0593, 0594 |
| 21.20–24.00 | Execution | `tile-startup` + `tile-background`; `crop-situation`; `crop-dialog`; `crop-executing` | IMG_0588, 0593, 0594 |
| 24.00–26.70 | Verification | `crop-done`; `res-startup`, `res-temp`, `res-boot` | IMG_0595 |
| 26.70–31.40 | Brand and CTA | Noah mark (SVG) | brand-pack |

## Processed crops

Produced by `scripts/process-assets.mjs`: vertical auto-alignment against a
group anchor, non-destructive crop, 2–3× Lanczos upscale (4× for small element
crops) so the compositor always downsamples, then restrained unsharp and a
slight contrast lift. Regions are in source-image pixels.

| Asset | Source | Crop region (x,y w×h) | Output |
|---|---|---|---|
| `app-full-plan` | IMG_0588.jpeg | 0,0 1170x966 | 2340x1932 |
| `app-full-dialog` | IMG_0593.jpeg | 0,0 1170x966 | 2340x1932 |
| `app-full-result` | IMG_0595.jpeg | 0,0 1170x966 | 2340x1932 |
| `pane-listening` | IMG_0583.jpeg | 331,36 839x936 | 1678x1872 |
| `pane-checks-2` | IMG_0584.jpeg | 331,31 839x936 | 1678x1872 |
| `pane-checks-4` | IMG_0585.jpeg | 331,37 839x936 | 1678x1872 |
| `pane-thinking` | IMG_0586.jpeg | 331,33 839x936 | 1678x1872 |
| `pane-thinking-5s` | IMG_0587.jpeg | 331,34 839x936 | 1678x1872 |
| `pane-plan` | IMG_0588.jpeg | 331,30 839x936 | 1678x1872 |
| `pane-plan-hover` | IMG_0591.jpeg | 331,30 839x936 | 1678x1872 |
| `pane-plan-typed` | IMG_0592.jpeg | 331,33 839x936 | 1678x1872 |
| `pane-sent` | IMG_0594.jpeg | 331,31 839x936 | 1678x1872 |
| `pane-result` | IMG_0595.jpeg | 331,30 839x936 | 1678x1872 |
| `crop-situation` | IMG_0588.jpeg | 378,108 762x168 | 2286x504 |
| `crop-checked` | IMG_0588.jpeg | 386,280 744x162 | 2232x486 |
| `crop-plan-list` | IMG_0588.jpeg | 386,452 744x294 | 2232x882 |
| `crop-cta` | IMG_0588.jpeg | 386,757 728x70 | 2184x210 |
| `crop-talk-note` | IMG_0588.jpeg | 400,932 712x40 | 2136x120 |
| `crop-cta-hover` | IMG_0591.jpeg | 386,760 728x70 | 2184x210 |
| `crop-typed` | IMG_0592.jpeg | 378,871 756x72 | 2268x216 |
| `crop-dialog` | IMG_0593.jpeg | 330,375 514x270 | 1542x810 |
| `crop-sent` | IMG_0594.jpeg | 386,506 728x62 | 2184x186 |
| `crop-executing` | IMG_0594.jpeg | 378,796 756x108 | 2268x324 |
| `crop-done` | IMG_0595.jpeg | 386,318 744x168 | 2232x504 |
| `crop-verify` | IMG_0595.jpeg | 386,534 744x88 | 2232x264 |
| `card-listening` | IMG_0583.jpeg | 370,46 772x370 | 2316x1110 |
| `card-checks-2` | IMG_0584.jpeg | 370,41 772x370 | 2316x1110 |
| `card-checks-4` | IMG_0585.jpeg | 370,47 772x370 | 2316x1110 |
| `card-thinking` | IMG_0586.jpeg | 370,43 772x370 | 2316x1110 |
| `card-thinking-5s` | IMG_0587.jpeg | 370,44 772x370 | 2316x1110 |
| `crop-bubble` | IMG_0583.jpeg | 918,56 228x70 | 912x280 |
| `crop-looking` | IMG_0583.jpeg | 372,161 768x76 | 2304x228 |
| `tile-startup` | IMG_0588.jpeg | 400,316 178x120 | 712x480 |
| `tile-disk` | IMG_0588.jpeg | 578,316 178x120 | 712x480 |
| `tile-installers` | IMG_0588.jpeg | 756,316 178x120 | 712x480 |
| `tile-background` | IMG_0588.jpeg | 934,316 186x120 | 744x480 |
| `plan-item-1` | IMG_0588.jpeg | 398,500 480x62 | 1920x248 |
| `plan-item-2` | IMG_0588.jpeg | 398,565 480x62 | 1920x248 |
| `plan-item-3` | IMG_0588.jpeg | 398,630 480x62 | 1920x248 |
| `plan-item-4` | IMG_0588.jpeg | 398,695 480x62 | 1920x248 |
| `res-startup` | IMG_0595.jpeg | 399,545 186x66 | 744x264 |
| `res-temp` | IMG_0595.jpeg | 648,545 190x66 | 760x264 |
| `res-boot` | IMG_0595.jpeg | 881,545 200x66 | 800x264 |
| `crop-done-word` | IMG_0595.jpeg | 395,352 300x52 | 1200x208 |

## Placeholders and things to note before publishing

- **Score and SFX are original, generated material** (`scripts/build-audio.mjs`)
  — royalty-free, no third-party rights. Swap in a supplied track by replacing
  `public/audio/noah-score.wav`; the cue times are listed in `TIMING.md`.
- **The browser windows in the "old way" montage are generic.** No real site,
  logo or forum is depicted, so no third party appears to endorse Noah.
- **The wait spinner in the opening is an abstract symbol**, not any operating
  system's UI.
- Everything else on screen is a real Noah capture.
