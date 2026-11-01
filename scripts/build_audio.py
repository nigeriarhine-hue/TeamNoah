"""Synthesize the music bed and UI sound effects used by Noah educational videos.

Usage: python3 scripts/build_audio.py
Writes WAV files into public/audio/. Everything is generated from scratch (no samples).
"""
import wave
import numpy as np

SR = 48000
OUT = "public/audio/"
rng = np.random.default_rng(7)


def save(name, y, stereo=False):
    y = np.asarray(y, np.float32)
    peak = np.abs(y).max() or 1
    y = y / peak * 0.89
    if y.ndim == 1:
        y = np.stack([y, y], 1)
    with wave.open(OUT + name, "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((y * 32767).astype(np.int16).tobytes())


def t(d):
    return np.arange(int(d * SR)) / SR


def env(n, a, r, curve=4):
    e = np.ones(n)
    na, nr = int(a * SR), int(r * SR)
    if na: e[:na] = np.linspace(0, 1, na)
    if nr: e[-nr:] *= np.linspace(1, 0, nr) ** (curve / 2)
    return e


def lp(x, cutoff):
    # one-pole low-pass
    a = np.exp(-2 * np.pi * cutoff / SR)
    y = np.empty_like(x); acc = 0.0
    for i, v in enumerate(x):
        acc = (1 - a) * v + a * acc; y[i] = acc
    return y


def lp_fast(x, cutoff):
    # FFT brickwall-ish low-pass (fast for long signals)
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR)
    X *= 1 / (1 + (f / cutoff) ** 4)
    return np.fft.irfft(X, len(x))


def hp_fast(x, cutoff):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR)
    X *= 1 / (1 + (cutoff / np.maximum(f, 1)) ** 4)
    return np.fft.irfft(X, len(x))


def note(f):
    return 440 * 2 ** ((f - 69) / 12)

# ---------------- music bed ----------------
DUR = 41.0
BPM = 100
beat = 60 / BPM
N = int(DUR * SR)
L = np.zeros(N); R = np.zeros(N)
# Am9 - Fmaj7 - C(add9) - G6 , 2 bars each (8 beats)
chords = [[57, 64, 67, 71, 72], [53, 60, 64, 67, 69], [48, 55, 62, 64, 67], [55, 59, 62, 64, 71]]
bar = beat * 4
pos = 0.0; ci = 0
while pos < DUR:
    ch = chords[ci % 4]
    d = min(bar * 2, DUR - pos)
    tt = t(d + 0.6)
    pad = np.zeros_like(tt)
    for k, m in enumerate(ch):
        for det in (-0.08, 0.08):
            ph = rng.random() * 6.28
            pad += np.sin(2 * np.pi * note(m + det) * tt + ph) * 0.5 + 0.15 * np.sin(4 * np.pi * note(m + det) * tt + ph)
    pad *= env(len(tt), 0.5, 0.9)
    s = int(pos * SR); e = min(N, s + len(tt))
    L[s:e] += pad[: e - s] * 0.06; R[s:e] += np.roll(pad, 300)[: e - s] * 0.06
    # bass
    bt = t(d)
    b = np.sin(2 * np.pi * note(ch[0] - 12) * bt) * env(len(bt), 0.05, 0.4) * 0.16
    L[s:s + len(bt)] += b[: N - s]; R[s:s + len(bt)] += b[: N - s]
    # pluck arpeggio on 8ths
    arp = [ch[1] + 12, ch[3] + 12, ch[2] + 12, ch[4] + 12]
    for i in range(int(d / (beat / 2))):
        st = pos + i * beat / 2
        pt = t(0.35)
        f = note(arp[i % 4])
        p = (np.sin(2 * np.pi * f * pt) + 0.3 * np.sin(4 * np.pi * f * pt)) * np.exp(-pt * 11)
        a = int(st * SR); b2 = min(N, a + len(pt))
        pan = 0.5 + 0.3 * np.sin(i)
        L[a:b2] += p[: b2 - a] * 0.05 * (1 - pan) * 2; R[a:b2] += p[: b2 - a] * 0.05 * pan * 2
    pos += bar * 2; ci += 1
# soft kick on beats 1 & 3, closed hat on off-beats, starting after 1 bar
kt = t(0.3)
kick = np.sin(2 * np.pi * (48 + 70 * np.exp(-kt * 30)) * kt) * np.exp(-kt * 14)
ht = t(0.05)
hat = hp_fast(rng.standard_normal(len(ht)), 7000) * np.exp(-ht * 90)
k = beat * 4
while k < DUR - 1:
    a = int(k * SR)
    L[a:a + len(kick)] += kick[: N - a] * 0.22; R[a:a + len(kick)] += kick[: N - a] * 0.22
    k += beat * 2
