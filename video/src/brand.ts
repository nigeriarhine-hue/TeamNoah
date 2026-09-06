/**
 * Noah brand tokens — the Aurora system (screen surface).
 * Source of truth: brand-kit.html at the repo root. Don't invent values here.
 *
 * Two colours carry meaning and must never be used decoratively:
 *   teal  — a confirmation: something succeeded, something is safe
 *   amber — a caution
 * The aurora gradient is reserved for the one thing to do next: the primary
 * action, or the phrase the whole frame turns on. The moment it becomes
 * wallpaper it stops meaning anything.
 */
export const color = {
  structure: '#1A1D61',
  auroraFrom: '#2563EB',
  auroraTo: '#7C3AED',
  night: '#0B1024',
  litHorizon: '#C7CBFF',
  cream: '#ECE8DF',
  ink: '#2A251F',
  teal: '#0D9488',
  amber: '#D97706',
} as const;

export const aurora = `linear-gradient(135deg, ${color.auroraFrom} 0%, ${color.auroraTo} 100%)`;

/** Ink at reduced presence. The kit ships one ink; these are its quiet registers. */
export const inkMuted = 'rgba(42, 37, 31, 0.62)';
export const inkFaint = 'rgba(42, 37, 31, 0.34)';
export const rule = 'rgba(42, 37, 31, 0.14)';

export const font = {
  /** Headlines. Always paired with tracking below. */
  sans: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
  /** Accent voice only — never a headline. */
  serif: "'Instrument Serif', Georgia, serif",
  /** Machine voice: paths, commands, timings. */
  mono: "'JetBrains Mono', ui-monospace, SFMono-Regular, monospace",
} as const;

/** Headline tracking is part of the typeface spec, not a per-use choice. */
export const headlineTracking = '-0.035em';

/** Soft cards, 12px radii, low shadows. */
export const card = {
  radius: 12,
  shadow: '0 1px 2px rgba(42,37,31,0.04), 0 8px 24px rgba(42,37,31,0.06)',
  surface: '#F5F2EC',
} as const;
