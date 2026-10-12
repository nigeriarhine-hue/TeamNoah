#!/usr/bin/env python3
"""
Build the audio for "Why Is My PC Slow? 5 Things to Check First".

VO
  Kokoro-82M (kokoro-onnx), run locally. Voice is a blend of am_michael (warm,
  clear) and am_puck (younger, livelier) for a relaxed 20-something tech
  creator. The SAME voice and speed read the product section, so the delivery
  never flips into announcer mode.

  The locked script is split ONLY at its own punctuation. The segments rejoin to
  the script word for word (asserted below). Each segment's real duration is
  measured and the timeline is laid out from those durations, so the picture
  follows the voice rather than the other way round.

Music + SFX
  Synthesized here with numpy - no third-party audio, nothing to license.
  A soft pad + muted pluck pattern at 96 BPM, ducked under the voice, plus
  understated UI ticks, section whooshes, data blips and cursor clicks.

Outputs
  public/audio/mix.wav        full mix (48 kHz stereo)
  src/timeline.json           segment + word timings consumed by src/timeline.ts

Requires: pip install kokoro-onnx soundfile numpy faster-whisper
          model files in /tmp/voices (see README).
"""
import json
import os

import numpy as np
import soundfile as sf

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.join(HERE, "..")
VOICES = os.environ.get("VOICE_DIR", "/tmp/voices")
SR = 48000

LOCKED = (
    "If your PC feels slow, don't start deleting random files. Check these five things first. "
    "Number one: startup apps. If too many programs launch when Windows starts, your PC can feel slow "
    "before you even do anything. "
    "Number two: background apps. Something you aren't even using could still be taking up resources. "
    "Number three: free storage. If your drive is almost full, check what's actually taking up the space. "
    "Number four: CPU and memory. Look for apps or processes that keep using an unusually large amount. "
    "And number five: figure out whether the slowdown affects your whole PC or just one app. "
    "That tells you where to troubleshoot next. "
    "If you don't want to check all of that manually, Noah can inspect your PC, explain what it finds, "
    "and show you what it recommends before you approve any changes. Free PC Check at onnoah.app."
)

# (id, scene, text as written, gap BEFORE this segment in seconds)
# `say` overrides only how a token is pronounced; the words are unchanged.
SEGMENTS = [
    ("hook1", "hook", "If your PC feels slow, don't start deleting random files.", 0.30),
    ("hook2", "hook", "Check these five things first.", 0.12),
    ("t1a", "tip1", "Number one: startup apps.", 0.50),
    ("t1b", "tip1", "If too many programs launch when Windows starts, your PC can feel slow before you even do anything.", 0.22),
    ("t2a", "tip2", "Number two: background apps.", 0.55),
    ("t2b", "tip2", "Something you aren't even using could still be taking up resources.", 0.22),
    ("t3a", "tip3", "Number three: free storage.", 0.55),
    ("t3b", "tip3", "If your drive is almost full, check what's actually taking up the space.", 0.22),
    ("t4a", "tip4", "Number four: CPU and memory.", 0.55),
    ("t4b", "tip4", "Look for apps or processes that keep using an unusually large amount.", 0.22),
    ("t5a", "tip5", "And number five: figure out whether the slowdown affects your whole PC or just one app.", 0.55),
    ("t5b", "tip5", "That tells you where to troubleshoot next.", 0.25),
    ("n1", "bridge", "If you don't want to check all of that manually,", 0.60),
    ("n2", "checks", "Noah can inspect your PC,", 0.08),
    ("n3", "checks", "explain what it finds,", 0.10),
    ("n4", "plan", "and show you what it recommends before you approve any changes.", 0.10),
    ("n5", "cta", "Free PC Check at onnoah.app.", 0.45),
]
SAY = {"onnoah.app": "on Noah dot app"}
TAIL = 1.9  # end-card hold after the last word

VOICE_BLEND = {"am_michael": 0.55, "am_puck": 0.45}
SPEED = 1.06


def check_script():
    joined = " ".join(s[2] for s in SEGMENTS)
    assert joined == LOCKED, "segments drifted from the locked script"


