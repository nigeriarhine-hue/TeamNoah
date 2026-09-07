/* Frame grabber: drives render(t) and pipes PNG frames straight into ffmpeg. */
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const SRC = 'file://' + path.resolve(__dirname, 'film.html');
const OUT = path.resolve(__dirname, '../out');
const FFMPEG = process.env.FFMPEG_BIN;

async function open() {
  const browser = await chromium.launch({ args: ['--force-color-profile=srgb', '--font-render-hinting=none'] });
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  await page.addInitScript(() => { window.__GRAB__ = true; });
  await page.goto(SRC, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);
  return { browser, page };
}

(async () => {
  const probe = process.argv.includes('--probe');
  const { browser, page } = await open();
  fs.mkdirSync(OUT, { recursive: true });

  if (probe) {
    const times = [1.2, 4.5, 9.0, 13.0, 16.3, 19.0, 22.5, 26.0, 34.5, 39.5,
                   42.0, 47.0, 50.5, 53.0, 58.8, 61.5, 65.0, 71.5, 74.0];
    fs.mkdirSync(path.join(OUT, 'probe'), { recursive: true });
    for (const t of times) {
      await page.evaluate(tt => window.render(tt), t);
      await page.screenshot({ path: path.join(OUT, 'probe', `t${String(t).padStart(5, '0')}.png`) });
    }
    console.log(`probe: wrote ${times.length} frames to out/probe`);
    await browser.close();
    return;
  }

  const { FPS, FRAMES } = await page.evaluate(() => window.FILM);
  const mp4 = path.join(OUT, 'noah-mine-has-one.mp4');
  const ff = spawn(FFMPEG, [
    '-y', '-f', 'image2pipe', '-vcodec', 'png', '-r', String(FPS), '-i', 'pipe:0',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '17',
    '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-level', '4.2',
    '-movflags', '+faststart', '-r', String(FPS), mp4,
  ], { stdio: ['pipe', 'inherit', 'inherit'] });

  const t0 = Date.now();
  for (let i = 0; i < FRAMES; i++) {
    await page.evaluate(t => window.render(t), i / FPS);
    const buf = await page.screenshot({ type: 'png' });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (i % 150 === 0) {
      const el = (Date.now() - t0) / 1000;
      process.stdout.write(`  frame ${i}/${FRAMES}  ${(i / FRAMES * 100).toFixed(0)}%  ${el.toFixed(0)}s\n`);
    }
  }
  ff.stdin.end();
  await new Promise(r => ff.on('close', r));
  await browser.close();
  console.log(`done -> ${mp4}`);
})();
