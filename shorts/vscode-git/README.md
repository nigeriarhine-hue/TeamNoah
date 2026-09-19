# "git isn't installed" — YouTube Short

`noah-vscode-git-short.mp4` — 1080×1920, 60 fps, 34.0 s, H.264 + AAC, −14.0 LUFS.

A Noah issue-fixed short built from the real VS Code / git case: after a macOS
Golden Gate upgrade, VS Code reported no git while `git` worked fine in the
terminal. The cause was a dead Intel-Homebrew symlink at `/usr/local/bin/git`
sitting ahead of Apple's git on `$PATH`.

All on-screen copy, metrics, timings and chat lines are **fabricated for the
video** around that real issue.

## Look

Deliberately **not** the brand kit — this one is its own thing: a light,
high-key palette on a drifting pastel mesh, with saturated accents.

| token | hex | used for |
| --- | --- | --- |
| ink | `#101733` | display type |
| coral | `#FF4D6D` | the fault |
| tangerine | `#FF922B` | warm gradient |
| sunshine | `#FFC93C` | warm gradient |
| mint | `#0FCFA0` | the fix |
| sky | `#23A9FF` | cool gradient |
| grape | `#8B5CF6` | cool gradient |

Type is Inter Variable + JetBrains Mono. The two terminal cards are the only
dark surfaces — they read as a shell, and they give the light frame something
to push against.

## Cut

| in | scene | beat |
| --- | --- | --- |
| 0.00 | s1 | VS Code says git isn't installed — and the terminal disagrees |
| 4.10 | s2 | what they said |
| 7.60 | s3 | Noah opens and reads the whole path |
| 10.90 | s4 | four checks |
| 16.10 | s5 | the dead symlink |
| 20.20 | s6 | the plan, one click |
| 24.20 | s7 | `which git` → `/usr/bin/git` |
| 28.40 | s8 | they confirm |
| 30.70 | s9 | 1 attempt. Fixed. |

Scenes cross-dissolve over 0.26 s; incoming content starts 0.18 s inside the
overlap so no beat ever shows an empty frame.

Content sits between y≈260 and y≈1580 — clear of the Shorts title, channel
strip and the right-hand button column.

## Rebuilding

```
apt-get install -y --no-install-recommends ffmpeg fonts-inter-variable fonts-jetbrains-mono
pip install numpy

node src/shoot.mjs preview 3.4,9.8,23      # single frames -> src/prev/
node src/shoot.mjs full   out.mp4          # 2040 frames, ~4.5 min
python3 src/score.py                       # -> score.wav

ffmpeg -i out.mp4 -i score.wav -filter:a "volume=-1.8dB" \
  -map 0:v:0 -map 1:a:0 -c:v copy -c:a aac -b:a 192k -ar 48000 -ac 2 \
  -movflags +faststart -shortest noah-vscode-git-short.mp4
```

`src/anim.js` exposes `window.__seek(t)` and every property is a pure function
of `t` — no CSS transitions, no `requestAnimationFrame` — so a frame renders
identically whenever it is asked for, and the render is resumable and
reproducible.

`src/shoot.mjs` pipes JPEG frames straight into ffmpeg rather than writing a
frame sequence to disk. JPEG over PNG is ~6× faster here and costs nothing
visible, since the delivered H.264 is 4:2:0 either way.

`src/score.py` writes the soundtrack from scratch with numpy. Its chord changes,
whooshes, UI ticks and chimes are keyed to the same scene boundaries listed
above, so picture and sound land together by construction rather than by
nudging a waveform around.
