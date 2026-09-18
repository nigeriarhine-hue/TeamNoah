// Records which generated UGC assets are actually present, so the composition
// degrades to the locked reference still instead of failing on a missing file.
import {existsSync, writeFileSync} from 'node:fs';

const base = 'public/ugc/mac-list/';
const assets = {
  reference: existsSync(base + 'video3-reference.png'),
  clipA: existsSync(base + 'video3-list-a.mp4'),
  clipB: existsSync(base + 'video3-list-b.mp4'),
};
writeFileSync('src/assets.json', JSON.stringify(assets, null, 2) + '\n');
console.log('assets:', assets);
