#!/usr/bin/env bash
#
# Pulls this ad's Higgsfield generations into public/ and re-renders.
#
# These hosts are denied by some Claude Code environment network policies. If
# curl fails with a 403 or a "CONNECT tunnel failed" error, raise the
# environment's Network access level (or allow the Higgsfield result CDN) and
# run this again. Downloading the three files by hand into the same paths works
# just as well.
#
set -euo pipefail
cd "$(dirname "$0")/.."

BASE=https://d8j0ntlcm91z4.cloudfront.net/user_3JA3Cf9f9t4L7C7zPSqBOLYIbCb

# Voiceover take. Dylan (13.46s) is the one the edit is cut to; Evan (12.85s)
# is the alternate. Cody's take runs 17.78s and does not fit 15 seconds.
VO=hf_20260926_001305_ee616d7b-410c-43f8-b6f6-d2b4cf0f3c7d.wav
# VO=hf_20260926_001305_907fdfee-d101-4c22-b8a7-fa3bc70639f4.wav   # Evan

CLIP1=hf_20260926_164033_b644c9c5-01b6-44e8-93a5-5374a54b1fb3.mp4
CLIP2=hf_20260926_164124_891df52e-230c-424b-ac60-c4906e819ed6.mp4

mkdir -p public/ugc/ai-tech-support public/audio
get () { echo "  -> $2"; curl -fsS -L -o "$2" "$BASE/$1"; }

echo "UGC clips"
get "$CLIP1" public/ugc/ai-tech-support/clip-01-gaming-problem.mp4
get "$CLIP2" public/ugc/ai-tech-support/clip-02-waiting.mp4

echo "Voiceover"
get "$VO" public/audio/ai-tech-support-young-american-male.wav

echo "Re-rendering"
node tools/make-assets-manifest.mjs
npx remotion render NoahAiTechSupport out/noah-ai-tech-support.mp4
echo "Done — out/noah-ai-tech-support.mp4"
