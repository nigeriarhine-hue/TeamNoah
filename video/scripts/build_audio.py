"""Build every audio stem for "I Asked Noah One Question".

Voice: the creator's opening line comes straight from the lip-synced Higgsfield
clip. The rest of the locked script is Seed Audio TTS cloned from the same
creator's voice (previous series clip), cut at its natural pauses so each
phrase can land on its scene.

Music + SFX are synthesised here from scratch (numpy), so they are original
and need no licence: a restrained 100 BPM consumer-tech bed and a small kit of
UI sounds (keys, send, ticks, reveals, click, approval, chime).

Usage: python3 scripts/build_audio.py assets-src/one-question
"""

import subprocess
import sys
import wave
from pathlib import Path

import numpy as np

SR = 48000
OUT = Path(__file__).resolve().parent.parent / "public" / "audio"
RNG = np.random.default_rng(7)


# ---------------------------------------------------------------- io helpers
def load(path: Path) -> np.ndarray:
    raw = subprocess.run(
        ["ffmpeg", "-v", "error", "-i", str(path), "-ac", "1", "-ar", str(SR), "-f", "s16le", "-"],
        capture_output=True, check=True,
    ).stdout
    return np.frombuffer(raw, np.int16).astype(np.float32) / 32768


def save(name: str, x: np.ndarray, stereo: bool = False) -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    x = np.clip(x, -1, 1)
    data = np.stack([x, x], 1) if stereo and x.ndim == 1 else x
    ch = 2 if data.ndim == 2 else 1
    with wave.open(str(OUT / name), "wb") as w:
        w.setnchannels(ch)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((data * 32767).astype(np.int16).tobytes())
    print(f"{name}: {len(x) / SR:.2f}s")


