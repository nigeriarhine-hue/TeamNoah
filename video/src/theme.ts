/**
 * Noah brand tokens — the dark surface ("Lantern").
 * Source of truth: brand-kit.html at the repo root, which paints its own dark
 * surfaces #0B1024 and draws the mark in lit horizon #C7CBFF.
 *
 * Two colours carry meaning and must never be used decoratively:
 *   teal  = something succeeded / is safe
 *   amber = a caution
 * The aurora gradient is reserved for the one thing to do next.
 *
 * Dark is not an inversion of the light system. Teal and amber are stepped up to
 * their dark-surface values (both already used by the brand kit) so they clear
 * 3:1 against night; the light-surface steps go muddy here.
 */
export const c = {
  night: '#0B1024',
  nightDeep: '#070B18',
  surface: '#131A33',
  surfaceHi: '#182046',
  structure: '#1A1D61',
  litHorizon: '#C7CBFF',
  auroraFrom: '#2563EB',
  auroraTo: '#7C3AED',
  cream: '#ECE8DF',
  teal: '#14B8A6',
  amber: '#F59E0B',
  white: '#FFFFFF',
} as const;

/** Ink on night. Cream is the primary ink — it is a brand token, not a grey. */
export const ink = {
  primary: c.cream,
  secondary: 'rgba(236,232,223,0.70)',
  muted: 'rgba(236,232,223,0.45)',
  hairline: 'rgba(199,203,255,0.15)',
  grid: 'rgba(199,203,255,0.11)',
} as const;

export const aurora = `linear-gradient(96deg, ${c.auroraFrom} 0%, ${c.auroraTo} 100%)`;

export const font = {
  display: "'Plus Jakarta Sans', system-ui, sans-serif",
  body: "'Plus Jakarta Sans', system-ui, sans-serif",
  accent: "'Instrument Serif', Georgia, serif",
  mono: "'JetBrains Mono', ui-monospace, monospace",
} as const;

/** Headline tracking is part of the identity: −0.035em. */
export const displayTracking = '-0.035em';

export const card = {
  radius: 12,
  background: c.surface,
  border: `1px solid ${ink.hairline}`,
  shadow: '0 1px 0 rgba(199,203,255,0.06) inset, 0 24px 60px -30px rgba(0,0,0,0.85)',
} as const;
