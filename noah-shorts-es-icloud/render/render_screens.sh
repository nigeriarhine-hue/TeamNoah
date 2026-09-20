#!/usr/bin/env bash
# Render every ui/*.html screen to a pixel-exact 1080x1920 PNG with headless Chromium.
# Transparent screens (captions, shot 1 overlay) keep their alpha channel.
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CHROME="${CHROME:-/opt/pw-browsers/chromium}"
OUT="$ROOT/out/screens"
mkdir -p "$OUT"

shopt -s nullglob
for f in "$ROOT"/ui/*.html; do
  name="$(basename "$f" .html)"
  "$CHROME" \
    --headless=new --no-sandbox --disable-gpu --hide-scrollbars \
    --force-device-scale-factor=1 --window-size=1080,1920 \
    --default-background-color=00000000 \
    --virtual-time-budget=4000 \
    --screenshot="$OUT/$name.png" "file://$f" >/dev/null 2>&1
  printf '  %-16s -> %s\n' "$name" "$(stat -c%s "$OUT/$name.png" 2>/dev/null || echo FAIL)"
done
echo "screens rendered to $OUT"
