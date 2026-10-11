# Noah — "Cleaner App vs. Diagnosis" (15–20s vertical ad)

**Working title:** DON'T JUST CLEAN IT. CHECK IT.
**Message:** cleaning is not the same as diagnosing.

Built with Remotion + React/TypeScript. 1080×1920, 9:16, 30 fps, 20.01s.

| Output | Path |
| --- | --- |
| Video | `out/noah-cleaner-vs-diagnosis.mp4` |
| Thumbnail | `out/noah-cleaner-vs-diagnosis-thumbnail.png` |

## Render

```bash
cd ads/cleaner-vs-diagnosis
npm install
export REMOTION_BROWSER_EXECUTABLE=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell

npx remotion render Ad   ../../out/noah-cleaner-vs-diagnosis.mp4 --codec=h264 --crf=17
npx remotion still  Thumbnail ../../out/noah-cleaner-vs-diagnosis-thumbnail.png
```

Rebuild the audio bed (needs the piper voice model, see below):

```bash
python3 scripts/build-audio.py
```

## Structure

| Time | Beat | On screen |
| --- | --- | --- |
| 0–2.5s | Hook | Character-led split, `CLEANER APP` / `NOAH` labels, `CLEANING ≠ DIAGNOSIS` |
| 2.5–6s | Blind cleaning | Generic Quick Clean races to 100%; `BUT WHAT WAS ACTUALLY WRONG?` |
| 6–10s | Noah checks | `WHAT NOAH CHECKED` — five gaming-relevant rows; `CHECK FIRST.` |
| 10–13s | The finding | `Here's what I found.` + situation; `SEE THE ISSUE.` |
| 13–16s | The plan | `WHAT NOAH WOULD DO` — four steps; `SEE THE PLAN.` |
| 16–18.5s | Approval | Full-frame modal, cursor → Go ahead; `YOU DECIDE.` |
| 18.5–20s | CTA | `FREE PC CHECK` · Describe it. Approve it. Done. · onnoah.app |

The split is not fixed at 50/50: it opens even, leans left while the cleaner is
busy, then shifts to 66% Noah from 6s. That is what makes the Noah UI legible at
phone size — a half-width Noah panel truncates every metric label.

While the left side is already deleting things, the right side is still showing
`Looking into it…`. That contrast is the argument, so the Noah side is never
blank during the cleaner beat.

## Script

Locked, used verbatim:

> One app just cleaned a bunch of stuff. Noah actually checked my PC first. It
> showed me what was wrong, showed me the fix, and waited for my approval before
> changing anything.

`scripts/build-audio.py` splits it **only at its own punctuation** into five
segments so each lands on its beat, and asserts the rejoined segments equal the
locked script.

## Voice

Piper neural TTS, `en_US-ryan-high` (young American male), run locally — no
Higgsfield. Models are fetched to `/tmp/voices`:

```bash
pip install piper-tts
BASE=https://huggingface.co/rhasspy/piper-voices/resolve/main/en/en_US
curl -L -o /tmp/voices/en_US-ryan-high.onnx      $BASE/ryan/high/en_US-ryan-high.onnx
curl -L -o /tmp/voices/en_US-ryan-high.onnx.json $BASE/ryan/high/en_US-ryan-high.onnx.json
```

## Sound design

Synthesized in `build-audio.py` (numpy, no third-party audio): a filter-sweep
snap on the split, fast chattery ticks under the cleaner side, sparser softer
tones under Noah, a click on approval and a two-note completion.

**No music track is included.** Nothing in this repo is licensed for
distribution, and shipping an unlicensed bed in an ad is a real risk. Drop a
licensed loop in as a second `<Audio>` in `src/Ad.tsx` at roughly -18 dB under
the voice.

## Assets

- **Character** — stills from the recurring young Black gamer clip already
  developed for Noah, in `public/char/`. Same four stills throughout, so the
  identity never drifts.
- **Noah UI** — rebuilt as React from `ugc/pc-gaming-fps/noah-ui-source.html`
  (itself from the product screenshots). Tokens in `src/theme.ts`.
- **Noah mark** — inline SVG from `brand-pack/svg/noah-mark-dark.svg`, branding
  positions only: title bar, approval modal header, corner, CTA lockup. Never
  inside a diagnostic card; those use generic glyphs.
- **Figtree** — local woff2 from `ugc/pc-gaming-fps/`.

## The generic cleaner side

Invented for this ad. No competitor name, mark, colourway or layout. It stands
for the broad "clean everything" category: a white utility that sprints to 100%,
lists what it deleted, reports GB freed — and never says what was wrong. Keep it
that way if you edit it.
