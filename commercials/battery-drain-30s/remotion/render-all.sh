#!/usr/bin/env bash
# Render every Noah interface screen at its exact clip length, plus the timing animatic.
#
# ProRes 4444 rather than 422 because several screens want an alpha channel for the
# glow passes described in 05-noah-ui-screens.md.
#
# Frame counts come from src/timeline.ts, which asserts the total is 816. A screen
# therefore drops onto the edit timeline with no retiming.
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p out

SCREENS=(UI-01 UI-02 UI-03 UI-04 UI-05 UI-06 UI-07 UI-08 UI-09 UI-10 UI-11)

for s in "${SCREENS[@]}"; do
  echo "── $s ──"
  npx remotion render "$s" "out/${s,,}.mov" --codec=prores --prores-profile=4444
done

echo "── Animatic (816f · 34.000s) ──"
npx remotion render Animatic out/animatic.mp4 --codec=h264 --crf=18

echo
echo "Done. Deliverables in out/:"
ls -la out/
