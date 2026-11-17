#!/usr/bin/env bash
# Usage: tools/lipsync.sh <vo dir> "<exact dialog text>"
# Runs Rhubarb on <vo dir>/vo.wav and writes <vo dir>/rhubarb.json (mouth cues A–H, X).
set -euo pipefail
cd "$(dirname "$0")/.."
DIR="$1"; TEXT="$2"
[ -x .tools/rhubarb/rhubarb ] || tools/get_rhubarb.sh
printf '%s\n' "$TEXT" > "$DIR/dialog.txt"
.tools/rhubarb/rhubarb -q -f json --dialogFile "$DIR/dialog.txt" -o "$DIR/rhubarb.json" "$DIR/vo.wav"
echo "wrote $DIR/rhubarb.json"
