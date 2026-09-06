import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { color, font } from '../brand';
import { ease, useSceneFade, useSettle } from '../components/anim';
import { NoahMark } from '../components/NoahMark';

/** The mark, the tagline, the three refusals. Nothing else. */
export const S8End: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const settle = useSettle(4);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: color.cream,
        opacity: useSceneFade(dur, 14, 18),
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ opacity: settle, transform: `translateY(${(1 - settle) * 12}px)` }}>
        <NoahMark size={148} />
      </div>

      <div style={{ height: 52 }} />

      <div
        style={{
          opacity: ease(frame, 20, 42),
          fontFamily: font.sans,
          fontWeight: 700,
          fontSize: 66,
          letterSpacing: '-0.035em',
          color: color.ink,
          textAlign: 'center',
          maxWidth: 1400,
          lineHeight: 1.1,
        }}
      >
        Noah finds what&rsquo;s actually wrong with your Mac.
      </div>

      <div style={{ height: 40 }} />

      <div
        style={{
          opacity: ease(frame, 44, 66),
          display: 'flex',
          gap: 18,
          alignItems: 'center',
          fontFamily: font.sans,
          fontWeight: 500,
          fontSize: 29,
          color: 'rgba(42, 37, 31, 0.55)',
        }}
      >
        <span>Shown before it runs</span>
        <span style={{ opacity: 0.4 }}>·</span>
        <span>Logged</span>
        <span style={{ opacity: 0.4 }}>·</span>
        <span>Reversible</span>
      </div>
    </AbsoluteFill>
  );
};
