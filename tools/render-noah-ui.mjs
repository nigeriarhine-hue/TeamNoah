// Renders the Noah UI screens to high-resolution PNGs for use in the video.
import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'public/noah-ui/mac-ai-tech-support');
fs.mkdirSync(outDir, { recursive: true });

const SCALE = 1.6; // 1400 x 1160 css  ->  2240 x 1856 px
const SCREENS = [
  ['s01', 'noah-ai-tech-support-01-problem.png'],
  ['s02', 'noah-ai-tech-support-02-diagnosis.png'],
  ['s03', 'noah-ai-tech-support-03-approval.png'],
  ['s04', 'noah-ai-tech-support-04-action.png'],
  ['s05', 'noah-ai-tech-support-05-result.png'],
];

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--no-sandbox', '--force-color-profile=srgb', '--font-render-hinting=none'],
});
const page = await browser.newPage({
  viewport: { width: 1500, height: 1800 },
  deviceScaleFactor: SCALE,
});
await page.goto('file://' + path.join(root, 'tools/noah-ui/screens.html'), { waitUntil: 'load' });
await page.waitForFunction(() => document.fonts.status === 'loaded');
await page.waitForTimeout(250);

for (const [id, file] of SCREENS) {
  const el = await page.$('#' + id);
  await el.screenshot({ path: path.join(outDir, file) });
  const box = await el.boundingBox();
  console.log(`${file}  ${Math.round(box.width * SCALE)}x${Math.round(box.height * SCALE)}`);
}

// Export hotspot geometry (fraction of frame) so Remotion can zoom precisely.
const spots = await page.evaluate(() => {
  const out = {};
  document.querySelectorAll('[data-spot]').forEach((n) => {
    const frame = n.closest('.frame');
    const f = frame.getBoundingClientRect();
    const r = n.getBoundingClientRect();
    out[`${frame.id}.${n.dataset.spot}`] = {
      x: (r.left - f.left) / f.width, y: (r.top - f.top) / f.height,
      w: r.width / f.width, h: r.height / f.height,
    };
  });
  return out;
});
fs.writeFileSync(path.join(root, 'src/ui-hotspots.json'), JSON.stringify(spots, null, 2) + '\n');
console.log('hotspots:', Object.keys(spots).join(', '));

await browser.close();
