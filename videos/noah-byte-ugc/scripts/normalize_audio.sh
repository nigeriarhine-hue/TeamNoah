#!/usr/bin/env bash
# Two-pass loudness normalisation of the master mix to -14 LUFS / -1 dBTP (social platform target).
set -euo pipefail
cd "$(dirname "$0")/.."
IN=public/audio/mix.wav
J=$(ffmpeg -hide_banner -i "$IN" -af loudnorm=I=-14:TP=-1.5:LRA=9:print_format=json -f null - 2>&1 | sed -n '/^{/,/^}/p')
g() { echo "$J" | grep "\"$1\"" | sed -E 's/.*: "([^"]+)".*/\1/'; }
ffmpeg -hide_banner -loglevel error -y -i "$IN" -af "loudnorm=I=-14:TP=-1.5:LRA=9:measured_I=$(g input_i):measured_TP=$(g input_tp):measured_LRA=$(g input_lra):measured_thresh=$(g input_thresh):offset=$(g target_offset):linear=true,aresample=48000" -c:a pcm_s16le public/audio/mix-norm.wav
mv public/audio/mix-norm.wav "$IN"
ffmpeg -hide_banner -i "$IN" -af ebur128=peak=true -f null - 2>&1 | grep -E "I:|Peak:" | tail -2
