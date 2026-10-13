// Noah "Aurora" tokens (brand-kit.html) used across the shorts.
export const colors = {
  bg: '#0B1024',
  bgDeep: '#070A18',
  navy: '#1A1D61',
  indigo: '#6366F1',
  violet: '#8B5CF6',
  blue: '#5B8DEF',
  lilac: '#C7CBFF',
  text: '#F4F6FF',
  textDim: 'rgba(228, 232, 255, 0.72)',
  // Noah desktop app surfaces (sampled from the real screenshots)
  appBg: 'rgb(26, 30, 33)',
  appInput: 'rgb(32, 37, 41)',
  appBubble: 'rgb(50, 56, 70)',
  appText: 'rgb(231, 234, 238)',
};

export const accentGradient = `linear-gradient(92deg, #7FA6FF 0%, ${colors.indigo} 48%, #A78BFA 100%)`;

export const fonts = {
  // Brand sans for everything we design.
  sans: "'Plus Jakarta Sans', 'Inter', system-ui, sans-serif",
  // The Windows app renders in a Segoe-style sans; Inter is the closest match
  // for text we composite into the genuine UI (the typed question).
  ui: "'Inter', 'Segoe UI', system-ui, sans-serif",
};
