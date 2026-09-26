"""Soundtrack for the 15 s Short: pieces of the finished ad's mix (voice at 80%) spliced at
beat-aligned points, plus light sound design reused from the ad's palette.
Usage: python3 short_audio.py <mix.mp3> <short.json> <out.wav>"""
import json, subprocess, sys
import numpy as np

SR = 48000
mix_path, spec_path, out = sys.argv[1:4]
S = json.load(open(spec_path)); X = S["sfx"]; N = int(S["duration"] * SR)
raw = subprocess.run(["ffmpeg", "-v", "error", "-i", mix_path, "-ac", "2", "-ar", str(SR), "-f", "f32le", "-"],
                     capture_output=True, check=True).stdout
mix = np.frombuffer(raw, np.float32).reshape(-1, 2).astype(np.float64)
rng = np.random.default_rng(5)

y = np.zeros((N, 2)); xf = int(0.03 * SR)
for a, b, src in S["audio"]:
    i0, n = int(a * SR), int((b - a) * SR)
    s0 = int(src * SR)
    piece = mix[s0 - xf:s0 + n + xf].copy() if s0 >= xf else np.vstack([np.zeros((xf, 2)), mix[:n + xf]])
    ramp = np.linspace(0, 1, xf)[:, None]
    piece[:xf] *= ramp; piece[-xf:] *= ramp[::-1]
    j0 = i0 - xf
    lo = max(0, j0); hi = min(N, j0 + len(piece))
    y[lo:hi] += piece[lo - j0:hi - j0]


def env(n, a, d):
    t = np.arange(n) / SR
    return np.minimum(1, t / max(a, 1e-4)) * np.exp(-t / d)


def noise(n, smooth=1):
    x = rng.standard_normal(n)
    if smooth > 1:
        x = np.convolve(x, np.ones(smooth) / smooth, mode="same")
    return x / (np.max(np.abs(x)) + 1e-9)


def tone(f, n, d=0.2, harm=(1,)):
    t = np.arange(n) / SR
    return sum(np.sin(2 * np.pi * f * h * t) / h for h in harm) * env(n, 0.003, d)


def boom(dur=1.2, f0=62, f1=34):
    n = int(dur * SR); t = np.arange(n) / SR
    f = f1 + (f0 - f1) * np.exp(-t / 0.18)
    return np.tanh(2.2 * np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, 0.002, 0.45)) * 0.8


def glitch(dur=0.14):
    n = int(dur * SR); x = noise(n); st = rng.integers(8, 40)
    x = np.repeat(x[::st], st)[:n]
    return x * (np.sin(2 * np.pi * 40 * np.arange(n) / SR) > 0) * env(n, 0.001, dur / 2) * 0.3


def whoosh(dur=0.5):
    n = int(dur * SR); t = np.arange(n) / SR
    return noise(n, 30) * np.sin(np.pi * t / dur) ** 2 * 0.25


def swell(dur=1.4):
    n = int(dur * SR); t = np.arange(n) / SR
    return sum(np.sin(2 * np.pi * f * t) for f in (293.7, 440.0, 587.3, 740.0)) / 4 * np.sin(np.pi * t / dur) ** 1.5 * 0.1


def click():
    n = int(0.035 * SR); t = np.arange(n) / SR
    return (np.sin(2 * np.pi * 3100 * t) * np.exp(-t / 0.003) + 0.6 * np.sin(2 * np.pi * 1300 * t) * np.exp(-t / 0.007)) * 0.3


def chime(freqs, lvl=0.08):
    n = int(1.2 * SR); s = np.zeros(n)
    for i, f in enumerate(freqs):
        o = int(i * 0.06 * SR); s[o:] += tone(f, n - o, 0.35, (1, 2.76)) * lvl
    return s


fx = np.zeros(N)


def put(sig, at, g=1.0):
    i = int(at * SR); m = min(len(sig), N - i)
    if m > 0: fx[i:i + m] += sig[:m] * g


for t in X["glitch"]: put(glitch(), t)
for t in X["bass_hit"]: put(boom(), t, 0.8)
for t in X["error_tone"]: put(tone(880, int(0.12 * SR), 0.05, (1, 3)) * 0.1, t + 0.04)
for t in X["calm_swell"]: put(swell(), t - 0.05)
for t in X["diag_tick"]: put(tone(1760, int(0.05 * SR), 0.02), t, 0.06)
for t in X["soft_tone"]: put(tone(987.8, int(0.2 * SR), 0.07, (1, 2)), t, 0.06)
for t in X["ui_click"]: put(click(), t)
for t in X["confirm"]: put(chime([1174.7, 1480.0, 1760.0]), t)
for t in X["whoosh"]: put(whoosh(), t - 0.25)
for t in X["end_hit"]: put(chime([587.3, 740, 880, 1174.7], 0.07) + np.pad(boom(1.0, 55, 38) * 0.35, (0, int(0.2 * SR))), t)

y += 0.6 * fx[:, None]
fo = int(0.25 * SR); y[-fo:] *= np.linspace(1, 0, fo)[:, None]
y /= max(1.0, np.abs(y).max() / 0.97)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "s16le", "-ar", str(SR), "-ac", "2", "-i", "-",
                "-af", "loudnorm=I=-14:TP=-1.5:LRA=11", "-ar", str(SR), out],
               input=(np.clip(y, -1, 1) * 32767).astype("<i2").tobytes(), check=True)
print("short soundtrack written")
