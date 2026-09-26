"""Voiceover for the Noah gaming ad, generated locally with Kokoro TTS (open-source, Apache-2.0).

pip install kokoro-onnx soundfile numpy
Model files: https://github.com/thewh1teagle/kokoro-onnx/releases (kokoro-v1.0.onnx, voices-v1.0.bin)
Voice: am_michael (American English, male). One clip per line so each lands on its scene.
"""
import pathlib
import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro

OUT = pathlib.Path(__file__).resolve().parent.parent / "public/audio/vo"
k = Kokoro("kokoro-v1.0.onnx", "voices-v1.0.bin")

LINES = {  # (text as spoken, speed)
    "vo01": ("The next big games, like Grand Theft Auto Six and Call of Duty, are coming.", 1.12),
    "vo02": ("But is your PC actually ready?", 1.08),
    "vo03": ("Slow startup, background activity, low storage, and extra system load can all affect your gaming experience before you even start playing.", 1.16),
    "vo04": ("Instead of guessing, tell Noah what's happening.", 1.08),
    "vo05": ("Noah checks your PC,", 1.08),
    "vo06": ("explains what it finds,", 1.08),
    "vo07": ("shows you what it recommends,", 1.08),
    "vo08": ("and nothing changes until you approve it.", 1.08),
    "vo09": ("Then Noah gets to work,", 1.08),
    "vo10": ("and shows you what changed.", 1.08),
    "vo11": ("So before your next big download, check your PC first.", 1.08),
    "vo12": ("Free PC Check.", 1.08),
    "vo13": ("Download Noah, and try it today at on noah dot app.", 1.12),
}

for key, (text, speed) in LINES.items():
    s, sr = k.create(text, voice="am_michael", speed=speed, lang="en-us")
    idx = np.where(np.abs(s) > 0.01)[0]  # trim silence
    s = s[max(0, idx[0] - int(0.03 * sr)): idx[-1] + int(0.08 * sr)]
    y = np.tanh(s / np.abs(s).max() * 1.35)  # gentle soft-limit
    y = y / np.abs(y).max() * 0.89
    sf.write(OUT / f"{key}.wav", y, sr)
    print(key, round(len(y) / sr, 2), "s")
