# "5 People. 5 PC Wins. One Noah." (YouTube Short)

A 20-second vertical ad (1080x1920, 30 fps) set in one community-center computer room, with
five adults each saying how Noah helped. The footage is AI-generated on Higgsfield. Everything
brand-related comes from this repo and is rendered locally:

- **UI inserts** are crops of the real Noah screenshots in the repo root (`IMG_0583/0585/0591/0593`).
  Nothing in them is mocked up.
- **Logo** is the official `brand-pack` mark and app icon, used as shipped: no recolouring and no effects.
- **Type** is Plus Jakarta Sans, pulled from `brand-kit.html`. Colours come from the Aurora dark tokens.
- **Website** on the splash is `onnoah.app`, as referenced in `brand-kit.html`.

## Timeline (auto-computed from `timeline.json`)

| t (s) | Beat | On-screen |
|---|---|---|
| 0.00 | Wide room shot, push-in | 5 PEOPLE. 5 PC WINS. ONE NOAH. |
| 1.75 | Person 1: "…typed in the chat like I was talking to a friend…" | JUST DESCRIBE THE PROBLEM + "My PC feels slow → Looking into it…" |
| 5.42 | Person 2: "Noah diagnosed my PC in just a few minutes." | DIAGNOSE. DON'T GUESS. + live checklist |
| 7.59 | Person 3: "Noah didn't execute any fixes without my approval." | YOU STAY IN CONTROL + "Can Noah do this?" dialog |
| 10.24 | Person 4: "…what was driving my CPU usage… isn't lagging anymore." | LESS LAG. REAL CAUSE FOUND. + Situation / What Noah checked |
| 14.28 | Person 5: "I could actually see what Noah wanted to fix before I approved it." | SEE THE FIX BEFORE IT HAPPENS + plan → approval dialog |
| 17.32 | Splash | DESCRIBE IT. APPROVE IT. DONE. · CTA · onnoah.app |

Captions are timed to faster-whisper word timings from the generated clips. Keywords
(chat, diagnosed, approval, CPU, lagging, Noah) are highlighted. Music and SFX (whooshes,
typing, clicks, UI pops, end chime) are synthesized in `compose.py`, so there are no licensing
dependencies. The music ducks under the dialogue, and the mix is normalized to -14 LUFS.

## Build

```bash
pip install pillow numpy imageio-ffmpeg
python3 build_graphics.py                      # -> build/gfx/*.png
# save the clips listed in sources.json as clips/clip0.mp4 … clip5.mp4 (+ thumb_bg.png)
python3 compose.py --clips clips --thumb-bg clips/thumb_bg.png
# -> build/noah_5people_short.mp4, build/noah_5people_thumbnail.png
```
