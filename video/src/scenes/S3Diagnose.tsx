import React from 'react';
import { useCurrentFrame } from 'remotion';
import { color, font, inkFaint, inkMuted, rule } from '../brand';
import { Body, Card, Eyebrow, Frame, Headline } from '../components/Layout';
import { ease, useSceneFade } from '../components/anim';

/**
 * Name the real thing. "Stale pre-Tahoe preferences" beats "some issues were
 * found" — specificity is the trust signal.
 *
 * Every number on screen is verbatim from the fix log. Only try5 was recorded,
 * so only try5 is shown: the other four trials are drawn as marks, never as
 * invented digits.
 */
const Seg: React.FC<{ label: string; value: string; tone: string; bold?: boolean }> = ({
  label,
  value,
  tone,
  bold,
}) => (
  <span style={{ color: tone, fontWeight: bold ? 700 : 400 }}>
    {label}
    <span style={{ opacity: 0.55 }}>=</span>
    {value}
  </span>
);

const Note: React.FC<{ head: string; body: string; tone: string; delay: number }> = ({
  head,
  body,
  tone,
  delay,
}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ flex: 1, opacity: ease(frame, delay, delay + 18) }}>
      <div style={{ height: 3, background: tone, width: 46, marginBottom: 16, borderRadius: 2 }} />
      <div
        style={{
          fontFamily: font.sans,
          fontWeight: 700,
          fontSize: 30,
          letterSpacing: '-0.02em',
          color: tone,
          marginBottom: 8,
        }}
      >
        {head}
      </div>
      <div style={{ fontFamily: font.sans, fontSize: 25, lineHeight: 1.42, color: inkMuted }}>
        {body}
      </div>
    </div>
  );
};

export const S3Diagnose: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();

  return (
    <Frame opacity={useSceneFade(dur)} footer="Fix log · attempt 1 · 2026-08-21">
      <Eyebrow delay={2}>What Noah measured</Eyebrow>
      <Headline delay={6} size={62}>
        Noah timed the load itself. Five times.
      </Headline>

      <div style={{ height: 40 }} />

      {/* Four trials came back normal, one stalled. */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          opacity: ease(frame, 30, 48),
        }}
      >
        {[0, 1, 2, 3, 4].map((i) => {
          const stalled = i === 4;
          return (
            <div
              key={i}
              style={{
                width: stalled ? 128 : 46,
                height: 12,
                borderRadius: 6,
                background: stalled ? color.amber : rule,
              }}
            />
          );
        })}
        <span
          style={{
            fontFamily: font.sans,
            fontSize: 25,
            color: inkMuted,
            marginLeft: 14,
          }}
        >
          1 of 5 trials stalled
        </span>
      </div>

      <div style={{ height: 34 }} />

      <Card
        style={{
          padding: '26px 34px',
          fontFamily: font.mono,
          fontSize: 30,
          letterSpacing: '-0.01em',
          color: inkMuted,
          opacity: ease(frame, 50, 70),
          alignSelf: 'flex-start',
        }}
      >
        <span style={{ color: inkFaint }}>try5: </span>
        <Seg label="dns" value="0.002419" tone={inkMuted} />
        {'  '}
        <Seg label="connect" value="1.048312" tone={color.amber} bold />
        {'  '}
        <Seg label="tls" value="1.140726" tone={inkMuted} />
        {'  '}
        <Seg label="total" value="1.319595" tone={color.ink} bold />
      </Card>

      <div style={{ height: 44 }} />

      <div style={{ display: 'flex', gap: 56, maxWidth: 1560 }}>
        <Note
          delay={84}
          tone={color.teal}
          head="DNS: 2 ms"
          body="Finding Google's address was never the problem."
        />
        <Note
          delay={100}
          tone={color.amber}
          head="Connect: 1.05 s"
          body="Opening the connection — before Google sends a byte. This is the stall."
        />
        <Note
          delay={116}
          tone={inkMuted}
          head="Signal: −68 dBm"
          body="Wi-Fi on en1 rated Fair. A weak link is where slow handshakes come from."
        />
      </div>

      <div style={{ height: 40 }} />

      <div style={{ opacity: ease(frame, 150, 172) }}>
        <Body size={33} tone={color.ink} width={1420}>
          So it is not the browser, and it is not junk. The wait is in the Wi-Fi
          link, before Google is reached at all.
        </Body>
      </div>
    </Frame>
  );
};
