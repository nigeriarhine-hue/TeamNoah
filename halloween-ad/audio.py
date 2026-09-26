"""Builds the 51 s soundtrack: edited dialogue, a synthesized Halloween score and SFX.

Usage: python3 audio.py <workdir>   (expects a1.wav..a6.wav there, writes mix.wav)
"""
import subprocess, sys, os
import numpy as np

SR = 48000
DUR = 51.0
W = sys.argv[1] if len(sys.argv) > 1 else "."
rng = np.random.default_rng(7)


def load(name):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", os.path.join(W, name), "-ac", "1", "-ar", str(SR),
                          "-f", "f32le", "-"], capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.float32).astype(np.float64)


def cut(x, spans, gap):
    """Keep the given (start, end) spans in seconds, joined by `gap` seconds of silence, with tiny fades."""
    out = []
    for i, (a, b) in enumerate(spans):
        s = x[int(a * SR):int(b * SR)].copy()
        f = int(0.012 * SR)
        s[:f] *= np.linspace(0, 1, f)
        s[-f:] *= np.linspace(1, 0, f)
        out.append(s)
        if i < len(spans) - 1:
            g = gap[i] if isinstance(gap, list) else gap
            out.append(np.zeros(int(g * SR)))
    return np.concatenate(out)


T = np.zeros(int(DUR * SR))           # dialogue bus
M = np.zeros((int(DUR * SR), 2))      # music bus (stereo)
S = np.zeros((int(DUR * SR), 2))      # sfx bus


def place(bus, sig, at, gain=1.0, pan=0.0):
    i = int(at * SR)
    n = min(len(sig), len(bus) - i)
    if n <= 0:
        return
    if bus.ndim == 1:
        bus[i:i + n] += sig[:n] * gain
    else:
        l, r = np.sqrt(0.5 * (1 - pan)), np.sqrt(0.5 * (1 + pan))
        bus[i:i + n, 0] += sig[:n] * gain * l * 1.414
        bus[i:i + n, 1] += sig[:n] * gain * r * 1.414


# ---------------- dialogue (speech spans measured with silencedetect) ----------------
lines = [
    ("a1.wav", [(0.30, 2.13), (2.98, 5.86)], 0.32, 0.25),
    ("a2.wav", [(0.36, 1.01), (1.70, 3.07), (3.97, 5.68)], [0.28, 0.32], 5.30),
    ("a3.wav", [(0.23, 2.71), (3.27, 3.87)], 0.40, 22.05),
    ("a4.wav", [(0.00, 2.57), (3.47, 4.10)], 0.42, 30.80),
    ("a5.wav", [(0.45, 1.69)], 0.0, 41.00),
    ("a6.wav", [(0.46, 1.08), (2.00, 2.62), (3.56, 3.94), (4.89, 5.70), (6.15, 7.24)], [0.78, 0.76, 0.62, 0.22], 44.80),
]
vo_windows = []
for name, spans, gap, at in lines:
    x = load(name)
    x = x / (np.max(np.abs(x)) + 1e-9) * 0.9
    seg = cut(x, spans, gap)
    place(T, seg, at)
    vo_windows.append((at, at + len(seg) / SR))
    print(f"{name}: {at:.2f} -> {at + len(seg) / SR:.2f}")


# ---------------- instruments ----------------
def env(n, a=0.005, d=0.4):
    t = np.arange(n) / SR
    e = np.minimum(1, t / a) * np.exp(-t / d)
    return e


def bell(freq, dur=1.6, amp=0.2):
    n = int(dur * SR); t = np.arange(n) / SR
    s = (np.sin(2 * np.pi * freq * t) + 0.35 * np.sin(2 * np.pi * freq * 2.76 * t) * np.exp(-t / 0.18)
         + 0.18 * np.sin(2 * np.pi * freq * 5.4 * t) * np.exp(-t / 0.07))
    return s * env(n, 0.002, dur / 3.2) * amp


