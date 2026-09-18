import {continueRender, delayRender, staticFile} from 'remotion';

/**
 * The three brand faces, served from `public/fonts` so a render never depends
 * on the network. Plus Jakarta Sans and JetBrains Mono are variable fonts, so
 * one file covers every weight we use.
 */
const FACES: {family: string; file: string; weight: string; style: string}[] = [
  {
    family: 'Plus Jakarta Sans',
    file: 'fonts/PlusJakartaSans-Variable.woff2',
    weight: '200 800',
    style: 'normal',
  },
  {
    family: 'Instrument Serif',
    file: 'fonts/InstrumentSerif-Regular.woff2',
    weight: '400',
    style: 'normal',
  },
  {
    family: 'Instrument Serif',
    file: 'fonts/InstrumentSerif-Italic.woff2',
    weight: '400',
    style: 'italic',
  },
  {
    family: 'JetBrains Mono',
    file: 'fonts/JetBrainsMono-Variable.woff2',
    weight: '100 800',
    style: 'normal',
  },
];

let started = false;

/**
 * Blocks the render until every brand face is actually usable. Without this,
 * early frames render in a fallback face and the headline tracking jumps.
 */
export const loadBrandFonts = () => {
  if (started) {
    return;
  }
  started = true;

  const handle = delayRender('Loading Noah brand fonts');

  Promise.all(
    FACES.map(async ({family, file, weight, style}) => {
      const face = new FontFace(family, `url(${staticFile(file)}) format("woff2")`, {
        weight,
        style,
        display: 'block',
      });
      await face.load();
      document.fonts.add(face);
    }),
  )
    .then(() => continueRender(handle))
    .catch((err) => {
      // Fail loudly: a silent fallback face would ship a typographically wrong ad.
      throw new Error(`Could not load Noah brand fonts: ${(err as Error).message}`);
    });
};
