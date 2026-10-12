/**
 * PC CHECK 101 — the educational series look.
 *
 * Built to be reused by future Noah explainer videos: change the episode
 * content, keep these tokens. Light, neutral "tech publication" surfaces for
 * teaching; the dark product palette only appears once the product does.
 * The accent gradient is the Noah blue→violet tide, used sparingly as an
 * editorial accent rather than as branding.
 */
export const edu = {
  bg: '#F3F4F8',
  bg2: '#E8EAF2',
  card: '#FFFFFF',
  line: '#DCDFE9',
  lineSoft: '#E7E9F0',
  ink: '#0E1222',
  ink2: '#454B63',
  ink3: '#80869C',
  accent: '#4F5BEA',
  accent2: '#7C5CF0',
  accentSoft: '#E9EAFD',
  amber: '#E39410',
  amberSoft: '#FDF2DC',
  red: '#E0454B',
  redSoft: '#FCE6E7',
  green: '#16A574',
  greenSoft: '#DDF5EC',
  dark: '#0B0C12',
  dark2: '#14151E',
  grad: 'linear-gradient(90deg,#3F7FD8 0%,#6F6AE6 50%,#A855F7 100%)',
  gradText: 'linear-gradient(100deg,#3F6FE0 0%,#6461EA 45%,#9B55F5 100%)',
} as const;

export const SERIES = 'PC CHECK 101';

export const FONT = "'Figtree', system-ui, sans-serif";

/** Phone safe area for 9:16 (TikTok / Shorts chrome). */
export const SAFE = { top: 190, bottom: 1500, left: 64, right: 1016 } as const;
