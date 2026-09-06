import React from 'react';
import { useCurrentFrame } from 'remotion';
import { color, font, inkMuted } from '../brand';
import { Accent, Body, Eyebrow, Frame } from '../components/Layout';
import { ease, useSceneFade } from '../components/anim';

/**
 * The category's failure is our opening: a cleaner sells the feeling of
 * maintenance and hands the actual work back to you.
 */
export const S2NotJunk: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const strike = ease(frame, 46, 70);

  return (
    <Frame opacity={useSceneFade(dur)} footer="Fix log · attempt 1 · 2026-08-21">
      <Eyebrow delay={2}>The usual guess</Eyebrow>

      <div style={{ position: 'relative', display: 'inline-block', alignSelf: 'flex-start' }}>
        <div
          style={{
            fontFamily: font.sans,
            fontWeight: 700,
            fontSize: 88,
            letterSpacing: '-0.035em',
            lineHeight: 1.05,
            color: frame > 58 ? inkMuted : color.ink,
            transition: 'none',
          }}
        >
          It&rsquo;s full of junk.
        </div>
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: '52%',
            height: 5,
            width: `${strike * 100}%`,
            background: inkMuted,
            borderRadius: 3,
          }}
        />
      </div>

      <div style={{ height: 30 }} />

      <div style={{ opacity: ease(frame, 66, 88) }}>
        <Body size={33}>
          So you run a cleaner. It empties the caches, reports a number, and Google
          still takes 1.3 seconds to open.
        </Body>
      </div>

      <div style={{ height: 58 }} />

      <div style={{ opacity: ease(frame, 108, 130) }}>
        <Accent size={84}>It&rsquo;s probably not junk.</Accent>
      </div>
    </Frame>
  );
};
