# Assembly — "It's Just Slower"

Total 41.97s, 16:9. Six live-action takes carry all the dialogue; the four fabricated Noah
screens cut in **over** that dialogue as full-frame inserts. Nothing needs re-voicing.

## Timeline — as built (41.97s)

Built by `assemble.sh`; times are measured from the finished file, not planned.

| # | In | Out | Source | What's on screen | Audio |
|---|---|---|---|---|---|
| 1 | 0:00.00 | 0:07.04 | take 1 | Tom alone, calls back over his shoulder | "Ell? Can you come here a sec?" |
| — | 0:06.72 | 0:07.02 | — | **0.3s dissolve into scene 2** | audio crossfades over room tone only |
| 2 | 0:07.02 | 0:13.76 | take 2 | Ellie comes in with the mug | "What's it doing." / "It boots into Sequoia now…" |
| 3 | 0:13.76 | 0:20.80 | take 3 | Over-shoulder, she leans in | "It's just slower…" / "So ask Noah." |
| 4 | 0:20.80 | 0:25.84 | take 4 | live 1.5s, then `01-looking-into-it` | "...All of that?" / "All of that." |
| 5 | 0:25.84 | 0:32.88 | take 5 | `02-the-plan`, then `03-can-noah-do-this` at +4.5s | "Spotlight's still rebuilding…" / "Because it asked first." |
| 6 | 0:32.88 | 0:37.92 | take 6 | `04-done` for 1.5s, then back to them | "Huh." / "Mm-hm." |
| 7 | 0:37.92 | 0:41.97 | `05-endcard` | End card | silent |

Inserts are the app window at ~95% height, centred on `#0b0b10` — the same ground
as the end card, so the two read as one system.

## How the inserts should sit

- Cut to the insert **on a word, not on a pause** — the dialogue running underneath is what
  sells it as one continuous moment rather than a slideshow.
- **Never place a dissolve by eye against a take's nominal length.** Measure where speech
  actually stops and start the transition after it. The 1→2 dissolve is positioned this way
  (`speech_end.py`); an earlier guess landed 0.16s inside the last word and smeared it.
  The remaining cuts are hard — takes 2 and 3 end within 0.04s of their last syllable, so
  there is no room tone to dissolve through without eating dialogue.
- **Not yet done:** the inserts in the delivered cut are static. A ~1% drift over each
  insert's length would help — a perfectly still screengrab reads as a screenshot, a hair of
  movement reads as a shot. Left out because `zoompan` tends to judder on a still and there
  was no way to eyeball the result from here; it's a two-minute fix in any NLE.
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
