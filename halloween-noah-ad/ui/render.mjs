// Renders every HTML-driven element of the edit from stage.html at 1920x1080, 30 fps.
// Usage: node render.mjs <outdir> [stills]
//   frames/<segment>/f0000.jpg        full-frame product / problem / diagnostic / splash shots
//   frames/<segment>_screen/f0000.jpg what the witch's monitor shows (green-screen composites)
//   frames/<segment>_ov_<name>/f0000.png  transparent typography overlays
//   frames/captions/<id>.png          caption plates
//   stills/<name>.png                 the eight named UI deliverables
import { chromium } from 'playwright';
import fs from 'fs'; import path from 'path'; import url from 'url';

const here = path.dirname(url.fileURLToPath(import.meta.url));
const root = path.join(here, '..');
const out = process.argv[2] || 'frames';
const onlyStills = process.argv[3] === 'stills';
const TL = JSON.parse(fs.readFileSync(path.join(root, 'timeline.json'), 'utf8'));
const CAPS = JSON.parse(fs.readFileSync(path.join(root, 'captions/captions.json'), 'utf8'));
const FPS = TL.fps;
const nFrames = s => Math.round(s.end * FPS) - Math.round(s.start * FPS);

const browser = await chromium.launch(process.env.CHROME ? { executablePath: process.env.CHROME } : {});
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
page.on('pageerror', e => { console.error('page error:', e.message); process.exitCode = 1; });
await page.goto('file://' + path.join(here, 'stage.html'));
await page.evaluate(() => document.fonts.ready);
const mk = d => fs.mkdirSync(d, { recursive: true });

async function seq(dir, n, fn, png) {
  mk(dir);
  for (let i = 0; i < n; i++) {
    await page.evaluate(fn(i));
    await page.screenshot({ path: path.join(dir, `f${String(i).padStart(4, '0')}.${png ? 'png' : 'jpg'}`),
      ...(png ? { omitBackground: true } : { type: 'jpeg', quality: 94 }) });
  }
}
const call = (name, t, opt) => `window.render(${JSON.stringify(name)}, ${t}, ${JSON.stringify(opt || {})})`;

mk(path.join(out, 'stills'));
for (const [file, scene, t] of TL.stills) {
  const splash = TL.segments.find(s => s.scene === 'splash');
  await page.evaluate(call(scene, t, scene === 'splash' ? { cue: splash.cue } : {}));
  await page.screenshot({ path: path.join(out, 'stills', file + '.png') });
}
console.log('stills', TL.stills.length);
if (onlyStills) { await browser.close(); process.exit(); }

for (const s of TL.segments) {
  const n = nFrames(s);
  if (s.type === 'html')
    await seq(path.join(out, 'frames', s.id), n, i => call(s.scene, (s.t0 || 0) + i / FPS, s.cue ? { cue: s.cue } : {}));
  if (s.type === 'comp')
    await seq(path.join(out, 'frames', s.id + '_screen'), n, i => call(s.screen, s.screen_t0 + i / FPS));
  for (const [name, t0] of s.overlays || [])
    await seq(path.join(out, 'frames', `${s.id}_ov_${name}`), n, i => call('ov:' + name, s.start + i / FPS - t0), true);
  console.log('rendered', s.id, n);
}
const cdir = path.join(out, 'frames', 'captions'); mk(cdir);
for (const c of CAPS) {
  await page.evaluate(`window.caption(${JSON.stringify(c.html)})`);
  await page.screenshot({ path: path.join(cdir, c.id + '.png'), omitBackground: true });
}
console.log('captions', CAPS.length);
await browser.close();
