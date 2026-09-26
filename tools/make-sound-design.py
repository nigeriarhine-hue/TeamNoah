"""
Sound design bed for the 15s cut: a quiet tonal pad plus four cues.

The voiceover is the primary audio, so everything here is mixed well under it.
No futuristic robot sounds — the cues are the kind a Mac makes.
"""
import math, struct, wave
import numpy as np

SR = 48000
DUR = 15.0
N = int(SR * DUR)
t = np.arange(N) / SR

TOTAL_FRAMES = 450
FPS = 30
f = lambda frame: frame / FPS

CUE = {
    'glitch':  0.55,        # the stutter he notices
    'push':    f(148) - 0.22,  # move into the software
    'click':   f(371),      # the pointer presses Go ahead
    'chime':   f(402) + 0.02,  # done
    'endcard': f(420),
}

rng = np.random.default_rng(7)


def env(start, attack, hold, release, curve=2.0):
    """One-shot envelope over the whole timeline."""
    e = np.zeros(N)
    a0, a1 = int(start * SR), int((start + attack) * SR)
    h1 = int((start + attack + hold) * SR)
    r1 = int((start + attack + hold + release) * SR)
    a0, a1, h1, r1 = [max(0, min(N, x)) for x in (a0, a1, h1, r1)]
    if a1 > a0:
        e[a0:a1] = np.linspace(0, 1, a1 - a0) ** (1 / curve)
    if h1 > a1:
        e[a1:h1] = 1.0
    if r1 > h1:
        e[h1:r1] = np.linspace(1, 0, r1 - h1) ** curve
    return e


def onepole_lp(x, cutoff):
    """Cheap one-pole low-pass; cutoff may be an array."""
    a = np.exp(-2 * np.pi * np.asarray(cutoff, dtype=float) / SR)
    a = np.broadcast_to(a, x.shape).copy()
    y = np.zeros_like(x)
    prev = 0.0
    for i in range(len(x)):
        prev = (1 - a[i]) * x[i] + a[i] * prev
        y[i] = prev
    return y


def onepole_hp(x, cutoff):
    return x - onepole_lp(x, cutoff)


def tone(freq, phase=0.0):
    return np.sin(2 * np.pi * freq * t + phase)


# ---------------------------------------------------------------- pad
# D minor-ish drone: root, fifth, octave, with slow detune movement.
pad = np.zeros(N)
for fr, amp, det in ((73.42, 0.55, 0.0), (110.0, 0.30, 0.13), (146.83, 0.22, -0.11),
                     (220.0, 0.10, 0.19), (293.66, 0.06, -0.2)):
    drift = 1 + det * 0.0012 * np.sin(2 * np.pi * 0.07 * t + fr)
    pad += amp * np.sin(2 * np.pi * fr * drift * t)
pad /= np.max(np.abs(pad))

# a slow breath so it is not a flat organ note
pad *= 0.72 + 0.28 * (0.5 + 0.5 * np.sin(2 * np.pi * 0.11 * t - 1.2))

# air
air = onepole_lp(rng.normal(0, 1, N), 900) * 0.25
pad = pad * 0.9 + air * 0.1

# the pad lifts as the film moves into the product, and opens out on the end card
shape = np.interp(
    t,
    [0.0, 0.5, f(89), f(148), f(297), f(387), f(420), DUR - 0.35, DUR],
    [0.00, 0.55, 0.62, 0.85, 0.80, 0.95, 1.00, 1.00, 0.00],
)
pad *= shape

# ------------------------------------------------------------- glitch
# A short stutter, like a frame hitch — gated noise plus a tone dropping pitch.
g0 = CUE['glitch']
gate = np.zeros(N)
seg = int(0.026 * SR)
for k in range(7):
    s = int((g0 + k * 0.030) * SR)
    if k % 2 == 0 and s + seg < N:
        gate[s:s + seg] = 1.0
