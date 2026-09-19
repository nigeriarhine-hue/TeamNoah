# Assembly — "It's Just Slower"

Total ~40s, 16:9. Six live-action takes carry all the dialogue; the four fabricated Noah
screens cut in **over** that dialogue as full-frame inserts. Nothing needs re-voicing.

## Timeline

| # | In | Dur | Source | What's on screen | Audio |
|---|---|---|---|---|---|
| 1 | 0:00 | 5s | take 1 | Tom alone, hands down his face, calls back over his shoulder | "Ell? Can you come here a sec?" |
| 2 | 0:05 | 7s | take 2 | Ellie comes in with the mug, he explains | "What's it doing." / "It boots into Sequoia now — …SanDisk off the back and everything." |
| 3 | 0:12 | 7s | take 3 | Over-shoulder, she leans in | "It's just slower than it was before…" / "So ask Noah. Tell it exactly what you just told me." |
| 4 | 0:19 | 5s | take 5 | **Hold 1.5s, then cut to `screens/01-looking-into-it.png` for 3.5s** | "...All of that?" / "All of that." |
| 5 | 0:24 | 7s | take 6 | **Cut to `screens/02-the-plan.png` on her first word; at "asked first" cut to `03-can-noah-do-this.png`** | "Spotlight's still rebuilding…" / "...It's not touching the OpenCore patches." / "Because it asked first." |
| 6 | 0:31 | 5s | take 4 | **Open on `screens/04-done.png` 1.5s, then cut back to the two of them** | "Huh." / "Mm-hm." + footsteps out |
| 7 | 0:36 | 4s | `screens/05-endcard.png` | End card | room tone falls away to silence |

## How the inserts should sit

- Cut to the insert **on a word, not on a pause** — the dialogue running underneath is what
  sells it as one continuous moment rather than a slideshow.
- Scale the insert to ~96% and let it drift ~1% over its length. A perfectly static screengrab
  reads as a screenshot; a hair of movement reads as a shot.
- Keep the live-action room tone under every insert. Silence under a cutaway kills it.
- Shots 4/5/6 were framed deliberately soft on the monitor so there's no clash between the
  out-of-focus glow in the take and the sharp UI in the insert.

## Notes on what shipped

- **Take 2 was resubmitted.** The first attempt returned a preset recommendation ("IN THE
  DARK") instead of a job; it went back through with that preset declined.
- **Dialogue is Kling's native audio**, generated per shot with the lines in the prompt. It is
  not TTS laid over the top, so there's no lip-sync drift to fix — but it also means delivery
  varies take to take. Re-roll any individual take that reads wrong; the keyframes are fixed
  so the casting won't move.
- **Screens are not AI-generated UI.** They're the real app's layout rebuilt in HTML
  (`noah-screens.html`) and rendered through Playwright at 2340×1960, which is why the type
  is sharp enough to sit full-frame.

## Re-rendering the screens

```bash
cd ad-imac-sequoia
node shoot.mjs          # screens/01..04
node shoot-endcard.mjs  # screens/05
```

Edit the content in `noah-screens.html` — the four states are the `SCREENS` object near the
bottom, and `PLAN_CARD` is shared between the plan and the permission-dialog screen so the
two can't drift apart.
