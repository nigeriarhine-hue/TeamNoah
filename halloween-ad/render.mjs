// Usage: node render.mjs <outdir> [preview]
// Renders the Noah UI inserts, splash and caption PNGs from stage.html at 1920x1080, 30fps.
import { chromium } from 'playwright';
import fs from 'fs'; import path from 'path'; import url from 'url';
const here = path.dirname(url.fileURLToPath(import.meta.url));
const out = process.argv[2] || 'out'; const preview = process.argv[3] === 'preview';
const FPS = 30;
export const SEGMENTS = { ui1: 5.6, ui2: 6.6, ui3: 4.8, ui4: 5.8, splash: 6.5 };
export const CAPTIONS = JSON.parse(fs.readFileSync(path.join(here, 'captions.json'), 'utf8'));
const browser = await chromium.launch(process.env.CHROME ? { executablePath: process.env.CHROME } : {});
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
await page.goto('file://' + path.join(here, 'stage.html'));
await page.evaluate(() => document.fonts.ready);
fs.mkdirSync(out, { recursive: true });
for (const [name, dur] of Object.entries(SEGMENTS)) {
  const times = preview ? [0.3, dur * 0.35, dur * 0.6, dur - 0.1] : [...Array(Math.round(dur * FPS)).keys()].map(i => i / FPS);
  const dir = path.join(out, name); fs.mkdirSync(dir, { recursive: true });
  for (let i = 0; i < times.length; i++) {
    await page.evaluate(([n, t]) => window.render(n, t), [name, times[i]]);
    await page.screenshot({ path: path.join(dir, `f${String(i).padStart(4, '0')}.jpg`), type: 'jpeg', quality: preview ? 80 : 95 });
  }
  console.log('rendered', name, times.length);
}
const cdir = path.join(out, 'captions'); fs.mkdirSync(cdir, { recursive: true });
for (const c of CAPTIONS) {
  await page.evaluate(([h, u]) => window.caption(h, u), [c.html, !!c.ui]);
  await page.screenshot({ path: path.join(cdir, c.id + '.png'), omitBackground: true });
}
console.log('captions', CAPTIONS.length);
await browser.close();
