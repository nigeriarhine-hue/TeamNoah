import { continueRender, delayRender, staticFile } from 'remotion';
import faces from './font-faces.json';

/**
 * Brand typefaces, served from public/ and injected at runtime so the bundler
 * never tries to resolve the font URLs itself. Remotion captures frames as
 * soon as React commits, so the frame is held until the faces are ready —
 * otherwise a fallback face gets baked into the render.
 */
const css = faces
  .map(
    (f) => `@font-face{font-family:'${f.family}';font-style:${f.style};font-weight:${f.weight};font-display:block;src:url(${staticFile(
      'fonts/' + f.file,
    )}) format('woff2');${f.range ? `unicode-range:${f.range};` : ''}}`,
  )
  .join('\n');

const style = document.createElement('style');
style.textContent = css;
document.head.appendChild(style);

const handle = delayRender('Loading brand typefaces');

const probes = [
  '400 48px "Plus Jakarta Sans"',
  '500 48px "Plus Jakarta Sans"',
  '600 48px "Plus Jakarta Sans"',
  '700 48px "Plus Jakarta Sans"',
  '800 48px "Plus Jakarta Sans"',
  'italic 48px "Instrument Serif"',
];

Promise.all(probes.map((p) => document.fonts.load(p, 'AaGgQq0123')))
  .then(() => document.fonts.ready)
  .then(() => continueRender(handle))
  .catch(() => continueRender(handle));
