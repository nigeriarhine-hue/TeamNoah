#!/usr/bin/env bash
# Generate the eight narration clips with Piper.
#
#   ./scripts/make-vo.sh /path/to/en_US-ryan-high.onnx
#
# Writes public/audio/vo-1.wav … vo-8.wav, each starting on the first syllable —
# Remotion places them at VO_MARKS in src/Video.tsx, so a padded head would push
# that line late.
#
# Voices: huggingface.co/rhasspy/piper-voices (en/en_US/...). You need both the
# .onnx and its .onnx.json sidecar, next to each other.
#
# length-scale 1.12 slows the read ~12%. The brand voice is "calm, plain,
# specific, unhurried"; Piper's default clips along faster than that.
set -euo pipefail

MODEL="${1:?usage: make-vo.sh /path/to/voice.onnx}"
[ -f "$MODEL" ]      || { echo "no such model: $MODEL" >&2; exit 1; }
[ -f "$MODEL.json" ] || { echo "missing sidecar: $MODEL.json" >&2; exit 1; }
command -v piper >/dev/null || { echo "piper not installed: pip install piper-tts" >&2; exit 1; }

OUT="$(cd "$(dirname "$0")/.." && pwd)/public/audio"
mkdir -p "$OUT"

LINES=(
  "Someone told Noah their Google was slow."
  "Cleaning is the reflex. It rarely finds the cause."
  "So Noah measured instead of guessing. It timed the load in stages. One stage swallowed a second."
  "Then Noah stops. It says what it will do, and what it will touch. And waits."
  "You approve. Every command runs where you can read it."
  "Then the same test again. Not a new one. The same one that found the problem."
  "This is the part that usually goes unsaid. The stall is gone. The weak signal is not."
  "Find the real cause. Show the work."
)

# The marks each line must land on, for the over-run warning below.
BUDGET=(4.0 5.7 9.4 8.9 6.1 9.3 8.5 4.6)

for i in "${!LINES[@]}"; do
  n=$((i + 1))
  printf '%s' "${LINES[$i]}" | piper -m "$MODEL" -f "$OUT/vo-$n.wav" \
    --length-scale 1.12 --sentence-silence 0.35 2>/dev/null
  dur=$(python3 -c "import wave,sys; w=wave.open(sys.argv[1]); print(f'{w.getnframes()/w.getframerate():.2f}')" "$OUT/vo-$n.wav")
  over=$(python3 -c "print('  OVER BUDGET' if float('$dur') > ${BUDGET[$i]} else '')")
  printf 'vo-%d.wav  %5ss  (budget %ss)%s\n' "$n" "$dur" "${BUDGET[$i]}" "$over"
done

echo
echo "Now set AUDIO.voiceoverLines = true in src/Video.tsx and re-render."
echo "Any line marked OVER BUDGET will collide with the next one — either"
echo "shorten the line in VOICEOVER.md or lengthen that scene in SCENES."
