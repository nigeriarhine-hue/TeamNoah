#!/usr/bin/env bash
# Assembles the finished spot. Runs in the Higgsfield sandbox (sandbox_exec),
# which has ffmpeg and unrestricted egress — this repo's own session cannot
# reach the Higgsfield media CDN, so the cut is built where the takes live.
set -euo pipefail

CDN="https://d8j0ntlcm91z4.cloudfront.net/user_3JA3Cf9f9t4L7C7zPSqBOLYIbCb"
RAW="https://raw.githubusercontent.com/nigeriarhine-hue/TeamNoah/claude/laughing-bohr-80al6h/ad-imac-sequoia/screens"

curl -sS -o t1.mp4 "$CDN/hf_20260919_182220_a0384fe3-9831-4c5e-91df-95190c0fdcd1.mp4"
curl -sS -o t2.mp4 "$CDN/hf_20260919_182254_c0768d7d-21ac-4b65-b056-0ff67fb70f72.mp4"
curl -sS -o t3.mp4 "$CDN/hf_20260919_182220_086bd0b2-6d71-4197-a541-c69ac05933f6.mp4"
curl -sS -o t4.mp4 "$CDN/hf_20260919_182255_a4bd00a5-cde2-47df-b12b-79db01669715.mp4"
curl -sS -o t5.mp4 "$CDN/hf_20260919_182254_508ccc4a-f9f6-4d8f-bf75-87c5dfdc0bd0.mp4"
curl -sS -o t6.mp4 "$CDN/hf_20260919_182220_980cf81e-8d34-4a0f-b455-0e61cad294ef.mp4"
for f in 01-looking-into-it 02-the-plan 03-can-noah-do-this 04-done 05-endcard; do
  curl -sSL -o "s${f%%-*}.png" "$RAW/$f.png"
done

VF="scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:color=black,fps=30,setsar=1,format=yuv420p"
ENC="-c:v libx264 -crf 18 -preset veryfast -pix_fmt yuv420p -c:a aac -b:a 192k -ar 48000 -ac 2"
P="scale=-2:1010,setsar=1"          # app window at ~95% height, centred

for n in 1 2 3; do ffmpeg -v error -y -i t$n.mp4 -vf "$VF" $ENC -r 30 seg$n.mp4; done

# NOTE: shortest=1 is load-bearing. The insert rides on a synthetic `color`
# plate that outlives the take; without it, overlay runs to the LONGEST input
# and pads the segment with a frozen frame and silence.
ffmpeg -v error -y -i t4.mp4 -i s01.png -filter_complex \
"[0:v]$VF[v];[1:v]$P[sc];color=c=0x0b0b10:s=1920x1080:r=30:d=12[bg];\
[bg][sc]overlay=(W-w)/2:(H-h)/2[p];[v][p]overlay=0:0:enable='gte(t,1.5)':shortest=1[vo]" \
-map "[vo]" -map 0:a $ENC -r 30 seg4.mp4

ffmpeg -v error -y -i t5.mp4 -i s02.png -i s03.png -filter_complex \
"[0:v]$VF[v];[1:v]$P[a];[2:v]$P[b];\
color=c=0x0b0b10:s=1920x1080:r=30:d=12[g1];color=c=0x0b0b10:s=1920x1080:r=30:d=12[g2];\
[g1][a]overlay=(W-w)/2:(H-h)/2[p1];[g2][b]overlay=(W-w)/2:(H-h)/2[p2];\
[v][p1]overlay=0:0:enable='lt(t,4.5)':shortest=1[v1];\
[v1][p2]overlay=0:0:enable='gte(t,4.5)':shortest=1[vo]" \
-map "[vo]" -map 0:a $ENC -r 30 seg5.mp4

ffmpeg -v error -y -i t6.mp4 -i s04.png -filter_complex \
"[0:v]$VF[v];[1:v]$P[sc];color=c=0x0b0b10:s=1920x1080:r=30:d=12[bg];\
[bg][sc]overlay=(W-w)/2:(H-h)/2[p];[v][p]overlay=0:0:enable='lt(t,1.5)':shortest=1[vo]" \
-map "[vo]" -map 0:a $ENC -r 30 seg6.mp4

ffmpeg -v error -y -loop 1 -t 4 -i s05.png -f lavfi -t 4 \
 -i anullsrc=channel_layout=stereo:sample_rate=48000 \
 -vf "scale=1920:1080,setsar=1,fps=30,format=yuv420p" $ENC -r 30 seg7.mp4

for n in 1 2 3 4 5 6 7; do echo "file 'seg$n.mp4'"; done > list.txt
ffmpeg -v error -y -f concat -safe 0 -i list.txt -c copy noah-its-just-slower-v1.mp4
ffprobe -v error -show_entries format=duration -of csv=p=0 noah-its-just-slower-v1.mp4
