import sharp from 'sharp';
// Brightest pixel inside a text box approximates the glyph colour.
const boxes = {
  '02 body line1':      ['02', 400, 158, 600, 32],
  '02 tile label':      ['02', 424, 345, 120, 18],
  '02 tile value':      ['02', 598, 366, 130, 26],
  '02 tile sub':        ['02', 424, 395, 130, 20],
  '02 item title':      ['02', 447, 503, 420, 28],
  '02 item sub':        ['02', 447, 532, 410, 24],
  '01 bubble text':     ['01', 955,  68, 160, 30],
  '01 list text':       ['01', 429, 183, 510, 26],
  '03 tile label':      ['03', 424,  90, 120, 18],
  '03 tile sub':        ['03', 943, 143, 130, 20],
  '03 item title':      ['03', 447, 248, 420, 28],
  '03 item sub':        ['03', 447, 278, 410, 24],
  '03 bubble text':     ['03', 648, 625, 450, 28],
  '03 action text':     ['03', 429, 825, 290, 28],
};
const files = {
  '01': 'public/noah-ui/01-problem.jpg',
  '02': 'public/noah-ui/02-diagnosis.jpg',
  '03': 'public/noah-ui/03-approval-action.jpg',
};
const cache = {};
for (const k of Object.keys(files)) cache[k] = await sharp(files[k]).raw().toBuffer({resolveWithObject: true});
const hex = (n) => n.toString(16).padStart(2, '0');
for (const [name, [f, x, y, w, h]] of Object.entries(boxes)) {
  const {data, info} = cache[f];
  let best = -1, br = 0, bg = 0, bb = 0;
  for (let yy = y; yy < y + h; yy++) {
    for (let xx = x; xx < x + w; xx++) {
      const i = (yy * info.width + xx) * info.channels;
      const lum = 0.2126 * data[i] + 0.7152 * data[i+1] + 0.0722 * data[i+2];
      if (lum > best) { best = lum; br = data[i]; bg = data[i+1]; bb = data[i+2]; }
    }
  }
  console.log(`${name.padEnd(18)} #${hex(br)}${hex(bg)}${hex(bb)}  lum=${best.toFixed(0)}`);
}
