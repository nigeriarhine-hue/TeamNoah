#!/usr/bin/env python3
"""Synthesise the narration with espeak-ng — a SCRATCH track, not a shipping voice.

espeak-ng is a formant synthesiser. It is intelligible and precisely timed, and it
sounds like a machine. That makes it useful for exactly one thing: hearing whether
the script lands against the picture before anyone books a read. Do not ship it.

It is here because it is the only engine that runs in a sandbox with no network
access to model hosts: the library and its data ship inside the espeakng-loader
wheel, so nothing is downloaded at synthesis time.

Outputs:
    public/audio/vo-1.wav … vo-8.wav      per-line stems  → AUDIO.voiceoverLines
    renders/noah-voiceover-scratch.mp3    one 57s track   → AUDIO.voiceover

Both layouts are generated from the same marks, so they cannot drift apart.
"""
import ctypes
import pathlib
import subprocess
import sys
import wave

import espeakng_loader

HERE = pathlib.Path(__file__).resolve().parent.parent
TOTAL = 57.045333  # matches the render exactly

# (mark in seconds, budget before it collides with the next line, text)
LINES = [
    (0.5,  4.0, "Someone told Noah their Google was slow."),
    (4.5,  5.7, "Cleaning is the reflex. It rarely finds the cause."),
    (10.2, 9.4, "So Noah measured instead of guessing. It timed the load in stages. "
                "One stage swallowed a second."),
    (19.6, 8.9, "Then Noah stops. It says what it will do, and what it will touch. And waits."),
    (28.5, 6.1, "You approve. Every command runs where you can read it."),
    (34.6, 9.3, "Then the same test again. Not a new one. The same one that found the problem."),
    (43.9, 8.5, "This is the part that usually goes unsaid. The stall is gone. "
                "The weak signal is not."),
    (52.4, 4.6, "Find the real cause. Show the work."),
]

RATE_WPM = 145   # espeak default is 175; the brand voice is unhurried
PITCH = 45       # default 50; a touch lower reads calmer


def synth(lib, rate, text):
    """One line to a list of 16-bit samples."""
    buf = []
    proto = ctypes.CFUNCTYPE(ctypes.c_int, ctypes.POINTER(ctypes.c_short),
                             ctypes.c_int, ctypes.c_void_p)

    def cb(wav, n, events):
        if wav and n > 0:
            buf.extend(wav[i] for i in range(n))
        return 0

    keep = proto(cb)          # hold the reference; a collected callback crashes espeak
    lib.espeak_SetSynthCallback(keep)
    lib.espeak_Synth(text.encode(), len(text) + 1, 0, 0, 0, 0x1, None, None)
    lib.espeak_Synchronize()
    return buf


def write_wav(path, rate, samples):
    path.parent.mkdir(parents=True, exist_ok=True)
    with wave.open(str(path), "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(rate)
        w.writeframes(b"".join(int(s).to_bytes(2, "little", signed=True) for s in samples))


def main():
    lib = ctypes.CDLL(espeakng_loader.get_library_path())
    rate = lib.espeak_Initialize(1, 0, str(espeakng_loader.get_data_path()).encode(), 0)
    if rate < 0:
        sys.exit("espeak_Initialize failed")
    lib.espeak_SetVoiceByName(b"gmw/en-US")
    lib.espeak_SetParameter(1, RATE_WPM, 0)
    lib.espeak_SetParameter(3, PITCH, 0)

    timeline = [0] * int(TOTAL * rate)
    over = []

    for i, (at, budget, text) in enumerate(LINES, 1):
        samples = synth(lib, rate, text)
        dur = len(samples) / rate
        write_wav(HERE / "public" / "audio" / f"vo-{i}.wav", rate, samples)

        start = int(at * rate)
        end = min(start + len(samples), len(timeline))
        timeline[start:end] = samples[:end - start]

        flag = ""
        if dur > budget:
            flag = "  OVER by %.2fs" % (dur - budget)
            over.append(i)
        print(f"vo-{i}.wav  {dur:5.2f}s at {at:5.1f}s  (budget {budget:.1f}s){flag}")

    scratch_wav = HERE / "renders" / "noah-voiceover-scratch.wav"
    write_wav(scratch_wav, rate, timeline)

    import imageio_ffmpeg
    mp3 = scratch_wav.with_suffix(".mp3")
    subprocess.run([imageio_ffmpeg.get_ffmpeg_exe(), "-y", "-loglevel", "error",
                    "-i", str(scratch_wav), "-codec:a", "libmp3lame",
                    "-b:a", "128k", str(mp3)], check=True)
    scratch_wav.unlink()

    print(f"\n{mp3.relative_to(HERE)}  {mp3.stat().st_size/1024:.0f} KB  {TOTAL:.1f}s")
    if over:
        print(f"\nlines {over} run past their budget and will collide with the next line —"
              f"\nshorten them in VOICEOVER.md or lengthen those scenes in SCENES.")
    else:
        print("\nevery line fits its budget.")


if __name__ == "__main__":
    main()
