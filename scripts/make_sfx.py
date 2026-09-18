"""Synthesise the restrained sound cues the brief calls for.

No stock library, no downloads: six short cues built from sine partials and
shaped noise. Deliberately dry and quiet -- the brief explicitly rules out
goofy sound effects.
"""
import math
import struct
import wave
import random

SR = 48000


def w(path, samples, peak):
    m = max(1e-9, max(abs(s) for s in samples))
    samples = [s / m * peak for s in samples]
    with wave.open(path, 'w') as f:
        f.setnchannels(1)
        f.setsampwidth(2)
        f.setframerate(SR)
        f.writeframes(b''.join(
            struct.pack('<h', max(-32767, min(32767, int(s * 32767)))) for s in samples
        ))


def env(i, n, attack=0.004, release=0.7):
    a = int(SR * attack)
    if i < a:
        return i / a
    t = (i - a) / max(1, n - a)
    return math.exp(-t / release * 5.0)


def tone(freq, dur, partials=(1.0,), decay=0.7, attack=0.004):
    n = int(SR * dur)
    out = []
    for i in range(n):
        t = i / SR
        v = sum(amp * math.sin(2 * math.pi * freq * k * t)
                for k, amp in enumerate(partials, start=1))
        out.append(v * env(i, n, attack, decay))
    return out


def noise(dur, lo_alpha, decay=0.5):
    """one-pole low-passed noise burst"""
    n = int(SR * dur)
    out, prev = [], 0.0
    for i in range(n):
        x = random.uniform(-1, 1)
        prev = prev + lo_alpha * (x - prev)
        out.append(prev * env(i, n, 0.002, decay))
    return out


def mix(*layers):
    n = max(len(l) for l in layers)
    out = [0.0] * n
    for l in layers:
        for i, s in enumerate(l):
            out[i] += s
    return out


def cat(*layers):
    return [s for l in layers for s in l]


def silence(dur):
    return [0.0] * int(SR * dur)


# 1. item one -- soft muted "wrong" tick
w('public/sfx/item1.wav',
  mix(tone(196, 0.16, (1.0, 0.22), decay=0.32), noise(0.05, 0.10, 0.25)), 0.34)

# 2. item two -- same family, a touch firmer and higher
w('public/sfx/item2.wav',
  mix(tone(233, 0.18, (1.0, 0.3, 0.1), decay=0.34), noise(0.05, 0.16, 0.22)), 0.42)

# 3. item three -- small two-note comedic descent, still dry
w('public/sfx/item3.wav',
  cat(mix(tone(262, 0.14, (1.0, 0.25), decay=0.3)),
      mix(tone(196, 0.30, (1.0, 0.3, 0.12), decay=0.42))), 0.44)

# 4. transition to Noah -- clean short whoosh, no cartoon swoop
_wh = []
_n = int(SR * 0.42)
_prev = 0.0
for i in range(_n):
    t = i / _n
    alpha = 0.02 + 0.30 * math.sin(math.pi * t) ** 2
    _prev = _prev + alpha * (random.uniform(-1, 1) - _prev)
    _wh.append(_prev * math.sin(math.pi * t) ** 1.7)
w('public/sfx/whoosh.wav', _wh, 0.40)

# 5. approval -- soft UI click
w('public/sfx/uiclick.wav',
  mix(tone(1320, 0.045, (1.0, 0.4), decay=0.18, attack=0.001),
      noise(0.022, 0.55, 0.12)), 0.30)

# 6. result -- subtle completion chime, a clean rising fifth
w('public/sfx/chime.wav',
  mix(tone(784, 0.85, (1.0, 0.16, 0.05), decay=1.5, attack=0.006),
      cat(silence(0.10), tone(1175, 0.75, (1.0, 0.12), decay=1.5, attack=0.006))), 0.30)

print('wrote 6 cues')
