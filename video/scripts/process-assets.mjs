/**
 * process-assets.mjs — turn the raw Noah screen captures into premium video assets.
 *
 * Pipeline per source:
 *   1. vertical auto-alignment against a group anchor (captures jitter by a few px)
 *   2. non-destructive crop to the region the storyboard needs
 *   3. 2x Lanczos3 upscale so the compositor always DOWNsamples (never upsamples)
 *   4. restrained unsharp + a touch of contrast so the UI sits in a dark grade
 *
 * Nothing here invents UI. Crops isolate real regions; no text is redrawn.
 */
import sharp from 'sharp';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const SRC = fileURLToPath(new URL('../..', import.meta.url));
const OUT = fileURLToPath(new URL('../public/noah', import.meta.url));
mkdirSync(OUT, { recursive: true });

const SCALE = 2;                 // upscale factor
const SIDEBAR_X = 331;           // x of the sidebar / conversation divider in source space

/** Mean-absolute-difference alignment of a narrow sidebar strip. */
async function verticalOffset(refRaw, testPath, search = 18) {
  const strip = { left: 20, top: 180, width: 280, height: 420 };
  const test = await sharp(testPath).extract({ ...strip, top: strip.top - search, height: strip.height + search * 2 })
    .greyscale().raw().toBuffer();
  const W = strip.width;
  let best = 0, bestScore = Infinity;
  for (let dy = -search; dy <= search; dy++) {
    let sum = 0;
    const base = (search + dy) * W;
    for (let i = 0; i < strip.height * W; i += 7) {           // stride sample: fast + plenty accurate
      sum += Math.abs(test[base + i] - refRaw[i]);
    }
    if (sum < bestScore) { bestScore = sum; best = dy; }
  }
  return best;
}

async function refStrip(path) {
  return sharp(path).extract({ left: 20, top: 180, width: 280, height: 420 }).greyscale().raw().toBuffer();
}

/** Crop + enhance + write. box is in SOURCE pixel space, before alignment shift. */
async function emit(name, srcPath, box, dy = 0, opts = {}) {
  const meta = await sharp(srcPath).metadata();
  const top = Math.max(0, Math.round(box.top + dy));
  const height = Math.min(meta.height - top, Math.round(box.height));
  const left = Math.max(0, Math.round(box.left));
  const width = Math.min(meta.width - left, Math.round(box.width));

  const pipe = sharp(srcPath)
    .extract({ left, top, width, height })
    .resize({
      width: Math.round(width * (opts.scale ?? SCALE)),
      height: Math.round(height * (opts.scale ?? SCALE)),
      kernel: 'lanczos3',
      fit: 'fill',
    })
    // restrained edge-biased unsharp: crisp UI text, no halos
    .sharpen({ sigma: 0.75, m1: 0.32, m2: 1.05, x1: 2, y2: 8, y3: 12 })
    // gentle S-contrast so the panel reads as a lit object on a dark stage
    .linear(1.045, -6);

  await pipe.png({ compressionLevel: 9, palette: false }).toFile(join(OUT, `${name}.png`));
  const m = await sharp(join(OUT, `${name}.png`)).metadata();
  return { name, w: m.width, h: m.height, from: srcPath.split('/').pop(), box: { left, top, width, height }, dy };
}

const manifest = [];
const P = (f) => join(SRC, f);

// ── Group A: the investigation run (identical sidebar) ────────────────────────
const groupA = ['IMG_0583.jpeg', 'IMG_0584.jpeg', 'IMG_0585.jpeg', 'IMG_0586.jpeg', 'IMG_0587.jpeg', 'IMG_0588.jpeg'];
const anchorA = await refStrip(P('IMG_0588.jpeg'));
const offA = {};
for (const f of groupA) offA[f] = f === 'IMG_0588.jpeg' ? 0 : await verticalOffset(anchorA, P(f));

// ── Group B: post-plan states (sidebar gained a TODAY row) ────────────────────
const groupB = ['IMG_0591.jpeg', 'IMG_0594.jpeg', 'IMG_0595.jpeg'];
const anchorB = await refStrip(P('IMG_0591.jpeg'));
const offB = {};
for (const f of groupB) offB[f] = f === 'IMG_0591.jpeg' ? 0 : await verticalOffset(anchorB, P(f));

console.log('alignment offsets A:', offA);
console.log('alignment offsets B:', offB);

