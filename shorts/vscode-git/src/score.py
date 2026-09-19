#!/usr/bin/env python3
"""Procedural score for the Noah short.
Bright, light, major-key. Every hit is pinned to a scene boundary in anim.js,
so picture and sound land together by construction."""

import numpy as np, wave, struct

SR   = 48000
DUR  = 34.00
N    = int(SR * DUR)
T    = np.arange(N) / SR
BPM  = 100.0
BEAT = 60.0 / BPM

L = np.zeros(N); R = np.zeros(N)

def add(buf_l, buf_r, start, sig, pan=0.0, gain=1.0):
    """pan -1 left .. +1 right"""
    i = int(start * SR)
    if i >= N: return
    s = sig[:max(0, N - i)]
    gl = gain * np.sqrt((1 - pan) / 2) * 1.4142
    gr = gain * np.sqrt((1 + pan) / 2) * 1.4142
    buf_l[i:i + len(s)] += s * gl
    buf_r[i:i + len(s)] += s * gr

def m2f(m):  return 440.0 * 2 ** ((m - 69) / 12.0)
def env(n, a, d, s_lvl, r, sustain_n=None):
    a, d, r = max(int(a * SR), 1), max(int(d * SR), 1), max(int(r * SR), 1)
    sus = n - a - d - r
    if sus < 0: sus = 0; d = max(1, min(d, n - a - r))
    e = np.concatenate([np.linspace(0, 1, a),
                        np.linspace(1, s_lvl, d),
                        np.full(max(sus, 0), s_lvl),
                        np.linspace(s_lvl, 0, r)])
    return np.resize(e, n)

def softclip(x, k=1.6):  return np.tanh(x * k) / np.tanh(k)

def fftfilt(x, gain_of_f):
    """zero-phase spectral shaping — no scipy needed"""
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR)
    return np.fft.irfft(X * gain_of_f(f), len(x))

def air(x, fc=3200, order=1.8):      # soft low-pass: 'shhh', not 'tss'
    return fftfilt(x, lambda f: 1 / np.sqrt(1 + (f / fc) ** (2 * order)))

# ---------------------------------------------------------------- pad
CHORDS = [   # (start, end, midi notes)
    (0.00,  4.10, [54, 57, 61, 64, 68]),   # F#m9   — the bug
    (4.10,  7.60, [50, 54, 57, 59, 64]),   # D6/9   — their words
    (7.60, 10.90, [52, 56, 59, 64, 66]),   # E      — Noah steps in
    (10.90,16.10, [57, 61, 64, 71]),       # Aadd9  — the checks
    (16.10,20.20, [54, 57, 61, 64, 68]),   # F#m9   — the culprit
    (20.20,24.20, [50, 54, 57, 61, 64]),   # Dmaj9  — the fix
    (24.20,28.40, [52, 56, 59, 64, 66]),   # E      — proof
    (28.40,30.70, [57, 61, 64, 71]),       # Aadd9  — they confirm
    (30.70,34.00, [57, 61, 64, 66, 71]),   # A6/9   — resolve
]
XF = 0.55
for (a, b, notes) in CHORDS:
    n = int((b - a + XF) * SR)
    tt = np.arange(n) / SR
    seg = np.zeros(n)
    for k, mid in enumerate(notes):
        f = m2f(mid)
        vib = 1 + 0.0016 * np.sin(2 * np.pi * (0.7 + 0.13 * k) * tt + k)
        v  = np.sin(2 * np.pi * f * tt * vib)
        v += 0.30 * np.sin(2 * np.pi * f * 2 * tt)           # octave shimmer
        v += 0.14 * np.sin(2 * np.pi * f * 3 * tt)
        v += 0.22 * np.sin(2 * np.pi * f * 1.002 * tt)       # detune, chorus width
        seg += v / (1.6 + 0.55 * k)
    e = env(n, 0.42, 0.5, 0.85, XF)
    seg *= e
    pan = -0.22 if (int(a) % 2 == 0) else 0.22
    add(L, R, a, seg, pan, 0.140)

