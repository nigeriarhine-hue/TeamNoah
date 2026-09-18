# Noah ads — Video 2: *Your Game Might Not Be the Problem*

A single 9:16 advertisement for TikTok and YouTube Shorts, built in
[Remotion](https://remotion.dev). Composition id `NoahGameNotTheProblem`.

Read [`brand-kit.html`](./brand-kit.html) before changing any copy or colour —
the tokens in `src/brand.ts` are mirrored from it, and the voice rules
(third person, no "scan" as the value, never "IT", no invented metrics) apply
to everything on screen.

| | |
|---|---|
| Canvas | 1080 × 1920, 30 fps |
| Length | 27.3 s (819 frames) |
| Video out | `out/noah-game-not-the-problem.mp4` |
| Thumbnail out | `out/noah-game-not-the-problem-thumbnail.png` |

## Commands

```bash
npm install

npm run preview              # Remotion Studio — scrub, retime, reframe live
npm run render:video2        # → out/noah-game-not-the-problem.mp4
npm run render:video2:thumb  # → out/noah-game-not-the-problem-thumbnail.png
npm run typecheck

python3 tools/make-audio.py  # rebuild public/audio/*.mp3 (only if you change it)
```

## Where things live

```
public/
  ugc/gamer/        the four Higgsfield clips (H.264 transcodes — see below)
  noah-ui/          drop real Noah screenshots here to override the coded screens
  audio/            bed, glitch, click, complete
  fonts/            Plus Jakarta Sans, Instrument Serif, JetBrains Mono
  brand/            marks copied from brand-pack/
src/
  brand.ts          colour, type and safe-area tokens from the brand kit
  video2/timeline.ts  every cut, every caption time — the single source of truth
  video2/scenes/    the Noah session (one persistent macOS window)
  noah-ui/          the Noah screens, the camera, the screenshot override
  components/       reframing, captions, narrator lines, end card, title card
tools/make-audio.py synthesises the four audio layers
```

## The UGC clips

The four uploads were HEVC 10-bit, which Chromium cannot decode, so they were
transcoded to H.264 (CRF 19) and placed at:

| Brief | File |
|---|---|
| Hook / stutter reaction | `public/ugc/gamer/video2-hook.mp4` |
| Talking head | `public/ugc/gamer/video2-talking.mp4` |
| B-roll hands / setup | `public/ugc/gamer/video2-broll.mp4` |
| Payoff reaction | `public/ugc/gamer/video2-payoff.mp4` |

All four are 1920×1080 landscape at 24 fps. They are reframed to 9:16 in
`src/components/Framed.tsx`, not in ffmpeg, so anchors and push-ins stay
adjustable in Remotion Studio without re-encoding. Each clip contains its own
internal cut; `timeline.ts` records where, and the framing snaps on that frame
so the change is invisible.

## Replacing the Noah UI with real screenshots

The four screens are built in code from the brand system. To swap in real
captures, put them in `public/noah-ui/` and name them in
`src/noah-ui/uiAssets.ts`:

```ts
export const NOAH_UI_SCREENSHOTS: Partial<Record<NoahScreenId, string>> = {
  diagnosis: 'noah-ui/diagnosis@2x.png',
  approval: 'noah-ui/approval@2x.png',
  action: 'noah-ui/action@2x.png',
  result: 'noah-ui/result@2x.png',
};
```

Nothing else changes — same window, same camera moves, same timings. Captures
should be portrait-ish (the window is drawn 960×1050) and taken on a Retina
display, because the camera pushes in to 1.24×.

## Retiming

Everything derives from `src/video2/timeline.ts`. Change a scene length in `D`
and the starts, the total and the Noah session all follow. The file throws if
the total leaves the 25–28 s brief.

The caption times in `CAPTIONS` were measured from the talking clip's own
speech envelope — three utterances at 0.65–3.33 s, 3.70–4.60 s and
5.00–6.86 s, which are the locked line's three breath groups. Re-measure before
moving them.

## What isn't here

- **No real Noah screenshots.** This repo contains the brand pack but no
  captures of the macOS app, so the four screens are built in code from the
  brand system and only show documented behaviour. See *Replacing the Noah UI*
  above — it's a one-file swap.
- **No licensed music.** `public/audio/bed.mp3` is a synthesised tonal bed, not
  a track. Drop a real one in at the same path to replace it.
