#!/usr/bin/env bash
# Assembles final/NOAH_HALLOWEEN_YOUTUBE_1920x1080.mp4 from the project sources.
# Run from an empty work dir: SRC=/path/to/halloween-noah-ad bash $SRC/build/build.sh
set -euo pipefail
SRC=${SRC:-$(cd "$(dirname "$0")/.." && pwd)}
W=$(pwd); FPS=30
enc="-c:v libx264 -preset medium -crf 15 -pix_fmt yuv420p -r $FPS"
J() { python3 -c "import json,sys;d=json.load(open('$SRC/$1'));print($2)"; }

# 1. sources (Higgsfield renders, narration, supplied beat)
mkdir -p src
for k in $(python3 -c "import json;print(' '.join(json.load(open('$SRC/build/sources.json'))['clips']))"); do [ -s src/$k.mp4 ] || curl -sSfo src/$k.mp4 "$(J build/sources.json "d['clips']['$k']")" & done; wait
MODE=$(J timeline.json "d.get('audio','vo')")
if [ "$MODE" = mix ]; then
  [ -s src/mix.mp3 ] || curl -sSfo src/mix.mp3 "$(J build/sources.json "d['vocal_mix']")"
else
  [ -s src/vo.mp3 ] || curl -sSfo src/vo.mp3 "$(J build/sources.json "d['voiceover']")"
  [ -s src/beat.mp3 ] || curl -sSfo src/beat.mp3 "$(J build/sources.json "d['beat']")"
fi

# 2. HTML-rendered frames: Noah UI, problem screens, diagnostics, splash, overlays, captions
node "$SRC/ui/render.mjs" "$W/r"

# 3. per-segment video, exact frame counts
mkdir -p seg; : > edit.txt
python3 - "$SRC/timeline.json" > segs.tsv <<'PY'
import json,sys
t=json.load(open(sys.argv[1]))
for s in t['segments']:
    r=lambda x:int(x*t['fps']+0.5)  # same rounding as Math.round in render.mjs
    n=r(s['end'])-r(s['start'])
    print('\t'.join(map(str,[s['id'],s['type'],n,s.get('clip',''),s.get('in',0),s.get('push_in',0),s.get('speed',1)])))
PY
grade="eq=contrast=1.04:saturation=1.05,vignette=PI/5"
while IFS=$'\t' read -r -u 3 id type n clip tin push speed; do
  case $type in
    html) ffmpeg -v error -y -framerate $FPS -i r/frames/$id/f%04d.jpg -frames:v $n -vf setsar=1 $enc seg/$id.mp4 ;;
    clip) ffmpeg -v error -y -ss $tin -i src/$clip.mp4 -frames:v $n -an -vf "setpts=PTS/$speed,scale=1920:1080:flags=lanczos,fps=$FPS,$grade,tpad=stop_mode=clone:stop_duration=2,setsar=1" $enc seg/$id.mp4 ;;
    comp) python3 "$SRC/build/composite.py" src/$clip.mp4 $tin $n r/frames/${id}_screen seg/${id}_raw.mp4 $push
          ffmpeg -v error -y -i seg/${id}_raw.mp4 -frames:v $n -vf "$grade,setsar=1" $enc seg/$id.mp4 ;;
  esac
  echo "file 'seg/$id.mp4'" >> edit.txt
done 3< segs.tsv
ffmpeg -v error -y -f concat -safe 0 -i edit.txt -c copy base.mp4

# 4. typography overlays + captions, then fade in from black
inputs=(-i base.mp4); chain=""; last="0:v"; n=1
while IFS=$'\t' read -r dir st en; do
  inputs+=(-framerate $FPS -i "$dir/f%04d.png")
  chain+="[$n:v]format=rgba,setpts=PTS+$st/TB[o$n];[$last][o$n]overlay=0:0:eof_action=pass[v$n];"; last="v$n"; n=$((n+1))
done < <(python3 -c "
import json;t=json.load(open('$SRC/timeline.json'))
for s in t['segments']:
  for name,t0 in s.get('overlays',[]): print(f\"r/frames/{s['id']}_ov_{name}\t{s['start']}\t{s['end']}\")")
while IFS=$'\t' read -r id st en; do
  d=$(python3 -c "print(round($en-$st,3))")
  inputs+=(-loop 1 -t "$d" -i "r/frames/captions/$id.png")
  chain+="[$n:v]format=rgba,fade=in:st=0:d=0.12:alpha=1,fade=out:st=$(python3 -c "print(max(0,round($en-$st-0.12,3)))"):d=0.12:alpha=1,setpts=PTS+$st/TB[o$n];[$last][o$n]overlay=0:0:eof_action=pass[v$n];"
  last="v$n"; n=$((n+1))
done < <(python3 -c "import json;[print(c['id'],c['start'],c['end'],sep='\t') for c in json.load(open('$SRC/captions/captions.json'))]")
chain+="[$last]fade=in:st=0:d=0.35,setsar=1[vout]"

# 5. soundtrack (beat + narration + sound design), mux
if [ "$MODE" = mix ]; then
  python3 "$SRC/build/audio.py" src/mix.mp3 - "$SRC/timeline.json" mix.wav sfx
else
  ffmpeg -v error -y -i src/vo.mp3 -ac 1 -ar 48000 vo.wav
  python3 "$SRC/build/audio.py" src/beat.mp3 vo.wav "$SRC/timeline.json" mix.wav sfx
fi
DUR=$(python3 -c "import json;print(json.load(open('$SRC/timeline.json'))['duration'])")
ffmpeg -v error -y "${inputs[@]}" -i mix.wav -filter_complex "$chain" -map "[vout]" -map $n:a \
  $enc -profile:v high -level 4.2 -movflags +faststart -c:a aac -b:a 256k -ar 48000 -t $DUR NOAH_HALLOWEEN_YOUTUBE_1920x1080.mp4
ffprobe -v error -show_entries format=duration:stream=codec_name,width,height,r_frame_rate,sample_aspect_ratio -of compact NOAH_HALLOWEEN_YOUTUBE_1920x1080.mp4
