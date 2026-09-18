import React from 'react';
import {AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {fontStack, noah} from '../theme';

export const CTAEndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = (d: number) => spring({frame, fps, delay: d, config: {damping: 200, mass: 0.5}});

  const steps = ['Describe it.', 'Approve it.', 'Done.'];

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(120% 80% at 50% 18%, #161A3A 0%, ${noah.deepNavy} 62%, #05070F 100%)`,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 300,
      }}
    >
      <Img
        src={staticFile('brand/noah-mark-dark.png')}
        style={{
          width: 172,
          marginBottom: 40,
          opacity: s(0),
          transform: `scale(${interpolate(s(0), [0, 1], [0.7, 1])})`,
        }}
      />

      <div
        style={{
          fontFamily: fontStack,
          fontSize: 104,
          fontWeight: 900,
          letterSpacing: '-0.04em',
          lineHeight: 0.98,
          textAlign: 'center',
          background: `linear-gradient(90deg, ${noah.tideBlue}, ${noah.tideViolet})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          opacity: s(4),
          transform: `translateY(${interpolate(s(4), [0, 1], [30, 0])}px)`,
        }}
      >
        FREE MAC CHECK
      </div>

      <div style={{display: 'flex', gap: 18, marginTop: 42}}>
        {steps.map((t, i) => (
          <span
            key={t}
            style={{
              fontFamily: fontStack,
              fontSize: 38,
              fontWeight: 700,
              color: '#FFFFFF',
              opacity: s(10 + i * 4) * 0.94,
              transform: `translateY(${interpolate(s(10 + i * 4), [0, 1], [16, 0])}px)`,
            }}
          >
            {t}
          </span>
        ))}
      </div>

      <div
        style={{
          marginTop: 56,
          fontFamily: fontStack,
          fontSize: 46,
          fontWeight: 800,
          color: '#FFFFFF',
          opacity: s(22),
        }}
      >
        Download Noah. Try it today.
      </div>

      <div
        style={{
          marginTop: 22,
          fontFamily: fontStack,
          fontSize: 54,
          fontWeight: 900,
          letterSpacing: '-0.02em',
          color: noah.periwinkle,
          opacity: s(26),
        }}
      >
        onnoah.app
      </div>
    </AbsoluteFill>
  );
};
