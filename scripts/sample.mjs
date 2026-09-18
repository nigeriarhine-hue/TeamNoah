import sharp from 'sharp';
const pts = {
  '02-panel-bg':        ['02', 1040, 250],
  '02-panel-bg2':       ['02',  420, 280],
  '02-tile-bg':         ['02',  520, 420],
  '02-tile-bg2':        ['02',  700, 330],
  '02-bodytext':        ['02',  409, 173],
  '02-wouldo-bg':       ['02',  950, 650],
  '02-sub-bg':          ['02',  900, 543],
  '01-bubble-bg':       ['01', 1120,  70],
  '01-bubble-bg2':      ['01',  950, 100],
  '01-list-bg':         ['01', 1050, 195],
  '01-list-bg2':        ['01',  420, 240],
  '03-bubble-bg':       ['03', 1110, 620],
  '03-bubble-bg2':      ['03',  650, 660],
  '03-tile-bg':         ['03',  520, 165],
  '03-tile-bg2':        ['03',  700,  80],
  '03-wouldo-bg':       ['03',  950, 395],
  '03-sub-bg':          ['03',  900, 289],
  '03-action-bg':       ['03',  900, 838],
};
const files = {
  '01': 'public/noah-ui/01-problem.jpg',
  '02': 'public/noah-ui/02-diagnosis.jpg',
  '03': 'public/noah-ui/03-approval-action.jpg',
};
const cache = {};
for (const k of Object.keys(files)) {
  cache[k] = await sharp(files[k]).raw().toBuffer({resolveWithObject: true});
}
const hex = (n) => n.toString(16).padStart(2, '0');
for (const [name, [f, x, y]] of Object.entries(pts)) {
  const {data, info} = cache[f];
  const i = (y * info.width + x) * info.channels;
  console.log(`${name.padEnd(18)} #${hex(data[i])}${hex(data[i+1])}${hex(data[i+2])}`);
}
