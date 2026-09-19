#!/usr/bin/env bash
# Pull the generated UGC assets and render both finals.
# Requires egress to d8j0ntlcm91z4.cloudfront.net (see GET-UGC-CLIPS.md).
set -euo pipefail

B=https://d8j0ntlcm91z4.cloudfront.net/user_3JA3Cf9f9t4L7C7zPSqBOLYIbCb
D=public/ugc/mac-list
mkdir -p "$D" out

# Asset ids are overridable so a re-shot character drops straight in:
#   REF=... CLIP_A=... CLIP_B=... bash scripts/finish.sh
REF="${REF:-hf_20260918_022104_9b866a6b-deaf-469f-9469-6057da1e7a72.png}"
CLIP_A="${CLIP_A:-hf_20260918_022852_c55c12c3-c38f-4572-8b0c-4c5237e70c41.mp4}"
CLIP_B="${CLIP_B:-hf_20260918_022852_a1dab046-a66c-44d7-a120-37029f531782.mp4}"

echo "==> fetching assets"
curl -fsS -o "$D/video3-reference.png" "$B/$REF"
curl -fsS -o "$D/video3-list-a.mp4"    "$B/$CLIP_A"
curl -fsS -o "$D/video3-list-b.mp4"    "$B/$CLIP_B"

echo "==> asset flags"
node scripts/check-assets.mjs

[ -d node_modules ] || npm install --no-audit --no-fund

echo "==> rendering"
npx remotion still  src/index.ts Thumbnail out/noah-things-i-wont-do-thumbnail.png
npx remotion render src/index.ts MacList   out/noah-things-i-wont-do.mp4

echo "==> done"
ls -la out/
