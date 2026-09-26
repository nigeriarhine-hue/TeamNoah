#!/usr/bin/env bash
# Pull the generated voice lines and character clips into assets/ so
# build_video.py can composite them. Needs the Higgsfield CDN to be reachable:
#   d8j0ntlcm91z4.cloudfront.net
# If it is denied, download them from your Higgsfield library instead and drop
# them in with these same filenames.
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
mkdir -p "$ROOT/assets/audio" "$ROOT/assets/character"

python3 - "$ROOT" <<'PY'
import json, pathlib, subprocess, sys
root = pathlib.Path(sys.argv[1])
man  = json.loads((root / "render" / "generated_assets.json").read_text())
todo = [("assets/audio/%s.mp3" % k, v["url"]) for k, v in man["audio"].items()]
todo += [("assets/character/%s.mp4" % k, v["url"]) for k, v in man["character"].items()]
bad = 0
for rel, url in todo:
    if not url.startswith("http"):
        print(f"  skip {rel}: {url}"); bad += 1; continue
    out = root / rel
    r = subprocess.run(["curl", "-sS", "-f", "-o", str(out), url, "--max-time", "180"])
    ok = r.returncode == 0 and out.exists() and out.stat().st_size > 0
    print(f"  {'ok  ' if ok else 'FAIL'} {rel}" + (f"  ({out.stat().st_size/1e6:.2f} MB)" if ok else ""))
    bad += 0 if ok else 1
sys.exit(1 if bad else 0)
PY
echo "now run:  python3 render/timeline.py && python3 render/make_captions.py && python3 render/build_video.py"
