# Brand notes and decisions

Everything here is checked against `brand-kit.html` and `brand-pack/README.md` in this repo.
Where the creative brief and the brand kit disagree, the conflict is named and resolved rather
than quietly split.

---

## 1. Mac, not PC

The brief asks for "Find the real cause of your **PC** problems." The brand kit is unambiguous:
*"Noah is a macOS app"*, tagline *"Noah finds what's actually wrong with your Mac."*

**Decision:** the primary cut says **Mac**. Everything in this package — the process names, the
`~/Library/LaunchAgents` path, the Energy Impact metric, the Login Items language — is macOS-real,
which is also what makes the diagnosis believable on screen.

**If you want the broader-market cut**, exactly three things change and nothing else:

| Element | Mac cut (primary) | Cross-platform cut |
|---|---|---|
| End card line 4 | `Find what's actually wrong with your Mac.` | `Find the real cause of your PC problems.` |
| VO line 10 | "Find the real cause." | "Find the real cause." *(unchanged)* |
| UI-06/07 path string | `~/Library/LaunchAgents/com.northwind.drive.sync.plist` | `HKCU\...\Run\NorthwindSync` |

Note that the cross-platform cut contradicts the current product. Ship it only if Windows has
actually shipped.

## 2. Noah never says "I"

The brief's sample UI copy reads **"I found a likely cause."** The brand kit's voice section:
*"Noah is always third person. 'Noah will fix it,' never 'I will fix it.' An AI posing as a
person doesn't build trust."*

**Decision:** all Noah UI copy is third person. The line becomes **"Noah found the actual
cause."** — which is also, word for word, a body-copy sample in the brand kit. This is the single
most load-bearing correction in the package; it appears in UI-05, UI-06, UI-07 and UI-08.

## 3. No circuit boards in the diagnosis montage

The brief asks for "cinematic macro shots of CPU activity." The brand kit's *Not this* list bans
*"cyber, crypto, neon grids, matrix rain, glowing circuit boards"* outright, and the image-model
seed ends with *"no circuit boards."*

**Decision:** the montage is built entirely from **real exterior surfaces** — the fan vent, warm
aluminium under a palm, the screen itself, the keyboard — plus real Noah UI. No PCB macro, no
die shot, no interior-of-the-machine journey. This is a stronger idea anyway: the drain is
invisible from outside, which is the whole reason you need something that measures.

Every negative prompt in `02-runway-shot-list.md` carries the brand kit's own ban list.

## 4. The culprit is a fictional vendor

The brief suggests **"Chrome Helper."** Naming a real shipping product as the villain in a paid
commercial is a legal exposure with no creative upside, and the brand kit's honesty rules make
an unfair characterisation worse, not better.

**Decision:** the culprit is **`NorthwindSyncHelper`**, the background sync agent of a fictional
"Northwind Drive." "Northwind" is a decades-old convention for a demo company, so it reads as
illustrative rather than as an accusation. The *mechanism* is completely real and is the single
most common cause of this symptom on a Mac: a helper stuck in a failed-upload retry loop, kept
alive by a LaunchAgent that is also a Login Item, holding the machine out of its low-power idle
state.

Swap table if you want a different culprit — change these four strings and nothing else:

| | Primary (recommended) | Alt A — browser | Alt B — media |
|---|---|---|---|
| Process | `NorthwindSyncHelper` | `Web Content (Extension)` | `HelperTool (Transcode)` |
| Parent | Northwind Drive | a browser extension | a video app |
| Agent path | `com.northwind.drive.sync.plist` | `com.example.ext.worker.plist` | `com.example.media.helper.plist` |
| Plain-English cause | stuck retrying a failed upload | an extension's background worker never sleeping | a finished export that never quit |

Legal will still want to clear whatever you pick. Alt A is deliberately generic for that reason.
**Do not** use a real vendor name without written clearance.

## 5. The 29% "low battery" alert would be a lie

The brief's sound list includes a *low battery notification*. At 29% no such alert fires, and
inventing one is exactly the thing the brand kit refuses: *"No fake 'at risk!' scares, no
invented urgency."*

**Decision:** replaced with the **power-source-changed chime** on the unplug at clip 04 — a real
sound that really happens at that moment, and dramatically better because it is the sound of
*her* taking an action rather than the machine crying wolf.

