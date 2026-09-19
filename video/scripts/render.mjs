/**
 * render.mjs — produce the final deliverables.
 *   node scripts/render.mjs            → vertical short, H.264 + AAC
 *   node scripts/render.mjs thumbnails → the three 1080x1920 thumbnail stills
 */
import { bundle } from '@remotion/bundler';
import { renderMedia, renderStill, selectComposition } from '@remotion/renderer';
import { mkdirSync } from 'node:fs';

const BROWSER = '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
const mode = process.argv[2] ?? 'video';
mkdirSync('out', { recursive: true });

let last = -1;
const onProgress = ({ progress }) => {
  const pct = Math.floor(progress * 100);
  if (pct >= last + 5) { last = pct; process.stdout.write(`${pct}% `); }
};

console.log('bundling…');
const serveUrl = await bundle({ entryPoint: 'src/index.ts', onProgress: () => {} });

if (mode === 'thumbnails') {
  for (const [id, out] of [
    ['NoahThumbnail', 'out/noah-pc-slowdown-thumbnail.png'],
    ['NoahThumbnailB', 'out/noah-pc-slowdown-thumbnail-b.png'],
    ['NoahThumbnailC', 'out/noah-pc-slowdown-thumbnail-c.png'],
  ]) {
    const composition = await selectComposition({ serveUrl, id, inputProps: {} });
    await renderStill({
      composition, serveUrl, output: out, browserExecutable: BROWSER,
      imageFormat: 'png', chromiumOptions: { gl: 'angle' },
    });
    console.log('+', out);
  }
} else {
  const composition = await selectComposition({ serveUrl, id: 'NoahVSCodeGitShort', inputProps: {} });
  console.log(`${composition.width}x${composition.height} @ ${composition.fps}fps, ${composition.durationInFrames} frames (${(composition.durationInFrames / composition.fps).toFixed(2)}s)`);
  await renderMedia({
    composition,
    serveUrl,
    codec: 'h264',
    outputLocation: 'out/noah-pc-slowdown-short.mp4',
    browserExecutable: BROWSER,
    imageFormat: 'png',
    pixelFormat: 'yuv420p',
    crf: 15,
    audioCodec: 'aac',
    audioBitrate: '256k',
    chromiumOptions: { gl: 'angle' },
    concurrency: 3,
    onProgress,
  });
  console.log('\n+ out/noah-pc-slowdown-short.mp4');
}
