/**
 * check-frames.mjs — automated QC on the encoded file.
 *  - flags any frame that is effectively black (a dropout at a cut)
 *  - flags any frame with no content at all
 *  - reports the luma envelope so pacing can be eyeballed
 */
import sharp from 'sharp';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
// ffmpeg-static if the project has it, otherwise whatever is on PATH
let ffmpeg = 'ffmpeg';
try { ffmpeg = require('ffmpeg-static'); } catch { /* fall back to PATH */ }
const file = process.argv[2] ?? 'out/noah-pc-slowdown-short.mp4';
const every = Number(process.argv[3] ?? 2);

const dir = mkdtempSync(join(tmpdir(), 'qc-'));
execFileSync(ffmpeg, ['-y', '-v', 'error', '-i', file, '-vf', `select='not(mod(n,${every}))',scale=270:-1`, '-vsync', '0', join(dir, 'f_%04d.png')]);

const files = readdirSync(dir).sort();
const rows = [];
for (let i = 0; i < files.length; i++) {
  const { data } = await sharp(join(dir, files[i])).greyscale().raw().toBuffer({ resolveWithObject: true });
  let max = 0, sum = 0;
  for (let j = 0; j < data.length; j++) { if (data[j] > max) max = data[j]; sum += data[j]; }
  rows.push({ frame: i * every, max, mean: sum / data.length });
}
rmSync(dir, { recursive: true, force: true });

// A dropout is a frame with nothing lit at all. The scripted dark beat before
// "I stopped guessing." still carries a lit background, so it is not a dropout.
const dropouts = rows.filter((r) => r.max < 12);
const held = rows.filter((r) => r.max >= 12 && r.max < 40);
console.log(`sampled ${rows.length} frames (every ${every})`);
if (dropouts.length) {
  console.log(`FAIL: ${dropouts.length} black dropout(s):`, dropouts.map((d) => d.frame).join(', '));
} else {
  console.log('PASS: no black dropouts — every sampled frame is lit');
}
if (held.length) {
  console.log(`note: ${held.length} intentionally dark frame(s) (${held.map((d) => (d.frame / 30).toFixed(1) + 's').join(', ')})`);
}
const peak = Math.max(...rows.map((r) => r.mean));
console.log('luma envelope (mean per sample):');
rows.filter((_, i) => i % 3 === 0).forEach((r) => {
  console.log(String((r.frame / 30).toFixed(1)).padStart(5) + 's ' + '#'.repeat(Math.round((r.mean / peak) * 40)));
});
