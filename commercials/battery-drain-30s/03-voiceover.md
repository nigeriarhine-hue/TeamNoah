# Voiceover script

24fps. All timings are frames from 00:00:00. **This file is the timing source of truth** — the
shot list and master timeline are reconciled to it.

---

## The script

> **1.** Your battery shouldn't disappear this fast.
>
> **2.** Cleaning random files won't tell you why.
>
> **3.** Noah measures what's actually using your power.
>
> **4.** It finds the process draining your battery…
>
> **5.** …explains what it found…
>
> **6.** …and shows you exactly what it wants to change.
>
> **7.** You approve it.
>
> **8.** Then Noah checks again.
>
> **9.** No guessing.
>
> **10.** Find the real cause.
>
> **11.** Noah.
>
> **12.** Describe it. Approve it. Done.

## Frame-accurate placement

| # | Line | In (f) | In (TC) | Dur | Out (f) | Out (TC) | Sits over |
|---|---|---|---|---|---|---|---|
| 1 | Your battery shouldn't disappear this fast. | 28 | 00:01:04 | 58f / 2.42s | 86 | 00:03:14 | 01 → 02 |
| 2 | Cleaning random files won't tell you why. | 150 | 00:06:06 | 62f / 2.58s | 212 | 00:08:20 | 04 → 05 |
| 3 | Noah measures what's actually using your power. | 258 | 00:10:18 | 65f / 2.71s | 323 | 00:13:11 | 07 → 08 |
| 4 | It finds the process draining your battery… | 350 | 00:14:14 | 58f / 2.42s | 408 | 00:17:00 | 10 → 11 |
| 5 | …explains what it found… | 416 | 00:17:08 | 36f / 1.50s | 452 | 00:18:20 | 12 |
| 6 | …and shows you exactly what it wants to change. | 462 | 00:19:06 | 70f / 2.92s | 532 | 00:22:04 | 13 → 14 |
| 7 | You approve it. | 538 | 00:22:10 | 29f / 1.21s | 567 | 00:23:15 | 15 → 16 |
| 8 | Then Noah checks again. | 590 | 00:24:14 | 38f / 1.58s | 628 | 00:26:04 | 17 → 18 |
| 9 | No guessing. | 638 | 00:26:14 | 24f / 1.00s | 662 | 00:27:14 | 18 → 19 |
| 10 | Find the real cause. | 686 | 00:28:14 | 36f / 1.50s | 722 | 00:30:02 | 20 |
| 11 | Noah. | 730 | 00:30:10 | 19f / 0.79s | 749 | 00:31:05 | 20 tail, across the dip |
| 12 | Describe it. Approve it. Done. | 758 | 00:31:14 | 52f / 2.17s | 810 | 00:33:18 | 21 |

**Line 11 is the sync point of the film.** "Noah." begins over the last of the room, carries
through the 8-frame dip to black, and resolves on the exact frame the mark appears. If one thing
in the mix has to be frame-perfect, it is this.

## The four silences

Speech occupies 547 of 816 frames — 67%. That is dense for a premium spot, so the gaps are not
leftovers, they are structure. **Do not fill them.**

| Frames | Length | Where | What it is for |
|---|---|---|---|
| 86 – 150 | 2.67s | clips 02–04 | The battery falls and she unplugs it with nobody explaining anything. |
| 232 – 258 | 1.08s | clip 06 | The stopwatch. The whole sound bed drops here too. |
| 532 – 538 | 0.25s | clip 14 → 15 | The gap in which she decides. Music is out entirely across clips 14–15. |
| 662 – 686 | 1.00s | clips 18 → 19 | After "No guessing." Let it sit. |

## Casting and direction

**Voice.** One narrator, whole film. Warm mid-range, unhurried, slightly dry. A competent friend
who already looked at the problem — the brand kit's phrase, and the whole brief. Not a movie
trailer, not a startup founder, not soothing-meditation-app.

Gender is open; audition both. If you cast to contrast with the on-screen actor, cast a man —
otherwise the audience can misread the VO as her interior monologue, and Noah is emphatically not
her inner voice.

**Direction notes.**
- **Never sell.** Every line is a statement of fact. If a read sounds like it wants something
  from the listener, it is wrong.
- **Line 1 is not a warning.** It is an observation, delivered flat. The picture supplies all the
  alarm the moment needs.
- **Line 2 is the only line with an edge.** A small dry drop on "why." This is the anti-cleaner
  jab and the brand's stated enemy. Say it once, don't lean on it.
- **Lines 4–6 are one sentence** broken across three shots. Record them as a single continuous
  breath and split in the edit, or the ellipses will sound like three separate thoughts.
- **Line 7 lands after the click, not before it.** She acts, then the narrator confirms what she
  did. That ordering is the entire point: Noah does not move first.
- **Line 9 is the shortest and the most important.** Two words, full stop, then a second of
  nothing.
- **Line 11 is a name, not a brand sting.** Say it the way you would say a person's name across a
  room. No lift at the end.
- **Line 12: three sentences, three full stops.** Beats of roughly 6 frames between them. "Done."
  is the lowest and quietest word in the film — it is a fact, not a flourish.

**Words never to say,** per `brand-kit.html`: *scan* (as the value), *IT*, *trial*, *free to
use*, *no subscription*, and any absolute privacy claim. None appear in this script; keep it that
way through any client revisions.

## Alternate: tight 30s cut

If the read feels crowded — and at 67% density it may — cut lines **5** and **10**. The picture
already carries both: clip 12 *is* Noah explaining what it found, and the end card already says
"Find what's actually wrong with your Mac."

That removes 72 frames of speech and drops density to 58%, which is the right neighbourhood for
this kind of film. Reclaim the time by shortening clip 01 by 24f and clip 20 by 24f, landing at
**768 frames / 32.00s**. Everything else holds its position relative to its clip.

## Recording spec

- 48kHz / 24-bit WAV, mono, dry, no processing on the print.
- Large-diaphragm condenser, ~20cm, slightly off-axis. Treated room, no reverb tail.
- **Three reads of every line** minimum: one flat, one warm, one with a touch more air. Line 12
  gets six.
- Record 10 seconds of room silence for the noise print.
- Deliver each line as a separate file named `noah_battery_VO_L01.wav` … `L12.wav`.
