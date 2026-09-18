/**
 * Noah brand tokens.
 *
 * Every value here comes from the canonical brand kit (`brand-kit.html`,
 * generated from noah-os/brain/BRAND.md). Don't invent colours or type here —
 * change the brand kit, then mirror it.
 */

export const colors = {
  /** Structure. The navy the mark is drawn in. */
  navy: '#1A1D61',
  /** Aurora tide — reserved for the ONE thing to do next. Never wallpaper. */
  auroraFrom: '#2563EB',
  auroraTo: '#7C3AED',
  /** Night. Dark ground. */
  night: '#0B1024',
  /** Lit horizon. Light text/accent on night. */
  litHorizon: '#C7CBFF',
  /** Page cream. Light ground. */
  cream: '#ECE8DF',
  /** Warm ink. Text on cream. */
  warmInk: '#2A251F',
  /** Commit teal — marks a confirmation. Meaning-bearing, never decorative. */
  teal: '#0D9488',
  /** Amber — marks a caution. Meaning-bearing, never decorative. */
  amber: '#D97706',

  white: '#FFFFFF',
} as const;

export const aurora = `linear-gradient(100deg, ${colors.auroraFrom} 0%, ${colors.auroraTo} 100%)`;

/**
 * Night-surface greys, derived from `night` so the Noah macOS window reads as
 * one material rather than a pile of unrelated greys.
 */
export const surface = {
  /** Window chrome / title bar. */
  chrome: '#141A32',
  /** Window body. */
  body: '#0E1428',
  /** Raised card inside the window. */
  card: '#182041',
  /** Card on card. */
  cardHi: '#1F2850',
  /** Hairline borders. */
  line: 'rgba(199, 203, 255, 0.14)',
  lineStrong: 'rgba(199, 203, 255, 0.26)',
  /** Body copy inside the app. */
  text: '#E8EAFB',
  textDim: '#9BA3D4',
  textFaint: '#6B74A8',
} as const;

export const fonts = {
  /** Headlines. Always 700, tracking −0.035em. */
  sans: '"Plus Jakarta Sans", system-ui, -apple-system, sans-serif',
  /** Accent voice only — never a headline. */
  serif: '"Instrument Serif", Georgia, serif',
  /** Machine voice: paths, commands, process names. */
  mono: '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace',
} as const;

/** The brand's headline tracking. Non-negotiable at display sizes. */
export const HEADLINE_TRACKING = '-0.035em';

/** 1080x1920 is the canvas; keep everything meaningful inside this gutter. */
export const SAFE = {
  x: 84,
  /** TikTok/Shorts chrome eats the top ~180px and the bottom ~420px. */
  top: 210,
  bottom: 430,
} as const;
