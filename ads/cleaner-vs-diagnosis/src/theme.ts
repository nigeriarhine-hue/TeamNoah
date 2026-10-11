/**
 * Noah design tokens, lifted from the real Noah UI
 * (ugc/pc-gaming-fps/noah-ui-source.html, itself rebuilt from the product
 * screenshots IMG_0583-0595). Do not invent new Noah colours here - if the
 * product gains a token, copy it across rather than guessing.
 */
export const noah = {
  bg: '#0f0f15',
  side: '#0c0c11',
  titlebar: '#0a0a0e',
  card: '#15151d',
  cardLine: '#23232e',
  tile: '#181820',
  tileLine: '#262631',
  txt: '#e9e9f2',
  txt2: '#9a9aae',
  txt3: '#76768a',
  label: '#74748c',
  amber: '#f0b429',
  green: '#34d9a0',
  purple: '#8b5cf6',
  blue: '#5b9bd5',
  indigo: '#6d6ae0',
  indigoSoft: '#9a97f5',
  accentGrad: 'linear-gradient(90deg,#3f7fd8 0%,#6f6ae6 50%,#a855f7 100%)',
  ctaGrad: 'linear-gradient(90deg,#5c93d8 0%,#7b76e8 48%,#a855f7 100%)',
  doneGrad: 'linear-gradient(90deg,#1f9c7a 0%,#2fcf98 55%,#3ee0a4 100%)',
} as const;

/**
 * The generic cleaner side. Deliberately NOT Noah and deliberately not modelled
 * on any shipping product - a flat, bright, busy utility look that reads as
 * "clean everything" without borrowing anyone's interface.
 */
export const cleaner = {
  bg: '#eef1f6',
  panel: '#ffffff',
  line: '#d8dee8',
  txt: '#1d2430',
  txt2: '#67728a',
  accent: '#2f9be8',
  accent2: '#19c37d',
  warn: '#f0a52a',
  barTrack: '#e3e8f0',
} as const;

export const FPS = 30;
export const W = 1080;
export const H = 1920;
export const DURATION = 600; // 20s

/** Beat map, in seconds, matching the brief's structure. */
export const beats = {
  hook: [0, 2.5],
  cleaner: [2.5, 6],
  noahCheck: [6, 10],
  finding: [10, 13],
  plan: [13, 16],
  approval: [16, 18.5],
  cta: [18.5, 20],
} as const;

export const sec = (s: number) => Math.round(s * FPS);
