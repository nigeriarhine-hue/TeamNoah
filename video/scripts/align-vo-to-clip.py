"""Warp a voiceover onto the speech timing baked into a generated talking-head clip.

Seedance re-performs a line with its own timing (and its own voice clone), and the
mouth follows that performance, not the reference audio. This script keeps the real
VO voice but moves and stretches each VO phrase so it starts and ends where the
clip's own speech does, which is what the lips are animated to.

Usage:
  python3 scripts/align-vo-to-clip.py CLIP.mp4 VO.(mp3|wav) OUT.wav [--length SECONDS]
"""
import argparse
import subprocess
import sys
import wave

import numpy as np

SR = 48000
HOP = 0.01  # 10 ms analysis frames


def load(path):
    raw = subprocess.run(
        ["ffmpeg", "-v", "error", "-i", path, "-vn", "-ac", "1", "-ar", str(SR), "-f", "s16le", "-"],
        check=True,
        capture_output=True,
    ).stdout
    return np.frombuffer(raw, np.int16).astype(np.float64) / 32768


def to_count(segs, n):
    """Merge across the smallest gaps until exactly n segments remain."""
    segs = [list(x) for x in segs]
    while len(segs) > n:
        i = min(range(len(segs) - 1), key=lambda k: segs[k + 1][0] - segs[k][1])
        segs[i][1] = segs[i + 1][1]
        del segs[i + 1]
    return segs


def phrases(a, rel_db=30.0, min_gap=0.14, min_len=0.10):
    """Speech segments [(start, end)] from an energy envelope."""
    h = int(SR * HOP)
    rms = np.sqrt([np.mean(a[i : i + h] ** 2) + 1e-12 for i in range(0, len(a) - h, h)])
    db = 20 * np.log10(rms)
    on = db > (db.max() - rel_db)
    segs, start = [], None
    for i, v in enumerate(on):
        if v and start is None:
            start = i
        elif not v and start is not None:
            segs.append([start * HOP, i * HOP])
            start = None
    if start is not None:
        segs.append([start * HOP, len(on) * HOP])
    merged = []
    for s in segs:
        if merged and s[0] - merged[-1][1] < min_gap:
            merged[-1][1] = s[1]
        else:
            merged.append(s)
    return [s for s in merged if s[1] - s[0] >= min_len]


def stretch(x, ratio):
    """Time-stretch by `ratio` (>1 = longer) with ffmpeg atempo (pitch preserved)."""
    tempo = 1.0 / ratio
    p = subprocess.run(
        ["ffmpeg", "-v", "error", "-f", "s16le", "-ar", str(SR), "-ac", "1", "-i", "-", "-af", f"atempo={tempo:.5f}", "-f", "s16le", "-"],
        input=(np.clip(x, -1, 1) * 32767).astype(np.int16).tobytes(),
        check=True,
        capture_output=True,
    )
    return np.frombuffer(p.stdout, np.int16).astype(np.float64) / 32768


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("clip")
    ap.add_argument("vo")
    ap.add_argument("out")
    ap.add_argument("--length", type=float, default=None)
    args = ap.parse_args()

    clip, vo = load(args.clip), load(args.vo)
    cp = phrases(clip)
    vp = phrases(vo)
    if len(vp) < len(cp):
        # The VO's pauses can be shorter than the clip's; split it at its largest gaps.
        vp = to_count(phrases(vo, min_gap=0.04), len(cp))
    elif len(cp) < len(vp):
        cp_fine = phrases(clip, min_gap=0.04)
        cp = to_count(cp_fine, len(vp)) if len(cp_fine) >= len(vp) else cp
    print("clip phrases:", [(round(a, 2), round(b, 2)) for a, b in cp])
    print("vo   phrases:", [(round(a, 2), round(b, 2)) for a, b in vp])
    if len(cp) != len(vp) or not cp:
        print("phrase count differs; aligning whole speech span", file=sys.stderr)
        cp, vp = [[cp[0][0], cp[-1][1]]], [[vp[0][0], vp[-1][1]]]

    length = args.length or len(clip) / SR
    out = np.zeros(int(length * SR) + SR)
    pad = 0.04  # keep consonant attack/decay
    for (cs, ce), (vs, ve) in zip(cp, vp):
        ratio = (ce - cs) / (ve - vs)
        ratio = float(np.clip(ratio, 0.75, 1.33))
        seg = vo[int(max(0, vs - pad) * SR) : int(min(len(vo) / SR, ve + pad) * SR)]
        seg = stretch(seg, ratio) if abs(ratio - 1) > 0.01 else seg
        fade = int(0.008 * SR)
        seg = seg.copy()
        seg[:fade] *= np.linspace(0, 1, fade)
        seg[-fade:] *= np.linspace(1, 0, fade)
        at = int(max(0, cs - pad * ratio) * SR)
        out[at : at + len(seg)] += seg[: len(out) - at]
        print(f"  vo {vs:.2f}-{ve:.2f} -> clip {cs:.2f}-{ce:.2f}  stretch x{ratio:.3f}")
    out = out[: int(length * SR)]

    with wave.open(args.out, "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((np.clip(out, -1, 1) * 32767).astype(np.int16).tobytes())
    print("wrote", args.out, f"{length:.2f}s")


if __name__ == "__main__":
    main()
