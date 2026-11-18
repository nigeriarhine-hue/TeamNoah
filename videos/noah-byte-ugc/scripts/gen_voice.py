"""Generate Byte's dialogue with Kokoro (local neural TTS), one consistent voice for all lines."""
import sys, json, numpy as np, soundfile as sf
from kokoro_onnx import Kokoro
OUT = sys.argv[1]; VOICE = sys.argv[2] if len(sys.argv) > 2 else "am_puck"; SPEED = float(sys.argv[3]) if len(sys.argv) > 3 else 1.1
k = Kokoro("/home/user/tts-models/kokoro-v1.0.onnx", "/home/user/tts-models/voices-v1.0.bin")
LINES = [
  "Okay... why does my computer act like it has a mind of its own?",
  "Slow startup, random background apps... and I have no idea what's causing it.",
  "So I found Noah. It checks what's happening, and actually explains what it finds.",
  "And before it makes changes, it shows me what it recommends, and asks for my approval.",
  "Honestly? I'd rather know what's wrong than just guess. Check out Noah. It's at on noah dot app.",
]
meta = []
for i, t in enumerate(LINES, 1):
    s, sr = k.create(t, voice=VOICE, speed=SPEED, lang="en-us")
    # trim leading/trailing silence
    a = np.abs(s); thr = 0.01 * a.max(); idx = np.where(a > thr)[0]
    s = s[max(0, idx[0] - int(0.02 * sr)): idx[-1] + int(0.06 * sr)]
    sf.write(f"{OUT}/line{i}.wav", s, sr)
    meta.append({"line": i, "text": t, "dur": len(s) / sr, "sr": sr})
    print(i, round(len(s) / sr, 2), t)
json.dump(meta, open(f"{OUT}/lines.json", "w"), indent=1)
print("total", round(sum(m["dur"] for m in meta), 2))
