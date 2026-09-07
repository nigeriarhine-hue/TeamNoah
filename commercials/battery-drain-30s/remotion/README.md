# Noah interface screens — Remotion

Frame-exact React renders of the eleven Noah interface screens for the "Fifteen Minutes" spot,
plus a timing animatic of the whole 34-second film.

**Why Remotion and not the HTML file.** Both exist and both are useful:

| | `../ui/noah-ui-screens.html` | this project |
|---|---|---|
| Open it | double-click, any browser, no toolchain | `npm i && npm run dev` |
| Good for | art direction, client look-see, quick stills | **the actual deliverables** |
| Timing | screen recording, a few frames of drift | deterministic, frame-exact |
| Output | screenshots | ProRes 4444, PNG sequences, MP4 |

Animation here lands on the frame it is supposed to land on, every render, which matters because
these screens have to hit marks like *"the mono readout reveals on frame 8 of clip 12."* A screen
recording gets you close; this gets you exact.

Both read the same copy and the same brand tokens, so they cannot drift on content — but if you
change a string, change it in `src/copy.ts`, in the HTML, and in `../04-onscreen-text.md`.

---

## Run it

```bash
npm install
npm run dev          # Remotion Studio — scrub every screen frame by frame
npm run render:all   # 11 ProRes 4444 screens + the animatic, into out/
npm run animatic     # just the 34s animatic
```

Rendering needs Chrome's **headless shell** — the full Chromium binary dropped old headless mode
and Remotion's launcher fails against it. `remotion.config.ts` points at Playwright's copy;
override with `REMOTION_BROWSER_EXECUTABLE=/path/to/headless_shell` if yours lives elsewhere.

## Compositions

Every duration is the clip's exact frame count from `../10-master-timeline.md`, so a rendered
screen drops onto the edit timeline with no retiming.

| Composition | Clip | Frames | Size | Motion |
|---|---|---|---|---|
| `UI-01` | 02 | 43 | 1200×300 | 41% → 38% across a defocus at f22 |
| `UI-02` | 05 | 34 | 1200×300 | 34% → 29% across a shorter defocus at f12 |
| `UI-03` | 06 | 29 | 1179×2556 | stopwatch running, hundredths blurred |
| `UI-04` | 08 | 38 | 2560×1600 | sentence types in by f16, send lights at f20 |
| `UI-05` | 10 | 29 | 2560×1600 | checks complete at f6 and f20 |
| `UI-06` | 12 | 53 | 2560×1600 | mono readout reveals f8–f20 |
| `UI-07` | 13 | 53 | 2560×1600 | **card static** — only the cursor moves, f26–f44 |
| `UI-08` | 16 | 34 | 2560×1600 | confirms at f2, f10; Done. f18; Undo f22 |
| `UI-09` | 18 | 53 | 2560×1600 | AFTER values count in, estimate last |
| `UI-10` | 21 | 66 | 3840×2160 | fades; legal fully up by f16 = global f766 |
| `UI-11` | 20 | 67 | 2560×1600 | **nothing moves** |
| `Animatic` | all | 816 | 1920×1080 | the whole film, for timing |

## The animatic

`out/animatic.mp4` is the entire 34-second spot at its real cut points — rendered `--muted`, so
the container is exactly 34.000s with no audio track to pad it, and it drops onto an NLE timeline
frame-aligned: the eleven UI screens
rendered live, the ten Runway shots as labelled slates, VO burned in as subtitles, the 2.39:1
extraction matted, and timecode/clip/act burn-ins along the top.

**Watch it before you spend a single Runway credit.** It answers the questions that actually
decide whether this film works, none of which need a generated frame:

- Can you read clip 13 in the 2.21 seconds it is on screen?
- Does the approval beat land, or does it go by too fast?
- Is Act I too long?
- Does the VO fit, or is 67% speech density too dense? (See `../03-voiceover.md`.)

If the film doesn't work as an animatic, no amount of generation will fix it.

## Structure

```
src/
  theme.ts        Aurora "Lantern" tokens, copied from brand-kit.html
  copy.ts         every on-screen string and number, in one place
  fonts.ts        the two brand faces, base64-inlined (see below)
  timeline.ts     the 21 clips and their frame counts; asserts the total is 816
  components/     window chrome, menu bar, mark, battery, glyphs
  screens/        macro.tsx · app.tsx · endcard.tsx
  Animatic.tsx    the 816-frame timing cut
  Root.tsx        composition registry
```

**Fonts are base64-inlined rather than loaded from `public/`.** Headless renders can race async
font loading and emit a handful of frames in the fallback face — easy to miss in a 53-frame clip
and fatal in a finished commercial. Inline `@font-face` has no such race.

## Brand rules the code enforces

These are load-bearing. `../00-brand-notes-and-decisions.md` has the reasoning.

- **The aurora gradient appears exactly twice** in 34 seconds: `UI07`'s APPROVE button and the
  words "Approve it." in `UI10`. It is reserved for the one thing to do next. Do not add a third.
- **Teal only confirms** (`UI08`'s ticks and "Done.", `UI09`'s AFTER column). **Amber only
  cautions** (`UI06`'s two out-of-range numbers). Neither is decorative.
- **"Done." is not teal on the end card** — there it is a promise, not a confirmation.
- **Noah is third person.** Never "I found." See `src/copy.ts`.
- **No progress bar.** `UI05` ticks through named checks; a bar performing work that isn't
  happening is one of the things the brand exists to be the opposite of.
- **Percentages never tick inside continuous sharp time.** `UI01`/`UI02` change across a defocus.
- **The mark is never glowed, tilted, cropped or recoloured**, and its waterline overshoots the
  disc on purpose. `NoahMark` in `components/chrome.tsx` is the real geometry — don't redraw it.
- **The Noah window is a fixed size on every screen.** The plate shows its edges, so a window that
  changed size between cuts would read as a continuity error.

## Handing off to the compositor

`npm run render:all` writes ProRes 4444 (alpha, for the glow passes in
`../05-noah-ui-screens.md`). For frame-exact PNG sequences instead:

```bash
npx remotion render UI-07 out/ui-07/ --sequence --image-format=png
```

Then follow the screen-replacement workflow in `../05-noah-ui-screens.md` — track, corner-pin,
inherit the plate's defocus, spill the UI's light onto the room, put the lamp reflection back on
top, grain over everything.
