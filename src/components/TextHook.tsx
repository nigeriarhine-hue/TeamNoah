import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {fontStack} from '../theme';

/** Opening title. Fast, strong entry — no logo intro, no clutter. */
export const TextHook: React.FC<{lines: string[]; mark?: string}> = ({
  lines,
  mark = '❌',
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10}}>
      <div
        style={{
          fontSize: 78,
          marginBottom: 6,
          opacity: interpolate(frame, [0, 5], [0, 1], {extrapolateRight: 'clamp'}),
          transform: `scale(${interpolate(
            spring({frame, fps, config: {damping: 12, mass: 0.6}}),
            [0, 1],
            [0.4, 1]
          )})`,
        }}
      >
        {mark}
      </div>
      {lines.map((line, i) => {
        const s = spring({frame, fps, delay: i * 4, config: {damping: 200, mass: 0.42}});
        return (
          <div
            key={i}
            style={{
              fontFamily: fontStack,
              fontSize: 96,
              fontWeight: 900,
              letterSpacing: '-0.035em',
              lineHeight: 1.02,
              color: '#FFFFFF',
              textAlign: 'center',
              textShadow: '0 6px 34px rgba(0,0,0,0.7), 0 2px 4px rgba(0,0,0,0.55)',
              opacity: s,
              transform: `translateY(${interpolate(s, [0, 1], [40, 0])}px)`,
            }}
          >
            {line}
          </div>
        );
      })}
    </div>
  );
};
