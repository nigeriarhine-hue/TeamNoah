/* Render short.html frame-by-frame.
   preview:  node shoot.mjs preview 2,6,9.5,...
   full:     node shoot.mjs full out.mp4
   Frames are piped straight into ffmpeg — nothing large hits disk. */

import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
const URL_ = 'file://' + join(HERE, 'short.html');
const [, , mode, arg] = process.argv;

const browser = await chromium.launch({
  args: ['--no-sandbox', '--force-color-profile=srgb', '--font-render-hinting=none',
         '--disable-font-subpixel-positioning', '--hide-scrollbars',
         '--disable-gpu-vsync', '--use-gl=swiftshader', '--enable-unsafe-swiftshader']
});
const page = await browser.newPage({
  viewport: { width: 1080, height: 1920 },
  deviceScaleFactor: 1,
  reducedMotion: 'reduce',
});
await page.goto(URL_, { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(450);          // let variable fonts + blur filters settle

const DUR = await page.evaluate(() => window.__DUR);
const FPS = await page.evaluate(() => window.__FPS);

if (mode === 'preview') {
  const times = (arg || '2,6,9.5,13.5,18.5,23,27.5,32.8').split(',').map(Number);
  mkdirSync(join(HERE, 'prev'), { recursive: true });
  for (const t of times) {
    await page.evaluate(tt => window.__seek(tt), t);
    await page.waitForTimeout(60);
    const buf = await page.screenshot({ type: 'png' });
    writeFileSync(join(HERE, 'prev', `t${t}.png`), buf);
    console.log('frame', t);
  }
  await browser.close();
  process.exit(0);
}

/* ---------- full render ---------- */
const out = arg || 'noah-short.mp4';
const total = Math.round(DUR * FPS);
const ff = spawn('ffmpeg', [
  '-y', '-hide_banner', '-loglevel', 'error',
  '-f', 'image2pipe', '-c:v', 'mjpeg', '-framerate', String(FPS), '-i', 'pipe:0',
  '-c:v', 'libx264', '-preset', 'slow', '-crf', '17',
  '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-level', '4.2',
  '-movflags', '+faststart', '-r', String(FPS),
  join(HERE, out)
], { stdio: ['pipe', 'inherit', 'inherit'] });

const write = b => new Promise(res => ff.stdin.write(b) ? res() : ff.stdin.once('drain', res));

const t0 = Date.now();
for (let f = 0; f < total; f++) {
  await page.evaluate(t => window.__seek(t), f / FPS);
  await write(await page.screenshot({ type: 'jpeg', quality: 97 }));
  if (f % 120 === 0) {
    const el = (Date.now() - t0) / 1000;
    const eta = f ? (el / f) * (total - f) : 0;
    console.log(`${f}/${total}  ${(f / total * 100).toFixed(1)}%  elapsed ${el.toFixed(0)}s  eta ${eta.toFixed(0)}s`);
  }
}
ff.stdin.end();
await new Promise(r => ff.on('close', r));
await browser.close();
console.log('done ->', out, `${total} frames @ ${FPS}fps`);
