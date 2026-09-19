# Noah short #3 — "Things I Will NOT Do to Fix My Mac in 2026"

One standalone 1080x1920 / 9:16 / 30fps short for TikTok + YouTube Shorts.
27.0s (810 frames).

## Locked script

The spoken VO is locked and must not be reworded:

> "Number one: delete random files. Number two: install five cleaner apps.
> Number three: follow a seven-year-old Reddit command I don't understand.
> I just tell Noah what's wrong."

Speech is generated natively by the video model, and integrity is verified
rather than assumed: both delivered clips are transcribed back with Whisper and
matched against the locked line word for word before they are accepted.

## Generation

| Asset | Model | Detail |
|---|---|---|
| Creator reference | `soul_2` (Soul 2.0) | 9:16, 2k, 4 variants, variant 4 selected |
| Clip A / Clip B | `seedance_2_5` | 8s, 9:16, **1080p**, `mode: omni_reference`, `generate_audio: true`, `image_references` = the character |

### Why not Wan 2.7

The first two passes used `wan2_7` with a TTS track fed in as
`audio_references`, on the assumption that it would drive the mouth. **It does
not.** Correlating mouth-region interframe motion against the audio envelope:

|  | mouth motion | mouth ↔ audio | forehead ↔ audio |
|---|---|---|---|
| Wan 2.7 | 8.1 (*less* than forehead) | −0.03 | +0.08 |
| Seedance 2.5 | 14.4 (highest region) | +0.19 (clip B +0.31) | −0.03 |

Wan treated the supplied audio as a soundtrack: it played, the face drifted,
the mouth did nothing. Seedance 2.5 with `omni_reference` + `generate_audio` is
what Higgsfield's own `ugc-review-video` workflow locks for talking heads, and
its mouth is now the most active region of the face and tracks the audio.

Worth keeping in mind for future videos: **verify the lip sync numerically**
before building an edit on top of a clip. The check is cheap.

### The creator

`mara-mac-creator`, a reusable Higgsfield element
(`2eecef95-b486-4bb9-a7dd-86f61831ec16`) rather than a one-off reference, so
later videos get the same person. Blunt jaw-length bob with a copper streak and
amber acetate glasses for a silhouette that reads at thumbnail size; deep
charcoal knit with sleeves pushed up so a raised hand contrasts against the
sleeve instead of vanishing into it.

### Cut points

Word-level timings are re-derived from the *delivered* clips, never from the
plan, and every caption, list item, strike and punch beat is keyed to them:

```
A  "Number one,"  0.00-1.52   "delete random files."        2.26-3.28
   "Number two,"  4.12-4.86   "install five cleaner apps."  5.40-7.06
B  "number three" 0.00-1.38   "...reddit command I don't understand" 1.38-4.80
   "I just tell Noah what's wrong"                          4.80-6.92
```

The clips are 24fps inside a 30fps composition; `OffthreadVideo` samples by
time, so that is handled.

## Product UI

Noah screens are the **genuine supplied screenshots**, never regenerated.
`FocusZoom` crops the wide desktop captures into 9:16 by scaling and centring a
region of interest. `NoahApproval` rings the real approve affordance instead of
drawing a fake modal.

The screenshots are the **Windows build**. All 12 approved Windows -> Mac
replacements are applied as overlays in `src/macPatches.ts`, positioned in each
screenshot's own pixel space so they ride the zoom with the pixels they cover.
Cover and glyph colours were sampled from the captures themselves; the type is
**Plus Jakarta Sans**, Noah's own brand sans per `brand-kit.html`. The Windows
title bar is painted out. See `MAC-TEXT-REPLACEMENTS.md` — one string
(`Trim startup & clear space`) is still outstanding.

## Sound

Six cues synthesised from scratch in `scripts/make_sfx.py` (no stock library):
soft wrong-tick, firmer click, two-note comedic beat, whoosh, UI click,
completion chime. Deliberately dry and quiet.

## Build

```bash
npm install
node scripts/check-assets.mjs                                   # refresh asset flags
npx remotion still  src/index.ts Thumbnail out/noah-things-i-wont-do-thumbnail.png
npx remotion render src/index.ts MacList   out/noah-things-i-wont-do.mp4
npx remotion studio src/index.ts                                # interactive
```

`scripts/check-assets.mjs` writes `src/assets.json`. When the UGC mp4s are absent
the composition falls back to the creator still, then to a neutral plate, so the
project always renders end to end rather than failing on a missing file.

## Components

`SafeArea` `UGCClip` `CaptionScrim` `AnimatedCaption` `ListItem`
`FingerCountOverlay` `TextHook` `NoahOverlay` `TideRule` `FocusZoom`
`NoahApproval` `CursorClick` `CTAEndCard` `ShortsThumbnail`

Built to be reusable by later videos, but no multi-video system is set up yet —
this is one standalone short by design.

## Pending decisions

1. **UGC mp4s are not in `public/ugc/mac-list/`.** The egress policy blocks
   every Higgsfield host, so generated media cannot be pulled into the repo.
   Allowlist `d8j0ntlcm91z4.cloudfront.net` (ideally `*.higgsfield.ai` too) and
   run `bash scripts/finish.sh`. Note the policy is fixed when a session's
   container starts, so the change needs a **fresh session** to take effect.
2. **One product string is still Windows-flavoured**: the approve button reads
   `Trim startup & clear space`. It was not among the 12 approved rows, so it
   has not been touched. See section E of `MAC-TEXT-REPLACEMENTS.md`.
