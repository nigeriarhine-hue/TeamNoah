"""Assemble the 20s "5 People, One Noah" Short from generated clips + build/gfx layers.

Usage:  python3 compose.py --clips <dir with clip0.mp4..clip5.mp4> [--thumb-bg thumb_bg.png]
Needs:  ffmpeg on PATH (or imageio-ffmpeg), numpy, Pillow. Run build_graphics.py first.
Output: build/noah_5people_short.mp4 (1080x1920, 30fps, H.264/AAC, -14 LUFS) and
        build/noah_5people_thumbnail.png when --thumb-bg is given.
"""
import argparse
import json
import os
import shutil
import subprocess
import wave

import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
BUILD = os.path.join(HERE, "build")
GFX = os.path.join(BUILD, "gfx")
SR = 48000


def ffmpeg_bin():
    exe = shutil.which("ffmpeg")
    if exe:
        return exe
    import imageio_ffmpeg
    return imageio_ffmpeg.get_ffmpeg_exe()


FF = ffmpeg_bin()


def run(args):
    subprocess.run([FF, "-hide_banner", "-loglevel", "error", "-y", *args], check=True)


# ------------------------------------------------------------------ timing
def plan(spec):
    X = spec["xfade"]
    beats = spec["beats"]
    for b in beats:
        if "clip" in b:
            b["speed"] = b.get("speed", spec["speech_speed"])
            b["dur"] = round((b["out"] - b["in"]) / b["speed"], 3)
    fixed = sum(b["dur"] for b in beats if "clip" in b)
    splash = [b for b in beats if "still" in b][0]
    splash["dur"] = round(spec["target_duration"] - fixed + X * (len(beats) - 1), 3)
    t = 0.0
    for b in beats:
        b["start"] = round(t, 3)
        t += b["dur"] - X
    return beats


def local(b, t_src):
    """Source-clip seconds -> seconds inside the beat's segment."""
    return max(0.0, (t_src - b["in"]) / b["speed"])


# ------------------------------------------------------------------ video
def segment(b, clips, i, fps):
    out = os.path.join(BUILD, f"seg{i}.mp4")
    inputs, chains, n = [], [], 0
    d = b["dur"]
    if "clip" in b:
        inputs += ["-ss", str(b["in"]), "-t", str(b["out"] - b["in"]), "-i", os.path.join(clips, b["clip"])]
        # 1080x1912 source -> fill 1080x1920, retime, gentle grade for cohesion
        chains.append(f"[0:v]scale=1086:1920:flags=lanczos,crop=1080:1920,setpts=(PTS-STARTPTS)/{b['speed']},fps={fps},"
                      f"eq=contrast=1.03:saturation=1.04,format=rgba[v0]")
    else:
        inputs += ["-loop", "1", "-t", str(d), "-i", os.path.join(GFX, b["still"])]
        # slow settle-in on the splash
        chains.append(f"[0:v]scale=1188:2112,zoompan=z='1.10-0.10*min(1,on/({fps}*0.9))':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)'"
                      f":d=1:s=1080x1920:fps={fps},format=rgba[v0]")
    n = 1
    cur = "v0"

    def layer(png, t_in, t_out, slide=0, fade=0.18):
        nonlocal n, cur
        inputs.extend(["-loop", "1", "-t", str(d), "-i", os.path.join(GFX, png)])
        t_out = min(t_out, d)
        lbl = f"l{n}"
        chains.append(f"[{n}:v]format=rgba,fade=in:st={t_in:.3f}:d={fade}:alpha=1,"
                      f"fade=out:st={max(t_in, t_out - 0.15):.3f}:d=0.15:alpha=1[{lbl}]")
        y = "0" if not slide else f"'{slide}*max(0,1-(t-{t_in:.3f})/0.28)'"
        chains.append(f"[{cur}][{lbl}]overlay=x=0:y={y}:eval=frame:enable='between(t,{t_in:.3f},{t_out:.3f})'[o{n}]")
        cur = f"o{n}"
        n += 1

    if b["id"] == "open":
        layer("title.png", 0.10, d + 1)
    if "kicker" in b:
        layer(f"kicker_{b['id']}.png", 0.12, d - 0.05, slide=-40)
    uis = b.get("ui", [])
    for k, u in enumerate(uis):
        t0 = u["t0"] / b["speed"]  # ui times are beat-relative, in source seconds
        t1 = uis[k + 1]["t0"] / b["speed"] if k + 1 < len(uis) else d - 0.12
        layer(u["png"], t0, t1, slide=90)
    caps = b.get("captions", [])
    for k, c in enumerate(caps):
        t0 = local(b, c["t0"])
        t1 = local(b, caps[k + 1]["t0"]) if k + 1 < len(caps) else d - 0.05
        layer(f"cap_{b['id']}_{k}.png", t0, t1, fade=0.08)
    chains.append(f"[{cur}]setsar=1,format=yuv420p[vout]")
    run([*inputs, "-filter_complex", ";".join(chains), "-map", "[vout]", "-t", str(d),
         "-r", str(fps), "-c:v", "libx264", "-crf", "14", "-preset", "medium", "-an", out])
    return out


