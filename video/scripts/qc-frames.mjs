/**
 * qc-frames.mjs — render representative frames from every beat (§52) and tile
 * them into contact sheets for review.
 */
import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const BROWSER = '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
const OUT = process.argv[3] ?? 'out/qc';
const FRAMES = (process.argv[2] ?? '')
  .split(',')
  .filter(Boolean)
  .map(Number);

const frames = FRAMES.length
  ? FRAMES
  : [4, 24, 54, 96, 120, 140, 160, 186, 212, 240, 258, 276, 300, 316, 336, 360,
     390, 414, 436, 470, 492, 510, 540, 570, 600, 625, 648, 664, 692, 716, 730,
     760, 790, 812, 840, 874, 906, 928];

mkdirSync(OUT, { recursive: true });

const serveUrl = await bundle({ entryPoint: 'src/index.ts', onProgress: () => {} });
const composition = await selectComposition({ serveUrl, id: 'NoahShortSilent', inputProps: {} });
console.log(`composition ${composition.width}x${composition.height} @${composition.fps} ${composition.durationInFrames}f`);

for (const frame of frames) {
  await renderStill({
    composition,
    serveUrl,
    output: join(OUT, `f${String(frame).padStart(4, '0')}.png`),
    frame,
    browserExecutable: BROWSER,
    imageFormat: 'png',
    chromiumOptions: { gl: 'angle' },
  });
  process.stdout.write(`${frame} `);
}
console.log('\ndone');
