"""Synthesizes the restrained tech music bed and UI sound effects used by the
Noah educational videos. Everything is generated procedurally (no samples), so
the output is royalty-free. Run: python3 scripts/make_audio.py"""
import numpy as np, wave, os

SR = 48000
OUT = os.path.join(os.path.dirname(__file__), '..', 'public', 'audio')

def write(name, x):
    x = np.clip(x, -1, 1)
    st = np.stack([x, x], 1) if x.ndim == 1 else x
    with wave.open(os.path.join(OUT, name), 'wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((st * 32767).astype(np.int16).tobytes())

def t(d): return np.arange(int(SR * d)) / SR
def env(n, a=0.005, r=0.1):
    e = np.ones(n); ai = int(SR * a); ri = min(n, int(SR * r))
    e[:ai] = np.linspace(0, 1, ai); e[-ri:] *= np.exp(-np.linspace(0, 6, ri)); return e
def lp(x, k):  # one-pole lowpass, k in (0,1]
    y = np.zeros_like(x); s = 0.0
    for i in range(len(x)): s += k * (x[i] - s); y[i] = s
    return y
rng = np.random.default_rng(7)

# ---------- music bed ----------
BPM = 104; beat = 60 / BPM; dur = 40.0; n = int(SR * dur)
mix = np.zeros(n)
def add(sig, at, gain=1.0):
    i = int(at * SR)
    if i >= n: return
    j = min(n, i + len(sig)); mix[i:j] += sig[: j - i] * gain
kick_t = t(0.35); kick = np.sin(2 * np.pi * (45 + 90 * np.exp(-kick_t * 30)) * kick_t) * np.exp(-kick_t * 9)
hat = lp(rng.standard_normal(int(SR * 0.05)), 0.9); hat = (hat - lp(hat, 0.2)) * np.exp(-t(0.05) * 70)
clap = rng.standard_normal(int(SR * 0.18)); clap = (clap - lp(clap, 0.08)) * np.exp(-t(0.18) * 25)
chords = [[57, 60, 64, 67], [53, 57, 60, 64], [55, 59, 62, 65], [52, 55, 59, 62]]  # Am7 Fmaj7 G7 Em7
bass = [45, 41, 43, 40]
def mtof(m): return 440 * 2 ** ((m - 69) / 12)
bar = beat * 4; nbars = int(dur / bar) + 1
for b in range(nbars):
    t0 = b * bar; c = chords[b % 4]
    pd = t(bar); pad = sum(np.sin(2 * np.pi * mtof(m) * pd + 0.3 * np.sin(2 * np.pi * 0.5 * pd)) for m in c) / 4
    pad *= np.minimum(1, pd / 0.4) * np.minimum(1, (bar - pd) / 0.3); add(pad, t0, 0.10)
    for k in range(8):  # gentle eighth-note arpeggio pluck
        pt = t(0.22); note = c[[0, 2, 1, 3, 2, 0, 3, 1][k]] + 12
        add(np.sin(2 * np.pi * mtof(note) * pt) * np.exp(-pt * 18), t0 + k * beat / 2, 0.05)
    bt = t(bar); add(np.sin(2 * np.pi * mtof(bass[b % 4]) * bt) * np.minimum(1, bt / 0.02) * np.exp(-bt * 0.6), t0, 0.16)
    for q in range(4):
        add(kick, t0 + q * beat, 0.35 if q % 2 == 0 else 0.22)
        if q % 2 == 1: add(clap, t0 + q * beat, 0.07)
        add(hat, t0 + q * beat + beat / 2, 0.06)
fade = np.ones(n); fade[: SR // 2] = np.linspace(0, 1, SR // 2); fade[-SR * 2:] = np.linspace(1, 0, SR * 2)
mix *= fade; mix /= np.abs(mix).max() * 1.1
write('music-bed.wav', mix)

# ---------- SFX ----------
tk = t(0.06); write('sfx-tick.wav', np.sin(2 * np.pi * 2400 * tk) * np.exp(-tk * 90) * 0.5)
wt = t(0.45); noise = rng.standard_normal(len(wt))
sweep = np.sin(np.pi * wt / 0.45) ** 2
wh = np.zeros(len(wt)); s = 0
for i in range(len(wt)):
    k = 0.02 + 0.25 * (i / len(wt)); s += k * (noise[i] - s); wh[i] = s
write('sfx-whoosh.wav', wh * sweep * 0.9)
dt = t(0.5); data = np.zeros(len(dt))
for k, f in enumerate([880, 1175, 1320, 1760]):
    i = int(k * 0.07 * SR); seg = t(0.12); data[i:i + len(seg)] += np.sin(2 * np.pi * f * seg) * np.exp(-seg * 35) * 0.3
write('sfx-data.wav', data)
ct = t(0.18); write('sfx-card.wav', (np.sin(2 * np.pi * (520 + 300 * np.exp(-ct * 40)) * ct) * np.exp(-ct * 22)) * 0.5)
cl = t(0.05); write('sfx-click.wav', (rng.standard_normal(len(cl)) * np.exp(-cl * 300) * 0.5 + np.sin(2 * np.pi * 1800 * cl) * np.exp(-cl * 200) * 0.3))
at = t(0.9); ap = np.zeros(len(at))
for k, f in enumerate([659.25, 987.77]):
    i = int(k * 0.11 * SR); seg = t(0.7); ap[i:i + len(seg)] += (np.sin(2 * np.pi * f * seg) + 0.3 * np.sin(4 * np.pi * f * seg)) * np.exp(-seg * 5) * 0.28
write('sfx-approve.wav', ap)
rt = t(0.5); rs = np.zeros(len(rt)); s = 0
for i in range(len(rt)):
    s += 0.08 * (noise[i % len(noise)] - s); rs[i] = s
write('sfx-slide.wav', rs * np.sin(np.pi * rt / 0.5) * 0.8 + np.concatenate([np.zeros(int(0.38 * SR)), np.sin(2 * np.pi * 300 * t(0.12)) * np.exp(-t(0.12) * 40) * 0.4])[: len(rt)])
hit = t(1.2); write('sfx-hit.wav', (np.sin(2 * np.pi * 55 * hit) * np.exp(-hit * 4) * 0.6 + lp(rng.standard_normal(len(hit)), 0.05) * np.exp(-hit * 6) * 0.5))
print('ok')
