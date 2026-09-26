"""Final soundtrack: supplied beat + aligned narration + chaos->control sound design.

Usage: python3 audio.py <beat audio> <final_voiceover.wav> <timeline.json> <out.wav> [sfx_dir]
       python3 audio.py <supplied vocal+music mix> - <timeline.json> <out.wav> [sfx_dir]   (mix mode)

* Beat: used as supplied, with one outro bar (43.49-45.905 s, 4 beats at 99.4 BPM) repeated at
  its own downbeat so the ending lands under the final "Done." instead of 2.4 s early.
* Before Noah (0-27.77 s): wind/rumble bed, glitches, error tones, bass hit, dark whooshes.
* From "That's where Noah comes in": the chaos bed is gone; clean clicks, soft diagnostic ticks,
  a confirmation chime and soft transitions only.
* Music ducks under the voice; mix is loudness-normalised to -14 LUFS / -1.5 dBTP.
"""
import json, os, subprocess, sys
import numpy as np

SR = 48000
beat_path, vo_path, tl_path, out = sys.argv[1:5]
sfx_dir = sys.argv[5] if len(sys.argv) > 5 else None
TL = json.load(open(tl_path)); X = TL["sfx"]; DUR = TL["duration"]
rng = np.random.default_rng(31)


def load(p, ch):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", p, "-ac", str(ch), "-ar", str(SR), "-f", "f32le", "-"],
                         capture_output=True, check=True).stdout
    a = np.frombuffer(raw, np.float32).astype(np.float64)
    return a.reshape(-1, ch) if ch > 1 else a


N = int(DUR * SR)
MIX_MODE = vo_path == "-"  # the supplied track already carries vocal + music
# ---------------- music: extend the outro by one bar ----------------
beat = load(beat_path, 2)
b0, b1 = int(43.49 * SR), int(45.905 * SR)
xf = int(0.004 * SR)  # both splices sit on downbeats; a 4 ms crossfade hides the seam
bar, head, tail = beat[b0:b1].copy(), beat[:b1].copy(), beat[b1:].copy()
ramp = np.linspace(0, 1, xf)[:, None]
bar[:xf] = bar[:xf] * ramp + head[-xf:] * (1 - ramp)
tail[:xf] = tail[:xf] * ramp + bar[-xf:] * (1 - ramp)
music = np.concatenate([head[:-xf], bar[:-xf], tail])
music = np.pad(music, ((0, max(0, N - len(music))), (0, 0)))[:N]

# ---------------- narration ----------------
if MIX_MODE:
    music = np.pad(load(beat_path, 2), ((0, N), (0, 0)))[:N]
    vo = np.zeros(N)
else:
    vo = load(vo_path, 1)
    vo = np.pad(vo, (0, max(0, N - len(vo))))[:N]


# ---------------- synthesized sound design ----------------
def env(n, a, d):
    t = np.arange(n) / SR
    return np.minimum(1, t / max(a, 1e-4)) * np.exp(-t / d)


def noise(n, smooth=1):
    x = rng.standard_normal(n)
    if smooth > 1:
        x = np.convolve(x, np.ones(smooth) / smooth, mode="same")
    return x / (np.max(np.abs(x)) + 1e-9)


def tone(f, n, a=0.003, d=0.2, harm=(1,)):
    t = np.arange(n) / SR
    return sum(np.sin(2 * np.pi * f * h * t) / h for h in harm) * env(n, a, d)


def boom(dur=1.6, f0=62, f1=34):
    n = int(dur * SR); t = np.arange(n) / SR
    f = f1 + (f0 - f1) * np.exp(-t / 0.18)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, 0.002, 0.55)
    return np.tanh(2.2 * s) * 0.8 + noise(n, 40) * env(n, 0.001, 0.08) * 0.35


def glitch(dur=0.16):
    n = int(dur * SR)
    x = noise(n)
    step = rng.integers(8, 40)
    x = np.repeat(x[::step], step)[:n]  # bit/sample-rate crush
    gate = (np.sin(2 * np.pi * rng.uniform(25, 60) * np.arange(n) / SR) > 0).astype(float)
    return x * gate * env(n, 0.001, dur / 2) * 0.35


