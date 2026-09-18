import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {fontStack} from '../theme';

/**
 * The list callout: big numeral + the bad-advice label, struck through with a
 * quick X once the joke has landed. strikeAt is relative to this sequence.
 */
export const ListItem: React.FC<{
  n: number;
  lines: string[];
  strikeAt?: number;
  subtle?: string;
}> = ({n, lines, strikeAt = 26, subtle}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const enter = spring({frame, fps, config: {damping: 200, mass: 0.4}});
  const numPop = spring({frame, fps, config: {damping: 11, mass: 0.5}});

  const strike = interpolate(frame, [strikeAt, strikeAt + 7], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const xIn = spring({frame: frame - strikeAt, fps, config: {damping: 10, mass: 0.5}});

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 26,
        opacity: interpolate(enter, [0, 1], [0, 1]),
        transform: `translateX(${interpolate(enter, [0, 1], [-46, 0])}px)`,
      }}
    >
      <div
        style={{
          fontFamily: fontStack,
          fontSize: 132,
          fontWeight: 900,
          lineHeight: 0.86,
          color: '#FFFFFF',
          opacity: 0.32,
          transform: `scale(${interpolate(numPop, [0, 1], [0.5, 1])})`,
          textShadow: '0 4px 24px rgba(0,0,0,0.6)',
        }}
      >
        {n}
      </div>

      <div style={{display: 'flex', flexDirection: 'column', gap: 4, paddingTop: 10}}>
        <div style={{position: 'relative', display: 'inline-block'}}>
          {lines.map((l, i) => (
            <div
              key={i}
              style={{
                fontFamily: fontStack,
                fontSize: 60,
                fontWeight: 800,
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
                color: '#FFFFFF',
                textShadow: '0 4px 26px rgba(0,0,0,0.66), 0 1px 3px rgba(0,0,0,0.5)',
              }}
            >
              {l}
            </div>
          ))}
          {/* strike-through sweeps left to right */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: '50%',
              height: 7,
              width: `${strike * 100}%`,
              background: '#FF4D4D',
              borderRadius: 4,
              boxShadow: '0 2px 12px rgba(255,77,77,0.55)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              right: -74,
              top: '50%',
              transform: `translateY(-50%) scale(${interpolate(xIn, [0, 1], [0, 1])}) rotate(${interpolate(
                xIn,
                [0, 1],
                [-40, 0]
              )}deg)`,
              fontSize: 54,
              opacity: xIn,
            }}
          >
            {'❌'}
          </div>
        </div>

        {subtle ? (
          <div
            style={{
              fontFamily: fontStack,
              fontSize: 30,
              fontWeight: 600,
              color: 'rgba(255,255,255,0.72)',
              marginTop: 10,
              opacity: interpolate(frame, [strikeAt + 6, strikeAt + 14], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              }),
              textShadow: '0 2px 14px rgba(0,0,0,0.6)',
            }}
          >
            {subtle}
          </div>
        ) : null}
      </div>
    </div>
  );
};
