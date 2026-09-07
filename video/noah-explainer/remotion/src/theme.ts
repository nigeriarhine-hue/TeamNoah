// Tokens transcribed from brand-kit.html. Do not invent colours here:
// the kit is explicit that teal, amber and the aurora gradient carry meaning.
export const C = {
  page: '#ECE8DF',        // page cream — the screen ground
  ink: '#2A251F',         // warm ink
  mute: 'rgba(60,50,40,0.6)',
  line: 'rgba(60,50,40,0.10)',
  card: '#F4F0E6',
  navy: '#1A1D61',
  night: '#0B1024',
  litHorizon: '#C7CBFF',
  commit: '#0D9488',      // teal — confirmation ONLY
  amber: '#D97706',       // amber — caution ONLY
} as const;

// Reserved for the one thing to do next. Never wallpaper.
export const AURORA = 'linear-gradient(135deg,#2563EB 0%,#4F46E5 50%,#7C3AED 100%)';

export const SANS = '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
export const SERIF = '"Instrument Serif", Georgia, serif';
export const MONO = 'ui-monospace, SFMono-Regular, "JetBrains Mono", Menlo, monospace';

// Headlines are 700 at -0.035em tracking, per the kit.
export const headline = (size: number) => ({
  fontFamily: SANS,
  fontWeight: 700,
  fontSize: size,
  letterSpacing: '-0.035em',
  color: C.ink,
} as const);

export const FPS = 30;
export const SCENE_FRAMES = 300; // 10s blocks, matching the locked script
export const WATERLINE_Y = 726;  // the level line, held constant in every scene