h = beat * 4 + beat / 2
while h < DUR - 1:
    a = int(h * SR)
    L[a:a + len(hat)] += hat[: N - a] * 0.035; R[a:a + len(hat)] += hat[: N - a] * 0.03
    h += beat
mix = np.stack([L, R], 1)
mix[:, 0] = lp_fast(mix[:, 0], 6000); mix[:, 1] = lp_fast(mix[:, 1], 6000)
fade = env(N, 1.2, 2.5)
mix *= fade[:, None]
save("music-bed.wav", mix)

# ---------------- SFX ----------------
# swoosh: filtered noise sweep
d = 0.55; tt = t(d)
n = rng.standard_normal(len(tt))
sw = np.zeros_like(n)
segs = 40
for i in range(segs):
    a, b = i * len(n) // segs, (i + 1) * len(n) // segs
    sw[a:b] = n[a:b]
sw = lp_fast(sw, 2500) * np.sin(np.pi * tt / d) ** 2
sw += 0.25 * np.sin(2 * np.pi * (300 + 900 * tt / d) * tt) * np.sin(np.pi * tt / d) ** 3
save("sfx-swoosh.wav", sw)

# restart whoosh: rising tone + swoosh (the "reboot")
d = 0.9; tt = t(d)
f = 180 + 700 * (tt / d) ** 1.6
rs = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * tt / d) ** 1.5 * 0.5
rs += lp_fast(rng.standard_normal(len(tt)), 1800) * np.sin(np.pi * tt / d) ** 2 * 0.6
save("sfx-restart.wav", rs)

# tick: short soft click
tt = t(0.06)
tick = np.sin(2 * np.pi * 2100 * tt) * np.exp(-tt * 140) + 0.4 * np.sin(2 * np.pi * 3400 * tt) * np.exp(-tt * 200)
save("sfx-tick.wav", tick)

# card pop: two-tone soft blip
tt = t(0.16)
pop = np.sin(2 * np.pi * (660 + 300 * np.exp(-tt * 40)) * tt) * np.exp(-tt * 28)
save("sfx-pop.wav", pop)

# process stop: descending blip
tt = t(0.28)
stop = np.sin(2 * np.pi * np.cumsum(900 - 600 * tt / 0.28) / SR) * np.exp(-tt * 12)
save("sfx-stop.wav", stop)

# reload: ascending two notes
tt = t(0.12)
a1 = np.sin(2 * np.pi * note(76) * tt) * np.exp(-tt * 25)
a2 = np.sin(2 * np.pi * note(83) * t(0.25)) * np.exp(-t(0.25) * 14)
save("sfx-reload.wav", np.concatenate([a1, a2]))

# "returns" (something comes back): low thud + minor blip
tt = t(0.3)
ret = np.sin(2 * np.pi * (90 + 60 * np.exp(-tt * 20)) * tt) * np.exp(-tt * 12) * 0.8
ret += np.sin(2 * np.pi * note(63) * tt) * np.exp(-tt * 10) * 0.35
save("sfx-return.wav", ret)

# typing: soft key clicks
d = 1.6; out = np.zeros(int(d * SR))
p = 0.0
while p < d - 0.08:
    kt2 = t(0.03)
    c = hp_fast(rng.standard_normal(len(kt2)), 2500) * np.exp(-kt2 * 220) * (0.6 + 0.4 * rng.random())
    a = int(p * SR); out[a:a + len(c)] += c
    p += 0.055 + rng.random() * 0.05
save("sfx-typing.wav", out)

# send / UI click
tt = t(0.09)
click = np.sin(2 * np.pi * 1200 * tt) * np.exp(-tt * 70) + hp_fast(rng.standard_normal(len(tt)), 3000) * np.exp(-tt * 300) * 0.3
save("sfx-click.wav", click)

# approve: confident two-note click-up
tt = t(0.45)
ap = (np.sin(2 * np.pi * note(79) * tt) * np.exp(-tt * 9)
      + 0.6 * np.concatenate([np.zeros(int(0.07 * SR)), np.sin(2 * np.pi * note(86) * t(0.38)) * np.exp(-t(0.38) * 8)]))
save("sfx-approve.wav", ap)

# chime: gentle completion
tt = t(1.4)
ch = sum(np.sin(2 * np.pi * note(m) * tt) * np.exp(-tt * (3 + i)) * (0.8 ** i) for i, m in enumerate([84, 88, 91]))
ch[: int(0.005 * SR)] *= np.linspace(0, 1, int(0.005 * SR))
save("sfx-chime.wav", ch)

# low impact (section start)
tt = t(0.7)
imp = np.sin(2 * np.pi * (55 + 40 * np.exp(-tt * 10)) * tt) * np.exp(-tt * 6) + lp_fast(rng.standard_normal(len(tt)), 600) * np.exp(-tt * 15) * 0.4
save("sfx-impact.wav", imp)
print("ok")