def synth():
    from kokoro_onnx import Kokoro

    k = Kokoro(f"{VOICES}/kokoro-v1.0.onnx", f"{VOICES}/voices-v1.0.bin")
    style = sum(k.get_voice_style(v) * w for v, w in VOICE_BLEND.items())
    out = {}
    for sid, _scene, text, _gap in SEGMENTS:
        spoken = text
        for a, b in SAY.items():
            spoken = spoken.replace(a, b)
        audio, sr = k.create(spoken, voice=style, speed=SPEED, lang="en-us")
        audio = resample(np.asarray(audio, dtype=np.float32), sr)
        out[sid] = trim(audio)
    return out


def resample(a, sr):
    if sr == SR:
        return a
    n = int(len(a) * SR / sr)
    return np.interp(np.linspace(0, len(a), n, endpoint=False), np.arange(len(a)), a).astype(np.float32)


def trim(a, thresh=0.012, pad=0.03):
    idx = np.where(np.abs(a) > thresh)[0]
    if not len(idx):
        return a
    s = max(0, idx[0] - int(pad * SR))
    e = min(len(a), idx[-1] + int(pad * 2 * SR))
    return a[s:e]


def word_times(clips, layout):
    """Word timings for captions. Whisper gives the timing; the WORDS always come
    from the locked script, so captions can never say something the VO doesn't."""
    try:
        from faster_whisper import WhisperModel

        model = WhisperModel("small.en", compute_type="int8")
    except Exception:  # fall back to proportional timing
        model = None
    words = []
    for sid, _scene, text, _gap in SEGMENTS:
        start = layout[sid]["start"]
        dur = layout[sid]["end"] - start
        script_words = text.split()
        timed = None
        if model is not None:
            a16 = np.interp(np.arange(0, len(clips[sid]), SR / 16000), np.arange(len(clips[sid])), clips[sid])
            segs, _ = model.transcribe(a16.astype(np.float32), word_timestamps=True, language="en")
            ww = [w for s in segs for w in s.words]
            if len(ww) == len(script_words):
                timed = [(w.start, w.end) for w in ww]
        if timed is None:  # proportional by character count
            total = sum(len(w) + 1 for w in script_words)
            t, timed = 0.0, []
            for w in script_words:
                d = dur * (len(w) + 1) / total
                timed.append((t, t + d))
                t += d
        for w, (a, b) in zip(script_words, timed):
            words.append({"seg": sid, "w": w, "start": round(start + a, 3), "end": round(start + b, 3)})
    return words


# ---------------------------------------------------------------- music + sfx

def env(n, a, r):
    e = np.ones(n, dtype=np.float32)
    a, r = int(a * SR), int(r * SR)
    if a:
        e[:a] = np.linspace(0, 1, a)
    if r:
        e[-r:] *= np.linspace(1, 0, r)
    return e


def osc(freq, dur, kind="sine"):
    t = np.arange(int(dur * SR)) / SR
    if kind == "sine":
        return np.sin(2 * np.pi * freq * t).astype(np.float32)
    if kind == "tri":
        return (2 / np.pi * np.arcsin(np.sin(2 * np.pi * freq * t))).astype(np.float32)
    raise ValueError(kind)


def lowpass(x, cutoff):
    # one-pole, cheap and smooth
    a = np.exp(-2 * np.pi * cutoff / SR)
    y = np.empty_like(x)
    acc = 0.0
    for i in range(len(x)):
        acc = (1 - a) * x[i] + a * acc
        y[i] = acc
    return y


def place(bed, sig, at, gain=1.0):
    i = int(at * SR)
    if i >= len(bed):
        return
    e = min(len(bed), i + len(sig))
    bed[i:e] += sig[: e - i] * gain


def midi(n):
    return 440.0 * 2 ** ((n - 69) / 12)


