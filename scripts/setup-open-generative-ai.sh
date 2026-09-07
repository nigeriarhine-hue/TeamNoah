#!/usr/bin/env bash
#
# One-command setup for the Open Generative AI submodule.
#
#   bash scripts/setup-open-generative-ai.sh
#
# Fetches the submodule (and its three nested submodules), installs npm
# dependencies, and builds the workspace packages. Safe to re-run.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
APP_DIR="$REPO_ROOT/open-generative-ai"

if ! command -v node >/dev/null 2>&1; then
  echo "error: node is not installed. Open Generative AI needs Node.js 18 or newer." >&2
  exit 1
fi

NODE_MAJOR="$(node -p 'process.versions.node.split(".")[0]')"
if [ "$NODE_MAJOR" -lt 18 ]; then
  echo "error: Node.js 18+ required, found $(node --version)." >&2
  exit 1
fi

echo "==> Fetching submodules (open-generative-ai + its 3 nested packages)"
git -C "$REPO_ROOT" submodule update --init --recursive

if [ ! -f "$APP_DIR/package.json" ]; then
  echo "error: $APP_DIR looks empty — the submodule checkout failed." >&2
  exit 1
fi

echo "==> Installing npm dependencies"
npm --prefix "$APP_DIR" install

# `npm install` alone is not enough: the studio/workflow/agent workspaces are
# consumed as built output, so neither dev script works until these are built.
echo "==> Building workspace packages (studio, workflow, agents, design-agent)"
npm --prefix "$APP_DIR" run build:packages

# Upstream ships a package-lock.json that is out of sync with its package.json, so
# `npm install` rewrites it on every run. Nothing here consumes that rewrite (and it
# belongs to the upstream repo, not this one), so drop it to keep the submodule clean
# — a dirty tracked file would otherwise block the next `git submodule update`.
if [ -n "$(git -C "$APP_DIR" status --porcelain -- package-lock.json)" ]; then
  echo "==> Reverting upstream package-lock.json churn (keeps the submodule clean)"
  git -C "$APP_DIR" checkout -- package-lock.json
fi

cat <<EOF

Done. Open Generative AI is installed at:
  $APP_DIR

Start it with ONE of:
  npm --prefix open-generative-ai run dev            # web app  -> http://localhost:3000
  npm --prefix open-generative-ai run electron:dev   # desktop app (Electron)

You will be prompted for a Muapi.ai access key on first use
(https://muapi.ai/access-keys). Skip it if you only plan to use local models.
EOF
