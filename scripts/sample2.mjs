import sharp from 'sharp';
const files = {
  '01': 'public/noah-ui/01-problem.jpg',
  '02': 'public/noah-ui/02-diagnosis.jpg',
  '03': 'public/noah-ui/03-approval-action.jpg',
};
const hex = (n) => n.toString(16).padStart(2, '0');
for (const [k, f] of Object.entries(files)) {
  const {data, info} = await sharp(f).raw().toBuffer({resolveWithObject: true});
  for (const [name, x, y] of [['chrome-bg', 900, 12], ['chrome-bg2', 1150, 26], ['chrome-bg3', 700, 8]]) {
    const i = (y * info.width + x) * info.channels;
    console.log(`${k} ${name.padEnd(11)} #${hex(data[i])}${hex(data[i+1])}${hex(data[i+2])}`);
  }
}
