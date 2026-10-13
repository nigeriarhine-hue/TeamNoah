#!/usr/bin/env bash
# Two-pass EBU R128 loudness master for short-form platforms (-14 LUFS, -1.5 dBTP).
# The video stream is copied untouched.
# usage: scripts/master_audio.sh <in.mp4> <out.mp4>
set -euo pipefail
in="$1"
out="$2"
stats=$(ffmpeg -hide_banner -i "$in" -af loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json -f null - 2>&1 | sed -n '/^{/,/^}/p')
get() { echo "$stats" | python3 -c "import json,sys; print(json.load(sys.stdin)['$1'])"; }
ffmpeg -hide_banner -v error -y -i "$in" -c:v copy \
  -af "loudnorm=I=-14:TP=-1.5:LRA=11:measured_I=$(get input_i):measured_TP=$(get input_tp):measured_LRA=$(get input_lra):measured_thresh=$(get input_thresh):offset=$(get target_offset):linear=true" \
  -ar 48000 -c:a aac -b:a 320k -movflags +faststart "$out"
echo "mastered -> $out"