def error_tone():
    n = int(0.28 * SR)
    return (np.concatenate([tone(880, n // 2, d=0.08, harm=(1, 3)), tone(622, n - n // 2, d=0.1, harm=(1, 3))])) * 0.14


def whoosh(dur=0.9, dark=True):
    n = int(dur * SR); t = np.arange(n) / SR
    x = noise(n, 60 if dark else 12)
    return x * np.sin(np.pi * t / dur) ** 2 * 0.35


def shimmer(dur=1.6):
    n = int(dur * SR); out_ = np.zeros(n)
    for i, f in enumerate([2093, 2637, 3136, 3951, 4699, 5274]):
        o = int(i * 0.07 * SR); s = tone(f, n - o, 0.002, 0.35, (1, 2.01))
        out_[o:] += s * 0.05
    return out_


def swell(dur=2.2):
    n = int(dur * SR); t = np.arange(n) / SR
    s = sum(np.sin(2 * np.pi * f * t) for f in (293.7, 440.0, 587.3, 740.0)) / 4
    e = np.sin(np.pi * np.minimum(1, t / dur)) ** 1.5
    return s * e * 0.12


def click(level=0.3):
    n = int(0.035 * SR); t = np.arange(n) / SR
    return (np.sin(2 * np.pi * 3100 * t) * np.exp(-t / 0.003) + 0.6 * np.sin(2 * np.pi * 1300 * t) * np.exp(-t / 0.007)) * level


def key():
    n = int(0.025 * SR)
    return np.diff(np.concatenate([[0], noise(n)])) * env(n, 0.0003, 0.005) * 0.12


def chime(freqs, level=0.1):
    n = int(1.4 * SR); s = np.zeros(n)
    for i, f in enumerate(freqs):
        o = int(i * 0.06 * SR); s[o:] += tone(f, n - o, 0.002, 0.4, (1, 2.76)) * level
    return s


S = np.zeros(N)


def put(sig, at, g=1.0):
    i = int(at * SR); m = min(len(sig), N - i)
    if m > 0:
        S[i:i + m] += sig[:m] * g


put(boom(2.0), X["opening_hit"], 0.9)
for t in X["glitch"]: put(glitch(rng.uniform(0.1, 0.22)), t, 0.9)
for t in X["error_tone"]: put(error_tone(), t + 0.05)
for t in X["bass_hit"]: put(boom(1.8, 70, 30), t, 1.1)
for t in X["whoosh_dark"]: put(whoosh(0.9), t - 0.3)
for t in X["magic_shimmer"]: put(shimmer(), t)
for t in X["calm_swell"]: put(swell(), t - 0.1)
for t in X["ui_click"]: put(click(), t)
a, b = X["keys"]
for k in np.arange(a, b, 0.085): put(key(), k + rng.uniform(-0.01, 0.01))
for t in X["diag_tick"]: put(tone(1760, int(0.06 * SR), d=0.02), t, 0.06)
for t in X["soft_tone"]: put(tone(987.8, int(0.25 * SR), d=0.08, harm=(1, 2)), t, 0.07)
for t in X["log_tick"]: put(tone(1318.5, int(0.08 * SR), d=0.03), t, 0.07)
for t in X["confirm"]: put(chime([1174.7, 1480.0, 1760.0]), t)
for t in X["transition_soft"]: put(whoosh(0.5, dark=False), t - 0.25, 0.25)
for t in X["end_hit"]: put(boom(1.4, 55, 38) * 0.5 + chime([587.3, 740, 880, 1174.7], 0.08)[:int(1.4 * SR)], t)

# pre-Noah atmosphere bed: wind + low rumble, gone by the Noah reveal
n = int(28.2 * SR); t = np.arange(n) / SR
wind = noise(n, 400) * (0.6 + 0.4 * np.sin(2 * np.pi * 0.13 * t)) * 0.18
rumble = np.sin(2 * np.pi * 38 * t) * (0.5 + 0.5 * np.sin(2 * np.pi * 0.21 * t)) * 0.06
bed = (wind + rumble) * np.clip((27.9 - t) / 0.6, 0, 1) * np.clip(t / 0.8, 0, 1)
S[:n] += bed

# ---------------- mix ----------------
# duck music under narration (fast attack, 250 ms release)
act = np.abs(vo) > 0.02
k = int(0.05 * SR)
act = np.convolve(act.astype(float), np.ones(k) / k, mode="same") > 0.05
duck = np.where(act, 0.42, 1.0)
if MIX_MODE:
    duck = np.ones(N) * 1.0 / 0.8  # keep the supplied mix at unity; sound design sits under it
    S *= 0.55
rel = int(0.25 * SR)
duck = np.convolve(duck, np.ones(rel) / rel, mode="same")
fade = np.ones(N); fo = int(0.5 * SR); fade[-fo:] = np.linspace(1, 0, fo)
mix = music * (duck * 0.8)[:, None] + (S + vo * 1.05)[:, None]
mix *= fade[:, None]
mix /= max(1.0, np.max(np.abs(mix)) / 0.97)
pcm = (np.clip(mix, -1, 1) * 32767).astype("<i2").tobytes()
subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "s16le", "-ar", str(SR), "-ac", "2", "-i", "-",
                "-af", "loudnorm=I=-14:TP=-1.5:LRA=11", "-ar", str(SR), out], input=pcm, check=True)
if sfx_dir:
    os.makedirs(sfx_dir, exist_ok=True)
    s16 = lambda a: (np.clip(a / (np.max(np.abs(a)) + 1e-9) * 0.9, -1, 1) * 32767).astype("<i2").tobytes()
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "s16le", "-ar", str(SR), "-ac", "1", "-i", "-",
                    os.path.join(sfx_dir, "sound_design_stem.wav")], input=s16(S), check=True)
print("soundtrack written:", out)
