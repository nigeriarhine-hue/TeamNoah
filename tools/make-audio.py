#!/usr/bin/env python3
"""
Builds the ad's four audio layers into public/audio/.

These are synthesised rather than sampled so they are deterministic, tiny, and
free of licensing questions — and because the sounds the brief asks for (a soft
UI click, a two-note completion chime, a short dropped-frame stutter, a warm
tonal bed) are exactly the kind that synthesis does better than a generator.

Nothing here is loud. The creator's voice is the only thing meant to carry.

    python3 tools/make-audio.py
"""
from __future__ import annotations

import math
import os
import struct
import subprocess
import sys
import wave

import numpy as np

SR = 48_000
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'public', 'audio')
TMP = os.path.join(ROOT, '.audio-build')


def t(seconds: float) -> np.ndarray:
    return np.arange(int(seconds * SR)) / SR


def adsr(n: int, attack: float, decay: float, curve: float = 3.0) -> np.ndarray:
    """Percussive envelope: short attack, exponential tail."""
    a = max(1, int(attack * SR))
    env = np.ones(n)
    env[:a] = np.linspace(0, 1, a) ** 0.6
    tail = np.arange(n - a) / SR
    env[a:] = np.exp(-tail / max(decay, 1e-6) * curve)
    return env


def onepole_lp(x: np.ndarray, cutoff: float) -> np.ndarray:
    """Cheap one-pole low pass; enough to take the fizz off noise."""
    a = math.exp(-2 * math.pi * cutoff / SR)
    y = np.empty_like(x)
    acc = 0.0
    for i, v in enumerate(x):
        acc = (1 - a) * v + a * acc
        y[i] = acc
    return y


def onepole_hp(x: np.ndarray, cutoff: float) -> np.ndarray:
    return x - onepole_lp(x, cutoff)


def band_noise(n: int, lo: float, hi: float, seed: int) -> np.ndarray:
    rng = np.random.default_rng(seed)
    x = rng.standard_normal(n)
    return onepole_hp(onepole_lp(x, hi), lo)


def norm(x: np.ndarray, peak: float) -> np.ndarray:
    m = float(np.max(np.abs(x)))
    return x * (peak / m) if m > 0 else x


def write_wav(path: str, mono: np.ndarray, stereo_spread: float = 0.0) -> None:
    """Writes 16-bit stereo. `stereo_spread` delays the right channel slightly
    to open the image up without touching phase coherence in the low end."""
    if stereo_spread > 0:
        d = int(stereo_spread * SR)
        right = np.concatenate([np.zeros(d), mono[:-d]]) if d else mono
    else:
        right = mono
    inter = np.empty(mono.size * 2)
    inter[0::2] = np.clip(mono, -1, 1)
    inter[1::2] = np.clip(right, -1, 1)
    data = (inter * 32767).astype('<i2').tobytes()
    with wave.open(path, 'wb') as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(data)


# ---------------------------------------------------------------- click ----
def click() -> np.ndarray:
    """A trackpad press: a dry tick with a little body under it. 90 ms."""
    n = int(0.09 * SR)
    tick = band_noise(n, 900, 5200, seed=11) * adsr(n, 0.0005, 0.010, 4.5)
    body = np.sin(2 * np.pi * 148 * t(0.09)) * adsr(n, 0.001, 0.022, 3.2) * 0.55
    click_ = np.sin(2 * np.pi * 2100 * t(0.09)) * adsr(n, 0.0004, 0.005, 5.0) * 0.25
    return norm(tick * 0.9 + body + click_, 0.72)


# ----------------------------------------------------------- completion ----
def complete() -> np.ndarray:
    """Two soft marimba-ish notes a fifth apart. Reassuring, not triumphant."""
    dur = 1.7
    n = int(dur * SR)
    out = np.zeros(n)
    # C5 then G5, the second landing while the first is still ringing.
    for f0, start, gain in ((523.25, 0.00, 1.0), (783.99, 0.17, 0.82)):
        s = int(start * SR)
        m = n - s
        tt = np.arange(m) / SR
        # Marimba's signature is a strong 4th partial over a quick-decaying body.
        note = (
            np.sin(2 * np.pi * f0 * tt) * adsr(m, 0.006, 0.42, 3.0)
            + 0.30 * np.sin(2 * np.pi * f0 * 4.0 * tt) * adsr(m, 0.003, 0.13, 4.0)
            + 0.08 * np.sin(2 * np.pi * f0 * 9.9 * tt) * adsr(m, 0.002, 0.05, 5.0)
        )
        out[s:] += note * gain
    return norm(out, 0.62)


