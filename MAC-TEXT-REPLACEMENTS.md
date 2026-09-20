# Windows -> Mac text replacements (APPROVED AND APPLIED)

The supplied Noah screenshots are the **Windows build**. All 12 rows below were
approved and are now applied, as Remotion text overlays positioned in each
screenshot's own pixel space (`src/macPatches.ts`). The underlying captures are
never edited, so the originals stay intact and auditable.

Cover colours and glyph colours were sampled from the screenshots themselves
(`scripts/sample.mjs`, `scripts/textcolor.mjs`), and the type is **Plus Jakarta
Sans** — Noah's own brand sans per `brand-kit.html` (`--sans`) — so a patch is
indistinguishable from the surrounding UI.

## A. Pre-approved in the brief — APPLIED

| # | Original (actual string in screenshot) | Replacement | Appears in |
|---|---|---|---|
| 1 | `My PC feels slow` | `My Mac feels slow` | 01 problem |
| 2 | `STARTUP ITEMS` | `LOGIN ITEMS` | 02, 03 |
| 3 | `C: DRIVE FREE` | `STORAGE FREE` | 02, 03 |
| 4 | `Stop Teams from auto-starting at boot` | `Stop Teams from auto-starting at login` | 02, 03 |

`Still On at Boot -> Still On at Login` was on the brief's list but that string
does not occur in these three screenshots.

## B. New rows — APPROVED, APPLIED

| # | Original | Proposed | Why |
|---|---|---|---|
| 5 | `Your PC is loading seven programs at every startup` | `Your Mac is loading seven programs at every login` | both "PC" and "startup" are Windows |
| 6 | `Stop 3 heavy apps from auto-launching at boot` | `Stop 3 heavy apps from auto-launching at login` | macOS has no "boot" items |
| 7 | `Clear temp files to free space` | `Clear cache files to free space` | macOS has caches, not temp files |
| 8 | `Safe, ~0.5 GB temp cache` | `Safe, ~0.5 GB cache` | same |
| 9 | `Accurately measure Downloads, Temp, and AppData sizes` | `Accurately measure Downloads, Caches, and Library sizes` | Temp/AppData are Windows paths |
| 10 | `Turning off a startup program — Teams` | `Turning off a login item — Teams` | macOS terminology |
| 11 | `stop teams from auto starting and clear temp files` (user-typed line) | `stop teams from auto starting and clear cache files` | consistency with #7 |
| 12 | `Edge autolaunch` / `Xbox, Avid, Teams` | `Chrome autolaunch` / `Slack, Avid, Teams` | Edge + Xbox read as Windows-only |

## C. Already Mac-correct — leave alone

- `Move ~14 old installers to Trash`
- `Clearing caches`

## D. Not a text issue — RESOLVED

The window chrome shows **Windows minimise / maximise / close buttons at the top
right**; macOS puts traffic lights at the top left, so no text substitution
fixes it. Resolved with option 1: the title bar is painted out
(`chromeCover()`), and the Noah beats now fit the content column rather than
covering the frame, which keeps the chrome out of shot anyway.

## E. The approve button — APPROVED, APPLIED

| Original | Replacement | Where |
|---|---|---|
| `Trim startup & clear space` | `Trim login items & clear space` | the approve button |

This one needed a different technique. Every other patch sits on a flat panel,
so a sampled solid colour covers it invisibly. The approve button is a
blue-to-violet gradient, where a flat cover would show as a block and a
hand-approximated gradient drifts from the real one.

Instead the cover is **a glyph-free pixel row lifted from the button itself**
(`scripts/` extracted row y=775 into `public/noah-ui/btn-strip.png`) and
stretched over the label. The button is vertically uniform, so this reproduces
its gradient exactly rather than approximating it.

**No Windows-specific wording now appears anywhere on screen.**
