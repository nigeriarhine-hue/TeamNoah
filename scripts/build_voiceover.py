"""Tighten the raw TTS voiceover and export phrase timings for captions.

Usage: python3 scripts/build_voiceover.py <raw.wav>
Writes public/audio/vo-restart.wav and src/restart/voTimings.json
"""
import json, subprocess, sys, wave
import numpy as np

RAW = sys.argv[1]
TEMPO = 1.05
LEAD = 0.25
# Speech intervals (seconds) in the raw TTS file, found with ffmpeg silencedetect.
SEGS = [
    (0.30, 2.11, "Restarting your PC can actually help."),
    (2.70, 4.53, "But if the same problem keeps coming back,"),
    (4.81, 7.26, "restarting probably isn't fixing the reason it started."),
    (8.23, 10.41, "A restart can stop stuck processes,"),
    (10.67, 12.03, "clear temporary activity,"),
    (12.34, 13.96, "and reload system services."),
    (14.82, 16.37, "But startup apps can launch again,"),
    (16.70, 18.50, "background programs can come back,"),
    (18.85, 20.60, "low storage is still low storage,"),
    (20.94, 23.21, "and a problem inside one app may still be there."),
    (24.72, 27.88, "So if you keep restarting your PC just to make it feel normal again,"),
    (28.08, 31.04, "it may be time to figure out what's actually causing the slowdown."),
    (32.83, 34.06, "Noah can check what's happening,"),
    (34.69, 35.99, "explain what it finds,"),
    (36.30, 39.07, "and show you what it recommends before you approve any changes."),
    (39.95, 41.10, "Don't just restart it again."),
    (41.88, 43.14, "Check what keeps coming back."),
    (44.22, 46.66, "Free PC Check at onnoah.app."),
]
# Pause after each segment (pre-tempo seconds).
GAPS = [0.30, 0.12, 0.45, 0.15, 0.15, 0.40, 0.15, 0.15, 0.15, 0.50,
        0.12, 0.50, 0.15, 0.12, 0.45, 0.30, 0.45, 0.0]
PAD = 0.05

w = wave.open(RAW)
sr, ch = w.getframerate(), w.getnchannels()
x = np.frombuffer(w.readframes(w.getnframes()), np.int16).reshape(-1, ch).astype(np.float32)
mono = x.mean(axis=1)

out, timings, t = [np.zeros(int(LEAD * sr), np.float32)], [], LEAD
for (a, b, text), gap in zip(SEGS, GAPS):
    s, e = int((a - PAD) * sr), int((b + PAD) * sr)
    seg = mono[s:e].copy()
    fade = int(0.012 * sr)
    seg[:fade] *= np.linspace(0, 1, fade); seg[-fade:] *= np.linspace(1, 0, fade)
    timings.append({"start": t / TEMPO, "end": (t + len(seg) / sr) / TEMPO, "text": text})
    out.append(seg); t += len(seg) / sr
    out.append(np.zeros(int(gap * sr), np.float32)); t += gap
out.append(np.zeros(int(0.3 * sr), np.float32))
y = np.concatenate(out)
tmp = "/tmp/claude-0/vo/vo_tight.wav"
with wave.open(tmp, "wb") as o:
    o.setnchannels(1); o.setsampwidth(2); o.setframerate(sr)
    o.writeframes(np.clip(y, -32768, 32767).astype(np.int16).tobytes())
subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", tmp, "-af",
                f"atempo={TEMPO},highpass=f=70,acompressor=threshold=-20dB:ratio=2.5:attack=8:release=120,loudnorm=I=-16:TP=-1.5:LRA=9",
                "-ar", "48000", "-ac", "1", "public/audio/vo-restart.wav"], check=True)
json.dump({"duration": t / TEMPO + 0.3, "segments": timings}, open("src/restart/voTimings.json", "w"), indent=1)
for i, s in enumerate(timings):
    print(i, round(s["start"], 2), round(s["end"], 2), s["text"])
