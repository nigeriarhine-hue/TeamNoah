#!/usr/bin/env bash
# Pull the generated UGC assets and render both finals.
# Requires egress to d8j0ntlcm91z4.cloudfront.net (see GET-UGC-CLIPS.md).
set -euo pipefail

B=https://d8j0ntlcm91z4.cloudfront.net/user_3JA3Cf9f9t4L7C7zPSqBOLYIbCb
D=public/ugc/mac-list
mkdir -p "$D" out

# Asset ids are overridable so a re-shot character drops straight in:
#   INTRO=... REF=... CLIP_A=... CLIP_B=... bash scripts/finish.sh
INTRO="${INTRO:-hf_20260919_220915_b829bd81-ad99-4f16-94d4-b5b3968c31ea.mp4}"
REF="${REF:-hf_20260919_184301_8039bdff-0c5a-4340-93c7-a1ad74a275a5.png}"
CLIP_A="${CLIP_A:-hf_20260919_212023_99a9d7c3-dd37-4e78-bcac-4d6ea977a3e9.mp4}"
CLIP_B="${CLIP_B:-hf_20260919_212430_65828cac-cb24-46ab-9afb-ade24569860f.mp4}"

echo "==> fetching assets"
curl -fsS -o "$D/video3-intro.mp4"     "$B/$INTRO"
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
