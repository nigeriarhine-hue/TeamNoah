import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';

/**
 * Snap-zoom on the beat. Short-form holds attention through micro-motion, so
 * the footage punches in a few percent on each spoken list item and eases back
 * rather than sitting still for eight seconds.
 */
export const Punch: React.FC<{
  /** local frames on which to punch */
  beats: number[];
  /** how far each punch pushes, as a scale delta */
  amount?: number;
  /** frames the punch takes to relax */
  decay?: number;
  /** slow continuous drift underneath the punches */
  drift?: number;
  children: React.ReactNode;
}> = ({beats, amount = 0.055, decay = 22, drift = 0.02, children}) => {
  const frame = useCurrentFrame();

  let punch = 0;
  for (const b of beats) {
    if (frame >= b) {
      // fast attack over 3 frames, then exponential relax
      const attack = interpolate(frame, [b, b + 3], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
      const relax = Math.exp(-(frame - b) / decay);
      punch = Math.max(punch, attack * relax);
    }
  }

  const base = 1 + drift * (frame / 240);
  const scale = base + punch * amount;

  return (
    <AbsoluteFill style={{transform: `scale(${scale})`, transformOrigin: '50% 42%'}}>
      {children}
    </AbsoluteFill>
  );
};

/** One-frame white flash used to hide the cut into the product section. */
export const Flash: React.FC<{at: number; len?: number}> = ({at, len = 5}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [at, at + 1, at + len], [0, 0.85, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  if (o <= 0) return null;
  return <AbsoluteFill style={{backgroundColor: '#FFFFFF', opacity: o}} />;
};
