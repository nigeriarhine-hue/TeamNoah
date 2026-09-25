# Noah music video: YouTube Short (9:16), pop_noah_27_1

Pipeline: branded start frames (GPT Image 2.5, using the Noah character sheet and the brand mark as references)
→ Wan 2.7 audio-synced clips (one per song section, the section audio passed as the audio reference)
→ cut together on the original song → Lantern end card from the PC-slowdown Short
(`splash_endcard.mp4` = last 4.85 s of `video/out/noah-pc-slowdown-short.mp4`).
No on-screen lyrics.

| # | Song time | Lyric | Start frame | Action |
|---|---|---|---|---|
| 1 | 0.0–10.0 | "Dude, that's a brand new computer software…" | desk + phone (0da08074) | talking on phone, excited gestures |
| 2 | 10.0–20.2 | "You describe a problem in plain English…" | loft + phone (d910a1da) | paces while on phone, counts on fingers |
| 3 | 20.2–28.4 | "A couple years has passed, my computer's starting to slow up…" | evening desk (a9c06f3d) | frustrated, hands on head, rapping |
| 4 | 28.4–40.7 | "…fans not blowing, apps keep crashing… what do I do?" | evening desk (a9c06f3d) | stands up, shrugs, big gestures |
| 5 | 40.7–49.6 | "I came across a couple options… downloaded Noah" | studio mark wall (70cee54e) | performs, points at camera |
| 6 | 49.6–58.4 | "…Mac and PC, it's cool, I'm very satisfied" | rooftop (f8991769) | arms-crossed swagger, bounces |
| 7 | 58.4–64.4 | "And install now, this paper is going down…" | desk + phone (0da08074) | celebrates, laptop working |
| 8 | 64.4–75.5 | "Just download Noah… slow computer, Wi-Fi… storage…" | creative studio (77e9a98b) | rap performance, counts off issues |
| 9 | 75.5–82.5 | "…download Noah and install today" | studio mark wall (70cee54e) | points at camera, big finish |
| — | 82.5–end | end card | splash_endcard.mp4 | Noah mark → "Describe it. Approve it. Done." |

## Rendered (2026-09-25)

Final Short (1080×1920, 30 fps, 87.3 s, song + end card, no lyrics on screen), saved in the Higgsfield media library:
https://d2ol7oe51mr4n9.cloudfront.net/user_3JA3Cf9f9t4L7C7zPSqBOLYIbCb/f76c9ce7-1a26-4c42-ac85-0883ac2c7aaf.mp4

Wan 2.7 clip jobs (shots 1–9), each trimmed to its section length:
365b4285, 56232407, 79681f48, 6b65e5c0, 547c770f, 26b4cd77, 0a14f25c, 2e95280c, 9c21aee9.
Frames per shot at 30 fps: 300, 306, 246, 369, 267, 264, 180, 333, 210 (= 82.5 s), then the 4.8 s end card.
Audio is the original MP3 from 0 s, padded under the end card, with a 1.5 s fade-out.

To redo a shot, re-run that Wan job with the same start frame and audio piece, then re-run the assembly.
