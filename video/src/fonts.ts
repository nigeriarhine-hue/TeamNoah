import {continueRender, delayRender, staticFile} from 'remotion';

const faces: [string, string, string, string][] = [
  ['Plus Jakarta Sans', 'fonts/PlusJakartaSans-var.woff2', '200 800', 'normal'],
  ['Instrument Serif', 'fonts/InstrumentSerif-400-normal.woff2', '400', 'normal'],
  ['Instrument Serif', 'fonts/InstrumentSerif-400-italic.woff2', '400', 'italic'],
];

let started = false;
export const loadFonts = () => {
  if (started || typeof document === 'undefined') return;
  started = true;
  const handle = delayRender('fonts');
  Promise.all(
    faces.map(([family, file, weight, style]) => {
      const f = new FontFace(family, `url(${staticFile(file)}) format('woff2')`, {weight, style});
      document.fonts.add(f);
      return f.load();
    }),
  )
    .then(() => continueRender(handle))
    .catch((e) => {
      console.error(e);
      continueRender(handle);
    });
};
