"""
Builds the audio side of the Noah x Byte UGC short:
  - places Byte's dialogue lines on a timeline (scene cuts follow the dialogue)
  - writes src/data/timeline.json (scene frames, word timings, per-frame lip-sync envelope, sfx cues)
  - synthesizes a light upbeat music bed + subtle SFX (all original, generated here)
  - mixes voice / music (ducked under dialogue) / sfx -> public/audio/mix.wav (+ stems)

Run: ~/.venv-tts/bin/python scripts/build_audio.py
"""
import json, os
import numpy as np
import soundfile as sf
from scipy.signal import resample_poly, butter, sosfilt

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VOICE_DIR = f"{ROOT}/audio-src/voice"
OUT_AUDIO = f"{ROOT}/public/audio"
OUT_DATA = f"{ROOT}/src/data"
os.makedirs(OUT_AUDIO, exist_ok=True)
os.makedirs(OUT_DATA, exist_ok=True)

SR = 48000
FPS = 30
FIRST_START = 0.22      # first line starts after a beat
GAP = 0.16              # breath between lines
CUT_LEAD = 0.10         # scene cut lands just before the next line
END_HOLD = 1.25         # branded end frame after the last word

rng = np.random.default_rng(7)

# ---------------------------------------------------------------- voice
meta = json.load(open(f"{VOICE_DIR}/lines.json"))
lines = []
t = FIRST_START
for L in meta:
    a, sr = sf.read(f"{VOICE_DIR}/line{L['line']}.wav", dtype="float32")
    if a.ndim > 1:
        a = a.mean(axis=1)
    a = resample_poly(a, SR, sr).astype(np.float32)
    dur = len(a) / SR
    lines.append({"line": L["line"], "text": L["text"], "start": t, "end": t + dur, "audio": a,
                  "words": [{"w": w["w"], "s": t + w["s"], "e": t + w["e"]} for w in L["words"]]})
    t += dur + GAP

total = lines[-1]["end"] + END_HOLD
N_FRAMES = int(np.ceil(total * FPS))
total = N_FRAMES / FPS
N = int(total * SR)

voice = np.zeros(N, np.float32)
for L in lines:
    s = int(L["start"] * SR)
    voice[s:s + len(L["audio"])] += L["audio"]
# gentle voice polish: high-pass rumble, normalise to -3 dBFS peak
voice = sosfilt(butter(2, 80, "hp", fs=SR, output="sos"), voice).astype(np.float32)
voice *= 0.70 / (np.abs(voice).max() + 1e-9)

# scene boundaries (frames)
cuts = [0] + [int(round((L["start"] - CUT_LEAD) * FPS)) for L in lines[1:]] + [N_FRAMES]
scenes = [{"id": i + 1, "from": cuts[i], "to": cuts[i + 1]} for i in range(5)]

# ---------------------------------------------------------------- lip-sync envelope
hop = SR // FPS
env = np.array([np.sqrt(np.mean(voice[i * hop:(i + 1) * hop] ** 2) + 1e-12) for i in range(N_FRAMES)])
ref = np.percentile(env[env > 0.01], 90) if np.any(env > 0.01) else 1
env = np.clip(env / ref, 0, 1.2)
env[env < 0.08] = 0
sm = np.zeros_like(env)
for i in range(N_FRAMES):  # fast attack, softer release
    p = sm[i - 1] if i else 0
    sm[i] = p + (env[i] - p) * (0.75 if env[i] > p else 0.45)
mouth = [round(float(x), 3) for x in sm]

# ---------------------------------------------------------------- synth helpers
def tt(d):
    return np.arange(int(d * SR)) / SR

def adsr(n, a=0.005, d=0.1, s=0.0, r=0.05):
    e = np.ones(n, np.float32)
    A, D, R = int(a * SR), int(d * SR), int(r * SR)
    A = max(A, 1)
    e[:A] = np.linspace(0, 1, A)
    if D > 0:
        e[A:A + D] = np.linspace(1, s, min(D, max(0, n - A)))[: max(0, min(D, n - A))]
    e[A + D:] = s
    if R > 0 and n > R:
        e[-R:] *= np.linspace(1, 0, R)
    return e

