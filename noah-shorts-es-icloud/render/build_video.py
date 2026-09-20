#!/usr/bin/env python3
"""Assemble the 20.000 s vertical Noah short (1080x1920, 30 fps, H.264 + AAC).

Two modes, chosen automatically:
  full      - assets/character/s*.mp4 and assets/audio/s*.mp3 are present
  animatic  - screens only; same cuts and burned captions, no face, no voice

Layering per segment, bottom to top:
  1. the screen PNG from out/screens (opaque for the UI shots)
  2. the character clip, cropped to her head and torso, corner-rounded with
     out/screens/inset-mask.png, dropped into the inset from geometry.json
     (shot 1 is the exception: there she is the full-frame background and the
     screen PNG, which is transparent, sits on top of her)
  3. the caption PNG for that line

Usage:  python3 render/build_video.py [--animatic]
"""
import json, pathlib, shutil, subprocess, sys

ROOT   = pathlib.Path(__file__).resolve().parent.parent
SCREEN = ROOT / "out" / "screens"
CHAR   = ROOT / "assets" / "character"
AUDIO  = ROOT / "assets" / "audio"
WORK   = ROOT / "out" / "_work"
OUT    = ROOT / "out"
W, H, FPS = 1080, 1920, 30

# Where in the 9:16 character clip to take the inset crop from: a window as
# wide as the source, tall enough to match the inset ratio, starting this far
# down so it lands on her head and upper torso.
CROP_TOP_FRACTION = 0.10

# Shots with a second state, and how far through the segment it takes over.
STATE_SWITCH = {"s4": 0.55, "s5": 0.52}


def ffmpeg() -> str:
    import imageio_ffmpeg
    return imageio_ffmpeg.get_ffmpeg_exe()


def run(args: list[str]) -> None:
    p = subprocess.run([ffmpeg(), "-hide_banner", "-loglevel", "error", "-y", *args],
                       capture_output=True, text=True)
    if p.returncode:
        sys.exit(f"ffmpeg failed:\n{' '.join(args[:14])}...\n{p.stderr[-1800:]}")


def make_inset_mask(g: dict) -> pathlib.Path:
    """Greyscale rounded-rect used as the character inset's alpha channel."""
    from PIL import Image, ImageDraw
    p = SCREEN / "inset-mask.png"
    im = Image.new("L", (g["vid_w"], g["vid_h"]), 0)
    ImageDraw.Draw(im).rounded_rectangle([0, 0, g["vid_w"] - 1, g["vid_h"] - 1], radius=26, fill=255)
    im.save(p)
    return p


def screen_for(seg: dict, state: int) -> pathlib.Path:
    """Resolve a segment + state index to its rendered PNG."""
    base = seg["screen"]
    if seg["id"] in STATE_SWITCH:
        base = base.replace("-", ("a-" if state == 0 else "b-"), 1) \
            if "-" in base else base
        # screens are named shot4a-frame / shot4b-frame
        stem = seg["screen"].split("-")[0]
        base = f"{stem}{'a' if state == 0 else 'b'}-frame"
    else:
        base = f"{seg['screen'].split('-')[0]}-frame"
    return SCREEN / f"{base}.png"


def render_unit(seg: dict, state: int, start: float, dur: float, nframes: int,
                g: dict, mask: pathlib.Path, full: bool, idx: int) -> pathlib.Path:
    """Render one continuous piece of the timeline to an intermediate mp4."""
    frame   = screen_for(seg, state)
    caption = SCREEN / f"cap-{seg['id']}.png"
    clip    = CHAR / f"{seg['id']}.mp4"
    out     = WORK / f"u{idx:02d}.mp4"
    use_char = full and clip.exists()

    args, fc = [], []
    if use_char and seg["character"] == "full-frame":
        # She is the background; the transparent screen PNG goes over her.
        args += ["-ss", f"{start - seg['start']:.3f}", "-t", f"{dur:.3f}", "-i", str(clip)]
        args += ["-loop", "1", "-t", f"{dur:.3f}", "-i", str(frame)]
        args += ["-loop", "1", "-t", f"{dur:.3f}", "-i", str(caption)]
        fc.append(f"[0:v]scale={W}:{H}:force_original_aspect_ratio=increase,"
                  f"crop={W}:{H},fps={FPS},setsar=1[bg]")
        fc.append("[bg][1:v]overlay=0:0[v1]")
        fc.append("[v1][2:v]overlay=0:0,format=yuv420p[v]")
    elif use_char:
        args += ["-loop", "1", "-t", f"{dur:.3f}", "-i", str(frame)]
        args += ["-ss", f"{start - seg['start']:.3f}", "-t", f"{dur:.3f}", "-i", str(clip)]
        args += ["-i", str(mask)]
        args += ["-loop", "1", "-t", f"{dur:.3f}", "-i", str(caption)]
        fc.append(f"[0:v]fps={FPS},setsar=1[bg]")
        fc.append(f"[1:v]crop=iw:iw*{g['vid_h']}/{g['vid_w']}:0:iw*{CROP_TOP_FRACTION},"
                  f"scale={g['vid_w']}:{g['vid_h']},fps={FPS},format=rgba[cv]")
        fc.append("[2:v]format=gray[mk]")
        fc.append("[cv][mk]alphamerge[cr]")
        fc.append(f"[bg][cr]overlay={g['vid_x']}:{g['vid_y']}[v1]")
        fc.append("[v1][3:v]overlay=0:0,format=yuv420p[v]")
    else:
        # Animatic: screen + caption only.
        args += ["-loop", "1", "-t", f"{dur:.3f}", "-i", str(frame)]
        args += ["-loop", "1", "-t", f"{dur:.3f}", "-i", str(caption)]
        bg = "color=c=0xEEF1F7:s=%dx%d:d=%.3f" % (W, H, dur)
        args += ["-f", "lavfi", "-t", f"{dur:.3f}", "-i", bg]
        fc.append(f"[2:v]fps={FPS},setsar=1[base]")
        fc.append("[base][0:v]overlay=0:0[v1]")
        fc.append("[v1][1:v]overlay=0:0,format=yuv420p[v]")

    run([*args, "-filter_complex", ";".join(fc), "-map", "[v]",
         "-c:v", "libx264", "-preset", "medium", "-crf", "17",
         "-pix_fmt", "yuv420p", "-r", str(FPS), "-frames:v", str(nframes),
         "-an", str(out)])
    return out