def music(total):
    """Calm, modern 'tech channel' bed: Fmaj9 - Am7 - Dm9 - Bbmaj7 pads, a soft
    pluck arpeggio, a gentle kick + shaker. Deliberately sparse."""
    bpm = 96
    beat = 60 / bpm
    bar = beat * 4
    bed = np.zeros(int(total * SR) + SR, dtype=np.float32)
    chords = [
        [53, 57, 60, 64, 67],  # Fmaj9
        [57, 60, 64, 67],      # Am7
        [50, 57, 60, 64, 65],  # Dm9
        [46, 53, 57, 62, 65],  # Bbmaj7
    ]
    nbars = int(total / bar) + 2
    rng = np.random.default_rng(7)
    for b in range(nbars):
        t0 = b * bar
        ch = chords[b % 4]
        # pad
        for n in ch:
            s = osc(midi(n), bar + 0.4, "tri") * 0.5 + osc(midi(n) * 1.003, bar + 0.4) * 0.5
            place(bed, s * env(len(s), 0.35, 0.6), t0, 0.030)
        # sub
        s = osc(midi(ch[0] - 12), bar)
        place(bed, s * env(len(s), 0.05, 0.3), t0, 0.06)
        # pluck arpeggio on 8ths
        pattern = [0, 2, 1, 3, 2, 4 % len(ch), 1, 3]
        for k, p in enumerate(pattern):
            n = ch[p % len(ch)] + 12
            d = 0.42
            s = osc(midi(n), d, "tri") * np.exp(-np.arange(int(d * SR)) / SR * 9)
            place(bed, s.astype(np.float32) * env(len(s), 0.004, 0.05), t0 + k * beat / 2, 0.020)
        # kick on 1 and 3, soft
        for q in (0, 2):
            d = 0.25
            t = np.arange(int(d * SR)) / SR
            f = 52 + 70 * np.exp(-t * 30)
            s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 14)
            place(bed, s.astype(np.float32), t0 + q * beat, 0.11)
        # shaker on off-beats
        for q in range(8):
            if q % 2 == 1:
                d = 0.06
                s = rng.standard_normal(int(d * SR)).astype(np.float32) * np.exp(-np.arange(int(d * SR)) / SR * 60)
                place(bed, s, t0 + q * beat / 2, 0.012)
    bed = lowpass(bed, 5200)
    return bed[: int(total * SR)]


def tick(freq=2400, d=0.035, g=1.0):
    s = osc(freq, d) * np.exp(-np.arange(int(d * SR)) / SR * 140)
    return (s * g).astype(np.float32)


def blip(f1, f2, d=0.12):
    t = np.arange(int(d * SR)) / SR
    f = np.linspace(f1, f2, len(t))
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(t), 0.004, d * 0.7)
    return s.astype(np.float32)


def whoosh(d=0.42, rng=np.random.default_rng(3)):
    n = int(d * SR)
    s = rng.standard_normal(n).astype(np.float32)
    # rising band via two lowpasses with moving cutoff approximated by crossfade
    lo = lowpass(s, 900)
    hi = lowpass(s, 4000) - lowpass(s, 1200)
    x = np.linspace(0, 1, n, dtype=np.float32)
    s = lo * (1 - x) + hi * x
    shape = np.clip(np.sin(np.pi * x), 0, 1) ** 1.6
    return (s * shape).astype(np.float32)


def click():
    d = 0.05
    t = np.arange(int(d * SR)) / SR
    s = (np.sin(2 * np.pi * 3200 * t) * 0.6 + np.sin(2 * np.pi * 1400 * t)) * np.exp(-t * 180)
    return s.astype(np.float32)


def chime():
    out = np.zeros(int(0.9 * SR), dtype=np.float32)
    for k, n in enumerate((76, 83)):
        s = osc(midi(n), 0.7) * np.exp(-np.arange(int(0.7 * SR)) / SR * 5)
        place(out, s.astype(np.float32), k * 0.11, 0.5)
    return out


