import { staticFile, continueRender, delayRender } from 'remotion';

/**
 * Fonts are vendored under public/fonts (all three are OFL) so a render is
 * deterministic and needs no network. Loaded once at module scope.
 */
const faces = [
  // Variable, wght 200–800.
  `@font-face{font-family:'Plus Jakarta Sans';src:url('${staticFile(
    'fonts/plus-jakarta-sans-var.woff2',
  )}') format('woff2-variations');font-weight:200 800;font-style:normal;font-display:block;}`,
  // Static, italic only — the accent voice has no upright cut in this brand.
  `@font-face{font-family:'Instrument Serif';src:url('${staticFile(
    'fonts/instrument-serif-italic.woff2',
  )}') format('woff2');font-weight:400;font-style:italic;font-display:block;}`,
  // Variable, wght 100–800.
  `@font-face{font-family:'JetBrains Mono';src:url('${staticFile(
    'fonts/jetbrains-mono-var.woff2',
  )}') format('woff2-variations');font-weight:100 800;font-style:normal;font-display:block;}`,
].join('\n');

let started = false;

export const loadFonts = () => {
  if (started || typeof document === 'undefined') return;
  started = true;

  const style = document.createElement('style');
  style.textContent = faces;
  document.head.appendChild(style);

  // Hold the render until the faces are actually rasterisable, otherwise the
  // first frames go out in a fallback face.
  const handle = delayRender('Loading Noah brand fonts');
  document.fonts.ready.then(() => continueRender(handle));
};
