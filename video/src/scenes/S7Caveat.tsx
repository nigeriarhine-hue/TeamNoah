import React from 'react';
import { useCurrentFrame } from 'remotion';
import { color, font, inkFaint, inkMuted, rule } from '../brand';
import { Accent, Body, Eyebrow, Frame, Headline } from '../components/Layout';
import { ease, useSceneFade } from '../components/anim';

/**
 * We never fake anything. The fix worked and the underlying link is still weak,
 * so the done card says both — stating a limit plainly, without apologising for
 * the product.
 */
const Signal: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const lit = 2; // Fair
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 20,
        opacity: ease(frame, delay, delay + 18),
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 46 }}>
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            style={{
              width: 14,
              height: 12 + i * 8.5,
              borderRadius: 3,
              background: i < lit ? color.amber : rule,
            }}
          />
        ))}
      </div>
      <span
        style={{
          fontFamily: font.mono,
          fontWeight: 700,
          fontSize: 32,
          color: color.amber,
          letterSpacing: '-0.01em',
        }}
      >
        −68 dBm
      </span>
      <span style={{ fontFamily: font.sans, fontWeight: 500, fontSize: 28, color: inkMuted }}>
        Fair · unchanged by the fix
      </span>
    </div>
  );
};

export const S7Caveat: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();

  return (
    <Frame opacity={useSceneFade(dur)}>
      <Eyebrow delay={2} tone={color.amber}>
        And what Noah will not claim
      </Eyebrow>

      <Headline delay={6} size={72}>
        The stalls can come back.
      </Headline>

      <div style={{ height: 34 }} />
      <Signal delay={26} />
      <div style={{ height: 34 }} />

      <div style={{ opacity: ease(frame, 52, 74) }}>
        <Body size={33} width={1400}>
          Reconnecting cleared the stall. It did not make the radio stronger. Your
          signal was Fair before the fix and it is Fair now, so the same 1.3-second
          wait can return &mdash; most likely further from the router.
        </Body>
      </div>

      <div style={{ height: 40 }} />

      <div
        style={{
          opacity: ease(frame, 92, 114),
          display: 'flex',
          alignItems: 'center',
          gap: 22,
          padding: '24px 32px',
          border: `1px solid ${rule}`,
          borderRadius: 12,
          background: '#F7F4EF',
          alignSelf: 'flex-start',
        }}
      >
        <div style={{ width: 10, height: 10, borderRadius: 5, background: color.teal }} />
        <span style={{ fontFamily: font.sans, fontWeight: 500, fontSize: 29, color: inkMuted }}>
          Noah left the check open and will run it again on its own.
        </span>
      </div>

      <div style={{ height: 46 }} />

      <div style={{ opacity: ease(frame, 128, 152) }}>
        <Accent size={60}>A fix that might not hold is worth saying out loud.</Accent>
      </div>
    </Frame>
  );
};