## 6. Two smaller calls

**"Dramatic visual contrast" vs "no dramatic lighting."** The brief wants contrast; the brand kit
bans heroic lighting. Resolved by putting the drama in the *environment* — a dark room, one warm
practical, the screen as key — while the actor stays calmly lit, shoulders down. No rim-light
hero shots, no shafts of light. Contrast ratio ~4:1 on her face, never higher.

**The battery falls while plugged in.** Clip 02 shows the charging bolt *and* the percentage
dropping 41% → 38%. This is real: with a runaway process and a compact low-wattage adapter, draw
exceeds supply and the machine loses charge on mains. It is also the most alarming honest image
available. **The small adapter is a required prop** — a large high-wattage brick in frame breaks
the physics and a technical viewer will catch it.

---

## Brand rules this package is built to obey

- **Aurora gradient is reserved for the one thing to do next.** It appears exactly twice in 34
  seconds: the `APPROVE` button (UI-07) and the words "Approve it." on the end card. Nowhere else.
  Not on the wallpaper, not on the logo, not as a transition.
- **Commit teal `#0D9488`/`#14B8A6` means confirmation only.** It appears on the check marks and
  the word "Done." in UI-08, and on the AFTER column in UI-09. It is not a decorative accent.
- **Amber `#D97706`/`#F59E0B` means caution only.** It appears on the drain readouts in UI-05/06.
- **Machine voice is mono.** Process names, PIDs and paths are `ui-monospace`/JetBrains Mono. The
  path-rewrite line `…plist → .noah_bak` is the brand kit's own sample, used verbatim in form.
- **The mark is never glowed, tilted, cropped or recoloured.** End card uses
  `brand-pack/svg/noah-mark-dark.svg` at rest on the night ground, waterline level, clear space
  ≥ the ring's stroke. No drop shadow, no bevel, no outer glow — including no "screen glow"
  treatment, despite the brief's general lighting direction.
- **No fake progress bar.** UI-05's diagnostics tick through *named checks*, and UI-08 completes
  in 1.8s of on-screen time. The brand kit calls a progress bar performing work that isn't
  happening one of the things Noah exists to be the opposite of.
- **Never the word "scan," never "IT," never a fake count of "issues found."**
- **Reversibility is on screen.** UI-07 states the backup; UI-08 offers "Undo this change." The
  brand promise is *shown first, logged, reversible* — two of those three are free to show and
  cost four words.

## Consistency bible (lock before generating a single clip)

**Actor.** Woman, 33. Mid-brown hair, shoulder length, loosely tied back with strands loose at
the temple. Minimal makeup. Small silver stud earrings. **No rings, no watch, no bracelet, short
unpainted nails** — every macro hand shot depends on this, and jewellery is where AI hands fall
apart. Charcoal heather cotton crewneck sweatshirt, sleeves pushed to mid-forearm.

**Room.** Small home office at night. Warm walnut desk against a cream wall. One matte-black
articulated desk lamp camera-left, 2700K, shade tipped down. A window camera-right showing deep
blue night and a linen curtain half drawn. Props: a stoneware mug, a paperback face down, a
small trailing pothos, a coiled USB-C cable, **a compact 30W-class charger** (see §6). Nothing
else. The brand kit asks for generous whitespace and few elements; that applies to set dressing.

**Laptop.** 14-inch space-grey aluminium laptop, **no visible brand logo on the lid or bezel**
(trademark, and AI generators garble logos). Screen open at ~105°.

**Lighting plot — identical in every clip.**
- **Key:** the laptop screen, ~6000K, low and frontal on her face.
- **Fill:** desk lamp, 2700K, camera-left at 45°, roughly one stop under key.
- **Back:** cool window ambience from behind camera-right, two stops under key, separating her
  shoulder from the wall.
- Nothing moves, nothing changes colour, no light animates. Consistency here is worth more than
  any single beautiful frame.

**Grade.** Warm ink shadows lifted to ~4 IRE with a slight red-and-green tint, never crushed
blue. Highlights rolled off soft. Global saturation ~92%. **No teal-and-orange** — the brand's
warm ink and page cream are the palette, and a teal-orange grade reads as generic tech and
fights the Aurora blue-violet which must stay the only saturated thing on screen.
