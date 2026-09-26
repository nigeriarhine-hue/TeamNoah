#!/usr/bin/env bash
# Builds NOAH_HALLOWEEN_SHORT_15SEC_1080x1920.mp4 from the finished ad's sources.
# Run in an empty work dir: SRC=/path/to/halloween-noah-ad bash $SRC/short/build_short.sh
set -euo pipefail
SRC=${SRC:-$(cd "$(dirname "$0")/.." && pwd)}
SH=$SRC/short; FPS=30
enc="-c:v libx264 -preset medium -crf 16 -pix_fmt yuv420p -r $FPS"
J() { python3 -c "import json;d=json.load(open('$1'));print($2)"; }

mkdir -p src seg
for k in w2 w6 k3 k8; do [ -s src/$k.mp4 ] || curl -sSfo src/$k.mp4 "$(J $SRC/build/sources.json "d['clips']['$k']")"; done
[ -s src/mix.mp3 ] || curl -sSfo src/mix.mp3 "$(J $SRC/build/sources.json "d['vocal_mix']")"

node "$SH/render_short.mjs" "$(pwd)/r"

grade="eq=contrast=1.04:saturation=1.05"
python3 - "$SH/short.json" > segs.tsv <<'PY'
import json,sys
t=json.load(open(sys.argv[1])); R=lambda x:int(x*t['fps']+0.5)
for s in t['segments']:
    n=R(s['end'])-R(s['start']); top=s.get('top',{})
    print('\t'.join(map(str,[s['id'],s['layout'],n,top.get('clip','-'),top.get('in',0),top.get('comp') or '-',top.get('x0',0)])))
PY
: > edit.txt
while IFS=$'\t' read -r -u 3 id layout n clip tin comp x0; do
  case $layout in
    stack)
      if [ "$comp" != "-" ]; then
        python3 "$SRC/build/composite.py" src/$clip.mp4 $tin $n r/h/${id}_screen seg/${id}_topsrc.mp4 >/dev/null
        topin="-i seg/${id}_topsrc.mp4"
      else
        topin="-ss $tin -i src/$clip.mp4"
      fi
      # top: native-resolution 1080x960 crop of the witch's side of the 16:9 frame
      # bottom: the PC / Noah screen she is reacting to, cropped from its 16:9 render into 1080x960
      ffmpeg -v error -y $topin -framerate $FPS -i r/h/${id}_bottom/f%04d.jpg -filter_complex \
        "[0:v]scale=1920:1080:flags=lanczos,fps=$FPS,crop=1080:960:$x0:60,$grade,tpad=stop_mode=clone:stop_duration=2[t];\
         [1:v]crop=1216:1080:352:0,scale=1080:960:flags=lanczos[b];\
         [t][b]vstack=inputs=2,drawbox=x=0:y=957:w=1080:h=6:color=0x0B1024@1:t=fill,setsar=1[v]" \
        -map "[v]" -frames:v $n $enc seg/$id.mp4 ;;
    ui|splash)
      ffmpeg -v error -y -framerate $FPS -i r/v/$id/f%04d.jpg -frames:v $n -vf setsar=1 $enc seg/$id.mp4 ;;
  esac
  echo "file 'seg/$id.mp4'" >> edit.txt
done 3< segs.tsv
ffmpeg -v error -y -f concat -safe 0 -i edit.txt -c copy base.mp4

inputs=(-i base.mp4); chain=""; last="0:v"; n=1
while IFS=$'\t' read -r k st; do
  inputs+=(-framerate $FPS -i "r/v/band_$k/f%04d.png")
  chain+="[$n:v]format=rgba,setpts=PTS+$st/TB[o$n];[$last][o$n]overlay=0:0:eof_action=pass[v$n];"; last="v$n"; n=$((n+1))
done < <(python3 -c "import json;[print(i,b['start'],sep='\t') for i,b in enumerate(json.load(open('$SH/short.json'))['bands'])]")
chain+="[$last]fade=in:st=0:d=0.12,setsar=1[vout]"

python3 "$SH/short_audio.py" src/mix.mp3 "$SH/short.json" short.wav
ffmpeg -v error -y "${inputs[@]}" -i short.wav -filter_complex "$chain" -map "[vout]" -map $n:a \
  $enc -profile:v high -level 4.2 -movflags +faststart -c:a aac -b:a 256k -ar 48000 -t 15 NOAH_HALLOWEEN_SHORT_15SEC_1080x1920.mp4
ffprobe -v error -show_entries format=duration:stream=codec_name,width,height,r_frame_rate,sample_aspect_ratio -of compact NOAH_HALLOWEEN_SHORT_15SEC_1080x1920.mp4
