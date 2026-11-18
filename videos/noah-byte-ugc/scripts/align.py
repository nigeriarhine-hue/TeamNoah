"""Word-level timestamps for each generated line (used for captions + verification)."""
import json, sys
import soundfile as sf, numpy as np
from scipy.signal import resample_poly
from faster_whisper import WhisperModel
D = sys.argv[1]
m = WhisperModel("base.en", device="cpu", compute_type="int8")
meta = json.load(open(f"{D}/lines.json"))
for L in meta:
    a, sr = sf.read(f"{D}/line{L['line']}.wav", dtype="float32")
    a = resample_poly(a, 16000, sr).astype(np.float32)
    segs, _ = m.transcribe(a, word_timestamps=True, beam_size=5)
    words = [{"w": w.word.strip(), "s": round(w.start, 3), "e": round(w.end, 3)} for s in segs for w in s.words]
    L["words"] = words
    print(L["line"], " ".join(w["w"] for w in words))
json.dump(meta, open(f"{D}/lines.json", "w"), indent=1)
