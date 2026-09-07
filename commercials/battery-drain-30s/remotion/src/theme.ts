/**
 * Noah Aurora "Lantern" (dark) tokens — copied from brand-kit.html.
 * The film is at night and the app is in dark mode, so only the dark set is here.
 *
 * Three of these carry meaning and must never be used decoratively:
 *   aurora  — reserved for THE ONE THING TO DO NEXT. Twice in 34 seconds:
 *             the APPROVE button (UI-07) and the words "Approve it." (UI-10).
 *   commit  — confirmation only. Something succeeded, something is safe.
 *   amber   — caution only.
 */
export const t = {
  page: '#14171C',
  page2: '#1A1D23',
  page3: '#21252C',
  night: '#0B1024',
  structure: '#1A1D61',
  horizon: '#C7CBFF',

  ink: '#EBEDF2',
  ink2: '#B4BCC8',
  mute: '#7A8290',

  line: 'rgba(255,255,255,.08)',
  line2: 'rgba(255,255,255,.12)',

  aurora: 'linear-gradient(135deg,#5B9BD5 0%,#6366F1 50%,#8B5CF6 100%)',
  blue: '#5B9BD5',
  indigo: '#6366F1',
  violet: '#8B5CF6',

  commit: '#14B8A6',
  amber: '#F59E0B',
} as const;

export const font = {
  sans: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  serif: "'Instrument Serif', Georgia, serif",
  mono: "ui-monospace, SFMono-Regular, 'JetBrains Mono', Menlo, monospace",
} as const;

/** The desktop canvas is 2560x1600 — 16:10, a MacBook's aspect, so it maps onto the
 *  plate without distortion. All values below are canvas px (= brand web px x2). */
export const SCREEN = {width: 2560, height: 1600} as const;
export const FPS = 24;