def place(buf, sig, at, gain=1.0):
    s = int(at * SR)
    if s >= len(buf):
        return
    e = min(len(buf), s + len(sig))
    buf[s:e] += sig[: e - s] * gain

def hp(x, f):
    return sosfilt(butter(2, f, "hp", fs=SR, output="sos"), x).astype(np.float32)

def lp(x, f):
    return sosfilt(butter(2, f, "lp", fs=SR, output="sos"), x).astype(np.float32)

def bp(x, lo, hi):
    return sosfilt(butter(2, [lo, hi], "bp", fs=SR, output="sos"), x).astype(np.float32)

def midi(n):
    return 440 * 2 ** ((n - 69) / 12)

# ---------------------------------------------------------------- music (original, synthesized)
BPM = 112
beat = 60 / BPM
music = np.zeros(N, np.float32)
# I - V - vi - IV in F major, with 7ths: Fmaj7, C(add9), Dm7, Bbmaj7
prog = [[53, 57, 60, 64], [48, 55, 62, 64], [50, 57, 60, 65], [46, 53, 57, 62]]
bass_roots = [41, 36, 38, 34]

def pluck(f, d, bright=1.0):
    x = tt(d)
    s = (np.sin(2 * np.pi * f * x) + 0.35 * bright * np.sin(2 * np.pi * 2 * f * x) + 0.12 * bright * np.sin(2 * np.pi * 3 * f * x))
    return (s * adsr(len(x), 0.004, d * 0.9, 0.0, 0.04)).astype(np.float32)

def kick():
    x = tt(0.32)
    f = 48 + 90 * np.exp(-x * 28)
    ph = 2 * np.pi * np.cumsum(f) / SR
    return (np.sin(ph) * np.exp(-x * 9)).astype(np.float32)

def clap():
    x = tt(0.22)
    n = rng.standard_normal(len(x)).astype(np.float32)
    return bp(n, 900, 4500) * np.exp(-x * 22).astype(np.float32)

def hat(open_=False):
    x = tt(0.12 if not open_ else 0.25)
    n = rng.standard_normal(len(x)).astype(np.float32)
    return hp(n, 7000) * np.exp(-x * (45 if not open_ else 14)).astype(np.float32)

music_end = total - 0.05
bar = 4 * beat
nbars = int(np.ceil(music_end / bar)) + 1
for b in range(nbars):
    t0 = b * bar
    ch = prog[b % 4]
    # chord stabs on the off-beats (bouncy, light)
    for k, off in enumerate([0.0, 1.5, 2.5, 3.5]):
        at = t0 + off * beat
        if at >= music_end - 1.3:
            continue
        for n in ch:
            place(music, pluck(midi(n + 12), 0.32, 0.8), at, 0.055 if off else 0.07)
    # bass
    for off, d in [(0, 0.9), (1.75, 0.25), (2, 0.9), (3.5, 0.4)]:
        at = t0 + off * beat
        if at >= music_end - 1.3:
            continue
        x = tt(d * beat)
        f = midi(bass_roots[b % 4] + (12 if off == 3.5 else 0))
        s = np.sin(2 * np.pi * f * x) + 0.25 * np.sin(2 * np.pi * 2 * f * x)
        place(music, (s * adsr(len(x), 0.006, 0.3, 0.55, 0.05)).astype(np.float32), at, 0.20)
    # drums
    for off in (0, 2, 2.75):
        if t0 + off * beat < music_end - 1.3:
            place(music, kick(), t0 + off * beat, 0.42)
    for off in (1, 3):
        if t0 + off * beat < music_end - 1.3:
            place(music, clap(), t0 + off * beat, 0.16)
    for i8 in range(8):
        at = t0 + i8 * beat / 2 + (0.035 if i8 % 2 else 0)  # light swing
        if at < music_end - 1.3:
            place(music, hat(open_=(i8 == 7)), at, 0.05 if i8 % 2 else 0.07)

