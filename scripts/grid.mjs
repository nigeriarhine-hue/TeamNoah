// Overlays a labelled 100px coordinate grid so patch boxes can be placed
// against the real screenshots instead of guessed.
import sharp from 'sharp';

const [src, out] = process.argv.slice(2);
const img = sharp(src);
const {width: w, height: h} = await img.metadata();

let lines = '';
for (let x = 0; x <= w; x += 100) {
  lines += `<line x1="${x}" y1="0" x2="${x}" y2="${h}" stroke="#00FF88" stroke-width="1" opacity="0.55"/>`;
  lines += `<text x="${x + 3}" y="14" fill="#00FF88" font-size="13" font-family="monospace">${x}</text>`;
}
for (let y = 0; y <= h; y += 100) {
  lines += `<line x1="0" y1="${y}" x2="${w}" y2="${y}" stroke="#00FF88" stroke-width="1" opacity="0.55"/>`;
  lines += `<text x="2" y="${y - 3}" fill="#FF3B8D" font-size="13" font-family="monospace">${y}</text>`;
}
const svg = Buffer.from(`<svg width="${w}" height="${h}">${lines}</svg>`);
await img.composite([{input: svg}]).png().toFile(out);
console.log(`${src} -> ${out}  (${w}x${h})`);
