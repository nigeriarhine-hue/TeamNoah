import { continueRender, delayRender, staticFile } from 'remotion';

const handle = delayRender('Loading brand fonts');

const jakarta = new FontFace(
  'Plus Jakarta Sans',
  `url(${staticFile('fonts/plus-jakarta-sans-var.woff2')}) format('woff2')`,
  { weight: '200 800' },
);
const instrument = new FontFace(
  'Instrument Serif',
  `url(${staticFile('fonts/instrument-serif-400-italic.woff2')}) format('woff2')`,
  { style: 'italic', weight: '400' },
);

Promise.all([jakarta.load(), instrument.load()])
  .then((loaded) => {
    // FontFaceSet.add is missing from the bundled DOM lib typings.
    loaded.forEach((f) => (document.fonts as unknown as Set<FontFace>).add(f));
    continueRender(handle);
  })
  .catch(() => continueRender(handle));