// Full app window (with authentic Noah title bar) — used inside PremiumAppFrame
const FULL = { left: 0, top: 0, width: 1170, height: 966 };
// Conversation pane only — sidebar and OS title bar removed so PremiumAppFrame supplies the chrome
const PANE = { left: SIDEBAR_X, top: 30, width: 1170 - SIDEBAR_X, height: 936 };

manifest.push(await emit('app-full-plan',      P('IMG_0588.jpeg'), FULL, offA['IMG_0588.jpeg']));
manifest.push(await emit('app-full-dialog',    P('IMG_0593.jpeg'), FULL, 0));
manifest.push(await emit('app-full-result',    P('IMG_0595.jpeg'), FULL, offB['IMG_0595.jpeg']));

// Investigation sequence — pane crops, aligned so they can hard-cut cleanly
manifest.push(await emit('pane-listening',     P('IMG_0583.jpeg'), PANE, offA['IMG_0583.jpeg']));
manifest.push(await emit('pane-checks-2',      P('IMG_0584.jpeg'), PANE, offA['IMG_0584.jpeg']));
manifest.push(await emit('pane-checks-4',      P('IMG_0585.jpeg'), PANE, offA['IMG_0585.jpeg']));
manifest.push(await emit('pane-thinking',      P('IMG_0586.jpeg'), PANE, offA['IMG_0586.jpeg']));
manifest.push(await emit('pane-thinking-5s',   P('IMG_0587.jpeg'), PANE, offA['IMG_0587.jpeg']));
manifest.push(await emit('pane-plan',          P('IMG_0588.jpeg'), PANE, offA['IMG_0588.jpeg']));
manifest.push(await emit('pane-plan-hover',    P('IMG_0591.jpeg'), PANE, offB['IMG_0591.jpeg']));
manifest.push(await emit('pane-sent',          P('IMG_0594.jpeg'), PANE, offB['IMG_0594.jpeg']));
manifest.push(await emit('pane-result',        P('IMG_0595.jpeg'), PANE, offB['IMG_0595.jpeg']));

// ── Tight, non-destructive region crops for the close-up beats ────────────────
const dyPlan = offA['IMG_0588.jpeg'];
manifest.push(await emit('crop-situation',  P('IMG_0588.jpeg'), { left: 378, top: 108, width: 762, height: 168 }, dyPlan, { scale: 3 }));
manifest.push(await emit('crop-checked',    P('IMG_0588.jpeg'), { left: 386, top: 280, width: 744, height: 162 }, dyPlan, { scale: 3 }));
manifest.push(await emit('crop-plan-list',  P('IMG_0588.jpeg'), { left: 386, top: 452, width: 744, height: 294 }, dyPlan, { scale: 3 }));
manifest.push(await emit('crop-cta',        P('IMG_0588.jpeg'), { left: 386, top: 757, width: 728, height: 70  }, dyPlan, { scale: 3 }));

manifest.push(await emit('crop-cta-hover',  P('IMG_0591.jpeg'), { left: 386, top: 760, width: 728, height: 70  }, offB['IMG_0591.jpeg'], { scale: 3 }));
manifest.push(await emit('crop-dialog',     P('IMG_0593.jpeg'), { left: 330, top: 375, width: 514, height: 270 }, 0, { scale: 3 }));
manifest.push(await emit('crop-approved',   P('IMG_0594.jpeg'), { left: 372, top: 712, width: 520, height: 54  }, offB['IMG_0594.jpeg'], { scale: 4 }));
manifest.push(await emit('crop-executing',  P('IMG_0594.jpeg'), { left: 378, top: 795, width: 756, height: 108 }, offB['IMG_0594.jpeg'], { scale: 3 }));
manifest.push(await emit('crop-done',       P('IMG_0595.jpeg'), { left: 386, top: 318, width: 744, height: 168 }, offB['IMG_0595.jpeg'], { scale: 3 }));
manifest.push(await emit('crop-verify',     P('IMG_0595.jpeg'), { left: 386, top: 534, width: 744, height: 88  }, offB['IMG_0595.jpeg'], { scale: 3 }));


