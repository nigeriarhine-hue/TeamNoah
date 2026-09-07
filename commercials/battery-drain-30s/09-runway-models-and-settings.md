# Runway models and settings

Runway's model lineup moves. Rather than pin version numbers that will be stale, this maps each
shot type to the **capability** you need; match it to whatever your account currently exposes.

---

## The consistency protocol — the only thing that really matters

An AI-video commercial fails in one specific way: twenty-one shots that each look great and
clearly depict twenty-one different people in twenty-one different rooms. Everything below exists
to prevent that.

**1. Generate stills first, video second.** Lock REF-A through REF-E as images
(`02-runway-shot-list.md`, Step 0). Never regenerate them once chosen. Treat them the way a
production treats a cast and a location: fixed.

**2. Every clip is image-to-video.** Not one shot in this film should be text-to-video. Build each
shot's start frame by editing a REF still — reframe, crop, inpaint the new angle — then animate
*that*. Text-to-video re-rolls the actor, the room and the laptop on every generation, and no
prompt is specific enough to stop it.

**3. Use the reference/character feature on every live-action prompt.** Pass REF-A for anything
with her face, REF-D for anything with hands, REF-B or REF-C for the room and machine. This is
what the feature is for and it is the difference between a spot and a mood reel.

**4. Lock the seed** once a look is working, and vary only the prompt. Log the seed for every
accepted take — you will need to regenerate something after the first client round.

**5. Generate long, cut short.** Every shot is generated at 5s (clip 20 at 10s) and trimmed to its
frame count. The first ~8 and last ~8 frames of an AI generation are the least stable; having
them to throw away is free insurance.

**6. Pairs come from one frame.** Clips 09 and 17 (the vent), clips 02 and 05 (the battery
cluster), clips 12/13/16/18 (the screen), clips 01 and 20 (the room) must each derive from a
single start frame. If they don't, the payoffs read as different objects and the film quietly
stops making sense.

## Settings by shot type

### A. Live action with her face — clips 01, 03, 19, 20

| | |
|---|---|
| Model | Highest-fidelity image-to-video generation available (the Gen-4 family, not a Turbo variant) |
| Input | Start frame derived from REF-A / REF-B, plus REF-A passed as a character reference |
| Duration | 5s (clip 20: 10s) |
| Aspect | **16:9 at max resolution.** Protect a 2.39:1 centre extraction; do not generate 21:9 — you lose the reframing headroom that the 9:16 and 1:1 versions need |
| Camera motion | Lowest usable setting. These are 2–25cm moves; anything more and the model starts inventing geometry |
| Guidance | Mid. High guidance over-bakes the prompt and stiffens the performance |
| Takes | 5–6. Faces are where you spend |

**Watch for:** eyes drifting toward camera (she never looks at lens), the mouth starting to
"speak," a second person resolving in the background, and the room changing between clip 01 and
clip 20.

### B. Macro hands — clips 04, 07, 11, 14, 15

| | |
|---|---|
| Model | Same as A |
| Input | Start frame from REF-D, REF-D as reference |
| Duration | 5s |
| Camera motion | Near zero — every one of these is locked or a 1cm float |
| Takes | 6–8. **Hands are the highest-failure shot type in the film** |

**Watch for:** extra or fused fingers, a ring or watch appearing (the wardrobe rule exists for
this reason), the nail changing length between clips 14 and 15, the connector deforming as it
leaves the port in clip 04.

The single best mitigation is fewer fingers in frame. Clips 14 and 15 show one fingertip on
purpose.

### C. Macro objects — clips 09, 17

| | |
|---|---|
| Model | Same as A |
| Input | **One shared start frame for both clips** |
| Duration | 5s each |
| Camera motion | Zero |
| Takes | 3–4 |

Prompt the *air*, not the machine: dust speed is the only thing changing between the pair, and
it is the entire payoff.

### D. Screen plates — clips 02, 05, 06, 08, 10, 12, 13, 16, 18

| | |
|---|---|
| Model | Same as A, or a faster/cheaper variant — nobody will study a plate |
| Input | Start frame from REF-E |
| Duration | 5s |
| Camera motion | Low. Push and slider only |
| Takes | 2–3 |

**Prompt the screen content as deliberately illegible.** A plate whose fake interface is nearly
readable is worse than one that's clearly a blur, because the comp then has to cover something
that reads as text. "Out-of-focus illegible" is in every plate prompt for that reason.

Clip 13 wants **zero** movement. If you can't get a genuinely locked generation, freeze the last
frame of clip 12's plate, add matched grain and a 0.3% scale drift, and use that.

### E. Not generated at all — clip 21

Built in After Effects from `brand-pack/svg/noah-mark-dark.svg` and the type spec in
`04-onscreen-text.md`. Any generated version of the mark will tilt the waterline, add a glow, or
invent a boat — all three explicitly forbidden by `brand-pack/README.md`.

## Post-generation

- **Upscale everything to 4K** after selects, before comping. Upscaling before you've chosen takes
  is money on fire.
- **Video-to-video editing** (the Aleph-class capability) is useful for one thing here: nudging an
  otherwise-perfect take's lighting or colour to match its neighbours. Do not use it to change
  what happens in a shot — regenerate instead.
- **Performance-capture tools** (Act-Two class) are not needed. There is no dialogue, and the two
  performance beats — clip 03 and clip 19 — are small enough to prompt directly.

## Budget

| | |
|---|---|
| Unique generations | ~16 |
| Attempts at normal hit rates | 70–100 |
| Heaviest line item | Macro hands (clips 04, 07, 11, 14, 15) — roughly a third of all attempts |
| Reference stills | 20–40 image generations before you have five keepers |

Generate Act III first — clips 12 through 15. If the approval sequence doesn't work, nothing else
in the film matters, and you would rather find that out on day one.