# a playful little lead motif on the hook + a resolving chord on the end card
lead = [(0, 72), (0.5, 74), (1, 77), (2, 76), (2.5, 74), (3, 72)]
for b in (2, 6):
    for off, n in lead:
        place(music, pluck(midi(n), 0.28, 0.5), b * bar + off * beat, 0.045)
end_at = music_end - 1.25
for n in [53, 57, 60, 64, 69]:
    x = tt(1.25)
    s = np.sin(2 * np.pi * midi(n + 12) * x) * np.exp(-x * 2.2)
    place(music, s.astype(np.float32), end_at, 0.06)
place(music, kick(), end_at, 0.35)

# intro fade + final fade
fi = int(0.25 * SR)
music[:fi] *= np.linspace(0.3, 1, fi)
fo = int(0.35 * SR)
music[-fo:] *= np.linspace(1, 0, fo)
music = lp(music, 9000)

# duck music under dialogue (smooth sidechain from voice envelope)
venv = np.abs(voice)
win = int(0.08 * SR)
venv = np.convolve(venv, np.ones(win) / win, mode="same")
duck_target = np.where(venv > 0.01, 0.42, 1.0).astype(np.float32)
duck = np.zeros_like(duck_target)
a_att, a_rel = 1 - np.exp(-1 / (0.03 * SR)), 1 - np.exp(-1 / (0.25 * SR))
g = 1.0
for i in range(0, N, 64):  # block-rate smoothing for speed
    tgt = duck_target[i]
    coef = a_att if tgt < g else a_rel
    g += (tgt - g) * (1 - (1 - coef) ** 64)
    duck[i:i + 64] = g
music *= duck

# ---------------------------------------------------------------- sfx (original, synthesized)
def whoosh(d=0.35, up=True):
    x = tt(d)
    n = rng.standard_normal(len(x)).astype(np.float32)
    out = np.zeros_like(n)
    seg = 256
    for i in range(0, len(n), seg):
        p = i / len(n)
        fc = 400 + (3200 if up else 2200) * (p if up else 1 - p)
        out[i:i + seg] = bp(n[i:i + seg + 512], fc * 0.6, min(fc * 1.6, 20000))[:len(n[i:i + seg])]
    e = np.sin(np.pi * np.linspace(0, 1, len(x))) ** 1.5
    return (out * e).astype(np.float32)

def pop(f=900):
    x = tt(0.09)
    f_ = f * (1 + 0.8 * np.exp(-x * 60))
    return (np.sin(2 * np.pi * np.cumsum(f_) / SR) * np.exp(-x * 45)).astype(np.float32)

def ding(f=1318.5, d=0.6):
    x = tt(d)
    s = np.sin(2 * np.pi * f * x) + 0.4 * np.sin(2 * np.pi * f * 2.0 * x) + 0.2 * np.sin(2 * np.pi * f * 3.01 * x)
    return (s * np.exp(-x * 7) * adsr(len(x), 0.002, 0, 1, 0.02)).astype(np.float32)

def click():
    x = tt(0.03)
    n = rng.standard_normal(len(x)).astype(np.float32)
    return hp(n, 2500) * np.exp(-x * 220).astype(np.float32)

def boing(f0=220):
    x = tt(0.45)
    f = f0 * (1 + 0.5 * np.sin(2 * np.pi * 9 * x) * np.exp(-x * 5)) * (1 + 0.6 * np.exp(-x * 10))
    return (np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-x * 6)).astype(np.float32)

def sparkle():
    out = np.zeros(int(0.7 * SR), np.float32)
    for i, n in enumerate([84, 88, 91, 96, 100]):
        place(out, ding(midi(n), 0.4), i * 0.05, 0.5)
    return out

def tick():
    x = tt(0.05)
    return (np.sin(2 * np.pi * 2400 * x) * np.exp(-x * 120)).astype(np.float32)

