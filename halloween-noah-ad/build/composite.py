"""Green-screen compositor: puts the rendered Noah / PC screen onto the witch's monitor.

Every monitor in the Higgsfield shots was generated as a flat chroma-green (#00FF00) panel.
Per frame this finds the panel's four corners, perspective-warps the matching screen frame
into it, keys it in with a soft matte, and suppresses green spill on the bezel.

Usage: python3 composite.py <clip.mp4> <in_s> <n_frames> <screen_dir> <out.mp4> [push_in_s]
"""
import subprocess, sys, os
import numpy as np
from PIL import Image, ImageDraw

clip, t_in, n, screen_dir, out = sys.argv[1], float(sys.argv[2]), int(sys.argv[3]), sys.argv[4], sys.argv[5]
push = float(sys.argv[6]) if len(sys.argv) > 6 else 0.0
W, H, FPS = 1920, 1080, 30

raw = subprocess.run(["ffmpeg", "-v", "error", "-ss", str(t_in), "-i", clip, "-frames:v", str(n),
                      "-vf", f"scale={W}:{H}:flags=lanczos,fps={FPS},setsar=1", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"],
                     capture_output=True, check=True).stdout
frames = np.frombuffer(raw, np.uint8).reshape(-1, H, W, 3)
assert len(frames) >= n - 1, f"clip too short: {len(frames)} < {n}"


def matte(f):
    f = f.astype(np.int16)
    g = f[..., 1] - np.maximum(f[..., 0], f[..., 2])
    return np.clip((g - 40) / 60.0, 0, 1)


def largest_blob(a):
    """Bounding box (full-res) of the largest green component, found on a 1/8 grid."""
    g = a[::8, ::8] > 0.5
    seen = np.zeros_like(g); best = None
    for y0, x0 in zip(*np.nonzero(g)):
        if seen[y0, x0]:
            continue
        stack, pts = [(y0, x0)], []
        seen[y0, x0] = True
        while stack:
            y, x = stack.pop(); pts.append((y, x))
            for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                yy, xx = y + dy, x + dx
                if 0 <= yy < g.shape[0] and 0 <= xx < g.shape[1] and g[yy, xx] and not seen[yy, xx]:
                    seen[yy, xx] = True; stack.append((yy, xx))
        if best is None or len(pts) > len(best):
            best = pts
    p = np.array(best)
    return p[:, 0].min() * 8 - 8, p[:, 0].max() * 8 + 16, p[:, 1].min() * 8 - 8, p[:, 1].max() * 8 + 16


def corners(a):
    y0, y1, x0, x1 = largest_blob(a)
    sub = np.zeros_like(a); sub[max(0, y0):y1, max(0, x0):x1] = a[max(0, y0):y1, max(0, x0):x1]
    ys, xs = np.nonzero(sub > 0.5)
    s, d = xs + ys, xs - ys
    return np.array([[xs[s.argmin()], ys[s.argmin()]], [xs[d.argmax()], ys[d.argmax()]],
                     [xs[s.argmax()], ys[s.argmax()]], [xs[d.argmin()], ys[d.argmin()]]], float)


def coeffs(dst, src):
    """PIL PERSPECTIVE coefficients mapping output (dst quad) back to input (src rect)."""
    A, B = [], []
    for (x, y), (u, v) in zip(dst, src):
        A += [[x, y, 1, 0, 0, 0, -u * x, -u * y], [0, 0, 0, x, y, 1, -v * x, -v * y]]
        B += [u, v]
    return np.linalg.solve(np.array(A, float), np.array(B, float))


mattes = [matte(f) for f in frames[:n]]
quads, last = [], None
for m in mattes:  # a frame with no visible green reuses the previous track
    last = corners(m) if (m > 0.5).sum() > 200 else last
    quads.append(last)
first = next(q for q in quads if q is not None)
quads = np.array([q if q is not None else first for q in quads])
# temporal smoothing of the corners (median of +-2 frames) to kill single-frame jitter
sm = np.array([np.median(quads[max(0, i - 2):i + 3], axis=0) for i in range(len(quads))])
# grow the quad by 3 px so the warped screen fully covers the green edge
c = sm.mean(axis=1, keepdims=True)
sm = c + (sm - c) * (1 + 3 / np.maximum(1, np.abs(sm - c).max(axis=2, keepdims=True)))

src = [(0, 0), (W, 0), (W, H), (0, H)]
enc = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS),
                        "-i", "-", "-c:v", "libx264", "-preset", "medium", "-crf", "15", "-pix_fmt", "yuv420p", out],
                       stdin=subprocess.PIPE)
for i in range(len(mattes)):
    f = frames[i].astype(np.float32)
    scr = Image.open(os.path.join(screen_dir, f"f{i:04d}.jpg")).convert("RGB")
    cf = tuple(coeffs(sm[i], src))
    warped = np.asarray(scr.transform((W, H), Image.PERSPECTIVE, cf, Image.BICUBIC), np.float32)
    valid = np.asarray(Image.new("L", scr.size, 255).transform((W, H), Image.PERSPECTIVE, cf, Image.BILINEAR), np.float32)[..., None] / 255
    # where the monitor runs past the frame edge the tracked quad is clipped; fill any green it misses
    # with the screen's own dark background instead of leaving chroma green
    edge = np.asarray(scr, np.float32)[4:40, 4:40].reshape(-1, 3).mean(axis=0)
    warped = warped * valid + edge * (1 - valid)
    # screens emit light: keep them slightly below full white so they sit in the dark room
    warped = warped * 0.9 + 6
    y0, y1, x0, x1 = largest_blob(mattes[i]) if (mattes[i] > 0.5).sum() > 200 else (0, 0, 0, 0)
    region = np.zeros((H, W), np.float32)
    region[max(0, y0 - 24):y1 + 24, max(0, x0 - 24):x1 + 24] = 1  # key only on and around the monitor
    a = (mattes[i] * region)[..., None]
    comp = f * (1 - a) + warped * a
    # spill suppression on the bezel/edges: clamp green to max(red, blue)
    near = region > 0
    g_lim = np.maximum(comp[..., 0], comp[..., 2]) + 12
    comp[..., 1] = np.where(near & (comp[..., 1] > g_lim), g_lim, comp[..., 1])
    if push and i >= len(mattes) - int(push * FPS):
        # push into the screen: zoom toward the monitor centre
        k = (i - (len(mattes) - int(push * FPS)) + 1) / (push * FPS)
        z = 1 + 2.4 * k * k
        cx, cy = sm[i].mean(axis=0)
        im = Image.fromarray(np.clip(comp, 0, 255).astype(np.uint8))
        w2, h2 = W / z, H / z
        x0 = min(max(cx - w2 / 2, 0), W - w2); y0 = min(max(cy - h2 / 2, 0), H - h2)
        comp = np.asarray(im.resize((W, H), Image.BICUBIC, box=(x0, y0, x0 + w2, y0 + h2)), np.float32)
        comp = comp * (1 - 0.6 * k) + np.array([199, 203, 255], np.float32) * 0.6 * k
    enc.stdin.write(np.clip(comp, 0, 255).astype(np.uint8).tobytes())
enc.stdin.close(); enc.wait()
print(f"{os.path.basename(out)}: {len(mattes)} frames, quad0={sm[0].astype(int).tolist()}")
