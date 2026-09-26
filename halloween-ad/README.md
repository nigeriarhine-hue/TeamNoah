# Noah — Halloween YouTube spot (1920×1080, ~51 s)

Production sources for `NOAH_HALLOWEEN_YOUTUBE_1920x1080.mp4`.

| File | What it is |
|---|---|
| `stage.html` | Noah UI inserts (recreated 1:1 from the app screenshots in the repo root), the end card, and caption plates. `render(scene, t)` is deterministic per frame. |
| `render.mjs` | Playwright renderer: writes 30 fps frames for `ui1–ui4`, `splash`, plus transparent caption PNGs. |
| `captions.json` | Caption text and on-screen windows (seconds). |
| `audio.py` | Edits the dialogue takes, synthesizes the waltz score + SFX, ducks music under dialogue, loudness-normalizes to −14 LUFS. |
| `build.sh` | Conforms the witch shots, renders, concatenates, burns captions, and muxes the final MP4. |

## Edit

| Time | Shot | Line / caption |
|---|---|---|
| 0.0–5.0 | Wide: witch left, PC right, cottage décor | "Six hundred years of spells… and this PC still takes ten minutes to boot." |
| 5.0–9.6 | Centered MCU, pushes spellbook aside, types | "Fine. No potions tonight. Let's try Noah." |
| 9.6–15.2 | Noah UI: types *My PC feels slow* → *Looking into it…* | Describe it in your own words. |
| 15.2–21.8 | Noah UI: Situation / What Noah checked / What Noah would do | Noah finds what's actually wrong. |
| 21.8–25.8 | Two-shot, witch + cat react | "Seven programs haunting my startup? Rude." |
| 25.8–30.6 | Noah UI: *Can Noah do this?* → Go ahead | Nothing runs until you approve. |
| 30.6–34.8 | Close-up, ringed finger clicks | "It actually asks first? …Go ahead." |
| 34.8–40.6 | Noah UI: Done — Teams off, ~450 MB cleared | Done — and reversible anytime. |
| 40.6–44.5 | Wide, witch triumphant | "Now that's magic!" |
| 44.5–51.0 | End card: icon + NOAH · DESCRIBE IT. APPROVE IT. DONE. · DOWNLOAD NOAH · onnoah.app | VO: "Describe it. Approve it. Done. Download Noah, at onnoah.app." |

Witch shots: GPT Image 2.5 key frames → Kling 3.0 Pro image-to-video (Higgsfield). Voices: Seed Audio (Tallulah = witch, Orion = narrator).

## Build

In a directory holding `v0.mp4…v4.mp4` and `a1.wav…a6.wav`:

```bash
SRC=/path/to/halloween-ad bash /path/to/halloween-ad/build.sh
```
