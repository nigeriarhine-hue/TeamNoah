import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {fontStack} from '../theme';

/**
 * Opening title. Words snap in one after another rather than the whole block
 * fading: the staggered entrance is what makes the first half second feel fast
 * enough to hold a scroll.
 */
export const TextHook: React.FC<{lines: string[]; mark?: string; tease?: string}> = ({
  lines,
  mark = '❌',
  tease,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const words = lines.map((l) => l.split(' '));
  let i = 0;

  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8}}>
      <div
        style={{
          fontSize: 82,
          marginBottom: 4,
          opacity: interpolate(frame, [0, 3], [0, 1], {extrapolateRight: 'clamp'}),
          transform: `scale(${interpolate(
            spring({frame, fps, config: {damping: 9, mass: 0.5}}),
            [0, 1],
            [0.2, 1]
          )}) rotate(${interpolate(frame, [0, 10], [-14, 0], {extrapolateRight: 'clamp'})}deg)`,
        }}
      >
        {mark}
      </div>

      {words.map((line, li) => (
        <div key={li} style={{display: 'flex', justifyContent: 'center', gap: '0 16px', whiteSpace: 'nowrap'}}>
          {line.map((w) => {
            const d = i++ * 2;
            const s = spring({frame, fps, delay: d, config: {damping: 13, mass: 0.34}});
            return (
              <span
                key={w + d}
                style={{
                  fontFamily: fontStack,
                  fontSize: 66,
                  fontWeight: 900,
                  letterSpacing: '-0.04em',
                  lineHeight: 1.0,
                  color: '#FFFFFF',
                  textShadow: '0 6px 34px rgba(0,0,0,0.78), 0 2px 4px rgba(0,0,0,0.6)',
                  opacity: s,
                  display: 'inline-block',
                  transform: `translateY(${interpolate(s, [0, 1], [46, 0])}px) scale(${interpolate(
                    s,
                    [0, 1],
                    [0.82, 1]
                  )})`,
                }}
              >
                {w}
              </span>
            );
          })}
        </div>
      ))}

      {tease ? (
        <div
          style={{
            marginTop: 20,
            fontFamily: fontStack,
            fontSize: 38,
            fontWeight: 800,
            letterSpacing: '0.02em',
            color: '#FF6B4D',
            opacity: interpolate(frame, [18, 24], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
            textShadow: '0 3px 18px rgba(0,0,0,0.75)',
          }}
        >
          {tease}
        </div>
      ) : null}
    </div>
  );
};
