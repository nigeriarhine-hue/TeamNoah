"""Assemble a Short's voice-over from separate line files and analyze it for animation.

Usage: python3 tools/build_short_vo.py <dir> <gap1> <gap2> ...
  <dir> holds l1.wav, l2.wav, ... (one file per script line, e.g. from Piper).
  gapN is the silence (seconds) before line N.

Writes into <dir>:
  vo.wav       the placed voice-over (48 kHz mono)
  timing.json  per line: start/end (s and frames) + pause points inside the line,
               plus `mouth`: one 0..1 value per frame (30 fps) for lip animation.
"""
import json, subprocess, sys
from pathlib import Path

import numpy as np

FPS = 30
SR = 48000


def run(*a):
    return subprocess.run(a, check=True, capture_output=True)


def load(path):
    raw = run('ffmpeg', '-loglevel', 'error', '-i', str(path), '-ac', '1', '-ar', str(SR), '-f', 's16le', '-').stdout
    return np.frombuffer(raw, np.int16).astype(np.float32) / 32768


def trim(x, thr=0.01):
    idx = np.where(np.abs(x) > thr)[0]
    if len(idx) == 0:
        return x
    a = max(0, idx[0] - int(0.03 * SR))
    b = min(len(x), idx[-1] + int(0.08 * SR))
    return x[a:b]


def pauses(x, start, min_len=0.12, thr=0.012):
    """Return pause midpoints (absolute seconds) inside a line."""
    hop = int(SR / 100)
    env = np.array([np.sqrt(np.mean(x[i:i + hop] ** 2)) for i in range(0, len(x) - hop, hop)])
    quiet = env < thr
    out, run_start = [], None
    for i, q in enumerate(quiet):
        if q and run_start is None:
            run_start = i
        if not q and run_start is not None:
            if (i - run_start) / 100 >= min_len and run_start > 5:
                out.append(round(start + (run_start + i) / 200, 3))
            run_start = None
    return out


d = Path(sys.argv[1])
gaps = [float(g) for g in sys.argv[2:]]
lines, t, parts = [], 0.0, []
for i, gap in enumerate(gaps, start=1):
    x = trim(load(d / f'l{i}.wav'))
    start = t + gap
    end = start + len(x) / SR
    lines.append({'line': i, 'start': round(start, 3), 'end': round(end, 3),
                  'startFrame': round(start * FPS), 'endFrame': round(end * FPS),
                  'pauses': pauses(x, start)})
    parts.append((x, start))
    t = end

total = t + 0.8
out = np.zeros(int(total * SR), np.float32)
for x, s in parts:
    a = int(s * SR)
    out[a:a + len(x)] += x
out = np.clip(out, -1, 1)
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'f32le', '-ar', str(SR), '-ac', '1', '-i', '-', str(d / 'vo.wav')],
               input=out.tobytes(), check=True)

# Mouth openness per frame: RMS in a 1/30 s window, smoothed and normalized.
n = int(total * FPS)
spf = SR // FPS
rms = np.array([np.sqrt(np.mean(out[i * spf:(i + 1) * spf] ** 2)) if (i + 1) * spf <= len(out) else 0 for i in range(n)])
ref = np.percentile(rms[rms > 0.005], 90) if np.any(rms > 0.005) else 1
mouth = np.clip(rms / ref, 0, 1)
mouth = np.convolve(mouth, [0.25, 0.5, 0.25], mode='same')
mouth[mouth < 0.06] = 0

json.dump({'fps': FPS, 'total': round(total, 3), 'totalFrames': n, 'lines': lines,
           'mouth': [round(float(m), 3) for m in mouth]}, open(d / 'timing.json', 'w'))
for l in lines:
    print(l['line'], l['start'], l['end'], l['startFrame'], l['endFrame'], l['pauses'])
print('total', round(total, 2), 'frames', n)
