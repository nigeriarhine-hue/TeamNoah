// Renders every HTML-driven element of the 9:16 Short from ../ui/stage.html.
// Usage: node render_short.mjs <outdir>
//   h/<seg>_bottom/f0000.jpg   1920x1080 PC / Noah screens, cropped later into the lower panel
//   v/<seg>_bottom/f0000.jpg   1080x1920 vertical Noah screen for a lower panel (top 960 rows used)
//   Every segment renders extra frames past its cut equal to the next segment's dissolve (xin).
//   h/<seg>_screen/f0000.jpg   1920x1080 monitor content for the green-screen composites
//   v/<seg>/f0000.jpg          1080x1920 native vertical Noah UI and end card
//   v/band_<i>/f0000.png       1080x1920 transparent text bands
import { chromium } from 'playwright';
import fs from 'fs'; import path from 'path'; import url from 'url';

const here = path.dirname(url.fileURLToPath(import.meta.url));
const out = process.argv[2] || 'r';
const S = JSON.parse(fs.readFileSync(path.join(here, 'short.json'), 'utf8'));
const FPS = S.fps;
const R = x => Math.floor(x * FPS + 0.5);
const nFrames = (a, b) => R(b) - R(a);
const browser = await browser_();
async function browser_() { return chromium.launch(process.env.CHROME ? { executablePath: process.env.CHROME } : {}); }
async function page(w, h) {
  const p = await browser.newPage({ viewport: { width: w, height: h } });
  p.on('pageerror', e => { console.error('page error:', e.message); process.exitCode = 1; });
  await p.goto('file://' + path.join(here, '..', 'ui', 'stage.html'));
  await p.evaluate(() => document.fonts.ready);
  return p;
}
const H = await page(1920, 1080), V = await page(1080, 1920);
async function seq(pg, dir, n, fn, png) {
  fs.mkdirSync(dir, { recursive: true });
  for (let i = 0; i < n; i++) {
    const [name, t, opt] = fn(i);
    await pg.evaluate(([a, b, c]) => window.render(a, b, c), [name, t, opt]);
    await pg.screenshot({ path: path.join(dir, `f${String(i).padStart(4, '0')}.${png ? 'png' : 'jpg'}`),
      ...(png ? { omitBackground: true } : { type: 'jpeg', quality: 94 }) });
  }
}
for (const [j, s] of S.segments.entries()) {
  // render past the cut by the next segment's dissolve length so the transition has frames to blend
  const n = nFrames(s.start, s.end) + R((S.segments[j + 1] || {}).xin || 0);
  if (s.layout === 'stack') {
    const b = s.bottom;
    if (b.vpc) await seq(V, path.join(out, 'v', s.id + '_bottom'), n, i => [b.vpc, b.t0 + i / FPS, { vert: true, vcam: b.vcam }]);
    else await seq(H, path.join(out, 'h', s.id + '_bottom'), n, i => [b.pc, b.t0 + i / FPS, { noLabel: true }]);
    if (s.top.comp)
      await seq(H, path.join(out, 'h', s.id + '_screen'), n, i => [s.top.comp, s.top.screen_t0 + i / FPS, {}]);
  } else if (s.layout === 'ui') {
    const vcam = s.scene === 'flow' ? undefined : (s.vcam || S.vcam_default); // flow drives its own camera
    await seq(V, path.join(out, 'v', s.id), n, i => [s.scene, (s.t0 || 0) + (i / FPS) * (s.speed || 1),
      { vert: true, vcam, pressAt: s.pressAt }]);
  } else if (s.layout === 'splash') {
    await seq(V, path.join(out, 'v', s.id), n, i => ['vsplash', i / FPS, { vert: true, cue: s.cue, noFade: s.noFade }]);
  }
  console.log('rendered', s.id, n);
}
for (const [k, b] of S.bands.entries()) {
  const n = nFrames(b.start, b.end);
  await seq(V, path.join(out, 'v', 'band_' + k), n, i => ['ov:band', i / FPS,
    { vert: true, lines: b.lines, size: b.size, y: b.y, t0: 0, t1: (b.end - b.start) - 0.15 }], true);
}
console.log('bands', S.bands.length);
await browser.close();
