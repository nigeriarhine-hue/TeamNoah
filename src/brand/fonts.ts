import {continueRender, delayRender, staticFile} from 'remotion';

let loaded = false;

// Load the Noah brand fonts from public/ (extracted from the official brand kit).
export const loadBrandFonts = () => {
  if (loaded || typeof document === 'undefined') return;
  loaded = true;
  const handle = delayRender('brand-fonts');
  const faces = [
    new FontFace('Plus Jakarta Sans', `url(${staticFile('fonts/PlusJakartaSans.woff2')}) format('woff2')`, {
      weight: '100 900',
    }),
    new FontFace('Instrument Serif', `url(${staticFile('fonts/InstrumentSerif.woff2')}) format('woff2')`, {
      style: 'normal',
    }),
  ];
  Promise.all(faces.map((f) => f.load()))
    .then((fs) => {
      fs.forEach((f) => (document.fonts as unknown as {add: (f: FontFace) => void}).add(f));
      continueRender(handle);
    })
    .catch((e) => {
      console.error('font load failed', e);
      continueRender(handle);
    });
};
