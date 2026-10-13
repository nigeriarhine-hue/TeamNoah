"""Procedurally synthesize the SFX and music bed used by the Noah explainer videos.

Run:  python3 scripts/make-audio.py   (writes into public/audio/)
Deterministic (fixed seed) so renders are reproducible.
"""
import os
import wave

import numpy as np

SR = 48000
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "audio")
rng = np.random.default_rng(7)


def t(dur):
    return np.arange(int(SR * dur)) / SR


def env(n, attack=0.002, decay=0.08):
    x = np.arange(n) / SR
    a = np.clip(x / max(attack, 1e-6), 0, 1)
    return a * np.exp(-x / decay)


def lowpass(x, cutoff):
    # one-pole low-pass
    a = np.exp(-2 * np.pi * cutoff / SR)
    y = np.empty_like(x)
    acc = 0.0
    for i, v in enumerate(x):
        acc = (1 - a) * v + a * acc
        y[i] = acc
    return y


def highpass(x, cutoff):
    return x - lowpass(x, cutoff)


def save(name, x, peak=0.9, stereo_width=0.0):
    x = np.asarray(x, dtype=np.float64)
    m = np.max(np.abs(x)) or 1.0
    x = x / m * peak
    if x.ndim == 1:
        x = np.stack([x, x], axis=1)
    pcm = (np.clip(x, -1, 1) * 32767).astype(np.int16)
    path = os.path.join(OUT, name)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with wave.open(path, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())
    print("wrote", path, f"{len(x) / SR:.2f}s")


def sine(f, dur, phase=0.0):
    return np.sin(2 * np.pi * f * t(dur) + phase)


# ---------- SFX ----------
def key_click(seed):
    r = np.random.default_rng(seed)
    n = int(SR * 0.045)
    noise = r.standard_normal(n)
    body = highpass(lowpass(noise, 6000), 900) * env(n, 0.0005, 0.006)
    thock = sine(180 + r.uniform(-20, 20), 0.045) * env(n, 0.0005, 0.01) * 0.5
    return body + thock


for i in range(4):
    save(f"sfx/type{i}.wav", key_click(100 + i), peak=0.55)

# send: soft click + upward blip
n = int(SR * 0.22)
x = np.zeros(n)
x[: int(SR * 0.045)] += key_click(9) * 0.8
f = np.linspace(700, 1300, n)
x += np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, 0.004, 0.05) * 0.5
save("sfx/send.wav", x, peak=0.6)

# diagnostic tick
n = int(SR * 0.09)
x = sine(2100, 0.09) * env(n, 0.0005, 0.012) + sine(3150, 0.09) * env(n, 0.0005, 0.006) * 0.3
save("sfx/tick.wav", x, peak=0.4)

# check-complete tick (slightly lower, softer two-step)
n = int(SR * 0.16)
x = sine(1320, 0.16) * env(n, 0.001, 0.03)
x[int(SR * 0.05):] += sine(1760, 0.16 - 0.05) * env(n - int(SR * 0.05), 0.001, 0.035)
save("sfx/check.wav", x, peak=0.38)

# scan: airy filtered noise with slow sweep
dur = 1.6
n = int(SR * dur)
noise = rng.standard_normal(n)
sweep = lowpass(noise, 2500)
sweep = highpass(sweep, 600)
shape = np.sin(np.linspace(0, np.pi, n)) ** 1.5
shimmer = 0.6 + 0.4 * np.sin(2 * np.pi * 9 * t(dur))
save("sfx/scan.wav", sweep * shape * shimmer, peak=0.22)

# reveal: soft pluck
def pluck(freq, dur=0.5, decay=0.18):
    n = int(SR * dur)
    return (sine(freq, dur) + 0.35 * sine(freq * 2, dur) + 0.12 * sine(freq * 3, dur)) * env(n, 0.003, decay)


save("sfx/reveal.wav", pluck(659.25), peak=0.42)
save("sfx/reveal2.wav", pluck(783.99), peak=0.42)

# whoosh: transition air
dur = 0.6
n = int(SR * dur)
noise = rng.standard_normal(n)
w = lowpass(noise, 1800)
shape = np.concatenate([np.linspace(0, 1, int(n * 0.55)) ** 2, np.linspace(1, 0, n - int(n * 0.55)) ** 1.5])
save("sfx/whoosh.wav", w * shape, peak=0.3)

# approval click: crisp mouse click
n = int(SR * 0.08)
noise = rng.standard_normal(n)
x = highpass(noise, 2500) * env(n, 0.0003, 0.004) + sine(1100, 0.08) * env(n, 0.0005, 0.012) * 0.6
save("sfx/approve.wav", x, peak=0.6)

