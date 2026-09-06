import React from 'react';
import { useCurrentFrame } from 'remotion';
import { aurora, color, font, inkFaint, inkMuted, rule } from '../brand';
import { Eyebrow, Frame, Headline } from '../components/Layout';
import { ease, useSceneFade, useSettle } from '../components/anim';

/**
 * The approval moment. If a piece of creative has room for exactly one idea,
 * it is this one — so the aurora gradient appears here and nowhere else in
 * the film. Noah proposes; the human approves.
 */
const Row: React.FC<{ k: string; v: React.ReactNode; delay: number; tone?: string }> = ({
  k,
  v,
  delay,
  tone = inkMuted,
}) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        display: 'flex',
        gap: 34,
        padding: '15px 0',
        borderTop: `1px solid ${rule}`,
        opacity: ease(frame, delay, delay + 16),
      }}
    >
      <div
        style={{
          fontFamily: font.sans,
          fontWeight: 500,
          fontSize: 24,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: inkFaint,
          width: 220,
          flexShrink: 0,
          paddingTop: 3,
        }}
      >
        {k}
      </div>
      <div style={{ fontFamily: font.sans, fontSize: 28, color: tone, lineHeight: 1.35 }}>{v}</div>
    </div>
  );
};

export const S4Approve: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const settle = useSettle(28);

  return (
    <Frame opacity={useSceneFade(dur)} footer="Fix log · attempt 1 · 2026-08-21">
      <Eyebrow delay={2}>Noah proposes</Eyebrow>
      <Headline delay={6} size={58}>
        One sentence, in plain English.
      </Headline>

      <div style={{ height: 38 }} />

      <div
        style={{
          opacity: settle,
          transform: `translateY(${(1 - settle) * 18}px)`,
          background: '#F7F4EF',
          border: `1px solid ${rule}`,
          borderRadius: 12,
          boxShadow: '0 1px 2px rgba(42,37,31,0.04), 0 14px 40px rgba(42,37,31,0.07)',
          padding: '40px 46px 34px',
          maxWidth: 1440,
        }}
      >
        <div
          style={{
            fontFamily: font.sans,
            fontWeight: 700,
            fontSize: 42,
            letterSpacing: '-0.03em',
            lineHeight: 1.24,
            color: color.ink,
            marginBottom: 28,
          }}
        >
          Turn Wi-Fi off and back on for en1, then run the same timing check again.
        </div>

        <Row
          delay={54}
          k="Command"
          v={
            <span style={{ fontFamily: font.mono, fontSize: 25 }}>
              networksetup -setairportpower en1 off &rarr; on
            </span>
          }
        />
        <Row delay={66} k="Deletes" v="Nothing. No files, no caches, no settings." />
        <Row
          delay={78}
          k="Reversible"
          v={<span style={{ color: color.teal }}>Yes — en1 rejoins the same network.</span>}
          tone={color.teal}
        />
        <Row delay={90} k="Cost" v="About ten seconds offline." />

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            marginTop: 34,
            opacity: ease(frame, 104, 124),
          }}
        >
          <div
            style={{
              background: aurora,
              color: '#fff',
              fontFamily: font.sans,
              fontWeight: 700,
              fontSize: 29,
              letterSpacing: '-0.01em',
              padding: '19px 52px',
              borderRadius: 12,
              boxShadow: '0 6px 20px rgba(37,99,235,0.28)',
            }}
          >
            Approve
          </div>
          <div
            style={{
              fontFamily: font.sans,
              fontWeight: 500,
              fontSize: 29,
              color: inkMuted,
              padding: '19px 34px',
              border: `1px solid ${rule}`,
              borderRadius: 12,
            }}
          >
            Not now
          </div>
        </div>
      </div>

      <div style={{ height: 34 }} />

      <div
        style={{
          opacity: ease(frame, 138, 160),
          fontFamily: font.sans,
          fontWeight: 700,
          fontSize: 38,
          letterSpacing: '-0.03em',
          color: color.structure,
        }}
      >
        Nothing runs until you approve.
      </div>
    </Frame>
  );
};
