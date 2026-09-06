# Noah brand pack

Ready-to-use logo files. **Read [`../../brain/BRAND.md`](../../brain/BRAND.md) first** — the files
matter far less than getting the brand right.

Generated from the canonical source (`noah-desktop/brand/build.py`) on 2026-07-21. Don't hand-edit
anything here; regenerate instead.

## Which file do I use?

| I need… | Use |
|---|---|
| Logo on a **white / light** background | `svg/noah-mark-light.svg` or `png/noah-mark-light-*.png` |
| Logo on a **dark / black** background | `svg/noah-mark-dark.svg` or `png/noah-mark-dark-*.png` |
| **Screen printing / embroidery** (one colour) | `svg/noah-mark-1color-navy.svg` (dark garments: `-white`) |
| **App icon** — rounded tile with its own background | `svg/noah-appicon-light.svg` / `-dark.svg` |
| **Website tab icon** | `svg/noah-favicon-light.svg` / `-dark.svg` |

**SVG or PNG?** Give a printer the **SVG** — it stays sharp at any size, including a billboard.
PNGs are for places that won't accept SVG (some social platforms, slide decks). Biggest PNG here is
2048px, plenty for a T-shirt.

⚠️ **`noah-mark-1color-white.png` will look like an empty file** in a light image viewer — it's white
artwork on a transparent background. That's correct. Open it on a dark background to see it.

## Rules

- **Don't recolour it.** Navy `#1A1D61` with the blue→violet tide, or one flat colour using the
  1-colour files. Never gold, chrome, neon, or a gradient we didn't ship.
- **Don't add effects** — no drop shadows, bevels, outer glows, or outlines.
- **Don't stretch it.** Scale proportionally. The circle is a circle.
- **Don't rotate it or tilt the waterline.** A level line is the entire point of the mark.
- **Don't crop the waterline.** It extends past the disc deliberately — that overshoot *is* the
  Plimsoll load line. A disc on its own is not the logo.
- **Give it room.** Clear space on all sides ≥ the height of the disc's stroke. Don't crowd it with
  text.
- **Smallest sizes:** below ~32px use the `favicon` files — they're drawn to hold up tiny. The
  regular mark goes muddy.

## Regenerating

```bash
cd ~/src/noah-desktop/brand && python build.py     # rewrites the canonical SVGs only
```

That regenerates `noah-desktop/brand/*.svg` in place and touches nothing else. **`bash brand/sync.sh`
is a different, bigger operation** — it also pushes assets into the website and desktop app and
re-renders every platform icon. Don't run it just to refresh this pack.