# --------------------------------------------------------------- glitch ----
def glitch() -> np.ndarray:
    """Three dropped-frame artefacts, decaying. Restrained: this is a texture
    under a title card, not a sound effect anyone should notice on its own."""
    dur = 1.4
    n = int(dur * SR)
    out = np.zeros(n)

    for i, (start, length, gain, lo, hi) in enumerate(
        (
            (0.000, 0.045, 1.00, 320, 3600),
            (0.115, 0.028, 0.66, 500, 4800),
            (0.300, 0.020, 0.40, 700, 5200),
        )
    ):
        s = int(start * SR)
        m = int(length * SR)
        burst = band_noise(m, lo, hi, seed=41 + i)
        # Hard-gate it into sub-slices so it reads as dropped frames, not noise.
        gate = np.ones(m)
        step = max(1, m // 5)
        for k in range(0, m, step):
            if (k // step) % 2:
                gate[k : k + step] *= 0.18
        sq = np.sign(np.sin(2 * np.pi * 196 * (np.arange(m) / SR))) * 0.22
        out[s : s + m] += (burst * gate + sq) * adsr(m, 0.0006, length * 0.55, 2.4) * gain

    # A short tape-flutter tail: a tone whose pitch wobbles as it dies away.
    fs, fl = int(0.34 * SR), int(0.42 * SR)
    tt = np.arange(fl) / SR
    wob = 1 + 0.045 * np.sin(2 * np.pi * 11.0 * tt) * np.exp(-tt * 5)
    out[fs : fs + fl] += (
        np.sin(2 * np.pi * 330 * np.cumsum(wob) / SR) * adsr(fl, 0.004, 0.11, 3.4) * 0.20
    )

    return norm(onepole_lp(out, 7000), 0.55)


# ------------------------------------------------------------------ bed ----
def bed(dur: float = 29.0) -> np.ndarray:
    """A warm Dm9 drone with a slow pulse.

    Long enough that the 27.3s ad never reaches a loop point, and every
    modulation completes a whole number of cycles so it loops cleanly anyway.
    """
    n = int(dur * SR)
    tt = np.arange(n) / SR
    out = np.zeros(n)

    # Dm9: D2 A2 D3 F3 A3 C4 E4. Weighted so the low end carries and the top
    # only colours — anything bright here would fight the voice.
    voices = (
        (73.42, 0.52), (110.00, 0.30), (146.83, 0.34),
        (174.61, 0.24), (220.00, 0.17), (261.63, 0.11), (329.63, 0.07),
    )
    for i, (f, amp) in enumerate(voices):
        # Whole numbers of LFO cycles over `dur` keep the loop seamless.
        cycles = 2 + i
        lfo = 1 + 0.16 * np.sin(2 * np.pi * cycles / dur * tt + i * 1.7)
        detune = 0.12 + i * 0.03
        out += amp * lfo * (
            np.sin(2 * np.pi * f * tt) + np.sin(2 * np.pi * (f + detune) * tt)
        ) * 0.5

    # A quiet pulse at 92 BPM — presence, not a beat.
    beat = 60.0 / 92.0
    pulse = np.zeros(n)
    k = 0
    while k * beat < dur:
        s = int(k * beat * SR)
        m = min(int(0.30 * SR), n - s)
        if m > 0:
            pulse[s : s + m] += np.sin(
                2 * np.pi * 146.83 * (np.arange(m) / SR)
            ) * adsr(m, 0.012, 0.075, 3.0)
        k += 1
    out += pulse * 0.085

    # Tape hiss, well under everything else.
    out += band_noise(n, 600, 5200, seed=7) * 0.012

    out = onepole_hp(onepole_lp(out, 2600), 38)

    # Ends taper so the bed never starts or stops abruptly.
    fade = int(0.9 * SR)
    out[:fade] *= np.linspace(0, 1, fade) ** 2
    out[-fade:] *= np.linspace(1, 0, fade) ** 2
    return norm(out, 0.58)


LAYERS = {
    'click': (click, 0.0),
    'complete': (complete, 0.004),
    'glitch': (glitch, 0.006),
    'bed': (bed, 0.011),
}


def main() -> int:
    os.makedirs(OUT, exist_ok=True)
    os.makedirs(TMP, exist_ok=True)
    for name, (fn, spread) in LAYERS.items():
        wav = os.path.join(TMP, f'{name}.wav')
        mp3 = os.path.join(OUT, f'{name}.mp3')
        print(f'  synthesising {name} …', flush=True)
        write_wav(wav, fn(), stereo_spread=spread)
        subprocess.run(
            ['npx', 'remotion', 'ffmpeg', '-y', '-hide_banner', '-loglevel', 'error',
             '-i', wav, '-c:a', 'libmp3lame', '-b:a', '192k', '-ar', str(SR), mp3],
            cwd=ROOT, check=True,
        )
        print(f'  -> {os.path.relpath(mp3, ROOT)} ({os.path.getsize(mp3)} bytes)')
    return 0


if __name__ == '__main__':
    sys.exit(main())