def rec_beep():
    return np.concatenate([ding(1760, 0.12) * 0.7]).astype(np.float32)

sfx = np.zeros(N, np.float32)
cues = []

def cue(name, at, sig, gain):
    place(sfx, sig, at, gain)
    cues.append({"name": name, "t": round(at, 3), "frame": int(round(at * FPS))})

def word_time(line, word, which="s"):
    for w in lines[line - 1]["words"]:
        if w["w"].lower().strip(".,?!").startswith(word):
            return w[which]
    raise KeyError(word)

sc = {s["id"]: s for s in scenes}
cue("rec-start", 0.02, rec_beep(), 0.22)
cue("zoom-boing", word_time(1, "mind") - 0.06, boing(260), 0.16)
cue("whip-to-pc", sc[2]["from"] / FPS - 0.12, whoosh(0.32), 0.20)
boot_at = sc[2]["from"] / FPS + 0.25
cue("boot-chime", boot_at, ding(midi(76), 0.5), 0.07)
icons_at = []
for i in range(6):
    at = boot_at + 0.45 + i * 0.13
    icons_at.append(at)
    cue(f"icon-pop-{i}", at, pop(700 + 90 * i), 0.10)
cue("confused-boing", word_time(2, "no") - 0.1, boing(180), 0.10)
cue("whoosh-to-noah", sc[3]["from"] / FPS - 0.1, whoosh(0.34), 0.18)
for i, k in enumerate([0.95, 1.3, 1.65, 2.0]):
    cue(f"check-tick-{i}", sc[3]["from"] / FPS + k, tick(), 0.06)
cue("whoosh-to-findings", sc[4]["from"] / FPS - 0.08, whoosh(0.28, up=False), 0.12)
dialog_at = word_time(4, "asks") - 0.25
cue("approval-ding", dialog_at, ding(midi(81), 0.5), 0.12)
click_at = word_time(4, "approval") + 0.05
cue("click-go-ahead", click_at, click(), 0.35)
cue("approved-chime", click_at + 0.1, ding(midi(84), 0.45), 0.08)
cue("whoosh-to-selfie", sc[5]["from"] / FPS - 0.1, whoosh(0.3), 0.16)
thumbs_at = word_time(5, "check") - 0.15
cue("thumbs-sparkle", thumbs_at, sparkle(), 0.12)
cue("endcard-sparkle", end_at - 0.05, sparkle(), 0.10)

# ---------------------------------------------------------------- master
mix = voice * 1.0 + music * 0.85 + sfx * 1.0
peak = np.abs(mix).max()
mix = mix * (0.89 / peak) if peak > 0.89 else mix
st = lambda x: np.stack([x, x], axis=1)
sf.write(f"{OUT_AUDIO}/mix.wav", st(mix), SR, subtype="PCM_16")
sf.write(f"{OUT_AUDIO}/stem-voice.wav", st(voice), SR, subtype="PCM_16")
sf.write(f"{OUT_AUDIO}/stem-music.wav", st(music * 0.85), SR, subtype="PCM_16")
sf.write(f"{OUT_AUDIO}/stem-sfx.wav", st(sfx), SR, subtype="PCM_16")

timeline = {
    "fps": FPS, "durationInFrames": N_FRAMES, "seconds": round(total, 3),
    "scenes": scenes,
    "lines": [{k: v for k, v in L.items() if k != "audio"} for L in lines],
    "mouth": mouth,
    "cues": cues,
    "beat": beat,
}
json.dump(timeline, open(f"{OUT_DATA}/timeline.json", "w"))
print("frames", N_FRAMES, "seconds", round(total, 2))
for s in scenes:
    print("scene", s["id"], s["from"], s["to"], round(s["from"] / FPS, 2))
for L in lines:
    print("line", L["line"], round(L["start"], 2), round(L["end"], 2))
print("cues", [(c["name"], c["frame"]) for c in cues])
