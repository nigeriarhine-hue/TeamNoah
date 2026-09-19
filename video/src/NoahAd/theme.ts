/**
 * Noah ad design system.
 * Colour tokens mirror the dark theme in ../../brand-kit.html so the film and the
 * product read as the same brand. Do not invent new brand colours here.
 */
export const theme = {
  // Environment — deeper than the product's --page so UI panels read as lit objects
  bg: '#080A11',
  bgLift: '#0E1118',
  panel: '#14171C',

  ink: '#EBEDF2',
  inkDim: '#B4BCC8',
  mute: '#7A8290',
  line: 'rgba(255,255,255,0.08)',

  blue: '#5B9BD5',
  indigo: '#6366F1',
  violet: '#8B5CF6',
  navy: '#1A1D61',
  navyDeep: '#0B1024',

  teal: '#14B8A6',
  amber: '#F59E0B',
  logoStroke: '#C7CBFF',

  aurora: 'linear-gradient(135deg,#5B9BD5 0%,#6366F1 50%,#8B5CF6 100%)',
} as const;

export const font = {
  sans: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  mono: "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
  serif: "'Instrument Serif', Georgia, serif",
} as const;

/** 1080x1920 mobile-safe area (§15 of the brief). */
export const safe = {
  x: 90,
  top: 160,
  bottom: 250,
  get width() {
    return 1080 - this.x * 2;
  },
} as const;

export const VIDEO = { width: 1080, height: 1920, fps: 30 } as const;

export { grid, headlineH, stack } from './layout';
