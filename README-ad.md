# AI Tech Support for Your Mac — 15s vertical ad

One standalone 1080×1920 / 30fps / 15.0s film for TikTok and YouTube Shorts,
plus a purpose-built Shorts cover.

```bash
npm run ui       # re-render the Noah UI screens (Playwright → PNG)
npm run studio   # open the Remotion editor
npm run render   # out/noah-ai-tech-support.mp4
npm run thumb    # out/noah-ai-tech-support-thumbnail.png
```

`tools/make-assets-manifest.mjs` writes `src/assets.json`, which records which
generated assets are present. The edit renders with neutral slates for anything
missing, so the cut can be reviewed before any paid generation is spent.

## Fetching the generated footage

The two UGC clips and the voiceover are generated on Higgsfield and live at the
URLs in `tools/fetch-generated-assets.sh`. Run it to pull them into `public/`
and re-render:

```bash
./tools/fetch-generated-assets.sh
```

Some Claude Code environment network policies deny the Higgsfield result CDN, in
which case curl returns 403 — raise the environment's Network access level, or
download the three files by hand into the paths the script names. `src/assets.json`
picks them up on the next `node tools/make-assets-manifest.mjs`.

Voice takes, all Seed Audio 1.0 presets reading the locked script:

| Voice | Length | |
|---|---|---|
| Dylan | 13.46s | the edit is cut to this one |
| Evan | 12.85s | alternate |
| Cody | 17.78s | too long for a 15s cut |

## The cut

| Time | Shot | On screen |
|---|---|---|
| 0:00–2:97 | Higgsfield clip 1 — gaming, something hitches | `AI TECH SUPPORT / FOR YOUR MAC?` + the opening VO line |
| 2:97–4:93 | Higgsfield clip 2 — waiting, hand on the mouse | `Imagine AI tech support…` |
| 4:93–6:10 | Noah takes the question, diagnostics running | — |
| 6:10–8:13 | Push to `WHAT NOAH CHECKED`, spotlit | `IT ACTUALLY CHECKS.` → `NO GUESSING.` |
| 8:13–9:90 | Continues down to `WHAT NOAH WOULD DO`, spotlit | `CHECKS THE PROBLEM` |
| 9:90–12:90 | Push onto the approval modal; pointer arrives and presses **Go ahead** at 12:37 | `SHOWS THE FIX` → `WITH YOUR APPROVAL.` |
| 12:90–13:40 | Approved, working | — |
| 13:40–14:00 | `RESULT / Done.` and what changed | — |
| 14:00–15:00 | End card | `AI TECH SUPPORT FOR YOUR MAC` · `FREE MAC CHECK` · `onnoah.app` |

The timeline lives in one place — `S` in `src/NoahAd.tsx`.

### Framing

The screenshots are a 0.80:1 window and the frame is 0.5625:1, so the film gives
the UI a fixed rounded viewport in the upper two thirds (`VIEWPORT` in
`src/components/FocusZoom.tsx`) and moves the image *inside* it. The viewport
edges never move, so every push reads as zooming into a screen, and the band
below it is where the captions sit — they never cover the UI.

Where a shot needs to point at one part of a screen that is otherwise fully
legible, it uses `Spotlight` rather than cropping: everything outside the region
dims and the region lifts.

### Captions

Built entirely in Remotion — no burned-in captions from any generator. Two
registers: `AnimatedCaption` (sentence case, under the UGC footage) and
`TextHook` (Plus Jakarta 800 at the brand's −0.035em headline tracking,
uppercase, one line at a time). Phrase-level, not karaoke; a line arrives whole,
rises a few pixels and leaves.

### Sound

`tools/make-sound-design.py` synthesises `public/audio/sfx/sound-design.wav`:
a quiet D-minor pad plus four cues — a stutter at 0:00.55, air and a low thud
into the software at 0:04.71, a soft press at 0:12.37, and a two-note
confirmation at 0:13.42. Pre-mixed and limited to −8.3 dBFS peak so the
voiceover stays the primary audio.

## Noah UI screens

`tools/noah-ui/screens.html` + `noah-ui.css` rebuild the real interface at
2240×2816 — high enough to zoom into. They are a faithful reconstruction of the
app in `IMG_0583`–`IMG_0595`, not a redesign: same sidebar, same `— SITUATION /
— WHAT NOAH CHECKED / — WHAT NOAH WOULD DO` hierarchy, same metric cards, same
numbered plan, same aurora primary action, same approval modal, same teal
confirmations.

`tools/render-noah-ui.mjs` also exports `src/ui-hotspots.json` — the measured
position of each region the film pushes into or spotlights, so the camera moves
are derived from the layout instead of hand-tuned pixel guesses.

### Windows → Mac adaptation

The source screenshots are the Windows build. Changed only where the platform
actually differs, plus the copy for this scenario:

| Original | Replacement |
|---|---|
| Windows title bar (minimise / maximise / close, right) | macOS traffic lights, left |
| `My PC feels slow` | `My Mac starts lagging when I open my game.` |
| `Your PC is loading seven programs at every startup plus a busy background load — that's what's making it feel slow. I also found ~12 GB of old FL Studio installers you can reclaim.` | `When your game opens, extra background activity and login items are contributing to the lag. I also found limited free storage and unnecessary background processes affecting performance.` |
| `STARTUP ITEMS` | `LOGIN ITEMS` |
| `C: DRIVE FREE` | `STORAGE FREE` |
| `OLD FL STUDI…` | `BACKGROUND APPS` |
| `BACKGROUND …` | `SYSTEM LOAD` |
| `Stop 3 heavy apps from auto-launching at boot` | `Stop unnecessary apps from opening at login` |
| `Stop Teams from auto-starting at boot` | `Reduce background activity affecting performance` |
| `Clear temp files to free space` | `Clear temporary/cache data` |
| `Reclaim old FL Studio installers` | `Reclaim some storage space` |
| `Trim startup & clear space →` | `Trim login items & clear space →` |
| `Battle.net, Avid Link, Edge autolaunch` | `Steam, Discord, Creative Cloud` |
| `Turning off a startup program — Teams` | `Turning off a login item — Steam` |
| `Teams no longer launches at startup (it still opens fine on demand), and I cleared ~450 MB of temp files.` | `Noah reduced unnecessary background activity, adjusted selected login items, and cleared temporary data that was contributing to the lag.` |
| `TEAMS AT STARTUP / Now off` | `LOGIN ITEMS / 3 off` |
| `TEMP FILES CLEARED / ~450 MB` | `STORAGE / +1.2 GB` |
| `STILL ON AT BOOT / 3 items` | `SYSTEM LOAD / Lower` |
| `Empty Recycle Bin` (thread list) | `Empty the Trash` |
| `Battle.net Installation and Startup…` | `Steam Installation and Login It…` |
| `Computer Performance Analysis …` | `Mac Performance Analysis …` |
| `PC Performance Slowdown Troub…` | `Game Lag Troubleshooting` |

`Checking System Updates`, `Printer Status Check`, `System Information Details
Requ…`, `Can Noah do this?`, `Noah needs your OK to continue.` and the
`No thanks / Go ahead / Approve all` buttons are platform-neutral and unchanged.

## Brand

Colours, typography and the rules they follow come from `brand-kit.html`:
Plus Jakarta Sans 700/800 at −0.035em for headlines, the aurora gradient
(`#5B9BD5 → #6366F1 → #8B5CF6`) reserved for the one primary action, commit teal
`#14B8A6` for confirmations, amber `#F59E0B` for caution, night `#0B1024` as the
ground. The end card and the cover each use the gradient once.