// ── Investigation: a fixed window on the checklist card, so it grows in place ──
const CARD = { left: 370, top: 40, width: 772, height: 370 };
manifest.push(await emit('card-listening',   P('IMG_0583.jpeg'), CARD, offA['IMG_0583.jpeg'], { scale: 3 }));
manifest.push(await emit('card-checks-2',    P('IMG_0584.jpeg'), CARD, offA['IMG_0584.jpeg'], { scale: 3 }));
manifest.push(await emit('card-checks-4',    P('IMG_0585.jpeg'), CARD, offA['IMG_0585.jpeg'], { scale: 3 }));
manifest.push(await emit('card-thinking',    P('IMG_0586.jpeg'), CARD, offA['IMG_0586.jpeg'], { scale: 3 }));
manifest.push(await emit('card-thinking-5s', P('IMG_0587.jpeg'), CARD, offA['IMG_0587.jpeg'], { scale: 3 }));

// The user's own words, and Noah's first response — the whole ask, in two crops
manifest.push(await emit('crop-bubble',      P('IMG_0583.jpeg'), { left: 918, top: 50, width: 228, height: 70 }, offA['IMG_0583.jpeg'], { scale: 4 }));
manifest.push(await emit('crop-looking',     P('IMG_0583.jpeg'), { left: 372, top: 155, width: 768, height: 76 }, offA['IMG_0583.jpeg'], { scale: 3 }));

// ── Element-level crops: at 9:16 these are the only way real UI text stays readable ──
// The four measurements Noah based its diagnosis on.
const TILE_Y = 316, TILE_H = 120;
manifest.push(await emit('tile-startup',    P('IMG_0588.jpeg'), { left: 400, top: TILE_Y, width: 178, height: TILE_H }, dyPlan, { scale: 4 }));
manifest.push(await emit('tile-disk',       P('IMG_0588.jpeg'), { left: 578, top: TILE_Y, width: 178, height: TILE_H }, dyPlan, { scale: 4 }));
manifest.push(await emit('tile-installers', P('IMG_0588.jpeg'), { left: 756, top: TILE_Y, width: 178, height: TILE_H }, dyPlan, { scale: 4 }));
manifest.push(await emit('tile-background', P('IMG_0588.jpeg'), { left: 934, top: TILE_Y, width: 186, height: TILE_H }, dyPlan, { scale: 4 }));

// The proposed plan, one real row at a time.
for (let i = 0; i < 4; i++) {
  manifest.push(await emit(`plan-item-${i + 1}`, P('IMG_0588.jpeg'),
    { left: 398, top: 500 + i * 65, width: 480, height: 62 }, dyPlan, { scale: 4 }));
}

// The re-measurement after the fix.
const RES_Y = 545, RES_H = 66;
manifest.push(await emit('res-startup', P('IMG_0595.jpeg'), { left: 399, top: RES_Y, width: 186, height: RES_H }, offB['IMG_0595.jpeg'], { scale: 4 }));
manifest.push(await emit('res-temp',    P('IMG_0595.jpeg'), { left: 648, top: RES_Y, width: 190, height: RES_H }, offB['IMG_0595.jpeg'], { scale: 4 }));
manifest.push(await emit('res-boot',    P('IMG_0595.jpeg'), { left: 881, top: RES_Y, width: 200, height: RES_H }, offB['IMG_0595.jpeg'], { scale: 4 }));

// Noah's verdict, large.
manifest.push(await emit('crop-done-word', P('IMG_0595.jpeg'), { left: 395, top: 352, width: 300, height: 52 }, offB['IMG_0595.jpeg'], { scale: 4 }));

writeFileSync(join(OUT, '_manifest.json'), JSON.stringify(manifest, null, 2));

// Generated size map — components use this so a frame's height always matches
// the asset's true aspect ratio and nothing is ever stretched (§10C).
const sizeEntries = manifest
  .map((m) => `  '${m.name}': { w: ${m.w}, h: ${m.h} },`)
  .join('\n');
writeFileSync(
  fileURLToPath(new URL('../src/NoahAd/config/asset-sizes.ts', import.meta.url)),
  `/* GENERATED by scripts/process-assets.mjs — do not edit by hand. */\n\n` +
    `export const assetSizes = {\n${sizeEntries}\n} as const;\n\n` +
    `export type AssetName = keyof typeof assetSizes;\n\n` +
    `/** Height that keeps \`name\` at its true aspect ratio when drawn \`width\` wide. */\n` +
    `export const heightFor = (name: AssetName, width: number) =>\n` +
    `  (width * assetSizes[name].h) / assetSizes[name].w;\n`,
);
console.table(manifest.map(({ name, w, h, from }) => ({ name, w, h, from })));
