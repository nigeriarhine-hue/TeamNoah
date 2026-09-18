import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {fontStack} from '../theme';

/**
 * Tiny count pip that punctuates the spoken "number N" without competing with
 * the creator's actual hand. Sits opposite the counting hand.
 */
export const FingerCountOverlay: React.FC<{count: number; side?: 'left' | 'right'}> = ({
  count,
  side = 'left',
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pop = spring({frame, fps, config: {damping: 12, mass: 0.45}});

  return (
    <div
      style={{
        position: 'absolute',
        top: 250,
        [side]: 70,
        display: 'flex',
        gap: 12,
        transform: `scale(${interpolate(pop, [0, 1], [0.3, 1])})`,
        opacity: interpolate(frame, [0, 4], [0, 1], {extrapolateRight: 'clamp'}),
      }}
    >
      {Array.from({length: count}).map((_, i) => (
        <div
          key={i}
          style={{
            width: 26,
            height: 26,
            borderRadius: 13,
            background: '#FFFFFF',
            opacity: interpolate(
              spring({frame: frame - i * 3, fps, config: {damping: 14}}),
              [0, 1],
              [0, 0.92]
            ),
            boxShadow: '0 2px 14px rgba(0,0,0,0.5)',
          }}
        />
      ))}
      <span
        style={{
          fontFamily: fontStack,
          fontSize: 26,
          fontWeight: 800,
          color: 'rgba(255,255,255,0.85)',
          marginLeft: 6,
          alignSelf: 'center',
        }}
      >
        /3
      </span>
    </div>
  );
};
