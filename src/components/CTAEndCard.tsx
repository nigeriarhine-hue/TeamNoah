import React from 'react';
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { AURORA, color, font, SAFE } from '../theme';

/**
 * The end card. One product name, one offer, one address — on the brand's
 * night ground. Nothing performs; the product already did the work.
 */
export const CTAEndCard: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const inP = interpolate(frame, [0, 10], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const rise = interpolate(inP, [0, 1], [22, 0]);

  return (
    <AbsoluteFill style={{ background: color.night }}>
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(90% 46% at 50% 40%, rgba(99,102,241,.26) 0%, rgba(11,16,36,0) 70%)',
        }}
      />
      <AbsoluteFill
        style={{
          paddingTop: SAFE.top,
          paddingBottom: SAFE.bottom,
          paddingLeft: SAFE.side,
          paddingRight: SAFE.side,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: inP,
          transform: `translateY(${rise}px)`,
        }}
      >
        <Img
          src={staticFile('brand/noah-mark-dark.png')}
          style={{ width: 132, height: 132, marginBottom: 54 }}
        />

        <div
          style={{
            fontFamily: font.sans,
            fontWeight: 800,
            fontSize: 78,
            lineHeight: 1.05,
            letterSpacing: '-0.035em',
            color: '#FFFFFF',
            textAlign: 'center',
          }}
        >
          AI TECH SUPPORT
          <br />
          FOR YOUR MAC
        </div>

        <div
          style={{
            marginTop: 48,
            padding: '26px 54px',
            borderRadius: 18,
            background: AURORA,
            fontFamily: font.sans,
            fontWeight: 800,
            fontSize: 46,
            letterSpacing: '-0.03em',
            color: '#fff',
          }}
        >
          FREE MAC CHECK
        </div>

        <div
          style={{
            marginTop: 46,
            fontFamily: font.sans,
            fontWeight: 500,
            fontSize: 40,
            lineHeight: 1.4,
            letterSpacing: '-0.02em',
            color: 'rgba(235,237,242,.82)',
            textAlign: 'center',
          }}
        >
          Download Noah.
          <br />
          Try it today.
        </div>

        <div
          style={{
            marginTop: 40,
            fontFamily: font.sans,
            fontWeight: 700,
            fontSize: 42,
            letterSpacing: '-0.01em',
            color: color.litHorizon,
          }}
        >
          onnoah.app
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
