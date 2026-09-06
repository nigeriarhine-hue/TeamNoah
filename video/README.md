# Noah — "Google takes forever to load"

A 57-second Remotion explainer built from one real entry in the Noah dashboard's
fix log (attempt 1, 2026-08-21, conversation `249b3157`).

Render it:

```bash
cd video
npm install
npx remotion render src/index.ts NoahGoogleSlow out/noah-google-takes-forever-to-load.mp4
npx remotion studio        # to scrub and edit interactively
```

1920×1080, 30 fps, 1710 frames. No audio track.

## What's on screen, and where it came from

Every number is quoted from the fix log. Nothing is illustrative.

| On screen | Source |
|---|---|
| `try5: dns=0.002419 connect=1.048312 tls=1.140726 total=1.319595` | pre-fix evidence, verbatim |
| 1 of 5 trials stalled | "1/5 at 1.32s before" |
| slowest after the fix, 0.363 s | `try6: total=0.362561s` |
| fastest after the fix, 0.247 s | post-fix range 0.247–0.363s |
| 6 of 6 trials | "6/6 trials at 0.247–0.363s" |
| −68 dBm, Fair | done card, verbatim |
| stalls can return, follow-up arranged | done card, verbatim |

The other four pre-fix trials were **not** recorded in the log, so they are drawn
as unlabelled marks. Inventing four plausible timings would have been the one
thing the brand refuses.

Before/after compares **slowest trial against slowest trial** — the conservative
read. Comparing the 1.32 s stall against the 0.247 s best would have been a
larger number and a dishonest one.

## Scene order

The order is the brand's messaging rule, not a storyboard preference: symptom,
then the real cause, then the approval.

1. **Symptom** — the user's own words, untranslated
2. **Not junk** — the category's failure is the opening
3. **Diagnose** — the real curl timings; DNS was fine, the TCP connect was the stall
4. **Approve** — one sentence, the gate, the only aurora gradient in the film
5. **Run** — real commands, `$` marks the ones that execute
6. **Proof** — the same diagnostic re-run, teal
7. **Caveat** — the signal is still Fair; the stalls can return, amber
8. **End card** — mark, tagline, the three refusals

## Brand notes for anyone editing this

- Colour meanings are load-bearing. Teal `#0D9488` only ever marks a
  confirmation, amber `#D97706` only ever marks a caution, and the aurora
  gradient appears exactly once, on `Approve`. Spreading any of them around as
  decoration is the one change that would break this.
- Noah is third person throughout. First person belongs to the user.
- `src/components/NoahMark.tsx` is traced from `brand-pack/svg/noah-mark-light.svg`
  and verified pixel-identical to it (differences are sub-pixel antialiasing
  only). Don't recolour, tilt, or crop the waterline — the overshoot past the
  disc is the load line.
- Fonts are vendored under `public/fonts` (all three OFL) so renders are
  deterministic and need no network.

## Rendering environment

`remotion.config.ts` points at the Chromium already on this image rather than
letting Remotion download its own:

```
/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell
```

On a machine without that path, delete the `setBrowserExecutable` line and
Remotion will fetch its own browser.

## Two deliberate departures from the log

**The command shown is the corrected one.** The log records a defect: the Wi-Fi
refresh hardcoded the interface name `Wi-Fi` instead of the actual `en1`, so the
chain exited 10 with `** Error: Error obtaining wireless information`. The toggle
still worked through `networksetup`'s fallback, and the filed fix is to detect the
interface name and use it. The video shows `en1` — the intended behaviour, not the
buggy invocation. If that fix has not shipped yet, this video is ahead of the
product and should wait for it.

**The two tool defects are not in the video.** Both entries in the log's defect
section (the hardcoded interface, and the malformed `open_loop` follow-up payload)
are internal QA about Noah's own tooling, not something a user watching a how-to
needs. The user-facing honesty — the signal is still Fair, the stalls can return —
is in the video, because that came from the done card the user actually sees.

## One inconsistency worth resolving

The done card in the log is written in the **first person**: *"Google now loads in
a quarter-second and I saw no more stalls in 6 trials."* The brand kit is explicit
that Noah is always third person — *"Noah will fix it," never "I will fix it"* —
because an AI posing as a person doesn't build trust. This video follows the brand
kit. Either the app copy or the rule needs to move.
