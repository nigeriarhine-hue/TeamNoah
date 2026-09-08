import {continueRender, delayRender, staticFile} from 'remotion';

/**
 * The brand faces are vendored into public/fonts (latin + latin-ext subsets) so a
 * render never depends on a network round-trip. Injected once, then the render is
 * held until the faces are actually rasterisable.
 */
const FACES: {file: string; family: string; weight: number; style: string}[] = [
  ...[400, 500, 600, 700, 800].flatMap((w) =>
    ['latin', 'latin-ext'].map((s) => ({
      file: `PlusJakartaSans-${w}-normal-${s}.woff2`,
      family: 'Plus Jakarta Sans',
      weight: w,
      style: 'normal',
    })),
  ),
  ...['latin', 'latin-ext'].map((s) => ({
    file: `InstrumentSerif-400-italic-${s}.woff2`,
    family: 'Instrument Serif',
    weight: 400,
    style: 'italic',
  })),
  ...[400, 500].flatMap((w) =>
    ['latin', 'latin-ext'].map((s) => ({
      file: `JetBrainsMono-${w}-normal-${s}.woff2`,
      family: 'JetBrains Mono',
      weight: w,
      style: 'normal',
    })),
  ),
];

let injected = false;

export const loadFonts = () => {
  if (injected || typeof document === 'undefined') return;
  injected = true;

  const style = document.createElement('style');
  style.textContent = FACES.map(
    (f) => `@font-face{font-family:'${f.family}';font-style:${f.style};font-weight:${f.weight};font-display:block;src:url(${staticFile(
      `fonts/${f.file}`,
    )}) format('woff2');}`,
  ).join('\n');
  document.head.appendChild(style);

  const handle = delayRender('Loading Noah brand fonts');
  Promise.all(
    [
      "700 80px 'Plus Jakarta Sans'",
      "500 40px 'Plus Jakarta Sans'",
      "italic 400 60px 'Instrument Serif'",
      "400 30px 'JetBrains Mono'",
    ].map((f) => document.fonts.load(f, 'Noah 0123456789')),
  )
    .then(() => document.fonts.ready)
    .then(() => continueRender(handle))
    .catch(() => continueRender(handle));
};
