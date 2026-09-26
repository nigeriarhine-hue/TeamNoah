#!/usr/bin/env bash
# Assembles NOAH_HALLOWEEN_YOUTUBE_1920x1080.mp4 (1920x1080, 30 fps, ~51 s).
# Needs: ffmpeg, node + playwright (chromium), python3 + numpy.
# Run from a work dir that holds v0..v4.mp4 (witch shots) and a1..a6.wav (dialogue); $SRC points at this folder.
set -euo pipefail
SRC=${SRC:-$(cd "$(dirname "$0")" && pwd)}
W=$(pwd)
FPS=30
enc="-c:v libx264 -preset medium -crf 16 -pix_fmt yuv420p -r $FPS"

# 1. UI inserts, end card and caption plates from stage.html
node "$SRC/render.mjs" "$W/frames"

# 2. witch shots: conform 1912x1080@24 -> 1920x1080@30, trim to edit length, light cinematic grade
declare -A VLEN=( [v0]=5.0 [v1]=4.6 [v2]=4.0 [v3]=4.2 [v4]=3.9 )
declare -A VIN=( [v0]=0 [v1]=0.3 [v2]=0.5 [v3]=0.4 [v4]=0.6 )
for v in v0 v1 v2 v3 v4; do
  ffmpeg -v error -y -ss ${VIN[$v]} -i $v.mp4 -t ${VLEN[$v]} -an \
    -vf "scale=1920:-2:flags=lanczos,crop=1920:1080,fps=$FPS,eq=contrast=1.04:saturation=1.06,vignette=PI/5,setsar=1" $enc seg_$v.mp4
done

# 3. UI / splash segments from frames
for s in ui1 ui2 ui3 ui4 splash; do
  ffmpeg -v error -y -framerate $FPS -i frames/$s/f%04d.jpg -vf setsar=1 $enc seg_$s.mp4
done

# 4. edit order
printf "file 'seg_%s.mp4'\n" v0 v1 ui1 ui2 v2 ui3 v3 ui4 v4 splash > edit.txt
ffmpeg -v error -y -f concat -safe 0 -i edit.txt -c copy base.mp4

# 5. captions: fade each plate in/out over its window
inputs=(-i base.mp4); chain=""; last="0:v"; n=1
while IFS=$'\t' read -r id st en; do
  d=$(python3 -c "print(round($en-$st+0.4,3))")
  inputs+=(-loop 1 -t "$d" -i "frames/captions/$id.png")
  chain+="[$n:v]format=rgba,fade=in:st=0:d=0.18:alpha=1,fade=out:st=$(python3 -c "print(round($en-$st-0.18,3))"):d=0.18:alpha=1,setpts=PTS+$st/TB[c$n];"
  chain+="[$last][c$n]overlay=0:0:enable='between(t,$st,$en)':eof_action=pass[o$n];"
  last="o$n"; n=$((n+1))
done < <(python3 -c "import json;[print(c['id'],c['start'],c['end'],sep='\t') for c in json.load(open('$SRC/captions.json'))]")
chain+="[$last]fade=in:st=0:d=0.5,setsar=1[vout]"

# 6. soundtrack
python3 "$SRC/audio.py" "$W"

ffmpeg -v error -y "${inputs[@]}" -i mix.wav -filter_complex "$chain" -map "[vout]" -map $n:a \
  $enc -profile:v high -level 4.2 -movflags +faststart -c:a aac -b:a 256k -ar 48000 -t 51 \
  NOAH_HALLOWEEN_YOUTUBE_1920x1080.mp4
ffprobe -v error -show_entries format=duration:stream=codec_name,width,height,r_frame_rate -of compact NOAH_HALLOWEEN_YOUTUBE_1920x1080.mp4
