import sharp from 'sharp';
import { readdirSync } from 'node:fs';
const dir = process.argv[2] ?? 'out/qc';
const outBase = process.argv[3] ?? '/tmp/claude-0/-home-user-TeamNoah/da2c5c73-831e-5bf1-b9bf-212dd4893954/scratchpad/qc';
const files = readdirSync(dir).filter((f) => f.endsWith('.png')).sort();
const TW = 250, TH = Math.round((250 * 1920) / 1080), cols = 7, per = cols * 3;
for (let c = 0; c * per < files.length; c++) {
  const chunk = files.slice(c * per, (c + 1) * per);
  const rows = Math.ceil(chunk.length / cols);
  const comps = [];
  for (let i = 0; i < chunk.length; i++) {
    const buf = await sharp(`${dir}/${chunk[i]}`).resize(TW, TH)
      .extend({ top: 2, bottom: 20, left: 2, right: 2, background: '#333' }).png().toBuffer();
    comps.push({ input: buf, left: (i % cols) * (TW + 6), top: Math.floor(i / cols) * (TH + 26) });
  }
  await sharp({ create: { width: cols * (TW + 6), height: rows * (TH + 26), channels: 3, background: '#101010' } })
    .composite(comps).png().toFile(`${outBase}${c}.png`);
  console.log(`${outBase}${c}.png`, chunk.join(' '));
}
