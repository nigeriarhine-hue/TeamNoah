import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { font, SAFE, W } from '../theme';

/**
 * The big statements. Plus Jakarta 800 at the brand's headline tracking,
 * uppercase, one or two lines. Minimal animation — it cuts in and settles.
 */
export const TextHook: React.FC<{
  lines: string[];
  from: number;
  durationInFrames: number;
  y: number;
  size?: number;
  align?: 'center' | 'left';
  accentLast?: boolean;
  scrim?: boolean;
}> = ({ lines, from, durationInFrames, y, size = 92, align = 'center', accentLast, scrim }) => {
  const frame = useCurrentFrame();
  const local = frame - from;
  if (local < -4 || local > durationInFrames + 4) return null;

  const inP = interpolate(local, [0, 9], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const outP = interpolate(local, [durationInFrames - 7, durationInFrames], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const o = Math.min(inP, outP);

  return (
    <>
      {scrim ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: y - 120,
            height: lines.length * size * 1.1 + 260,
            background:
              'linear-gradient(180deg, rgba(4,6,14,0) 0%, rgba(4,6,14,.80) 38%, rgba(4,6,14,.92) 100%)',
            opacity: o,
          }}
        />
      ) : null}
      <div
        style={{
          position: 'absolute',
          left: SAFE.side,
          width: W - SAFE.side * 2,
          top: y,
          textAlign: align,
          opacity: o,
          transform: `translateY(${interpolate(inP, [0, 1], [18, 0])}px)`,
          fontFamily: font.sans,
          fontWeight: 800,
          fontSize: size,
          lineHeight: 1.04,
          letterSpacing: '-0.035em',
          color: '#FFFFFF',
          textShadow: '0 4px 40px rgba(0,0,0,.65)',
        }}
      >
        {lines.map((l, i) => (
          <div
            key={l}
            style={{
              color: accentLast && i === lines.length - 1 ? '#C7CBFF' : undefined,
            }}
          >
            {l}
          </div>
        ))}
      </div>
    </>
  );
};
