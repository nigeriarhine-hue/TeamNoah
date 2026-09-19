# Getting the UGC clips into the render

The three generated assets live on Higgsfield's CDN. This session's egress
policy returns 403 for every Higgsfield host, so they cannot be pulled in from
here. Any ONE of the options below fixes it.

## The three files

| Save as | URL |
|---|---|
| `public/ugc/mac-list/video3-reference.png` | https://d8j0ntlcm91z4.cloudfront.net/user_3JA3Cf9f9t4L7C7zPSqBOLYIbCb/hf_20260919_184301_8039bdff-0c5a-4340-93c7-a1ad74a275a5.png |
| `public/ugc/mac-list/video3-list-a.mp4` | https://d8j0ntlcm91z4.cloudfront.net/user_3JA3Cf9f9t4L7C7zPSqBOLYIbCb/hf_20260919_212023_99a9d7c3-dd37-4e78-bcac-4d6ea977a3e9.mp4 |
| `public/ugc/mac-list/video3-list-b.mp4` | https://d8j0ntlcm91z4.cloudfront.net/user_3JA3Cf9f9t4L7C7zPSqBOLYIbCb/hf_20260919_212430_65828cac-cb24-46ab-9afb-ade24569860f.mp4 |

The filenames matter — `scripts/check-assets.mjs` looks for exactly these.

These are the CURRENT assets, shot with the recurring character
`mara-mac-creator` (Higgsfield element `2eecef95-b486-4bb9-a7dd-86f61831ec16`).

## Option 1 — do it from your machine (2 minutes, works right now)

```bash
git clone https://github.com/nigeriarhine-hue/TeamNoah.git
cd TeamNoah && git checkout claude/practical-knuth-2ozmlo
mkdir -p public/ugc/mac-list
B=https://d8j0ntlcm91z4.cloudfront.net/user_3JA3Cf9f9t4L7C7zPSqBOLYIbCb
curl -o public/ugc/mac-list/video3-reference.png "$B/hf_20260919_184301_8039bdff-0c5a-4340-93c7-a1ad74a275a5.png"
curl -o public/ugc/mac-list/video3-list-a.mp4   "$B/hf_20260919_212023_99a9d7c3-dd37-4e78-bcac-4d6ea977a3e9.mp4"
curl -o public/ugc/mac-list/video3-list-b.mp4   "$B/hf_20260919_212430_65828cac-cb24-46ab-9afb-ade24569860f.mp4"

npm install
node scripts/check-assets.mjs          # should print all three true
npx remotion render src/index.ts MacList out/noah-things-i-wont-do.mp4
```

Or just `bash scripts/finish.sh`, which does all of the above.

Commit and push the three files and I can render here too.

## Option 2 — allowlist the host (best long-term)

Add `d8j0ntlcm91z4.cloudfront.net` — ideally `*.higgsfield.ai` as well — to this
environment's network policy, then say the word. I pull the files in and
re-render in about three minutes, and every future video in this project works
without any of this.

Network policy is set per environment; see
https://code.claude.com/docs/en/claude-code-on-the-web

## Option 3 — I render it in Higgsfield's own sandbox (nothing needed from you)

The Higgsfield MCP exposes a Linux sandbox that CAN reach the CDN, and it has
node, npm and headless Chromium. Since this repo is public, that sandbox can
clone it, fetch the three assets, install and render, then upload the finished
MP4 back to Higgsfield so you get a download link.

Trade-offs: the result arrives as a hosted URL rather than as
`out/noah-things-i-wont-do.mp4` in the repo, and the sandbox is ephemeral with a
15-minute working lease, so it is a tighter fit than rendering locally.

## Checking the clips before committing to them

Their specs and spoken words are verified (1080x1920, 30fps, 8.0s, audio
present; Whisper round-trips both halves word for word). Their *visual*
performance is not: the finger counts, identity consistency and lip sync have
not been eyeballed. Watch both before locking them in.
