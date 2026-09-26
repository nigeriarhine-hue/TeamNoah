/** Noah brand tokens (from brand-kit.html) + this film's layout constants. */

export const FPS = 30;
export const W = 1080;
export const H = 1920;
export const DURATION = 450; // 15.0s

export const color = {
  night: '#0B1024',
  structure: '#1A1D61',
  ink: '#EBEDF2',
  cream: '#ECE8DF',
  litHorizon: '#C7CBFF',
  commit: '#14B8A6',
  amber: '#F59E0B',
  auroraA: '#5B9BD5',
  auroraB: '#6366F1',
  auroraC: '#8B5CF6',
} as const;

export const AURORA = `linear-gradient(100deg, ${color.auroraA} 0%, ${color.auroraB} 52%, ${color.auroraC} 100%)`;

export const font = {
  sans: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
  serif: "'Instrument Serif', Georgia, serif",
} as const;

/** Mobile-safe insets — keeps text clear of TikTok / Shorts chrome. */
export const SAFE = { top: 180, bottom: 300, side: 72 } as const;

/** Every cue in the film, in seconds. Single source of truth for the edit. */
export const T = {
  clip1: [0.0, 2.95],
  clip2: [2.95, 5.0],
  uiProblem: [5.0, 6.15],
  uiDiagnosis: [6.15, 8.2],
  uiPlan: [8.2, 9.95],
  uiApproval: [9.95, 13.2],
  uiAction: [13.2, 13.72],
  uiResult: [13.72, 14.3],
  cta: [14.3, 15.0],
} as const;

export const CLICK_AT = 12.45; // cursor lands on "Go ahead"

export const sec = (s: number) => Math.round(s * FPS);
