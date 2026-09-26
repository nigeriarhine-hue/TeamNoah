import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { font, SAFE, W } from '../theme';

/**
 * Phrase captions. Deliberately not karaoke: a phrase arrives whole, rises a
 * few pixels, and leaves. One idea on screen at a time.
 */
export const AnimatedCaption: React.FC<{
  text: string;
  /** frame this caption appears, relative to its Sequence */
  from: number;
  durationInFrames: number;
  y?: number;
  size?: number;
}> = ({ text, from, durationInFrames, y = 1430, size = 46 }) => {
  const frame = useCurrentFrame();
  const local = frame - from;
  if (local < -6 || local > durationInFrames + 6) return null;

  const inP = interpolate(local, [0, 7], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
  const outP = interpolate(local, [durationInFrames - 6, durationInFrames], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const o = Math.min(inP, outP);

  return (
    <div
      style={{
        position: 'absolute',
        left: SAFE.side,
        width: W - SAFE.side * 2,
        top: y,
        textAlign: 'center',
        opacity: o,
        transform: `translateY(${interpolate(inP, [0, 1], [14, 0])}px)`,
        fontFamily: font.sans,
        fontWeight: 600,
        fontSize: size,
        lineHeight: 1.26,
        letterSpacing: '-0.022em',
        color: '#FFFFFF',
        textShadow: '0 2px 24px rgba(0,0,0,.72), 0 1px 3px rgba(0,0,0,.85)',
      }}
    >
      {text}
    </div>
  );
};