def pluck(freq, dur=0.5, amp=0.3):
    n = int(dur * SR); t = np.arange(n) / SR
    s = sum(np.sin(2 * np.pi * freq * k * t) / k ** 1.4 for k in range(1, 7))
    return s * env(n, 0.003, 0.13) * amp


def pad(freqs, dur, amp=0.05):
    n = int(dur * SR); t = np.arange(n) / SR
    s = np.zeros(n)
    for f in freqs:
        for det in (-0.35, 0.0, 0.4):
            ph = rng.uniform(0, 2 * np.pi)
            s += np.sin(2 * np.pi * (f + det) * t + ph) + 0.25 * np.sin(2 * np.pi * 2 * (f + det) * t + ph)
    a = int(0.8 * SR)
    e = np.ones(n); e[:a] = np.linspace(0, 1, a); e[-a:] = np.linspace(1, 0, a)
    return s * e * amp / len(freqs)


def tick(amp=0.08):
    n = int(0.05 * SR)
    nz = rng.standard_normal(n)
    nz = np.diff(np.concatenate([[0], nz]))  # brighten
    return nz * env(n, 0.0005, 0.008) * amp


def hz(m):
    return 440.0 * 2 ** ((m - 69) / 12)


BPM = 104
beat = 60 / BPM
bar = 3 * beat  # waltz time

# D minor waltz: Dm - Bb - Gm - A   then D major coda
minor = [(50, [62, 65, 69]), (46, [58, 62, 65]), (43, [55, 58, 62]), (45, [57, 61, 64])]
major = [(50, [62, 66, 69]), (55, [59, 62, 67]), (47, [59, 62, 66]), (45, [57, 61, 64])]
box_m = [74, 77, 81, 77, 74, 73]  # music box figures per bar (eighths)
box_M = [74, 78, 81, 78, 74, 76]

t0 = 0.0
b = 0
while t0 < 44.6:
    prog = major if t0 >= 34.8 else minor
    root, chord = prog[b % 4]
    # drone pad across the bar
    place(M, pad([hz(root - 12), hz(chord[0]), hz(chord[2])], bar + 0.9, 0.045 if t0 < 9.6 else 0.06), t0, pan=0)
    fig = box_M if t0 >= 34.8 else box_m
    shift = chord[0] - 62
    for i, m in enumerate(fig):
        place(M, bell(hz(m + shift), 1.3, 0.085), t0 + i * beat / 2, pan=0.35 if i % 2 else -0.25)
    if t0 >= 9.4:
        # oom-pah-pah pizzicato
        place(M, pluck(hz(root - 12), 0.5, 0.33), t0, pan=-0.1)
        for k in (1, 2):
            for m in chord:
                place(M, pluck(hz(m - 12), 0.35, 0.07), t0 + k * beat, pan=0.2)
        for k in range(6):
            place(M, tick(0.05 if k % 2 else 0.08), t0 + k * beat / 2, pan=0.5)
    t0 += bar
    b += 1

# final chord + shimmer on the end card
place(M, pad([hz(38), hz(50), hz(62), hz(66), hz(69)], 6.6, 0.11), 44.5)
for i, m in enumerate([74, 78, 81, 86, 90, 93]):
    place(M, bell(hz(m), 2.6, 0.08), 44.55 + i * 0.09, pan=(-0.6 + i * 0.24))

# riser into the approval click (UI3 starts at 25.8, click at +3.3)
n = int(3.2 * SR); t = np.arange(n) / SR
riser = rng.standard_normal(n)
riser = np.convolve(riser, np.ones(12) / 12, mode="same") * (t / t[-1]) ** 2 * 0.07
place(S, riser, 25.9)

