// Noah educational-series design tokens (light, consumer-tech look).
// Accent values come from the Noah brand kit (Aurora gradient, navy mark, commit teal, amber).
export const FPS = 30;
export const sec = (s: number) => Math.round(s * FPS);

export const C = {
  page: '#F4F5F9',
  page2: '#FFFFFF',
  page3: '#E9EBF2',
  ink: '#12142A',
  ink2: '#3A3F57',
  mute: '#6B7089',
  line: 'rgba(18,20,42,0.09)',
  line2: 'rgba(18,20,42,0.16)',
  navy: '#1A1D61',
  dark: '#0B1024',
  dark2: '#141A35',
  blue: '#2563EB',
  indigo: '#4F46E5',
  violet: '#7C3AED',
  blueSoft: 'rgba(37,99,235,0.10)',
  violetSoft: 'rgba(124,58,237,0.10)',
  success: '#0E9F6E',
  successSoft: 'rgba(14,159,110,0.12)',
  amber: '#D97706',
  amberSoft: 'rgba(217,119,6,0.12)',
  // lighter accent for text on dark
  blueLight: '#8DB2FF',
  violetLight: '#BBA2FF',
};

export const AURORA = 'linear-gradient(135deg,#2563EB 0%,#4F46E5 50%,#7C3AED 100%)';
export const AURORA_LIGHT = 'linear-gradient(135deg,#8DB2FF 0%,#A5A1FF 50%,#C3A6FF 100%)';

export const FONT = "'Plus Jakarta Sans', -apple-system, 'Segoe UI', sans-serif";
export const SERIF = "'Instrument Serif', Georgia, serif";
export const MONO = "ui-monospace, 'JetBrains Mono', Menlo, monospace";

export const SHADOW =
  '0 2px 4px rgba(15,23,41,0.05), 0 18px 48px -18px rgba(15,23,41,0.28)';