def quietest(x: np.ndarray, t0: float, t1: float) -> float:
    """Time of the lowest-energy 20 ms window between t0 and t1."""
    win = int(0.02 * SR)
    best, best_t = 1e9, t0
    for s in range(int(t0 * SR), int(t1 * SR) - win, win // 4):
        e = float(np.mean(x[s:s + win] ** 2))
        if e < best:
            best, best_t = e, s / SR + 0.01
    return best_t


def cut(x: np.ndarray, t0: float, t1: float, fade: float = 0.012) -> np.ndarray:
    seg = x[int(t0 * SR):int(t1 * SR)].copy()
    n = int(fade * SR)
    seg[:n] *= np.linspace(0, 1, n)
    seg[-n:] *= np.linspace(1, 0, n)
    return seg


def norm_speech(x: np.ndarray, target_rms_db: float = -20.0) -> np.ndarray:
    voiced = x[np.abs(x) > 0.02]
    rms = np.sqrt(np.mean(voiced ** 2)) if len(voiced) else 1e-3
    gain = 10 ** (target_rms_db / 20) / rms
    y = x * gain
    peak = np.max(np.abs(y))
    return y * (0.89 / peak) if peak > 0.89 else y


# ------------------------------------------------------------------- voice
def build_voice(src: Path) -> None:
    clip = load(src / "clip1-audio.wav")
    l2 = load(src / "l2.wav")
    l7 = load(src / "l7.wav")
    l3 = load(src / "l3.wav")
    l6 = load(src / "l6.wav")
    l8 = load(src / "l8.wav")

    # Opening line exactly as lip-synced in the creator clip.
    save("vo-01-opening.wav", norm_speech(cut(clip, 0.0, 3.86)))
    save("vo-02-question.wav", norm_speech(cut(l2, 0.30, 1.95)))

    # l8 is one continuous read of the middle of the script; split at breaths.
    a = quietest(l8, 2.10, 2.45)
    b = quietest(l8, 3.45, 3.86)
    c = quietest(l8, 5.05, 5.50)
    # "Noah checked…" from its standalone read: the name is crisper there.
    save("vo-03-checked.wav", norm_speech(cut(l3, 0.0, 2.36)))
    save("vo-04-explained.wav", norm_speech(cut(l8, a, b)))
    save("vo-05-recommended.wav", norm_speech(cut(l8, b, c)))
    # The l8 read drags "approval" out to ~1.1 s; its standalone read is clean.
    save("vo-06-approval.wav", norm_speech(cut(l6, 0.28, 2.80)))

    # Close: "One question. No guessing." / "Free PC Check at onnoah.app."
    save("vo-07-no-guessing.wav", norm_speech(cut(l7, 0.14, 2.20)))
    free_pc = cut(l7, 2.66, 3.38)
    rest = cut(l7, 3.56, 6.18)
    gap = np.zeros(int(0.06 * SR), np.float32)
    save("vo-08-cta.wav", norm_speech(np.concatenate([free_pc, gap, rest])))


# --------------------------------------------------------------- synthesis
def env(n: int, a: float, d: float) -> np.ndarray:
    t = np.arange(n) / SR
    return np.minimum(1, t / max(a, 1e-4)) * np.exp(-t / d)


def tone(freq: float, dur: float, a: float = 0.005, d: float = 0.3, harm=(1.0,)) -> np.ndarray:
    n = int(dur * SR)
    t = np.arange(n) / SR
    s = sum(amp * np.sin(2 * np.pi * freq * (i + 1) * t) for i, amp in enumerate(harm))
    return (s * env(n, a, d)).astype(np.float32)


def lowpass(x: np.ndarray, cutoff: float) -> np.ndarray:
    alpha = 1 - np.exp(-2 * np.pi * cutoff / SR)
    y = np.empty_like(x)
    acc = 0.0
    for i, v in enumerate(x):
        acc += alpha * (v - acc)
        y[i] = acc
    return y


def highpass(x: np.ndarray, cutoff: float) -> np.ndarray:
    return x - lowpass(x, cutoff)


def noise(dur: float) -> np.ndarray:
    return RNG.uniform(-1, 1, int(dur * SR)).astype(np.float32)


def place(buf: np.ndarray, x: np.ndarray, t: float, gain: float = 1.0) -> None:
    s = int(t * SR)
    e = min(len(buf), s + len(x))
    if s < len(buf):
        buf[s:e] += x[: e - s] * gain


def midi(m: float) -> float:
    return 440.0 * 2 ** ((m - 69) / 12)


def build_music(duration: float = 24.5) -> None:
    bpm = 100
    beat = 60 / bpm
    bar = beat * 4
    n = int(duration * SR)
    drums = np.zeros(n, np.float32)
    bass = np.zeros(n, np.float32)
    pad = np.zeros(n, np.float32)
    keys = np.zeros(n, np.float32)

    # Fmaj9 - Am7 - Dm9 - Bbmaj7 (bright, calm, no tension)
    chords = [[53, 57, 60, 64, 67], [57, 60, 64, 67], [50, 57, 60, 64, 65], [46, 57, 62, 65, 69]]
    roots = [41, 45, 38, 46]

    # Soft kick
    kt = np.arange(int(0.35 * SR)) / SR
    kick = np.sin(2 * np.pi * (48 + 70 * np.exp(-kt * 30)) * kt) * np.exp(-kt * 9)
    # Closed hat
    hat = highpass(noise(0.05), 6000) * env(int(0.05 * SR), 0.001, 0.012)
    # Rim/clap-ish snap, very soft
    snap = highpass(noise(0.12), 1800) * env(int(0.12 * SR), 0.001, 0.035)

    t = 0.0
    bar_i = 0
    while t < duration:
        ci = bar_i % 4
        # pad: detuned saws softened through a lowpass, long attack
        pdur = bar + 0.4
        for m in chords[ci]:
            f = midi(m + 12)
            tt = np.arange(int(pdur * SR)) / SR
            saw = sum(np.sin(2 * np.pi * f * k * tt * (1 + det)) / k for k in range(1, 6) for det in (-0.003, 0.003))
            shape = np.minimum(1, tt / 0.6) * np.minimum(1, (pdur - tt) / 0.4)
            place(pad, (saw * shape).astype(np.float32), t, 0.018)
        # bass: root on 1, fifth pickup
        place(bass, tone(midi(roots[ci]), beat * 1.8, a=0.01, d=0.9, harm=(1, 0.35, 0.1)), t, 0.32)
        place(bass, tone(midi(roots[ci] + 7), beat * 0.9, a=0.01, d=0.3, harm=(1, 0.3)), t + beat * 2.5, 0.2)
        # pluck arpeggio, 8ths, from bar 2 onward so the hook breathes
        if bar_i >= 1:
            notes = chords[ci][1:] + chords[ci][1:][::-1]
            for k in range(8):
                f = midi(notes[k % len(notes)] + 12)
                place(keys, tone(f, 0.35, a=0.002, d=0.12, harm=(1, 0.25, 0.08)), t + k * beat / 2, 0.06)
        # drums
        for k in range(4):
            bt = t + k * beat
            if k in (0, 2):
                place(drums, kick.astype(np.float32), bt, 0.55)
            if k in (1, 3) and bar_i >= 1:
                place(drums, snap.astype(np.float32), bt, 0.18)
            for h in range(2):
                place(drums, hat.astype(np.float32), bt + h * beat / 2, 0.10 if h else 0.06)
        t += bar
        bar_i += 1

    pad = lowpass(pad, 2200)
    mix = drums + bass + pad + keys
    # gentle fade in/out
    fi = int(0.4 * SR)
    fo = int(1.6 * SR)
    mix[:fi] *= np.linspace(0, 1, fi)
    mix[-fo:] *= np.linspace(1, 0, fo)
    mix /= np.max(np.abs(mix)) + 1e-6
    # simple stereo widening: blend a short delay into the right side
    d = int(0.011 * SR)
    left = mix
    right = 0.7 * mix + 0.3 * np.concatenate([np.zeros(d, np.float32), mix[:-d]])
    save("music-bed.wav", np.stack([left * 0.8, right * 0.8], 1).astype(np.float32))


def build_sfx() -> None:
    # Keyboard tap: short band-limited click
    for i in range(3):
        k = highpass(noise(0.045), 1500 + 600 * i) * env(int(0.045 * SR), 0.0005, 0.008)
        k += tone(180 + 40 * i, 0.045, a=0.0005, d=0.01) * 0.4
        save(f"sfx-key-{i + 1}.wav", (k * 0.6).astype(np.float32))
    # Send: soft pop + rising blip
    pop = tone(520, 0.12, a=0.001, d=0.05, harm=(1, 0.3)) + tone(780, 0.12, a=0.02, d=0.05) * 0.5
    save("sfx-send.wav", (pop * 0.5).astype(np.float32))
    # Diagnostic tick
    save("sfx-tick.wav", (tone(1760, 0.08, a=0.001, d=0.02, harm=(1, 0.2)) * 0.35).astype(np.float32))
    # Card reveal: airy filtered swell
    sw = lowpass(highpass(noise(0.45), 400), 3500)
    tt = np.arange(len(sw)) / SR
    sw *= np.sin(np.pi * tt / tt[-1]) ** 2
    save("sfx-reveal.wav", (sw * 0.35).astype(np.float32))
    # UI click
    c = highpass(noise(0.03), 2500) * env(int(0.03 * SR), 0.0003, 0.004) + tone(1200, 0.03, a=0.0003, d=0.006) * 0.5
    save("sfx-click.wav", (c * 0.7).astype(np.float32))
    # Approval: two-note rising tone
    ap = np.zeros(int(0.6 * SR), np.float32)
    place(ap, tone(midi(76), 0.5, a=0.004, d=0.18, harm=(1, 0.3, 0.1)), 0.0, 0.4)
    place(ap, tone(midi(83), 0.5, a=0.004, d=0.25, harm=(1, 0.3, 0.1)), 0.09, 0.4)
    save("sfx-approve.wav", ap)
    # Completion chime: bell triad
    ch = np.zeros(int(1.6 * SR), np.float32)
    for i, m in enumerate((84, 88, 91)):
        place(ch, tone(midi(m), 1.4, a=0.002, d=0.55, harm=(1, 0.0, 0.25, 0.0, 0.08)), i * 0.06, 0.25)
    save("sfx-chime.wav", ch)


if __name__ == "__main__":
    build_voice(Path(sys.argv[1]))
    build_music()
    build_sfx()
