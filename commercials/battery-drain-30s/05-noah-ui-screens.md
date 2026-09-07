# Noah interface screens — build these outside Runway

## Why none of this is generated

AI video models cannot hold legible type. They will produce something that *looks* like an
interface at a glance and dissolves into nonsense letterforms the moment anyone pauses — and this
film asks the audience to *read* the screen four times, at length, as its central argument. A
garbled approval dialog doesn't just look cheap; it destroys the one claim the spot is making.

There is also a brand reason. `brand-kit.html` bans **"invented UI"** and **"fake metrics"**
outright, in the same list as neon and matrix rain. A generated interface is invented UI by
definition.

**So: Runway generates the physical screen — glow, glass, pixel texture, lamp reflection, focus
falloff, the bezel and the room around it. The interface is built here and screen-replaced.** This
is how real technology commercials have always done it, and it is faster than fighting the model.

---

## The built asset

**[`ui/noah-ui-screens.html`](ui/noah-ui-screens.html)** contains all eleven screens, built to the
real Aurora dark ("Lantern") tokens from `brand-kit.html`, with **Instrument Serif and Plus
Jakarta Sans embedded as base64** — extracted from the brand kit itself, so there is no network
call and no font-fallback risk on a capture machine.

Open it in a browser. Each screen has a **1:1** button that isolates it at exact pixel size for
capture, and a **Play** button that restarts its animation.

Instrument Serif is embedded but deliberately unused: `brand-kit.html` restricts it to the accent
voice and forbids it as a headline, and none of these screens call for an accent line. It is in the
file so that anyone adding one later gets the real face rather than a Georgia fallback.

| Screen | Clip | Canvas | Animated? |
|---|---|---|---|
| UI-01 battery cluster, plugged, 41% → 38% | 02 | 1200 × 300 | rack-cut, not a tick |
| UI-02 battery cluster, on battery, 34% → 29% | 05 | 1200 × 300 | rack-cut |
| UI-03 phone stopwatch `00:15:12` | 06 | 1179 × 2556 | hundredths run |
| UI-04 composer — her sentence | 08 | 2560 × 1600 | types in, caret, send |
| UI-05 measuring — named checks | 10 | 2560 × 1600 | checks tick through |
| UI-06 the finding | 12 | 2560 × 1600 | mono line reveals last |
| UI-07 the proposal + APPROVE / Not now | 13 | 2560 × 1600 | **static by design** |
| UI-08 Noah acting + Undo | 16 | 2560 × 1600 | two confirms, then Done. |
| UI-09 before / after | 18 | 2560 × 1600 | AFTER values count in |
| UI-10 end card | 21 | 3840 × 2160 | fades, built in AE |
| UI-11 resting desktop, 29%, still | 20 | 2560 × 1600 | **nothing moves** |

2560 × 1600 is 16:10 — a MacBook's aspect — so the screens map onto the laptop in the plate
without distortion. The two cluster screens are oversized on purpose: clips 02 and 05 are extreme
macro, so the menu bar fills the frame and needs far more resolution than a full desktop capture
can give it.

---

## Capture

**Stills** — for the screens that don't need to animate, or as a fallback:
open the file, click **1:1**, and screenshot at 2× device pixel ratio. On macOS,
`Cmd-Shift-4`, `Space`, click the screen. You want a PNG with no compression.

**Motion** — the honest way, and the fastest:

```
# 60fps lossless screen capture of a browser window
ffmpeg -f avfoundation -framerate 60 -i "1:none" -c:v libx264 -crf 0 -preset ultrafast ui-05.mov
```

Or drive it headlessly, which is repeatable and what I'd recommend for anything you'll iterate on:

```
npx playwright screenshot --viewport-size=2560,1600 --wait-for-timeout=3000 \
  "file://$PWD/ui/noah-ui-screens.html?only=ui-05" ui-05.png
```

The page reads an `?only=<id>` query parameter and renders that screen alone, full-bleed, with no
chrome — built for exactly this.

**If you want frame-exact control**, rebuild UI-04 through UI-09 in Remotion. The HTML is already
React-shaped: tokens at the top, one component per screen. Remotion gives you deterministic frame
numbers, which matters because these screens have to hit marks like "the mono line reveals on
frame 24 of clip 12." A screen recording will get you within a few frames; Remotion gets you
exact. For a first cut, the recording is fine.

**Do not rebuild these in Figma** and export flats. You lose the animation and gain nothing — the
HTML is already the design.

---

## Compositing into the plates

1. **Track the plate.** Mocha Pro planar track on the screen's four corners, or AE's built-in
   3D camera tracker for the wider shots. The macro shots (02, 05) barely move; a two-point track
   is enough.
2. **Corner-pin the UI** onto the tracked surface.
3. **Match the optics — this is the whole job.** A UI layer pasted flat onto a plate reads as
   fake instantly. In order:
   - **Defocus to match.** The plate has real shallow DOF; the UI must inherit it. Use the plate's
     own blur as reference, and remember that in clips 12/18 the focus *changes* during the shot,
     so the UI's blur has to animate with it.
   - **Screen glow spills onto the room.** Sample the UI's own luminance and drive a soft glow
     that touches the bezel and the desk. This is what sells it more than anything else.
   - **Add the reflection back on top.** The lamp reflection in the plate belongs *in front of*
     the UI. Duplicate the plate, isolate the reflection, and lay it over the comped UI at screen
     blend, ~20%.
   - **Grain last.** Match the plate's grain over the whole comp, never under the UI only.
   - **Slight chromatic aberration** at the frame edges, matched to the plate.
4. **Never let the UI be brighter than the plate's screen.** If it is, it reads as a sticker. Pull
   exposure until it sits.

---

## Copy rules for anyone editing these screens

The interface is where brand voice is easiest to break, so:

- **Noah is third person, always.** "Noah found the actual cause," never "I found." This is the
  one correction the brief needed most — see `00-brand-notes` §2.
- **Short declaratives.** `brand-kit.html`: *"If a sentence needs a comma to survive, it needs a
  period instead."*
- **Name the real thing.** `NorthwindSyncHelper`, `PID 40218`, the actual `~/Library/LaunchAgents`
  path. Vagueness is what the scam category sounds like; specificity is the trust signal.
- **Machine voice is mono.** Process names, PIDs, paths, counts. Sentences are Jakarta.
- **The aurora gradient appears exactly once** — the APPROVE button in UI-07. Not on the send
  control, not on the check marks, not on a heading, not on the wallpaper.
- **Teal only confirms. Amber only cautions.** Neither is ever decorative.
- **Never** the word *scan*, never *IT*, never a count of "issues found," never a progress bar
  standing in for work.
- Nothing on screen is invented: every metric is one a Mac actually reports.

---

## What to hand the compositor

```
ui/
  ui-01-battery-plugged.png          1200×300  @2x
  ui-02-battery-onbattery.png        1200×300  @2x
  ui-03-stopwatch.mov                1179×2556 ProRes 4444
  ui-04-composer.mov                 2560×1600 ProRes 4444
  ui-05-measuring.mov                2560×1600 ProRes 4444
  ui-06-finding.mov                  2560×1600 ProRes 4444
  ui-07-proposal.png                 2560×1600 @2x   (static — do not animate)
  ui-08-acting.mov                   2560×1600 ProRes 4444
  ui-09-before-after.mov             2560×1600 ProRes 4444
  ui-10-endcard/                     AE project, 3840×2160
  ui-11-resting-desktop.png          2560×1600 @2x   (static — do not animate)
```

ProRes 4444 rather than 422 because several screens want an alpha channel for the glow passes.
