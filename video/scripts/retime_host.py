"""Retimes sections of the Higgsfield host clip so the creator's lip movement
lines up with the narration track (one consistent voice for the whole video).
Each output file is a list of (clip_start, clip_end, out_duration) pieces."""
import subprocess, os
HERE = os.path.dirname(__file__)
SRC = os.path.join(HERE, '..', 'public', 'host', 'host-clip-raw.mp4')
OUT = os.path.join(HERE, '..', 'public', 'host')

PLANS = {
    # narration 0.00–3.50s  ("Your PC feels slow ... Check this first.")
    'host-hook.mp4': [(0.0, 2.9, 2.34), (2.9, 3.6, 0.32), (3.6, 4.16, 0.48), (4.16, 4.86, 0.70)],
    # narration 9.65–12.50s ("But a slow PC doesn't automatically mean you need more RAM.")
    'host-clarify.mp4': [(4.74, 4.88, 0.13), (4.88, 7.56, 2.42), (7.56, 7.98, 0.42)],
    # narration 26.65–28.40s ("Instead of guessing what your PC needs...")
    'host-transition.mp4': [(8.34, 8.48, 0.15), (8.48, 9.75, 1.34), (9.75, 10.02, 0.28)],
}

for name, pieces in PLANS.items():
    parts, labels = [], []
    for i, (a, b, d) in enumerate(pieces):
        rate = (b - a) / d
        parts.append(f'[0:v]trim={a}:{b},setpts=(PTS-STARTPTS)/{rate:.5f}[p{i}]')
        labels.append(f'[p{i}]')
    fc = ';'.join(parts) + ';' + ''.join(labels) + f'concat=n={len(pieces)}:v=1:a=0,fps=30,format=yuv420p[v]'
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', SRC, '-filter_complex', fc, '-map', '[v]', '-an',
                    '-c:v', 'libx264', '-crf', '14', '-preset', 'slow', os.path.join(OUT, name)], check=True)
    print(name, subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0',
                                os.path.join(OUT, name)], capture_output=True, text=True).stdout.strip())