# ---------------------------------------------------------------- sub bass, pulsing on the beat
ROOTS = [(a, b, r) for (a, b, _), r in zip(CHORDS, [42, 38, 40, 45, 42, 38, 40, 45, 45])]
for (a, b, root) in ROOTS:
    t = a
    while t < b - 0.05:
        n = int(min(BEAT * 1.02, b - t) * SR)
        if n < 400: break
        tt = np.arange(n) / SR
        f = m2f(root)
        v = np.sin(2 * np.pi * f * tt) + 0.22 * np.sin(2 * np.pi * f * 2 * tt)
        v *= env(n, 0.012, 0.16, 0.42, 0.22)
        add(L, R, t, v, 0.0, 0.19)
        t += BEAT

# ---------------------------------------------------------------- arp sparkle (builds from S2)
ARP_FROM, ARP_TO = 4.10, 33.2
step = BEAT / 2
t = ARP_FROM
i = 0
while t < ARP_TO:
    ch = next((c for c in CHORDS if c[0] <= t < c[1]), CHORDS[-1])
    notes = ch[2]
    mid = notes[i % len(notes)] + 12
    n = int(0.34 * SR); tt = np.arange(n) / SR
    f = m2f(mid)
    v = (np.sin(2 * np.pi * f * tt)
         + 0.42 * np.sin(2 * np.pi * f * 2 * tt)
         + 0.16 * np.sin(2 * np.pi * f * 3.01 * tt))
    v *= np.exp(-tt * 11.0)
    build = 0.30 + 0.70 * min(1.0, (t - ARP_FROM) / 22.0)
    add(L, R, t, v, -0.5 if i % 2 else 0.5, 0.034 * build)
    t += step; i += 1

# ---------------------------------------------------------------- soft hats on 8ths
t = 2.0
rng = np.random.default_rng(7)
while t < 33.4:
    n = int(0.055 * SR)
    v = rng.standard_normal(n) * np.exp(-np.arange(n) / SR * 90)
    v = v - np.convolve(v, np.ones(12) / 12, mode='same')     # take out the mud
    v = air(v, 9000, 1.2)                                     # and the fizz
    accent = 1.0 if abs((t / BEAT) % 1) < 0.01 else 0.42
    bld = 0.35 + 0.65 * min(1.0, (t - 2.0) / 20.0)
    add(L, R, t, v, 0.28, 0.013 * accent * bld)
    t += BEAT / 2

# ---------------------------------------------------------------- transition whooshes
BOUNDS = [4.10, 7.60, 10.90, 16.10, 20.20, 24.20, 28.40, 30.70]
for b in BOUNDS:
    d = 0.62; n = int(d * SR); tt = np.arange(n) / SR
    noise = rng.standard_normal(n)
    out = air(noise, 2600, 1.6)                     # soft-edged air
    out = out - np.convolve(out, np.ones(220) / 220, mode='same')   # lose the rumble
    out *= np.sin(np.pi * np.linspace(0, 1, n)) ** 1.8
    add(L, R, b - 0.42, out, 0.0, 0.055)
    # a little downward tail so the cut feels landed
    n2 = int(0.30 * SR); t2 = np.arange(n2) / SR
    ft = np.linspace(760, 300, n2)
    tail = np.sin(2 * np.pi * np.cumsum(ft) / SR) * np.exp(-t2 * 9)
    add(L, R, b, tail, 0.0, 0.035)

# ---------------------------------------------------------------- UI ticks on element entrances
def tick(at, f=1850, g=0.055, dec=42):
    n = int(0.12 * SR); tt = np.arange(n) / SR
    v = (np.sin(2 * np.pi * f * tt) + 0.5 * np.sin(2 * np.pi * f * 2.02 * tt)) * np.exp(-tt * dec)
    add(L, R, at, v, 0.0, g)

for s, off in [(10.90, [.34, .62, .90, 1.18])]:          # the four check tiles
    for k, o in enumerate(off): tick(s + o - 0.18, 1500 + k * 190, 0.060)
tick(13.07, 900, 0.075, 26)                               # "cause" callout shake
for o in [.55, .78, 1.01]: tick(20.20 + o - 0.18, 1400, 0.045)   # plan rows
tick(16.10 + 1.95 - 0.18, 700, 0.075, 24)                 # "No such file"