def join(beats, segs, spec, out):
    X = spec["xfade"]
    inputs = []
    for s in segs:
        inputs += ["-i", s]
    chain, prev, acc = [], "0:v", beats[0]["dur"]
    for i in range(1, len(segs)):
        tr = beats[i - 1].get("transition", "fade")
        off = acc - X
        chain.append(f"[{prev}][{i}:v]xfade=transition={tr}:duration={X}:offset={off:.3f}[x{i}]")
        prev = f"x{i}"
        acc = off + beats[i]["dur"]
    run([*inputs, "-filter_complex", ";".join(chain), "-map", f"[{prev}]", "-c:v", "libx264",
         "-crf", "14", "-preset", "medium", "-pix_fmt", "yuv420p", "-an", out])


# ------------------------------------------------------------------ audio synthesis
def env(n, a, r):
    e = np.ones(n)
    ai, ri = int(a * SR), int(r * SR)
    if ai:
        e[:ai] = np.linspace(0, 1, ai)
    if ri:
        e[-ri:] *= np.linspace(1, 0, ri)
    return e


def lowpass(x, cutoff):
    a = np.exp(-2 * np.pi * cutoff / SR)
    y = np.empty_like(x)
    acc = 0.0
    for i, v in enumerate(x):
        acc = (1 - a) * v + a * acc
        y[i] = acc
    return y


def note(f):
    return 440.0 * 2 ** ((f - 69) / 12)


def music(total):
    """Light, modern tech bed: soft pad, plucked arpeggio, sub pulse, airy hats. ~104 BPM."""
    rng = np.random.default_rng(7)
    n = int(total * SR)
    mix = np.zeros(n)
    beat = 60 / 104
    bar = beat * 4
    chords = [[53, 57, 60, 64], [57, 60, 64, 67], [55, 59, 62, 67], [52, 55, 59, 64]]  # Fmaj7 Am7 G Em7
    t_all = np.arange(n) / SR
    for bi in range(int(total / bar) + 1):
        ch = chords[bi % 4]
        s, e = int(bi * bar * SR), min(n, int((bi + 1) * bar * SR) + int(0.3 * SR))
        if s >= n:
            break
        tt = t_all[s:e] - bi * bar
        pad = sum(np.sin(2 * np.pi * note(m) * tt * (1 + dt)) for m in ch for dt in (-0.002, 0.002))
        mix[s:e] += 0.030 * pad * env(e - s, 0.35, 0.4)
        sub = np.sin(2 * np.pi * note(ch[0] - 12) * tt) * np.exp(-tt * 1.2)
        mix[s:e] += 0.10 * sub
        for k in range(8):  # eighth-note pluck arp
            ts = bi * bar + k * beat / 2
            s2 = int(ts * SR)
            if s2 >= n:
                break
            L = min(int(0.45 * SR), n - s2)
            t2 = np.arange(L) / SR
            f = note(ch[[0, 2, 1, 3, 2, 1, 3, 2][k]] + 12)
            pl = (np.sin(2 * np.pi * f * t2) + 0.3 * np.sin(4 * np.pi * f * t2)) * np.exp(-t2 * 9)
            mix[s2:s2 + L] += 0.040 * pl
    # airy offbeat hats + soft kick after the open
    hat = lowpass(rng.standard_normal(int(0.05 * SR)), 9000)
    hat = (rng.standard_normal(int(0.05 * SR)) - hat) * np.exp(-np.arange(int(0.05 * SR)) / SR * 70)
    k_t = np.arange(int(0.25 * SR)) / SR
    kick = np.sin(2 * np.pi * (48 + 90 * np.exp(-k_t * 30)) * k_t) * np.exp(-k_t * 14)
    i = 0
    while True:
        tb = i * beat
        if tb >= total - 0.3:
            break
        if tb >= 1.9 and i % 2 == 0:
            s = int(tb * SR)
            mix[s:s + len(kick)] += 0.11 * kick[: n - s]
        s = int((tb + beat / 2) * SR)
        if s + len(hat) < n and tb >= 0.8:
            mix[s:s + len(hat)] += 0.012 * hat
        i += 1
    mix *= env(n, 0.6, 1.2)
    return mix