def build_audio(tl: dict, full: bool) -> pathlib.Path | None:
    """Lay each voice line at its exact start; duck a music bed under it."""
    lines = [(s, AUDIO / f"{s['id']}.mp3") for s in tl["segments"]]
    if not full or not all(p.exists() for _, p in lines):
        return None
    music = next((AUDIO / n for n in ("music.mp3", "music.wav") if (AUDIO / n).exists()), None)

    args, fc, mixin = [], [], []
    for i, (seg, p) in enumerate(lines):
        args += ["-i", str(p)]
        tempo = tl["tempo_applied"]
        chain = f"[{i}:a]aresample=48000"
        if tempo > 1.0:
            chain += f",atempo={tempo:.4f}"
        chain += f",adelay={int(seg['voice_start'] * 1000)}|{int(seg['voice_start'] * 1000)}[a{i}]"
        fc.append(chain)
        mixin.append(f"[a{i}]")
    n = len(lines)
    fc.append("".join(mixin) + f"amix=inputs={n}:normalize=0:dropout_transition=0[vo]")

    if music:
        args += ["-i", str(music)]
        fc.append(f"[{n}:a]aresample=48000,volume=0.10,"
                  f"afade=t=in:st=0:d=0.6,afade=t=out:st=18.6:d=1.4[bed]")
        fc.append("[vo][bed]amix=inputs=2:normalize=0:dropout_transition=0[mixed]")
        last = "[mixed]"
    else:
        last = "[vo]"
    fc.append(f"{last}apad,atrim=0:20,asetpts=N/SR/TB,"
              f"alimiter=limit=0.94,aresample=48000[aout]")

    out = WORK / "audio.m4a"
    run([*args, "-filter_complex", ";".join(fc), "-map", "[aout]",
         "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-t", "20", str(out)])
    return out


def main() -> None:
    animatic = "--animatic" in sys.argv
    tl = json.loads((ROOT / "render" / "timeline.json").read_text())
    g  = json.loads((ROOT / "render" / "geometry.json").read_text())

    have_char  = all((CHAR / f"{s['id']}.mp4").exists() for s in tl["segments"])
    have_audio = all((AUDIO / f"{s['id']}.mp3").exists() for s in tl["segments"])
    full = (have_char or have_audio) and not animatic

    if WORK.exists():
        shutil.rmtree(WORK)
    WORK.mkdir(parents=True)
    mask = make_inset_mask(g)

    units, idx = [], 0
    for seg in tl["segments"]:
        if seg["id"] in STATE_SWITCH:
            n1 = max(1, min(seg["frames"] - 1, round(seg["frames"] * STATE_SWITCH[seg["id"]])))
            spans = [(0, seg["start"], n1),
                     (1, seg["start"] + n1 / FPS, seg["frames"] - n1)]
        else:
            spans = [(0, seg["start"], seg["frames"])]
        for state, start, nf in spans:
            units.append(render_unit(seg, state, start, nf / FPS, nf, g, mask,
                                     have_char and not animatic, idx))
            idx += 1

    lst = WORK / "units.txt"
    lst.write_text("".join(f"file '{u.name}'\n" for u in units))
    silent = WORK / "video.mp4"
    run(["-f", "concat", "-safe", "0", "-i", str(lst), "-c", "copy", str(silent)])

    audio = build_audio(tl, have_audio and not animatic)
    name  = "noah-mac-espacio-20s.mp4" if full else "noah-mac-espacio-20s-ANIMATIC.mp4"
    final = OUT / name
    if audio:
        run(["-i", str(silent), "-i", str(audio), "-map", "0:v", "-map", "1:a",
             "-c:v", "copy", "-c:a", "copy", "-t", "20", "-movflags", "+faststart", str(final)])
    else:
        run(["-i", str(silent), "-c:v", "copy", "-t", "20",
             "-movflags", "+faststart", str(final)])

    mode = "FULL" if full else "ANIMATIC (no character footage / voice-over)"
    print(f"built {final.relative_to(ROOT)}  [{mode}]  {final.stat().st_size/1e6:.2f} MB")


if __name__ == "__main__":
    main()
