import React from 'react';
import { useCurrentFrame } from 'remotion';
import { color, font, inkFaint, inkMuted, rule } from '../brand';
import { Eyebrow, Frame } from '../components/Layout';
import { ease, useSceneFade } from '../components/anim';

/**
 * The proof is the *same diagnostic that named the problem*, re-run. Anything
 * else would be theater.
 *
 * Slowest trial is compared against slowest trial — the honest apples-to-apples
 * read, and the conservative one. Status colours carry the bars; the numbers
 * stay in ink and every bar is direct-labelled, so identity is never colour
 * alone.
 */
const TRACK = 1180; // px at the widest bar (1.320 s)
const MAX = 1.32;

const Bar: React.FC<{
  caption: string;
  value: number;
  display: string;
  status: string;
  tone: string;
  delay: number;
}> = ({ caption, value, display, status, tone, delay }) => {
  const frame = useCurrentFrame();
  const grow = ease(frame, delay, delay + 26);
  const w = (value / MAX) * TRACK * grow;

  return (
    <div style={{ opacity: ease(frame, delay - 8, delay + 6) }}>
      <div
        style={{
          fontFamily: font.sans,
          fontWeight: 500,
          fontSize: 25,
          letterSpacing: '0.02em',
          color: inkMuted,
          marginBottom: 12,
        }}
      >
        {caption}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 26 }}>
        <div
          style={{
            width: w,
            height: 52,
            background: tone,
            borderRadius: '2px 6px 6px 2px',
            flexShrink: 0,
          }}
        />
        <div
          style={{
            fontFamily: font.mono,
            fontWeight: 700,
            fontSize: 44,
            color: color.ink,
            letterSpacing: '-0.04em',
            opacity: ease(frame, delay + 20, delay + 34),
          }}
        >
          {display}
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            opacity: ease(frame, delay + 24, delay + 38),
          }}
        >
          <div style={{ width: 12, height: 12, borderRadius: 6, background: tone }} />
          <span style={{ fontFamily: font.sans, fontWeight: 500, fontSize: 26, color: tone }}>
            {status}
          </span>
        </div>
      </div>
    </div>
  );
};

export const S6Proof: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();

  return (
    <Frame opacity={useSceneFade(dur)}>
      <Eyebrow delay={2} tone={color.teal}>
        Re-checked — the same test, run again
      </Eyebrow>

      <div
        style={{
          fontFamily: font.sans,
          fontWeight: 700,
          fontSize: 58,
          letterSpacing: '-0.035em',
          color: color.ink,
          opacity: ease(frame, 6, 24),
          marginBottom: 52,
        }}
      >
        Time to load google.com
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 44 }}>
        <Bar
          caption="Before — slowest of 5 trials"
          value={1.319595}
          display="1.320 s"
          status="stalled"
          tone={color.amber}
          delay={34}
        />
        <Bar
          caption="After — slowest of 6 trials"
          value={0.362561}
          display="0.363 s"
          status="no stall"
          tone={color.teal}
          delay={92}
        />
      </div>

      <div style={{ height: 52 }} />

      <div
        style={{
          borderTop: `1px solid ${rule}`,
          paddingTop: 28,
          display: 'flex',
          gap: 78,
          opacity: ease(frame, 156, 178),
        }}
      >
        {[
          ['6 of 6', 'trials under 0.37 s'],
          ['0.247 s', 'fastest after the fix'],
          ['0', 'stalls seen in the re-check'],
        ].map(([big, small]) => (
          <div key={small}>
            <div
              style={{
                fontFamily: font.mono,
                fontWeight: 700,
                fontSize: 40,
                color: color.ink,
                letterSpacing: '-0.05em',
              }}
            >
              {big}
            </div>
            <div style={{ fontFamily: font.sans, fontSize: 24, color: inkFaint, marginTop: 6 }}>
              {small}
            </div>
          </div>
        ))}
      </div>
    </Frame>
  );
};
