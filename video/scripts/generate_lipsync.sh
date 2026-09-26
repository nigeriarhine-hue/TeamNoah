#!/usr/bin/env bash
# Lip-sync mouth patches for the on-camera lines (vo01, vo02, vo11, vo13), made
# locally with Wav2Lip (https://github.com/Rudrabha/Wav2Lip, wav2lip_gan.pth).
# Needs: python with torch (CPU is fine), opencv, librosa 0.10, pillow, ffmpeg on PATH.
# Wav2Lip patches for current libs: audio.py -> librosa.filters.mel(sr=..., n_fft=...),
# inference.py -> torch.load(..., weights_only=False).
set -euo pipefail
W2L=${W2L:-./Wav2Lip}
ROOT=$(cd "$(dirname "$0")/.." && pwd)
TMP=$(mktemp -d)
for k in vo01 vo02 vo11 vo13; do
  # 0.3 s silence before/after the line (timeline.ts LIPSYNC offsets assume this)
  python - "$ROOT/public/audio/vo/$k.wav" "$TMP/$k.wav" <<'PY'
import sys, numpy as np, soundfile as sf
s, sr = sf.read(sys.argv[1]); s = s.mean(1) if s.ndim > 1 else s
pad = np.zeros(int(0.3 * sr)); sf.write(sys.argv[2], np.concatenate([pad, s, pad]), sr)
PY
  (cd "$W2L" && python inference.py --checkpoint_path checkpoints/wav2lip_gan.pth \
    --face "$ROOT/public/img/gamer.png" --audio "$TMP/$k.wav" --outfile "$TMP/$k.mp4" \
    --box 200 480 745 1040 --static True --fps 30)
  mkdir -p "$TMP/fr_$k"
  ffmpeg -loglevel error -y -i "$TMP/$k.mp4" -vf "crop=260:160:780:330" "$TMP/fr_$k/%04d.png"
  python -c "
import glob; from PIL import Image, ImageFilter
[Image.open(f).filter(ImageFilter.UnsharpMask(2, 90, 2)).save(f) for f in glob.glob('$TMP/fr_$k/*.png')]"
  ffmpeg -loglevel error -y -framerate 30 -i "$TMP/fr_$k/%04d.png" -c:v libx264 -crf 14 -pix_fmt yuv420p "$ROOT/public/lipsync/$k.mp4"
  echo "$k: $(ls "$TMP/fr_$k" | wc -l) frames (update LIPSYNC in src/timeline.ts if this changes)"
done
