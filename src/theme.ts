// Noah brand tokens. The UGC half of this video deliberately does NOT use these —
// only the product/CTA half lets Noah's real dark interface become the visual identity.
export const noah = {
  navy: '#1A1D61',
  deepNavy: '#0B1024',
  tideBlue: '#2563EB',
  tideViolet: '#7C3AED',
  indigo: '#4F46E5',
  periwinkle: '#C7CBFF',
  uiBg: '#14171C',
  uiPanel: '#1A1D23',
  uiEdge: '#21252C',
  textMuted: '#B4BCC8',
  textDim: '#7A8290',
  white: '#FFFFFF',
  amber: '#F59E0B',
  teal: '#14B8A6',
} as const;

export const tide = `linear-gradient(90deg, ${noah.tideBlue} 0%, ${noah.indigo} 50%, ${noah.tideViolet} 100%)`;

// Native-Shorts caption stack: system UI faces, heavy weights, tight tracking.
export const fontStack =
  '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

export const VIDEO = {
  width: 1080,
  height: 1920,
  fps: 30,
} as const;
