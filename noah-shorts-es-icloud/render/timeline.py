#!/usr/bin/env python3
"""Compute the exact 20.000 s timeline from the real voice-over durations.

Kept separate from build_video.py so the timing can be inspected and tweaked
without touching the render. If the character audio is not on disk yet, the
estimates here stand in so the animatic still cuts at the right moments.

Rule from the brief: no spoken word may be rushed, clipped or omitted. So when
the lines do not fit, we spend the deficit in this order:
  1. shrink the inter-line gaps (down to MIN_GAP)
  2. shrink the lead-in and tail (down to their minimums)
  3. only then a uniform tempo nudge, capped at MAX_TEMPO, and reported loudly
Truncating a line is never an option.
"""
import json, pathlib, subprocess, sys

ROOT  = pathlib.Path(__file__).resolve().parent.parent
TOTAL = 20.0
FPS   = 30

LEAD_IN, MIN_LEAD = 0.28, 0.10
TAIL,    MIN_TAIL = 0.50, 0.22
GAP,     MIN_GAP  = 0.20, 0.06
MAX_TEMPO = 1.05          # beyond this the delivery audibly hurries

# Fallback durations (s) if the mp3s are not present. Derived from Spanish TTS
# at ~14.5 characters/second for eleven_multilingual_v2 at speed 1.0.
ESTIMATED = {"s1": 3.45, "s2": 4.35, "s3": 4.20, "s4": 3.55, "s5": 4.55}


def ffmpeg() -> str:
    import imageio_ffmpeg
    return imageio_ffmpeg.get_ffmpeg_exe()


def audio_duration(path: pathlib.Path) -> float | None:
    """Read a file's duration by decoding it; no ffprobe in this toolchain."""
    if not path.exists():
        return None
    out = subprocess.run([ffmpeg(), "-hide_banner", "-i", str(path), "-f", "null", "-"],
                         capture_output=True, text=True).stderr
    for line in reversed(out.splitlines()):
        if "time=" in line:
            t = line.split("time=")[1].split()[0]
            h, m, s = t.split(":")
            return int(h) * 3600 + int(m) * 60 + float(s)
    return None


def build() -> dict:
    script = json.loads((ROOT / "script" / "script.es.json").read_text())
    shots  = script["shots"]
    audio_dir = ROOT / "assets" / "audio"

    durs, measured = [], True
    for s in shots:
        d = audio_duration(audio_dir / f"{s['id']}.mp3")
        if d is None:
            d, measured = ESTIMATED[s["id"]], False
        durs.append(d)

    lead, tail, gap, tempo = LEAD_IN, TAIL, GAP, 1.0
    need = lead + sum(durs) + gap * (len(durs) - 1) + tail

    if need > TOTAL:                                   # 1. gaps
        gap = max(MIN_GAP, gap - (need - TOTAL) / (len(durs) - 1))
        need = lead + sum(durs) + gap * (len(durs) - 1) + tail
    if need > TOTAL:                                   # 2. lead-in / tail
        room = (lead - MIN_LEAD) + (tail - MIN_TAIL)
        take = min(room, need - TOTAL)
        if room > 0:
            lead -= (lead - MIN_LEAD) * (take / room)
            tail -= (tail - MIN_TAIL) * (take / room)
        need = lead + sum(durs) + gap * (len(durs) - 1) + tail
    if need > TOTAL:                                   # 3. last resort
        tempo = min(MAX_TEMPO, need / TOTAL)
        durs  = [d / tempo for d in durs]
        need  = lead + sum(durs) + gap * (len(durs) - 1) + tail

    slack = TOTAL - need
    if slack > 0:                       # spread spare time into gaps and tail
        gap  += slack * 0.6 / (len(durs) - 1)
        tail += slack * 0.4

    # Line start times, then segment bounds that hand over midway through a gap.
    starts, t = [], lead
    for d in durs:
        starts.append(t)
        t += d + gap

    cuts = [0.0 if i == 0 else starts[i] - gap / 2 for i in range(len(shots))]
    cuts.append(TOTAL)

    # Snap every boundary to a whole frame so the segments sum to exactly
    # TOTAL*FPS frames. Without this the per-segment rounding drifts and the
    # export lands a few frames past 20 s.
    total_frames = int(round(TOTAL * FPS))
    fcuts = [min(total_frames, max(0, int(round(c * FPS)))) for c in cuts]
    fcuts[0], fcuts[-1] = 0, total_frames
    for i in range(1, len(fcuts)):                  # keep strictly increasing
        fcuts[i] = max(fcuts[i], fcuts[i - 1] + 1)
    for i in range(len(fcuts) - 2, 0, -1):
        fcuts[i] = min(fcuts[i], fcuts[i + 1] - 1)

    segs = []
    for i, s in enumerate(shots):
        a, b = fcuts[i], fcuts[i + 1]
        segs.append({
            "id": s["id"], "screen": s["screen"], "character": s["character"],
            "start_frame": a, "end_frame": b, "frames": b - a,
            "start": round(a / FPS, 4), "end": round(b / FPS, 4),
            "duration": round((b - a) / FPS, 4),
            "voice_start": round(starts[i], 4),
            "voice_duration": round(durs[i], 4),
            "caption": s["caption"],
        })

    return {
        "total": TOTAL, "fps": FPS,
        "durations_measured": measured,
        "tempo_applied": round(tempo, 4),
        "lead_in": round(lead, 4), "gap": round(gap, 4), "tail": round(tail, 4),
        "speech_total": round(sum(durs), 4),
        "total_frames": int(round(TOTAL * FPS)),
        "segments": segs,
    }


if __name__ == "__main__":
    tl = build()
    (ROOT / "render" / "timeline.json").write_text(json.dumps(tl, indent=2))
    src = "measured from assets/audio/*.mp3" if tl["durations_measured"] else "ESTIMATED (no audio on disk)"
    print(f"timeline  total={tl['total']:.3f}s  speech={tl['speech_total']:.2f}s  source={src}")
    if tl["tempo_applied"] > 1.0:
        print(f"  !! tempo {tl['tempo_applied']}x applied to fit 20 s")
    for s in tl["segments"]:
        print(f"  {s['id']}  {s['start']:6.2f}–{s['end']:6.2f}s  "
              f"({s['duration']:.2f}s)  voice@{s['voice_start']:.2f} "
              f"for {s['voice_duration']:.2f}s")
    got = sum(s["frames"] for s in tl["segments"])
    assert got == tl["total_frames"], f"segments sum to {got} frames, want {tl['total_frames']}"
    assert tl["segments"][-1]["end_frame"] == tl["total_frames"]
    print(f"  frame check: {got} frames @ {FPS}fps = {got/FPS:.3f}s  OK")
