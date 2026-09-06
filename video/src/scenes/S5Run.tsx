import React from 'react';
import { useCurrentFrame } from 'remotion';
import { color, font, inkFaint, inkMuted, rule } from '../brand';
import { Eyebrow, Frame, Headline } from '../components/Layout';
import { ease, useSceneFade } from '../components/anim';

/**
 * No progress bar performing work that isn't happening. Steps appear as they
 * actually complete, each one a real command, and the last one is the check
 * re-running — not a claim of success.
 */
const steps = [
  { at: 22, cmd: 'networksetup -setairportpower <wi-fi> off', run: true, label: 'Wi-Fi off' },
  { at: 52, cmd: 'networksetup -setairportpower <wi-fi> on', run: true, label: 'Wi-Fi on' },
  { at: 82, cmd: 'wi-fi re-associated', run: false, label: 'Back on the network' },
  { at: 112, cmd: 'curl -w "%{time_total}" https://www.google.com  × 6', run: true, label: 'Re-running the check' },
];

export const S5Run: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();

  return (
    <Frame opacity={useSceneFade(dur)}>
      <Eyebrow delay={2}>You approved. Noah runs it.</Eyebrow>
      <Headline delay={6} size={58}>
        Every step shown as it runs. Nothing hidden.
      </Headline>

      <div style={{ height: 46 }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxWidth: 1420 }}>
        {steps.map((s) => {
          const shown = ease(frame, s.at, s.at + 14);
          const ticked = ease(frame, s.at + 18, s.at + 30);
          return (
            <div
              key={s.cmd}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 26,
                padding: '20px 0',
                borderBottom: `1px solid ${rule}`,
                opacity: shown,
                transform: `translateY(${(1 - shown) * 10}px)`,
              }}
            >
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  border: `2px solid ${ticked > 0.5 ? color.teal : inkFaint}`,
                  background: ticked > 0.5 ? color.teal : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {ticked > 0.5 ? (
                  <svg width="16" height="12" viewBox="0 0 16 12">
                    <path
                      d="M1.5 6L6 10.5L14.5 1.5"
                      fill="none"
                      stroke="#fff"
                      strokeWidth="2.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : null}
              </div>

              <div
                style={{
                  fontFamily: font.mono,
                  fontSize: 27,
                  color: inkMuted,
                  flex: 1,
                  letterSpacing: '-0.01em',
                }}
              >
                <span style={{ color: inkFaint }}>{s.run ? '$ ' : '  '}</span>
                {s.cmd}
              </div>

              <div
                style={{
                  fontFamily: font.sans,
                  fontWeight: 500,
                  fontSize: 25,
                  color: ticked > 0.5 ? color.teal : inkFaint,
                  opacity: Math.max(ticked, 0.45),
                }}
              >
                {s.label}
              </div>
            </div>
          );
        })}
      </div>
    </Frame>
  );
};