# ---------------- sfx ----------------
def thunder(dur=4.5):
    n = int(dur * SR); x = rng.standard_normal(n)
    for _ in range(3):
        x = np.convolve(x, np.ones(90) / 90, mode="same")
    t = np.arange(n) / SR
    e = (1 - np.exp(-t / 0.05)) * np.exp(-t / 1.3) * (1 + 0.6 * np.sin(2 * np.pi * 1.7 * t) ** 2)
    return x / np.max(np.abs(x)) * e * 0.55


def key(amp=0.12):
    n = int(0.03 * SR); x = rng.standard_normal(n)
    x = np.diff(np.concatenate([[0], x]))
    return x * env(n, 0.0003, 0.006) * amp + pluck(rng.uniform(1800, 2600), 0.03, 0.02)


def click(amp=0.35):
    n = int(0.04 * SR); t = np.arange(n) / SR
    return (np.sin(2 * np.pi * 3200 * t) * np.exp(-t / 0.004) + 0.5 * np.sin(2 * np.pi * 1400 * t) * np.exp(-t / 0.008)) * amp


def whoosh(dur=0.6, amp=0.18):
    n = int(dur * SR); t = np.arange(n) / SR
    x = rng.standard_normal(n)
    x = np.convolve(x, np.ones(25) / 25, mode="same")
    e = np.sin(np.pi * t / dur) ** 2
    return x / np.max(np.abs(x)) * e * amp


def chime(freqs, amp=0.12):
    out = np.zeros(int(1.8 * SR))
    for i, f in enumerate(freqs):
        s = bell(f, 1.5, amp)
        o = int(i * 0.08 * SR)
        out[o:o + len(s)] += s[:len(out) - o]
    return out


place(S, thunder(), 0.05)
place(S, thunder(3.0) * 0.5, 2.6, pan=0.4)
for i in range(11):                               # witch typing at the end of shot 2
    place(S, key(), 7.6 + i * 0.135 + rng.uniform(-0.02, 0.02), pan=0.3)
for i in range(16):                               # typing "My PC feels slow" (UI1 t=0.5..2.1)
    place(S, key(0.1), 9.6 + 0.5 + i * 0.1 + rng.uniform(-0.015, 0.015), pan=0.1)
place(S, click(0.25), 9.6 + 2.5)
place(S, whoosh(0.45, 0.10), 9.6 + 2.5)
for at in (9.35, 15.0, 25.55, 34.55, 44.2):       # scene transitions into UI / end card
    place(S, whoosh(0.55, 0.14), at)
place(S, click(0.35), 25.8 + 3.3)                  # "Go ahead"
place(S, click(0.30), 30.6 + 3.0)                  # witch's mouse click
place(S, chime([hz(74), hz(78), hz(81), hz(86)], 0.10), 34.8 + 2.0)   # Done.
place(S, whoosh(1.0, 0.12), 40.6)
place(S, click(0.12), 15.2 + 6.45)

# ---------------- mix ----------------
duck = np.ones(len(T))
for a, b in vo_windows:
    i, j = int((a - 0.15) * SR), int((b + 0.25) * SR)
    duck[max(0, i):j] = 0.45
k = int(0.12 * SR)
duck = np.convolve(duck, np.ones(k) / k, mode="same")
music = M * duck[:, None] * 0.9
fade = np.ones(len(T)); fo = int(0.3 * SR); fade[-fo:] = np.linspace(1, 0, fo)
fi = int(0.4 * SR); fade[:fi] = np.linspace(0, 1, fi)
mix = (music + S + T[:, None] * 0.95) * fade[:, None]
mix /= max(1.0, np.max(np.abs(mix)) / 0.98)
pcm = (np.clip(mix, -1, 1) * 32767).astype("<i2").tobytes()
subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "s16le", "-ar", str(SR), "-ac", "2", "-i", "-",
                "-af", "loudnorm=I=-14:TP=-1.5:LRA=11", "-ar", str(SR), os.path.join(W, "mix.wav")],
               input=pcm, check=True)
print("mix.wav written")
