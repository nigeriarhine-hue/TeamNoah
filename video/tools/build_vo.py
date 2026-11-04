"""Assemble the episode voice-over from separate TTS lines.

Each line is trimmed of leading/trailing silence, sped up by TEMPO, and placed at a start time.
Outputs (in public/vo/):
  vo_full.wav        the master VO track used by Remotion
  lipsync_a.mp3      audio for host clip A (padded), uploaded to Seedance
  lipsync_b.mp3      audio for host clip B (padded)
  timing.json        start/end of each line in seconds and frames (30 fps)
"""
import json, subprocess, sys
from pathlib import Path

VO = Path(__file__).resolve().parent.parent / 'public' / 'vo'
TEMPO = 1.12
# (file, gap before this line in seconds). Lines run back to back with these gaps.
# Countdown sits inside the gap before "Got your answer?".
LINES = [
    ('t0.mp3', 0.10),   # This Windows PC feels slow every time it starts.
    ('t5.mp3', 0.18),   # You've got five seconds. What's causing it? RAM, low storage, or startup apps?
    ('t2.mp3', None),   # Got your answer?   (placed at countdown end)
    ('t3.mp3', 0.20),   # Noah checked it. Memory looked normal, storage had room, but nine apps...
    ('t4.mp3', 0.12),   # Did you get it right?
]
COUNTDOWN_END = float(sys.argv[1]) if len(sys.argv) > 1 else 8.85
CLIP_B_START = COUNTDOWN_END - 0.05

def run(*a):
    return subprocess.run(a, check=True, capture_output=True, text=True)

def speech_bounds(f):
    out = subprocess.run(['ffmpeg', '-hide_banner', '-i', str(f), '-af', 'silencedetect=n=-40dB:d=0.05', '-f', 'null', '-'],
                         capture_output=True, text=True).stderr
    dur = float(run('ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', str(f)).stdout)
    starts = [float(x.split(': ')[1]) for x in out.split('\n') if 'silence_start' in x for x in [x[x.index('silence_start'):]]]
    ends = [float(x.split(': ')[1].split(' ')[0]) for x in out.split('\n') if 'silence_end' in x for x in [x[x.index('silence_end'):]]]
    a = ends[0] if starts and starts[0] < 0.01 and ends else 0.0
    b = starts[-1] if starts and (not ends or starts[-1] > ends[-1]) else dur
    return max(0, a - 0.03), min(dur, b + 0.06)

timing, t = [], 0.0
parts = []
for i, (f, gap) in enumerate(LINES):
    a, b = speech_bounds(VO / f)
    seg = VO / f'_seg{i}.wav'
    run('ffmpeg', '-y', '-loglevel', 'error', '-i', str(VO / f), '-af',
        f'atrim={a}:{b},asetpts=PTS-STARTPTS,atempo={TEMPO}', '-ar', '48000', '-ac', '1', str(seg))
    d = float(run('ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', str(seg)).stdout)
    start = COUNTDOWN_END if gap is None else t + gap
    timing.append({'file': f, 'start': round(start, 3), 'end': round(start + d, 3),
                   'startFrame': round(start * 30), 'endFrame': round((start + d) * 30)})
    parts.append((seg, start))
    t = start + d

total = t + 0.05
def mix(out, items, length, offset=0.0, codec=None):
    inputs, filt = [], []
    for k, (seg, s) in enumerate(items):
        inputs += ['-i', str(seg)]
        filt.append(f'[{k}]adelay={int(round((s - offset) * 1000))}:all=1[d{k}]')
    filt.append(''.join(f'[d{k}]' for k in range(len(items))) + f'amix=inputs={len(items)}:normalize=0,apad=whole_dur={length}[o]')
    run('ffmpeg', '-y', '-loglevel', 'error', *inputs, '-filter_complex', ';'.join(filt), '-map', '[o]',
        '-t', str(length), '-ar', '48000', *(codec or []), str(out))

mix(VO / 'vo_full.wav', parts, total)
a_items = [(s, st) for s, st in parts if st < CLIP_B_START]
b_items = [(s, st) for s, st in parts if st >= CLIP_B_START]
mix(VO / 'lipsync_a.mp3', a_items, 9.0, 0.0, ['-b:a', '192k'])
mix(VO / 'lipsync_b.mp3', b_items, 8.0, CLIP_B_START, ['-b:a', '192k'])
for i in range(len(LINES)):
    (VO / f'_seg{i}.wav').unlink()
json.dump({'tempo': TEMPO, 'countdownEnd': COUNTDOWN_END, 'clipBStart': CLIP_B_START, 'total': total, 'lines': timing},
          open(VO / 'timing.json', 'w'), indent=2)
print(json.dumps(timing, indent=1), '\ntotal', round(total, 2))
