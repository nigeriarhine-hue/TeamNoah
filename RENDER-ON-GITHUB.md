# Rendering without installing anything

GitHub Actions runs the render on GitHub's machines. You need a browser and
nothing else.

## Getting the files

1. Open **https://github.com/nigeriarhine-hue/TeamNoah/actions**
2. Click the most recent **Render Noah short** run.
   It starts by itself whenever this branch is pushed, so one should already
   be there. To start one by hand instead: pick *Render Noah short* in the
   left sidebar, then **Run workflow**, choose branch
   `claude/practical-knuth-2ozmlo`, and confirm.
3. Wait for the green tick. Roughly 10-20 minutes — GitHub's free runners have
   two cores, so the render is slower than a laptop.
4. Scroll to **Artifacts** at the bottom of the run page and download
   **noah-things-i-wont-do**. It is a zip holding:
   - `noah-things-i-wont-do.mp4` — 1080x1920, 27s
   - `noah-things-i-wont-do-thumbnail.png` — 1080x1920

Artifacts are kept for 30 days.

## If the run fails

Open the run and look at which step is red.

| Red step | What it means |
|---|---|
| **Fetch the UGC clips** | The Higgsfield links have expired. They need regenerating — ask Claude. |
| **Confirm the clips arrived** | A download produced an empty file. Re-run the job. |
| **Ensure Chrome for Remotion** / **Render** | Usually transient. Use **Re-run jobs** first. |

The "Confirm the clips arrived" step exists on purpose: without it a failed
download would still render happily and hand you a finished video with no
creator in it, which is exactly the failure that is easy to miss.

## Re-rendering after a change

Any push to `src/`, `public/` or `scripts/` on this branch starts a fresh run
automatically. No need to trigger it by hand.
