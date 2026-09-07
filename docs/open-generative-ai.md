# Open Generative AI

[Open Generative AI](https://github.com/Anil-matcha/Open-Generative-AI) is an open-source (MIT)
AI image/video studio — 400+ models across 14 studios, driven by the [Muapi.ai](https://muapi.ai)
API. It's installed here as a **git submodule** at [`open-generative-ai/`](../open-generative-ai),
so this repo carries a pinned upstream commit rather than a copy of the code.

Pinned at `c50d5fd` (`v2.0.0-219-gc50d5fd`). It brings three nested submodules of its own —
`Vibe-Workflow`, `Open-Poe-AI`, and `Open-AI-Design-Agent` — all of which are **required** to
build.

## Install

```bash
bash scripts/setup-open-generative-ai.sh
```

That fetches the submodules recursively, runs `npm install`, and builds the workspace packages.
Safe to re-run. Needs **Node.js 18+** (verified on v22).

Doing it by hand is the same three steps:

```bash
git submodule update --init --recursive
npm --prefix open-generative-ai install
npm --prefix open-generative-ai run build:packages
```

> `npm install` on its own is **not** enough. The `studio`, `workflow-builder`, `ai-agent`, and
> `design-agent` workspaces are consumed as compiled output, so neither dev script will start
> until `build:packages` has run.

## Running it

```bash
npm --prefix open-generative-ai run dev            # web app -> http://localhost:3000
npm --prefix open-generative-ai run electron:dev   # desktop app (Electron)
```

`/` redirects to `/studio`. First load shows a key-entry modal.

## API key

Bring your own [Muapi.ai access key](https://muapi.ai/access-keys) — paste the generated key
*value*, not its name/label. The app stores it in browser `localStorage`; there is no `.env` to
commit and no key lives in this repo. You can skip the key entirely if you only intend to use the
desktop app's local-inference engines (sd.cpp / Wan2GP).

## Verified on install

- `npm install` — 1044 packages, clean
- `npm run build:packages` — all four workspaces compiled
- `npm run dev` — Next.js 15.5.15, ready in 1.4s, no errors; `GET /` → 307 → `/studio` → 200,
  studio UI renders and shows the expected key-entry modal
- `npm run build` — production build compiled in 49s, 11 static pages generated, exit 0

Not verified here: `electron:dev` (needs a display) and the installer builds
(`electron:build:*`).

## Gotchas

- **Clone this repo with `--recurse-submodules`.** Without it `open-generative-ai/` is an empty
  directory. Already cloned? Just run the setup script.
- **Upstream's `package-lock.json` is out of sync with its `package.json`,** so `npm install`
  rewrites it on every run. The setup script reverts that automatically to keep the submodule
  clean — otherwise the dirty file blocks the next `git submodule update`. If you install by
  hand, revert it yourself with `git -C open-generative-ai checkout -- package-lock.json`. For
  the same reason `npm ci` fails here; use `npm install`.
- **`npm audit` reports 35 known vulnerabilities** (1 critical, 26 high) in the upstream
  dependency tree. They're inherited from upstream, not introduced here. Worth a look before
  exposing this to anything beyond localhost.
- A single harmless `404` for a missing favicon shows in the browser console; upstream ships no
  `favicon.ico`.

## Updating

```bash
git -C open-generative-ai fetch origin
git -C open-generative-ai checkout <new-ref>
git -C open-generative-ai submodule update --init --recursive
git add open-generative-ai && git commit -m "Bump Open Generative AI to <new-ref>"
```

Then re-run the setup script.

## Licence

Upstream is MIT — see [`open-generative-ai/LICENSE`](../open-generative-ai/LICENSE). It is
third-party code vendored by reference; keep local modifications out of the submodule so it stays
updatable.
