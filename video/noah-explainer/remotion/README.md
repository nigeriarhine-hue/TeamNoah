# Noah explainer — Remotion composition

A 2:00, 16:9 explainer built as code rather than generated footage. Every colour,
weight and tracking value comes from `brand-kit.html`, so the video cannot drift
off-brand the way a prompt-driven render does.

## Why Remotion here

The Noah brand is typographic and exact: navy `#1A1D61`, page cream `#ECE8DF`,
Plus Jakarta Sans 700 at `-0.035em`, and three colours that carry fixed meaning
(teal confirms, amber cautions, the aurora gradient marks the one primary action).
Those are constraints a generative video model cannot hold. Here they are tokens
in `src/theme.ts`, and the render is deterministic — same input, same frames.

## Structure

| Path | What it is |
|---|---|
| `../script_manifest.json` | The locked script. Source of truth; passes `validate_motion_script.py`. |
| `gen-script.py` | Regenerates `src/script.ts` from that manifest. |
| `src/theme.ts` | Brand tokens, transcribed from the kit. |
| `src/components/Frame.tsx` | Chrome (load line, mark) and the word-by-word caption. |
| `src/components/CardStack.tsx` | The through-line: the issue-card stack. |
| `src/scenes/index.tsx` | The twelve block visuals. |

The layout *is* the mark: a level load line across the frame, sky above carrying
the picture, tide below carrying the words. The line never tilts and is never
cropped — the kit is explicit that the overshoot past the disc is the load line.

## Running it

```bash
npm install
npm run studio          # interactive preview
npm run render          # writes out/noah-explainer.mp4
```

Remotion drives Chrome's old headless mode, which the modern `chrome` binary has
dropped, so a headless-shell build is required:

```bash
npx remotion render NoahExplainer out/noah-explainer.mp4 \
  --browser-executable=/path/to/chrome-headless-shell --concurrency=4
```

`remotion.config.ts` sets the `swangle` software rasteriser, since the render
host has no GPU.

## Editing the script

Change `../script_manifest.json`, re-run the validator, then `python3 gen-script.py`.
Editing `src/script.ts` directly will be overwritten and skips the word-band,
shot-variety and through-line checks the manifest has to pass.

## Not done here

There is no voiceover. The captions are timed to the ~2.6 words/sec the lines
were written for, so a narration track drops in without retiming, but the audio
itself needs a TTS pass or a human read.