gsweep = np.zeros(N)
s0, s1 = int(g0 * SR), int((g0 + 0.21) * SR)
sw = np.linspace(520, 190, s1 - s0)
gsweep[s0:s1] = np.sin(2 * np.pi * np.cumsum(sw) / SR)
glitch = (onepole_hp(rng.normal(0, 1, N), 700) * gate * 0.5 + gsweep * 0.55)
glitch *= env(g0, 0.004, 0.19, 0.06)

# --------------------------------------------------------------- push
# Air moving into the software, landing on a low thud.
p0 = CUE['push']
noise = rng.normal(0, 1, N)
cut = np.interp(t, [p0, p0 + 0.34], [320, 5200]).clip(300, 5200)
swell = onepole_hp(onepole_lp(noise, cut), 260) * env(p0, 0.30, 0.02, 0.16, curve=2.6)
thud_f = np.interp(t, [p0 + 0.28, p0 + 0.52], [120, 46]).clip(46, 120)
thud = np.sin(2 * np.pi * np.cumsum(thud_f) / SR) * env(p0 + 0.28, 0.006, 0.03, 0.30, curve=2.4)
push = swell * 0.34 + thud * 0.7

# -------------------------------------------------------------- click
# A soft, short UI press. Nothing plasticky.
c0 = CUE['click']
click = (onepole_lp(rng.normal(0, 1, N), 4200) * env(c0, 0.001, 0.004, 0.045, curve=3.0) * 0.8
         + tone(1180) * env(c0, 0.001, 0.006, 0.055, curve=3.0) * 0.30
         + tone(430) * env(c0, 0.002, 0.010, 0.10, curve=2.4) * 0.22)

# -------------------------------------------------------------- chime
# Two soft bell partials a fifth apart — a confirmation, not a fanfare.
h0 = CUE['chime']
chime = np.zeros(N)
for fr, amp, dly in ((880.0, 0.60, 0.0), (1318.5, 0.42, 0.075), (1760.0, 0.16, 0.075)):
    chime += amp * tone(fr) * env(h0 + dly, 0.006, 0.05, 0.95, curve=2.8)
chime += 0.10 * tone(293.66) * env(h0, 0.01, 0.08, 1.0, curve=2.4)

# ------------------------------------------------------------ endcard
e0 = CUE['endcard']
lift = 0.5 * tone(146.83) * env(e0, 0.05, 0.25, 0.65, curve=2.2)

# ----------------------------------------------------------------- mix
mix = (pad * 0.090
       + glitch * 0.150
       + push * 0.185
       + click * 0.230
       + chime * 0.115
       + lift * 0.060)

# duck everything under the voiceover's two busiest stretches
duck = np.interp(t, [0, 0.4, 0.6, f(148), f(297), f(387), f(420), DUR],
                 [1.0, 1.0, 0.86, 0.86, 0.82, 0.92, 1.0, 1.0])
mix *= duck

# top and tail
mix *= np.interp(t, [0, 0.10, DUR - 0.30, DUR], [0, 1, 1, 0])

peak = np.max(np.abs(mix))
print(f'peak before limit: {20*math.log10(peak):.1f} dBFS')
mix = np.tanh(mix * 1.15) / 1.15
mix *= 0.92 / np.max(np.abs(mix)) * 0.42   # leave plenty of room for the voice
print(f'final peak: {20*math.log10(np.max(np.abs(mix))):.1f} dBFS')

stereo = np.stack([mix, mix], axis=1)
# a touch of width on the pad only
w = onepole_hp(pad, 200) * 0.010
stereo[:, 0] += w
stereo[:, 1] -= w

pcm = np.clip(stereo, -1, 1)
data = (pcm * 32767).astype('<i2').tobytes()

import os
os.makedirs('public/audio/sfx', exist_ok=True)
with wave.open('public/audio/sfx/sound-design.wav', 'wb') as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(data)
print('wrote public/audio/sfx/sound-design.wav', len(data) // 4, 'frames')