# modal open: soft low swell
dur = 0.5
n = int(SR * dur)
x = (sine(392, dur) + 0.5 * sine(587.33, dur)) * np.sin(np.linspace(0, np.pi, n)) ** 2
save("sfx/modal.wav", x, peak=0.25)

# completion chime: C6 E6 G6 arpeggio
dur = 1.4
n = int(SR * dur)
x = np.zeros(n)
for k, (fq, off) in enumerate([(1046.5, 0.0), (1318.5, 0.09), (1568.0, 0.18)]):
    s = int(SR * off)
    m = n - s
    x[s:] += (np.sin(2 * np.pi * fq * np.arange(m) / SR) + 0.2 * np.sin(2 * np.pi * fq * 2 * np.arange(m) / SR)) * env(m, 0.004, 0.35)
save("sfx/chime.wav", x, peak=0.4)


# ---------- MUSIC ----------
BPM = 100
beat = 60 / BPM
DUR = 47.0
N = int(SR * DUR)
music = np.zeros((N, 2))


def add(sig, start, gain=1.0, pan=0.0):
    s = int(start * SR)
    if s >= N:
        return
    e = min(N, s + len(sig))
    seg = sig[: e - s] * gain
    music[s:e, 0] += seg * (1 - max(0, pan))
    music[s:e, 1] += seg * (1 + min(0, pan))


def kick():
    d = 0.35
    n = int(SR * d)
    f = 45 + 90 * np.exp(-np.arange(n) / SR / 0.03)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, 0.001, 0.12)


def hat(seed):
    r = np.random.default_rng(seed)
    n = int(SR * 0.05)
    return highpass(r.standard_normal(n), 7000) * env(n, 0.0005, 0.012)


def pad(freqs, dur):
    n = int(SR * dur)
    x = np.zeros(n)
    for fq in freqs:
        for det in (-0.12, 0.12):
            x += np.sin(2 * np.pi * fq * (1 + det / 100) * t(dur))
            x += 0.25 * np.sin(2 * np.pi * fq * 2 * (1 + det / 100) * t(dur))
    a = np.minimum(1, np.arange(n) / (SR * 0.6))
    r = np.minimum(1, (n - np.arange(n)) / (SR * 0.6))
    return lowpass(x * a * r, 1400)


def bass(fq, dur):
    n = int(SR * dur)
    return (np.sin(2 * np.pi * fq * t(dur)) + 0.2 * np.sin(2 * np.pi * fq * 2 * t(dur))) * env(n, 0.01, dur * 0.7)


# Fmaj7 - Am7 - Dm9 - Cmaj7(add9)   (2 bars each)
chords = [
    ([174.61, 220.0, 261.63, 329.63], 87.31),
    ([220.0, 261.63, 329.63, 392.0], 110.0),
    ([146.83, 220.0, 261.63, 329.63], 73.42),
    ([130.81, 196.0, 246.94, 293.66], 65.41),
]
bar = beat * 4
pos = 0.0
ci = 0
hat_seed = 0
while pos < DUR:
    freqs, root = chords[ci % 4]
    add(pad(freqs, bar * 2 + 0.6), pos, 0.09)
    for b in range(8):
        tb = pos + b * beat
        # bass on 1 and the "and" of 3
        if b % 4 == 0:
            add(bass(root, beat * 1.5), tb, 0.35)
        if b % 4 == 2:
            add(bass(root, beat * 0.8), tb + beat * 0.5, 0.25)
        # kick on 1 & 3 (beats 0,2), sparse intro
        if pos >= bar * 2 and b % 2 == 0:
            add(kick(), tb, 0.55)
        # 8th hats
        if pos >= bar * 1:
            for h in range(2):
                hat_seed += 1
                add(hat(hat_seed), tb + h * beat / 2, 0.08 if h else 0.12, pan=0.25 if h else -0.15)
        # soft arpeggio pluck on off-beats
        if b % 2 == 1:
            nt = freqs[(b // 2 + ci) % 4] * 2
            add(pluck(nt, 0.6, 0.22), tb + beat * 0.5, 0.05, pan=0.3 if b % 4 == 1 else -0.3)
    pos += bar * 2
    ci += 1

# master fade-out
fade = int(SR * 2.5)
music[-fade:] *= np.linspace(1, 0, fade)[:, None]
fadein = int(SR * 0.4)
music[:fadein] *= np.linspace(0, 1, fadein)[:, None]
save("music-bed.wav", music, peak=0.8)
