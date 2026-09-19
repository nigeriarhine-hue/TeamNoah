import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { theme } from '../theme';

type Mood = 'quiet' | 'tense' | 'warm' | 'resolve' | 'brand';

const MOODS: Record<Mood, { a: string; b: string; strength: number }> = {
  quiet: { a: 'rgba(99,102,241,0.16)', b: 'rgba(91,155,213,0.07)', strength: 1 },
  tense: { a: 'rgba(139,92,246,0.15)', b: 'rgba(26,29,97,0.22)', strength: 1.25 },
  warm: { a: 'rgba(99,102,241,0.24)', b: 'rgba(139,92,246,0.13)', strength: 1.1 },
  resolve: { a: 'rgba(20,184,166,0.15)', b: 'rgba(99,102,241,0.15)', strength: 1 },
  brand: { a: 'rgba(99,102,241,0.30)', b: 'rgba(139,92,246,0.18)', strength: 1.3 },
};

/**
 * The room the film happens in (§13): never flat black. A dim radial key light
 * drifts slowly, a second fill sits low, and an edge vignette keeps the eye centred.
 * Grain is real noise, not an image — it also kills gradient banding on export.
 */
export const GlowBackground: React.FC<{
  mood?: Mood;
  /** 0–1, multiplies the whole lighting rig. */
  intensity?: number;
  /** Extra drift so consecutive scenes never sit at the same phase. */
  phase?: number;
  children?: React.ReactNode;
}> = ({ mood = 'quiet', intensity = 1, phase = 0, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = (frame + phase * fps) / fps;
  const m = MOODS[mood];

  // Very slow, non-repeating drift — motion you feel rather than see.
  const kx = 50 + Math.sin(t * 0.17) * 7;
  const ky = 34 + Math.cos(t * 0.13) * 5;
  const fx = 50 + Math.cos(t * 0.11 + 1.2) * 9;
  const breathe = 1 + Math.sin(t * 0.23) * 0.035;
  const k = intensity * m.strength;

  return (
    <AbsoluteFill style={{ backgroundColor: theme.bg, overflow: 'hidden' }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(${118 * breathe}% ${72 * breathe}% at ${kx}% ${ky}%, ${m.a} 0%, rgba(8,10,17,0) 62%)`,
          opacity: k,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(90% 55% at ${fx}% 104%, ${m.b} 0%, rgba(8,10,17,0) 70%)`,
          opacity: k,
        }}
      />
      {/* horizon lift — a whisper of the logo's waterline, never a visible line */}
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(to top, rgba(99,102,241,0.055) 0%, rgba(99,102,241,0) 34%)',
          opacity: k,
        }}
      />
      {children}
      {/* edge vignette */}
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(120% 78% at 50% 46%, rgba(0,0,0,0) 42%, rgba(0,0,0,0.5) 100%)',
          pointerEvents: 'none',
        }}
      />
      <Grain />
    </AbsoluteFill>
  );
};

/** Static-per-frame film grain. Low opacity: texture, never noise. */
export const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.035 }) => {
  const frame = useCurrentFrame();
  const seed = frame % 7;
  return (
    <AbsoluteFill style={{ opacity, mixBlendMode: 'overlay', pointerEvents: 'none' }}>
      <svg width="100%" height="100%">
        <filter id={`grain-${seed}`}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves={2}
            seed={seed}
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#grain-${seed})`} />
      </svg>
    </AbsoluteFill>
  );
};
