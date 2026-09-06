import React from 'react';
import { useCurrentFrame } from 'remotion';
import { color, font, inkFaint, inkMuted, rule } from '../brand';
import { Body, Frame } from '../components/Layout';
import { ease, typed, useRise, useSceneFade } from '../components/anim';
import { NoahMark } from '../components/NoahMark';

/**
 * Lead with the symptom, in the user's own words. Nobody should have to
 * translate their problem into our vocabulary first.
 */
export const S1Symptom: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const text = typed('Google takes forever to load', frame, 14, 19);
  const caret = frame > 14 && Math.floor(frame / 14) % 2 === 0 ? '▍' : ' ';
  const done = frame > 74;

  return (
    <Frame opacity={useSceneFade(dur)}>
      <div style={{ ...useRise(0, 20), display: 'flex', alignItems: 'center', gap: 20 }}>
        <NoahMark size={66} />
        <span
          style={{
            fontFamily: font.sans,
            fontWeight: 700,
            fontSize: 30,
            letterSpacing: '-0.02em',
            color: color.structure,
          }}
        >
          Noah
        </span>
      </div>

      <div style={{ height: 64 }} />

      <div
        style={{
          ...useRise(6, 20),
          fontFamily: font.sans,
          fontWeight: 500,
          fontSize: 26,
          letterSpacing: '0.02em',
          color: inkFaint,
          marginBottom: 22,
        }}
      >
        What&rsquo;s wrong with your Mac?
      </div>

      <div
        style={{
          ...useRise(6, 20),
          borderBottom: `2px solid ${rule}`,
          paddingBottom: 26,
          maxWidth: 1400,
          fontFamily: font.sans,
          fontWeight: 700,
          fontSize: 78,
          letterSpacing: '-0.035em',
          color: color.ink,
          minHeight: 100,
        }}
      >
        {text}
        <span style={{ color: color.auroraFrom, fontWeight: 400 }}>{done ? '' : caret}</span>
      </div>

      <div style={{ height: 44 }} />

      <div style={{ opacity: ease(frame, 78, 96) }}>
        <Body size={32} tone={inkMuted}>
          That is a complete bug report. You describe the symptom your way &mdash;
          Noah goes and finds what is actually causing it.
        </Body>
      </div>
    </Frame>
  );
};
