#!/usr/bin/env python3
"""Where does the dialogue actually stop?

silencedetect is no use here: these takes carry continuous room tone and fan
hum, so digital silence never occurs and the detector reports "still live" at
the tail whether or not the line finished. Measure the loudness envelope
against the room-tone floor instead.

Prints: <dissolve_offset> <dissolve_duration> <speech_end> <clip_duration>
"""
import wave, array, subprocess, math, sys, statistics as st

src = sys.argv[1]
gap, max_d = 0.02, 0.30          # breath before the dissolve; longest we'll use

subprocess.run(["ffmpeg","-v","error","-y","-i",src,"-ac","1","-ar","16000","/tmp/_se.wav"],
               check=True)
w = wave.open("/tmp/_se.wav")
sr = w.getframerate()
a = array.array("h"); a.frombytes(w.readframes(w.getnframes())); w.close()

win = int(sr * 0.05)
db = []
for i in range(0, len(a) - win, win):
    s = a[i:i+win]
    r = math.sqrt(sum(v*v for v in s) / len(s))
    db.append(20*math.log10(r + 1e-9) - 20*math.log10(32768))

floor = st.median(sorted(db)[:max(3, len(db)//4)])   # quietest quartile = room tone
peak  = max(db)
thr   = floor + (peak - floor) * 0.35                # clearly speech, not tone
end   = (max(i for i, v in enumerate(db) if v > thr) + 1) * 0.05
dur   = len(a) / sr

off = round(end + gap, 3)
d   = round(min(max_d, dur - off - 0.01), 3)
if d <= 0:
    sys.exit(f"{src}: only {dur-end:.2f}s after the line - no room to dissolve")
print(f"{off} {d} {end:.2f} {dur:.2f}")
