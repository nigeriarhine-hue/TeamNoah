import { continueRender, delayRender, staticFile } from 'remotion';

// Brand font (Plus Jakarta Sans, OFL) bundled locally so renders work offline.
export const FONT = "'Plus Jakarta Sans', 'Segoe UI', sans-serif";

const faces = [
  new FontFace('Plus Jakarta Sans', `url(${staticFile('fonts/PlusJakartaSans-latin.woff2')}) format('woff2')`, {
    weight: '400 800',
    style: 'normal',
  }),
  new FontFace('Plus Jakarta Sans', `url(${staticFile('fonts/PlusJakartaSans-Italic-latin.woff2')}) format('woff2')`, {
    weight: '700 800',
    style: 'italic',
  }),
];
const handle = delayRender('Loading Plus Jakarta Sans', { timeoutInMilliseconds: 120000, retries: 2 });
Promise.all(faces.map((ff) => ff.load()))
  .then((loaded) => {
    loaded.forEach((ff) => document.fonts.add(ff));
    continueRender(handle);
  })
  .catch((err) => {
    console.error(err);
    continueRender(handle);
  });

// Brand colours from brand-kit.html + brand-pack/README.md
export const C = {
  navy: '#1A1D61',
  blue: '#2563EB',
  indigo: '#4F46E5',
  violet: '#7C3AED',
  violetSoft: '#8B5CF6',
  teal: '#0D9488',
  tealBright: '#14B8A6',
  amber: '#D97706',
  red: '#E5484D',
  ink: '#1B1F3B',
  ink2: '#4A5068',
  mute: '#7A8290',
  line: '#E6E8F0',
  panel: '#FFFFFF',
  rail: '#F6F7FB',
  night: '#070913',
};

export const GRAD = `linear-gradient(90deg, ${C.blue}, ${C.violet})`;
export const GRAD_TEXT = 'linear-gradient(95deg, #8FA8FF 0%, #A78BFA 55%, #C4B5FD 100%)';
