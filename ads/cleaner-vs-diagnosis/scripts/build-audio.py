#!/usr/bin/env python3
"""
Build the 20s audio bed for the Noah "Cleaner App vs. Diagnosis" ad.

VO: piper en_US-ryan-high (young American male), the locked script split only at
its own punctuation so the spoken words are verbatim. Each segment is placed at
the beat it belongs to rather than read straight through, so the voice lands with
the visuals.

SFX: synthesized here (no third-party audio), fast ticks on the cleaner side and
sparser, softer tones on the Noah side so the sound design carries the same
contrast as the picture.

Music: intentionally not included - see README.
"""
import os
import subprocess
import wave

import numpy as np

SR = 48000
DUR = 20.0
VOICE = "/tmp/voices/en_US-ryan-high.onnx"
WORK = "/tmp/voices"
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "audio", "mix.wav")

# The locked script, split ONLY at its own punctuation. Joined back together these
# segments reproduce the script exactly, word for word.
SEGMENTS = [
    ("s1", "One app just cleaned a bunch of stuff.", 1.00, 1.12),
    ("s2", "Noah actually checked my PC first.", 6.40, 1.00),
    ("s3", "It showed me what was wrong,", 10.30, 1.00),
    ("s4", "showed me the fix,", 13.20, 1.00),
    ("s5", "and waited for my approval before changing anything.", 15.75, 1.00),
]


def synth():
    for name, text, _start, length_scale in SEGMENTS:
        path = f"{WORK}/{name}.wav"
        subprocess.run(
            ["python3", "-m", "piper", "-m", VOICE, "-f", path,
             "--length-scale", str(length_scale), "--noise-scale", "0.60"],
            input=text.encode(), check=True, capture_output=True,
        )


def read_wav(path):
    with wave.open(path) as w:
        n, sr = w.getnframes(), w.getframerate()
        a = np.frombuffer(w.readframes(n), dtype=np.int16).astype(np.float32) / 32768.0
    if sr != SR:  # linear resample to the project rate
        a = np.interp(np.linspace(0, len(a), int(len(a) * SR / sr), endpoint=False),
                      np.arange(len(a)), a).astype(np.float32)
    return a


def place(bed, sig, at, gain=1.0):
    i = int(at * SR)
    end = min(len(bed), i + len(sig))
    if end > i:
        bed[i:end] += sig[: end - i] * gain


def env(n, attack, release):
    e = np.ones(n, dtype=np.float32)
    a, r = int(attack * SR), int(release * SR)
    if a: e[:a] = np.linspace(0, 1, a)
    if r: e[-r:] = np.linspace(1, 0, r)
    return e


def tone(freq, dur, attack=0.004, release=None, harmonic=0.0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    s = np.sin(2 * np.pi * freq * t)
    if harmonic:
        s += harmonic * np.sin(2 * np.pi * freq * 2 * t)
    return (s * env(n, attack, release if release is not None else dur * 0.8)).astype(np.float32)


def click(dur=0.045, cut=0.55, seed=0):
    """Short filtered-noise tick - the cleaner side's chattery UI."""
    rng = np.random.default_rng(seed)
    n = int(dur * SR)
    s = rng.standard_normal(n).astype(np.float32)
    # one-pole lowpass so it reads as a UI tick, not a hiss
    out = np.zeros(n, dtype=np.float32)
    acc = 0.0
    for i in range(n):
        acc += cut * (s[i] - acc)
        out[i] = acc
    return out * env(n, 0.001, dur * 0.9)


def whoosh(dur=0.42, seed=7):
    rng = np.random.default_rng(seed)
    n = int(dur * SR)
    s = rng.standard_normal(n).astype(np.float32)
    acc, out = 0.0, np.zeros(n, dtype=np.float32)
    sweep = np.linspace(0.04, 0.6, n)  # opening filter = the split snapping open
    for i in range(n):
        acc += sweep[i] * (s[i] - acc)
        out[i] = acc
    return out * env(n, 0.01, dur * 0.7)


def main():
    synth()
    bed = np.zeros(int(DUR * SR), dtype=np.float32)

    # --- voice ---------------------------------------------------------------
    for name, _text, start, _ls in SEGMENTS:
        place(bed, read_wav(f"{WORK}/{name}.wav"), start, gain=1.0)

    # --- split-screen snap ---------------------------------------------------
    place(bed, whoosh(), 0.10, 0.30)
    place(bed, tone(320, 0.18, harmonic=0.3), 0.16, 0.10)

    # --- cleaner side: fast, chattery, slightly cluttered --------------------
    t = 2.75
    i = 0
    while t < 6.05:
        place(bed, click(seed=i), t, 0.085)
        t += 0.155 + (0.05 if i % 3 == 0 else 0.0)
        i += 1
    # broad "sweeping" cleanup passes
    for at in (3.05, 4.15, 5.25):
        place(bed, whoosh(0.30, seed=int(at * 10)), at, 0.055)

    # --- Noah side: sparser, softer, deliberate ------------------------------
    place(bed, tone(523.25, 0.30, attack=0.02, harmonic=0.25), 6.30, 0.085)  # C5 enter
    for k, at in enumerate((7.05, 7.60, 8.15, 8.70, 9.25)):                  # five checked cards
        place(bed, tone(659.25 + k * 28, 0.16, attack=0.008), at, 0.045)
    place(bed, tone(493.88, 0.26, attack=0.02), 10.35, 0.060)                # the finding
    for k, at in enumerate((13.35, 14.05, 14.75, 15.40)):                    # four plan steps
        place(bed, tone(587.33 + k * 34, 0.14, attack=0.008), at, 0.045)

    # --- approval beat -------------------------------------------------------
    place(bed, tone(392.00, 0.22, attack=0.02), 16.30, 0.050)   # modal spotlight
    place(bed, click(0.035, 0.75, seed=99), 18.05, 0.200)       # the click on Go ahead
    place(bed, tone(659.25, 0.16, attack=0.004), 18.22, 0.085)  # completion, E5
    place(bed, tone(987.77, 0.42, attack=0.006), 18.34, 0.070)  # resolving to B5

    # --- master --------------------------------------------------------------
    peak = float(np.max(np.abs(bed)))
    if peak > 0:
        bed *= 0.89 / peak
    # gentle limiter so the ticks never clip the voice
    bed = np.tanh(bed * 1.08) * 0.95

    stereo = np.stack([bed, bed], axis=1)
    pcm = (np.clip(stereo, -1, 1) * 32767).astype(np.int16)
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with wave.open(OUT, "w") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())
    print(f"wrote {OUT}  {len(bed)/SR:.2f}s  peak={peak:.3f}")

    spoken = " ".join(s[1] for s in SEGMENTS)
    print("\nspoken script (must equal the locked script):")
    print(" ", spoken)


if __name__ == "__main__":
    main()