# typing clicks
def typing(t0, t1, rate=15, g=0.017):
    t = t0
    while t < t1:
        n = int(0.035 * SR)
        v = rng.standard_normal(n) * np.exp(-np.arange(n) / SR * 200)
        add(L, R, t, air(v, 5200, 1.4), rng.uniform(-.3, .3), g)
        t += 1.0 / rate
typing(0.00 + 1.30 - 0.18, 0.00 + 1.86 - 0.18)            # s1  git --version
typing(24.20 + .60 - 0.18, 24.20 + 1.12 - 0.18)           # s7  which git
typing(24.20 + 1.74 - 0.18, 24.20 + 2.34 - 0.18)          # s7  git --version

# ---------------------------------------------------------------- click + confirm
def chime(at, midis, g=0.085, sp=0.085, dec=5.5):
    for k, mid in enumerate(midis):
        n = int(1.5 * SR); tt = np.arange(n) / SR
        f = m2f(mid)
        v = (np.sin(2 * np.pi * f * tt) + 0.45 * np.sin(2 * np.pi * f * 2 * tt)
             + 0.18 * np.sin(2 * np.pi * f * 3 * tt) + 0.09 * np.sin(2 * np.pi * f * 4.7 * tt))
        v *= np.exp(-tt * dec)
        add(L, R, at + k * sp, v, -0.3 + 0.2 * k, g)

# the press
n = int(0.20 * SR); tt = np.arange(n) / SR
press = (np.sin(2 * np.pi * 420 * tt) * np.exp(-tt * 30)
         + rng.standard_normal(n) * np.exp(-tt * 120) * 0.5)
add(L, R, 20.20 + 2.10 - 0.18, press, 0.0, 0.10)

chime(20.20 + 2.45 - 0.18, [69, 73, 76], 0.070)           # "Sent"
chime(24.20 + 2.95 - 0.18, [76, 81, 85, 88], 0.080)       # trash confirmed
chime(30.70 + 0.05,        [69, 73, 76, 81, 88], 0.095, 0.07, 3.4)   # the burst

# riser into the closer
d = 1.5; n = int(d * SR); tt = np.arange(n) / SR
ft = np.linspace(180, 1500, n)
riser = np.sin(2 * np.pi * np.cumsum(ft) / SR) * (np.linspace(0, 1, n) ** 2.2)
riser += rng.standard_normal(n) * np.linspace(0, .5, n) * 0.35
add(L, R, 30.70 - d, riser, 0.0, 0.055)

# final shimmer
n = int(3.0 * SR); tt = np.arange(n) / SR
sh = rng.standard_normal(n) * np.exp(-tt * 1.5)
sh = sh - np.convolve(sh, np.ones(16) / 16, mode='same')
add(L, R, 30.70, air(sh, 7000, 1.3), 0.0, 0.020)

# ---------------------------------------------------------------- master
for buf in (L, R):
    buf[:int(0.25 * SR)] *= np.linspace(0, 1, int(0.25 * SR))          # fade in
    buf[-int(1.1 * SR):] *= np.linspace(1, 0, int(1.1 * SR))           # fade out

def master_curve(f):
    hi = 1 / np.sqrt(1 + (f / 8500) ** 2.4)                 # gentle air roll-off
    lo = (f / 32) ** 2 / (1 + (f / 32) ** 2)                # high-pass below ~32 Hz
    return hi * lo
L = fftfilt(L, master_curve); R = fftfilt(R, master_curve)
mix = np.stack([softclip(L, 1.35), softclip(R, 1.35)], axis=1)
peak = np.max(np.abs(mix))
mix = mix / peak * 0.89
rms = np.sqrt(np.mean(mix ** 2))
print(f"peak {20*np.log10(np.max(np.abs(mix))):.2f} dBFS   rms {20*np.log10(rms):.2f} dBFS")

pcm = (mix * 32767).astype('<i2')
with wave.open('score.wav', 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes(pcm.tobytes())
print("wrote score.wav", round(len(pcm) / SR, 2), "s")
