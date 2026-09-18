# Noah short #3 — "Things I Will NOT Do to Fix My Mac in 2026"

One standalone 1080x1920 / 9:16 / 30fps short for TikTok + YouTube Shorts.
27.0s (810 frames).

## Locked script

The spoken VO is locked and must not be reworded:

> "Number one: delete random files. Number two: install five cleaner apps.
> Number three: follow a seven-year-old Reddit command I don't understand.
> I just tell Noah what's wrong."

Integrity is enforced mechanically rather than trusted: the line is produced as
TTS first, then handed to the video model as an `audio_references` input, so the
model lip-syncs to fixed audio instead of improvising speech. Both halves were
transcribed back with Whisper and matched word for word.

## Generation

| Asset | Model | Detail |
|---|---|---|
| Creator reference | `soul_2` (Soul 2.0) | 9:16, 2k, 3 variants, variant 3 selected |
| VO, both halves | `seed_audio` | voice **Xenia** (preset) |
| Clip A / Clip B | `wan2_7` (Wan 2.7) | 8s, 9:16, **1080p native**, `start_image` = reference, `audio_references` = VO |

Wan 2.7 was chosen as the lowest-cost model that supports `audio_references` —
the only way to make a locked script deterministic. Both clips use the *same*
reference as `start_image`, so identity is pinned at frame 0 of each take.

Word-level VO timings drive every cut:

```
A  "Number one,"  0.00-1.06   "delete random files."        1.68-2.86
   "Number two,"  3.66-4.92   "install five cleaner apps."  5.36-7.04
B  "Number three" 0.00-0.98   "...command I don't understand." 1.62-4.66
   "I just tell Noah what's wrong."                         5.28-6.66
```

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

1. **UGC mp4s are not in `public/ugc/mac-list/`.** This session's egress policy
   blocks every Higgsfield host, so generated media cannot be pulled into the
   repo. Allowlist `d8j0ntlcm91z4.cloudfront.net` (and ideally
   `*.higgsfield.ai`) and the three files drop straight in.
2. **One product string is still Windows-flavoured**: the approve button reads
   `Trim startup & clear space`. It was not among the 12 approved rows, so it
   has not been touched. See section E of `MAC-TEXT-REPLACEMENTS.md`.
