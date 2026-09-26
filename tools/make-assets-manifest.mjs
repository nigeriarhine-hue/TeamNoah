// Records which generated assets exist, so the edit renders (with neutral
// placeholders) before any paid generation has run.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const has = (p) => fs.existsSync(path.join(root, 'public', p)) && fs.statSync(path.join(root, 'public', p)).size > 1024;

const manifest = {
  clip1: has('ugc/ai-tech-support/clip-01-gaming-problem.mp4'),
  clip2: has('ugc/ai-tech-support/clip-02-waiting.mp4'),
  voiceover: has('audio/ai-tech-support-young-american-male.wav'),
  sfx: has('audio/sfx/sound-design.wav'),
};
fs.writeFileSync(path.join(root, 'src/assets.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log(manifest);
