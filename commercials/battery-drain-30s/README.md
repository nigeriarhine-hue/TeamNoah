# "Fifteen Minutes" — Noah 34-second commercial

Production package for a premium cinematic spot about a laptop battery draining too fast.

**Runtime:** 34.000s · 24fps · 816 frames · 21 clips
**Master format:** 2.39:1 extraction from a 16:9 UHD generation
**Concept:** A woman loses 12% of her battery in fifteen minutes. Noah measures what is actually
drawing the power, names it, shows her the exact change it wants to make, and waits. She
approves. Noah runs the same check again and shows her the difference.

The spot is built so that **every readable pixel is composited, not generated.** Runway makes
the room, the person, the hands and the physical screen; the Noah interface is built in HTML
(included here) and screen-replaced in After Effects. That is the only reliable way to get
legible UI out of an AI-video pipeline.

---

## Read in this order

| # | File | What it is |
|---|---|---|
| — | [`00-brand-notes-and-decisions.md`](00-brand-notes-and-decisions.md) | **Read first.** Five places the brief and `brand-kit.html` disagree, and what I did about each. Also the culprit-process swap table. |
| 1 | [`01-storyboard.md`](01-storyboard.md) | Beat-by-beat storyboard, five acts, with the panel description for each clip. |
| 2 | [`02-runway-shot-list.md`](02-runway-shot-list.md) | All 21 clips, each with the 16 required fields including the copy-paste Runway prompt. |
| 3 | [`03-voiceover.md`](03-voiceover.md) | Full VO script, frame-accurate, with casting and direction notes and a tight-30 alt. |
| 4 | [`04-onscreen-text.md`](04-onscreen-text.md) | Every word that appears on screen, with type spec and legal super. |
| 5 | [`05-noah-ui-screens.md`](05-noah-ui-screens.md) | The 11 interface screens to build outside Runway, and how to capture them. |
| 6 | [`06-sound-design.md`](06-sound-design.md) | Frame-accurate SFX timeline, sourcing notes, mix targets. |
| 7 | [`07-music-prompt.md`](07-music-prompt.md) | Music generation prompt, structure map, and the sonic logo. |
| 8 | [`08-edit-instructions.md`](08-edit-instructions.md) | Assembly, screen-replacement workflow, grade, transitions, deliverables. |
| 9 | [`09-runway-models-and-settings.md`](09-runway-models-and-settings.md) | Which model and settings for each shot type, and the consistency protocol. |
| 10 | [`10-master-timeline.md`](10-master-timeline.md) | The single sheet: every clip, VO line, UI overlay, SFX and transition on one grid. |

## Buildable asset

- [`ui/noah-ui-screens.html`](ui/noah-ui-screens.html) — all 11 Noah interface screens, built to the
  real Aurora dark ("Lantern") tokens with the real brand fonts embedded. Open it in a browser,
  press **1:1** on a screen, and capture. Works offline; no network, no font fallback risk.

## The one idea

If the edit has room for exactly one idea, it is the approval gate — *nothing runs until you
approve.* Clips 13, 14 and 15 are that idea. Protect their length before anything else.
