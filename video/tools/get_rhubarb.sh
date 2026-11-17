#!/usr/bin/env bash
# Downloads Rhubarb Lip Sync (MIT) into video/.tools/rhubarb (gitignored).
set -euo pipefail
cd "$(dirname "$0")/.."
VER=1.14.0
DEST=.tools/rhubarb
if [ -x "$DEST/rhubarb" ]; then echo "rhubarb already installed: $DEST/rhubarb"; exit 0; fi
mkdir -p .tools
TMP=$(mktemp -d)
curl -sSL -o "$TMP/rh.zip" "https://github.com/DanielSWolf/rhubarb-lip-sync/releases/download/v$VER/Rhubarb-Lip-Sync-$VER-Linux.zip"
python3 -I -m zipfile -e "$TMP/rh.zip" "$TMP/x"
rm -rf "$DEST" && mv "$TMP/x/Rhubarb-Lip-Sync-$VER-Linux" "$DEST"
chmod +x "$DEST/rhubarb"
rm -rf "$TMP"
"$DEST/rhubarb" --version
