// Render selected frames (seconds) to a folder for review: node scripts/preview-frames.mjs out-dir 1.2 5 9.5 ...
import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';
import path from 'node:path';

const [outDir, ...secs] = process.argv.slice(2);
const browserExecutable = process.env.REMOTION_BROWSER_EXECUTABLE;
const serveUrl = await bundle({ entryPoint: path.resolve('src/index.ts') });
const comp = await selectComposition({ serveUrl, id: 'WhyIsMyPcSlow', browserExecutable });
for (const s of secs) {
  const frame = Math.min(comp.durationInFrames - 1, Math.round(Number(s) * comp.fps));
  await renderStill({ serveUrl, composition: comp, frame, output: path.join(outDir, `f-${String(s).padStart(5, '0')}.png`), browserExecutable, scale: 0.5, chromiumOptions: { gl: 'swangle' } });
  console.log('rendered', s);
}
