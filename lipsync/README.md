# Noah lip-sync

`noah_lipsync.mp4` — the FRONT pose from the character sheet, with the screen mouth animated to `pop_noah_27_1.mp3` (1080x1080, 24 fps, 85 s).

How it works:
- `analyze.py` estimates the vocal envelope: centre-panned + harmonic (drums removed via HPSS) energy in the 250–3500 Hz band → `env.npz`.
- `render.py` erases the painted smile, draws pixel-art mouth shapes in the sheet's style (closed smile, 4 open "D" shapes, 4 round "O" shapes for darker vowels), picks one per frame from the envelope, adds a small bob, and muxes with the audio.

Rebuild (from this folder):

```
pip install pillow numpy scipy imageio-ffmpeg
ffmpeg -i pop_noah_27_1.mp3 -ar 22050 -ac 2 song.wav   # or use imageio_ffmpeg's binary
python3 analyze.py && python3 render.py
```