def whoosh(d=0.42, rng=np.random.default_rng(1)):
    L = int(d * SR)
    t = np.arange(L) / SR
    x = rng.standard_normal(L)
    y, acc = np.empty(L), 0.0
    for i in range(L):  # swept one-pole lowpass: 400Hz -> 5kHz -> 800Hz
        c = 400 + 4600 * np.sin(np.pi * t[i] / d) ** 2
        a = np.exp(-2 * np.pi * c / SR)
        acc = (1 - a) * x[i] + a * acc
        y[i] = acc
    return y * np.sin(np.pi * t / d) ** 1.5 * 0.9


def click():
    L = int(0.04 * SR)
    t = np.arange(L) / SR
    return (np.sin(2 * np.pi * 2300 * t) * np.exp(-t * 180) + 0.5 * np.sin(2 * np.pi * 900 * t) * np.exp(-t * 120)) * 0.6


def pop():
    L = int(0.16 * SR)
    t = np.arange(L) / SR
    f = 880 + 440 * np.minimum(1, t / 0.05)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 26) * 0.35


def chime():
    L = int(1.6 * SR)
    t = np.arange(L) / SR
    out = np.zeros(L)
    for f, st, g in ((1318.5, 0.0, 0.45), (1975.5, 0.11, 0.35)):
        s = int(st * SR)
        tt = t[: L - s]
        out[s:] += g * (np.sin(2 * np.pi * f * tt) + 0.25 * np.sin(2 * np.pi * 2 * f * tt)) * np.exp(-tt * 3.2)
    return out * 0.5


def typing(d, rng=np.random.default_rng(3)):
    n = int(d * SR)
    out = np.zeros(n)
    t = 0.05
    while t < d - 0.05:
        s = int(t * SR)
        L = int(0.02 * SR)
        k = rng.standard_normal(L) * np.exp(-np.arange(L) / SR * 400)
        out[s:s + L] += k[: n - s] * rng.uniform(0.08, 0.16)
        t += rng.uniform(0.07, 0.16)
    return out


def place(buf, sig, t, gain=1.0):
    s = int(t * SR)
    if s >= len(buf):
        return
    e = min(len(buf), s + len(sig))
    buf[s:e] += gain * sig[: e - s]


