# Editing instructions

---

## Order of work

Do it in this order. Steps 1–3 are where the film is won or lost, and all three happen before a
single Runway credit is spent.

1. **Lock the reference frames** (REF-A … REF-E in `02-runway-shot-list.md`). Do not proceed until
   you have five stills you would be happy to see in the finished spot.
2. **Build the UI screens** and capture them. `ui/noah-ui-screens.html` is ready; you need the
   captures before you can judge whether a plate works.
3. **Record a scratch VO** — your own voice, phone mic, five minutes. Cut the whole thing as an
   animatic against stills. **If the film doesn't work as an animatic, no amount of generation
   will fix it.**
4. Generate the live-action clips. Budget 4–6 takes each; hands and faces need the most.
5. Generate the plates. Fewer takes — you are only judging glow, focus falloff and reflection.
6. Screen-replace the UI into the plates.
7. Assemble to the frame counts in `10-master-timeline.md`.
8. Sound design and mix.
9. Grade.
10. Versions and deliverables.

## Assembly

**Every transition is a hard cut, except one.** Twenty of the twenty-one clips butt-cut. The only
exception is the 8-frame dip to `#0B1024` between clips 20 and 21 (frames 742–750). Not a
cross-dissolve, not a white flash, not a light leak, not a glitch wipe.

This is not minimalism for its own sake. The film's argument is that Noah shows you things plainly
and doesn't perform. A transition that draws attention to itself contradicts the copy running over
it.

**Cut points that must not drift:**

| Frame | Cut | Why |
|---|---|---|
| 78 | 01 → 02 | On her hands coming to rest. Cut a frame early and it reads as a mistake. |
| 197 | 04 → 05 | On the connector clearing the port. |
| 294 | 07 → 08 | On a keystroke bottoming out. |
| 534 | 14 → 15 | The click. Music, SFX and cut all land on this single frame. |
| 587 | 16 → 17 | Into the fan falling away. |
| 750 | dip → 21 | VO line 11 ("Noah.") resolves here and the mark appears here. |

**Three shots are deliberately still** — 13, 18, 21. In a film cut this fast, stillness is the
emphasis. If the edit runs long in review, the instinct will be to trim clip 13. **Trim clip 01
instead.** Clip 13 is the ad.

## Screen replacement

Full workflow in `05-noah-ui-screens.md`. The four things that matter most, in order:

1. **Inherit the plate's defocus**, including when it changes mid-shot (clips 12 and 18 both rack).
2. **Let the UI's light spill onto the room** — sample its luminance and drive a soft glow onto
   the bezel and desk. This sells the comp more than the corner-pin ever will.
3. **Put the plate's lamp reflection back on top** of the comped UI, screen blend, ~20%.
4. **Grain over everything**, matched to the plate, never under the UI only.

If a comp still reads as pasted on, it is almost always too bright. Pull exposure until it sits
*under* the plate's own screen brightness.

## Grade

**Reference:** warm ink, page cream, no teal-and-orange. `brand-kit.html` names the palette; the
grade's job is to stay inside it.

| | Setting |
|---|---|
| Shadows | Lifted to ~4 IRE, tinted slightly warm (R+2, G+1). **Never crushed, never blue.** |
| Midtones | Neutral. Skin protected — no push toward orange. |
| Highlights | Rolled off soft. Screen white ~92 IRE, never clipped. |
| Saturation | ~92% global. |
| Screen light | Neutral-cool, desaturated. The Noah UI's aurora blue-violet must stay the only saturated thing in frame. |
| Film emulation | A gentle 2383-style print LUT at ~60% strength, or an Alexa 709 base with a soft shoulder. |
| Diffusion | 1/8 Black Pro-Mist look on the practical highlights only. Do not haze the whole frame. |
| Vignette | None. |

**Match clip 01 and clip 20 to each other before you match either to anything else.** They are the
film's continuity spine, they bookend it, and a viewer will feel a mismatch there without being
able to name it.

**Grade the end card separately.** It is `#0B1024` flat and must stay exactly that value — no LUT,
no diffusion, no grain over the mark.

## Titles and the mark

- The end card is built in After Effects from `brand-pack/svg/noah-mark-dark.svg`. Never generated,
  never traced, never re-drawn.
- **No glow, no drop shadow, no bevel, no outline on the mark.** The brief's general "screen glow"
  direction does not override `brand-pack/README.md`, which forbids effects outright.
- The mark is level. The waterline overshoot is not cropped. Clear space on all sides is at least
  the ring's stroke thickness.
- Aurora gradient on **"Approve it."** only — the film's second and final use of it.

## Versions

| Cut | Length | Notes |
|---|---|---|
| **Master** | 34.00s, 2.39:1 | Extracted from a 16:9 UHD timeline. |
| Broadcast 30 | 32.00s → trim to 30 | Drop VO lines 5 and 10 and 24f each from clips 01 and 20, per `03-voiceover.md`. |
| Social 16:9 | 34.00s | The full 16:9 frame, no matte. |
| Social 9:16 | 34.00s | Reframe, do not letterbox. Clips 12/13/16/18 need the UI re-laid-out — recapture from the HTML at 1440×2560 rather than cropping. Clip 20's pull-back needs a tighter path. |
| Social 1:1 | 20s | Shortest useful cut: clips 02, 05, 06, 12, 13, 15, 18, 21. The whole argument, no setup. |
| Silent/captioned | 34.00s | Burn VO as captions. **Check that clip 13 is legible at 9:16 phone size** — if it isn't, the cut doesn't work and the UI needs a larger-type variant. |

Deliver a **no-VO (M&E)** mix with every version.

## Before you call it done

- [ ] Total runtime is exactly 816 frames.
- [ ] Clip 13 is a full 53 frames and completely static.
- [ ] The aurora gradient appears exactly twice in the whole film.
- [ ] The legal super is on screen ≥ 2.0s and passes 4.5:1 contrast.
- [ ] No frame contains the words *scan*, *IT*, *trial*, or a count of "issues found."
- [ ] Noah never says "I" anywhere on screen.
- [ ] Clips 09 and 17 read as the same vent.
- [ ] Clips 01 and 20 read as the same room, same lamp, same everything.
- [ ] The mark is level, unglowed, uncropped.
- [ ] Every number on screen is consistent with `04-onscreen-text.md`'s table.
- [ ] Mono fold-down checked on a phone speaker: the fan and the click both survive.
