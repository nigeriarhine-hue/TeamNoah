import React from 'react';
import { interpolate } from 'remotion';
import { noah } from '../theme';
import { FONT } from './Base';

/**
 * Authored captions, hand-timed against the measured VO segments - not an
 * auto-transcribe pass. Short phrase groups, caps, bottom safe-zone, with the
 * Noah-relevant words carrying the brand accent.
 *
 * Every word here comes from the locked script, in order.
 */
type Cue = { t: number; d: number; text: string; hot?: string };

export const CUES: Cue[] = [
  // s1  1.00 -> 2.99
  { t: 1.00, d: 0.66, text: 'ONE APP JUST' },
  { t: 1.66, d: 0.72, text: 'CLEANED A BUNCH' },
  { t: 2.38, d: 0.61, text: 'OF STUFF' },
  // s2  6.40 -> 8.48
  { t: 6.40, d: 0.62, text: 'NOAH', hot: 'NOAH' },
  { t: 7.02, d: 0.74, text: 'ACTUALLY CHECKED', hot: 'CHECKED' },
  { t: 7.76, d: 0.72, text: 'MY PC FIRST' },
  // s3  10.30 -> 11.58
  { t: 10.30, d: 0.60, text: 'IT SHOWED ME' },
  { t: 10.90, d: 0.68, text: 'WHAT WAS WRONG', hot: 'WRONG' },
  // s4  13.20 -> 14.36
  { t: 13.20, d: 0.54, text: 'SHOWED ME' },
  { t: 13.74, d: 0.62, text: 'THE FIX', hot: 'FIX' },
  // s5  15.75 -> 18.30
  { t: 15.75, d: 0.78, text: 'AND WAITED FOR' },
  { t: 16.53, d: 0.78, text: 'MY APPROVAL', hot: 'APPROVAL' },
  { t: 17.31, d: 0.99, text: 'BEFORE CHANGING ANYTHING' },
];

export const Captions: React.FC<{ time: number; bottom?: number }> = ({ time, bottom = 232 }) => {
  const cue = CUES.find((c) => time >= c.t && time < c.t + c.d);
  if (!cue) return null;

  const p = (time - cue.t) / cue.d;
  const inOut = Math.min(
    interpolate(p, [0, 0.14], [0, 1], { extrapolateRight: 'clamp' }),
    interpolate(p, [0.86, 1], [1, 0], { extrapolateLeft: 'clamp' }),
  );
  const lift = interpolate(p, [0, 0.18], [12, 0], { extrapolateRight: 'clamp' });

  return (
    <div
      style={{
        position: 'absolute',
        left: 60,
        right: 60,
        bottom,
        display: 'flex',
        justifyContent: 'center',
        pointerEvents: 'none',
        // above the approval modal's dim layer, which would otherwise mute them
        zIndex: 25,
      }}
    >
      <div
        style={{
          fontFamily: FONT,
          fontWeight: 800,
          fontSize: 66,
          lineHeight: 1.08,
          letterSpacing: '-0.025em',
          textAlign: 'center',
          color: '#ffffff',
          opacity: inOut,
          transform: `translateY(${lift}px)`,
          textShadow: '0 4px 24px rgba(0,0,0,0.85), 0 2px 6px rgba(0,0,0,0.9)',
          maxWidth: 900,
        }}
      >
        {cue.text.split(' ').map((w, i) => {
          const isHot = cue.hot && w.replace(/[^A-Z]/g, '') === cue.hot;
          return (
            <span
              key={`${w}-${i}`}
              style={{
                color: isHot ? '#b9a8ff' : '#ffffff',
                textShadow: isHot
                  ? `0 0 28px ${noah.purple}99, 0 4px 24px rgba(0,0,0,0.85)`
                  : undefined,
              }}
            >
              {w}
              {i < cue.text.split(' ').length - 1 ? ' ' : ''}
            </span>
          );
        })}
      </div>
    </div>
  );
};