def write_wav(path, x):
    x = np.clip(x, -1, 1)
    with wave.open(path, "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((x * 32767).astype("<i2").tobytes())


def audio(beats, spec, clips, out):
    total = spec["target_duration"]
    X = spec["xfade"]
    n = int(total * SR)
    sfx = np.zeros(n)
    for i, b in enumerate(beats[1:], 1):
        place(sfx, whoosh(), b["start"] + X / 2 - 0.21, 0.30)
        for u in b.get("ui", []):
            place(sfx, pop(), b["start"] + u["t0"] / b["speed"], 0.5)
            if "click" in u:
                place(sfx, click(), b["start"] + u["click"] / b["speed"], 0.8)
    place(sfx, typing(1.7), 0.15, 0.55)
    place(sfx, chime(), beats[-1]["start"] + 0.35, 0.55)
    write_wav(os.path.join(BUILD, "sfx.wav"), sfx)
    write_wav(os.path.join(BUILD, "music.wav"), music(total))

    # dialogue: each clip's own audio, retimed, laid at its timeline position
    inputs, chains, labels = [], [], []
    for i, b in enumerate(beats):
        if "clip" not in b:
            continue
        inputs += ["-ss", str(b["in"]), "-t", str(b["out"] - b["in"]), "-i", os.path.join(clips, b["clip"])]
        k = len(labels)
        tempo = f"atempo={b['speed']}," if b["speed"] != 1.0 else ""
        vol = 0.35 if b["id"] == "open" else 1.0  # room tone under the title only
        fade_out = max(0.0, b["dur"] - 0.12)
        chains.append(f"[{k}:a]aresample={SR},{tempo}volume={vol},afade=t=in:d=0.05,"
                      f"afade=t=out:st={fade_out:.3f}:d=0.12,adelay={int(b['start'] * 1000)}:all=1[d{k}]")
        labels.append(f"[d{k}]")
    nd = len(labels)
    inputs += ["-i", os.path.join(BUILD, "music.wav"), "-i", os.path.join(BUILD, "sfx.wav")]
    chains.append(f"{''.join(labels)}amix=inputs={nd}:normalize=0,apad=whole_dur={total}[dia]")
    chains.append("[dia]asplit=2[dia1][key]")
    chains.append(f"[{nd}:a]volume=0.55[mus]")
    chains.append("[mus][key]sidechaincompress=threshold=0.03:ratio=6:attack=15:release=320[duck]")
    chains.append(f"[dia1][duck][{nd + 1}:a]amix=inputs=3:normalize=0,atrim=0:{total},"
                  f"loudnorm=I=-14:TP=-1.5:LRA=9,aresample={SR}[aout]")
    run([*inputs, "-filter_complex", ";".join(chains), "-map", "[aout]", "-ac", "2", "-c:a", "pcm_s16le", out])


# ------------------------------------------------------------------ thumbnail
def thumbnail(bg_path):
    from PIL import Image, ImageOps
    bg = Image.open(bg_path).convert("RGB")
    bg = ImageOps.fit(bg, (1080, 1920), Image.LANCZOS)
    ov = Image.open(os.path.join(GFX, "thumb_overlay.png"))
    img = bg.convert("RGBA")
    img.alpha_composite(ov)
    out = os.path.join(BUILD, "noah_5people_thumbnail.png")
    img.convert("RGB").save(out)
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--clips", required=True)
    ap.add_argument("--thumb-bg")
    a = ap.parse_args()
    spec = json.load(open(os.path.join(HERE, "timeline.json")))
    beats = plan(spec)
    for b in beats:
        print(f"{b['id']:>6}  start {b['start']:6.2f}  dur {b['dur']:5.2f}")
    segs = [segment(b, a.clips, i, spec["fps"]) for i, b in enumerate(beats)]
    vid = os.path.join(BUILD, "video.mp4")
    join(beats, segs, spec, vid)
    aud = os.path.join(BUILD, "audio.wav")
    audio(beats, spec, a.clips, aud)
    final = os.path.join(BUILD, "noah_5people_short.mp4")
    run(["-i", vid, "-i", aud, "-map", "0:v", "-map", "1:a", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k",
         "-t", str(spec["target_duration"]), "-movflags", "+faststart", final])
    print("->", final)
    if a.thumb_bg:
        print("->", thumbnail(a.thumb_bg))


if __name__ == "__main__":
    main()
