# Timing sheet — Noah vertical short

1080 × 1920, 30 fps, **942 frames / 31.40 s**.
Source of truth: `src/NoahAd/config/timing.ts`. Scenes are laid out back to
back; each one lingers 8 frames past its end so the next dissolves in over it.

## Scenes

| # | Scene | Frames | Start | End | Length | Beat |
|---|---|---|---|---|---|---|
| 1 | `hook` | 0–132 | 0.00s | 4.40s | 4.40s | The contradiction |
| 2 | `oldWay` | 132–249 | 4.40s | 8.30s | 3.90s | The old way, then the turn |
| 3 | `reveal` | 249–324 | 8.30s | 10.80s | 2.50s | Enter Noah |
| 4 | `investigate` | 324–408 | 10.80s | 13.60s | 2.80s | Noah actually checks |
| 5 | `diagnose` | 408–495 | 13.60s | 16.50s | 2.90s | The real cause |
| 6 | `approval` | 495–636 | 16.50s | 21.20s | 4.70s | The trust moment |
| 7 | `execution` | 636–720 | 21.20s | 24.00s | 2.80s | Diagnose / Explain / Approve / Fix |
| 8 | `verify` | 720–801 | 24.00s | 26.70s | 2.70s | The proof |
| 9 | `brand` | 801–942 | 26.70s | 31.40s | 4.70s | Mark, promise, CTA |

## Copy and audio cues

Audio events are generated at these same times by `scripts/build-audio.mjs`, so
picture and sound land together by construction rather than by ear.

| Time | On screen | Audio |
|---|---|---|
| 0.17s | "Your PC got slow." | low impact |
| 1.55s | "Same laptop." | soft bell |
| 2.95s | "So what changed?" | muted impact + riser |
| 4.45s | "Search Reddit." | pulse bed enters, digital tick |
| 5.10s | "Try random fixes." | tick, keyboard taps |
| 5.75s | "Hope something works." | tick, pulse tightens |
| 6.50s | everything drops out | impact, downward sweep |
| 6.85s | "I stopped guessing." | one low note, long tail |
| 8.42s | Noah app icon rises | tonal lift, F major bell |
| 9.25s | "I just told Noah what was wrong." | sweep + bell |
| 11.30–12.80s | checks complete, one at a time | four ticks |
| 14.05s | "Then found the real cause." | riser into subdued impact |
| 15.15s | the four measurements | tick + bell |
| 16.60s | "Then Noah stopped." | everything thins out |
| 17.65s | "It showed me the fix…" — the action button appears | sweep, bell |
| 18.50s | pointer reaches the button, which lifts | soft tick |
| 18.80s | pointer clicks the button | mouse click, bell |
| 19.25s | "Can Noah do this? / Noah needs your OK to continue." | riser, impact |
| 20.45s | pointer clicks "Go ahead" | mouse click, bell |
| 20.65s | "Approved: Action approved" | tick |
| 21.32 / 21.92 / 22.52 / 23.12s | Diagnose / Explain / Approve / Fix | four rising impacts |
| 24.05s | "Verify." | impact, key lifts to C major |
| 25.15s | the re-measurement | resolving bells |
| 26.85s | Noah mark | final controlled impact |
| 28.00 / 28.45 / 28.90s | "Describe it." / "Approve it." / "Done." | tick, tick, impact |
| 29.65s | "Try Noah / onnoah.app" | resolving bells, pad tail |

## Retention beats

A new reason to keep watching roughly every 1.5–2.5 s (§40): spinner → claim →
contradiction → question → clutter → blackout → turn → icon → app → checks
filling in → diagnosis → measurements → "Noah stopped" → the plan → typed
change → permission dialog → click → four-beat cadence → proof → mark → CTA.
