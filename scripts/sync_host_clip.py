"""Retime a Higgsfield Intone talking-head clip so its lip movement matches our final voiceover.

Intone slightly re-times the speech it is given. We align the clip's own audio to the reference
audio (the VO slice we uploaded) with DTW on loudness envelopes, then rebuild the video at 30 fps by
picking, for each output frame, the clip frame whose speech position matches.

Usage: python3 scripts/sync_host_clip.py <clip.mp4> <reference.wav> <out.mp4>
"""
import os, subprocess, sys, tempfile, wave
import numpy as np

clip, ref, out = sys.argv[1:4]
tmp = tempfile.mkdtemp()


def load(path):
    p = os.path.join(tmp, os.path.basename(path) + '.wav')
    subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', path, '-ac', '1', '-ar', '16000', p], check=True)
    w = wave.open(p)
    return np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(float)


def env(x):
    e = np.sqrt(np.convolve(x ** 2, np.ones(320) / 320, 'same'))[::160]  # 10 ms hop
    e = np.log(e + 50)
    return (e - e.mean()) / e.std()


a, b = env(load(clip)), env(load(ref))
n, m = len(b), len(a)
D = np.full((n + 1, m + 1), np.inf); D[0, 0] = 0
cost = np.abs(b[:, None] - a[None, :])
for i in range(1, n + 1):
    for j in range(max(1, int(i * 0.85) - 60), min(m + 1, int(i * 1.3) + 60)):
        D[i, j] = cost[i - 1, j - 1] + min(D[i - 1, j - 1], D[i - 1, j], D[i, j - 1])
i, j, path = n, m, []
while i > 0 and j > 0:
    path.append((i - 1, j - 1))
    k = int(np.argmin([D[i - 1, j - 1], D[i - 1, j], D[i, j - 1]]))
    i, j = (i - 1, j - 1) if k == 0 else ((i - 1, j) if k == 1 else (i, j - 1))
P = np.array(path[::-1], float) / 100.0
# smooth monotone map: anchors every 0.4 s, then linear interpolation
anchors_t = np.arange(0, P[-1, 0] + 0.001, 0.4)
anchors_c = [np.median(P[np.abs(P[:, 0] - t) < 0.2, 1]) for t in anchors_t]
anchors_c = np.maximum.accumulate(anchors_c)

src_dir = os.path.join(tmp, 'src'); os.makedirs(src_dir)
subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', clip, '-q:v', '2', os.path.join(src_dir, '%04d.jpg')], check=True)
src_fps = 24.0
nsrc = len(os.listdir(src_dir))
dur = len(b) / 100.0
lines = []
for f in range(int(dur * 30)):
    t = f / 30
    ct = float(np.interp(t, anchors_t, anchors_c))
    idx = min(nsrc, max(1, int(round(ct * src_fps)) + 1))
    lines.append(f"file '{os.path.join(src_dir, '%04d.jpg' % idx)}'\nduration {1/30:.6f}")
lst = os.path.join(tmp, 'list.txt')
open(lst, 'w').write('\n'.join(lines) + '\n')
subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', lst, '-r', '30', '-c:v', 'libx264',
                '-crf', '16', '-pix_fmt', 'yuv420p', '-an', out], check=True)
print(out, 'frames', len(lines), 'map', [(round(t, 1), round(c, 2)) for t, c in zip(anchors_t[::3], anchors_c[::3])])