def main():
    check_script()
    clips = synth()

    # lay out the voice
    t = 0.0
    layout = {}
    for sid, scene, text, gap in SEGMENTS:
        t += gap
        d = len(clips[sid]) / SR
        layout[sid] = {"scene": scene, "text": text, "start": round(t, 3), "end": round(t + d, 3)}
        t += d
    total = round(t + TAIL, 3)

    vo = np.zeros(int(total * SR), dtype=np.float32)
    for sid in layout:
        place(vo, clips[sid], layout[sid]["start"])
    vo /= max(1e-6, np.abs(vo).max())
    vo *= 0.86

    # duck the music under speech (smoothed envelope)
    speech = np.zeros_like(vo)
    for sid in layout:
        a, b = int(layout[sid]["start"] * SR), int(layout[sid]["end"] * SR)
        speech[a:b] = 1
    k = int(0.25 * SR)
    speech = np.convolve(speech, np.ones(k) / k, mode="same")
    m = music(total)
    m *= (1.0 - 0.45 * speech)
    m *= env(len(m), 0.8, 1.2)

    # sound design, keyed to the scene layout
    fx = np.zeros_like(vo)
    s = lambda sid: layout[sid]["start"]
    e = lambda sid: layout[sid]["end"]
    place(fx, whoosh(0.5), 0.0, 0.18)
    for i, sid in enumerate(["t1a", "t2a", "t3a", "t4a", "t5a"]):
        place(fx, whoosh(), s(sid) - 0.32, 0.22)       # section transition
        place(fx, blip(880, 1320, 0.09), s(sid) + 0.02, 0.10)  # number lands
    # tip 1: apps popping in on Windows start
    for j in range(5):
        place(fx, tick(2000 + j * 180), s("t1b") + 0.55 + j * 0.16, 0.12)
    # tip 2: gentle resource blips
    for j in range(4):
        place(fx, blip(600, 760, 0.07), s("t2b") + 0.5 + j * 0.42, 0.06)
    # tip 3: storage gauge fill ticks, then category ticks
    for j in range(10):
        place(fx, tick(1500 + j * 60, 0.025), s("t3a") + 0.55 + j * 0.08, 0.07)
    for j in range(4):
        place(fx, tick(2600, 0.03), s("t3b") + 1.0 + j * 0.28, 0.10)
    # tip 4: graph sweep + outlier blip
    for j in range(6):
        place(fx, tick(1800 + j * 90, 0.02), s("t4b") + 0.1 + j * 0.12, 0.06)
    place(fx, blip(700, 1400, 0.18), s("t4b") + 1.9, 0.10)
    # tip 5: split + two branch ticks
    place(fx, whoosh(0.3), s("t5a") + 1.6, 0.12)
    place(fx, tick(2200), s("t5b") - 0.1, 0.10)
    place(fx, tick(2500), s("t5b") + 0.8, 0.10)
    # Noah: UI checks ticks, cursor clicks, approval chime
    place(fx, whoosh(0.5), s("n1") - 0.3, 0.18)
    for j in range(4):
        place(fx, tick(2300, 0.03), s("n2") + 0.4 + j * 0.3, 0.09)
    place(fx, click(), s("n4") + 2.35, 0.30)
    place(fx, chime(), s("n4") + 2.45, 0.10)
    place(fx, blip(660, 990, 0.2), s("n5") - 0.1, 0.10)

    mix = vo + m * 0.9 + fx
    # loudness for social (~-14 LUFS): make-up gain, then a soft limiter so
    # peaks round off instead of clipping
    mix *= 1.3
    mix = np.tanh(mix * 1.1) / np.tanh(1.1) * 0.86
    stereo = np.stack([mix, mix], axis=1)
    os.makedirs(os.path.join(ROOT, "public", "audio"), exist_ok=True)
    sf.write(os.path.join(ROOT, "public", "audio", "mix.wav"), stereo, SR, subtype="PCM_16")

    words = word_times(clips, layout)
    os.makedirs(os.path.join(ROOT, "public", "data"), exist_ok=True)
    with open(os.path.join(ROOT, "src", "timeline.json"), "w") as f:
        json.dump({"total": total, "segments": layout, "words": words}, f, indent=1)
    print(f"total {total:.2f}s")
    for sid, v in layout.items():
        print(f"  {sid:6s} {v['start']:6.2f} - {v['end']:6.2f}  {v['text']}")


if __name__ == "__main__":
    main()
