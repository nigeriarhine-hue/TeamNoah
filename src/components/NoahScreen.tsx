import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {fontStack, noah} from '../theme';

/** Overlay label sitting over genuine Noah UI. Deliberately sparse. */
export const NoahOverlay: React.FC<{
  lines: string[];
  position?: 'top' | 'bottom';
  accentLast?: boolean;
}> = ({lines, position = 'top', accentLast = false}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame, fps, config: {damping: 200, mass: 0.45}});

  return (
    <AbsoluteFill
      style={{
        justifyContent: position === 'top' ? 'flex-start' : 'flex-end',
        alignItems: 'center',
        paddingTop: position === 'top' ? 210 : 0,
        paddingBottom: position === 'bottom' ? 440 : 0,
      }}
    >
      <div
        style={{
          opacity: s,
          transform: `translateY(${interpolate(s, [0, 1], [24, 0])}px)`,
          textAlign: 'center',
          padding: '22px 34px',
          borderRadius: 22,
          background: 'rgba(8,10,16,0.62)',
          backdropFilter: 'blur(14px)',
          border: '1px solid rgba(199,203,255,0.16)',
        }}
      >
        {lines.map((l, i) => (
          <div
            key={i}
            style={{
              fontFamily: fontStack,
              fontSize: 60,
              fontWeight: 900,
              letterSpacing: '-0.03em',
              lineHeight: 1.08,
              color: accentLast && i === lines.length - 1 ? noah.periwinkle : '#FFFFFF',
            }}
          >
            {l}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

/** Thin tide-gradient progress rule — ties product beats to the brand without logos. */
export const TideRule: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const w = interpolate(frame, [0, durationInFrames], [0, 100], {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{justifyContent: 'flex-end', paddingBottom: 300}}>
      <div style={{height: 6, width: `${w}%`, background: `linear-gradient(90deg, ${noah.tideBlue}, ${noah.tideViolet})`}} />
    </AbsoluteFill>
  );
};
