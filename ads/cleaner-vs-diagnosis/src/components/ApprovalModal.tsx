import React from 'react';
import { interpolate, spring, useVideoConfig } from 'remotion';
import { noah } from '../theme';
import { FONT, NoahLabel, NoahMark } from './Base';

/**
 * The approval step - the whole point of the ad, so it gets the full frame.
 * Noah has a plan ready and does not act on it until the person says go.
 *
 * Cursor drifts to "Go ahead", presses at ~f62 (18.05s absolute, where the click
 * lands in the audio bed), and the row confirms. Nothing is claimed beyond
 * "waiting for approval".
 */
export const ApprovalModal: React.FC<{ local: number }> = ({ local }) => {
  const { fps } = useVideoConfig();

  const rise = spring({ frame: local - 2, fps, config: { damping: 16, mass: 0.7 } });
  const dim = interpolate(local, [0, 12], [0, 0.76], { extrapolateRight: 'clamp' });

  // cursor travel -> press -> confirm
  const CLICK = 62;
  const travel = interpolate(local, [14, CLICK], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const cx = interpolate(travel, [0, 1], [720, 556]);
  const cy = interpolate(travel, [0, 1], [1250, 1136]);
  const pressed = local >= CLICK && local < CLICK + 6;
  const confirmed = local >= CLICK + 3;
  const pulse = 1 + Math.sin(local / 5.2) * 0.012 * (1 - travel * 0.55);

  const btn = (label: string, primary: boolean) => (
    <div
      key={label}
      style={{
        flex: primary ? 1.25 : 1,
        height: 92,
        borderRadius: 14,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 30,
        fontWeight: primary ? 700 : 600,
        letterSpacing: '-0.01em',
        color: primary ? '#fff' : noah.txt2,
        background: primary
          ? confirmed
            ? noah.doneGrad
            : noah.ctaGrad
          : 'transparent',
        border: primary ? 'none' : `1px solid ${noah.cardLine}`,
        transform: primary ? `scale(${pressed ? 0.965 : pulse})` : 'none',
        boxShadow: primary ? `0 14px 40px rgba(123,118,232,${0.26 + travel * 0.2})` : 'none',
      }}
    >
      {primary && confirmed ? 'Approved ✓' : label}
    </div>
  );

  return (
    <div style={{ position: 'absolute', inset: 0, fontFamily: FONT, zIndex: 15 }}>
      {/* the rest of the UI dims away behind the decision */}
      <div style={{ position: 'absolute', inset: 0, background: `rgba(6,6,11,${dim})` }} />

      <div
        style={{
          position: 'absolute',
          left: 70,
          right: 70,
          top: 620,
          borderRadius: 26,
          background: noah.card,
          border: `1px solid ${noah.cardLine}`,
          padding: '44px 44px 40px',
          overflow: 'hidden',
          opacity: rise,
          transform: `translateY(${(1 - rise) * 44}px) scale(${0.96 + rise * 0.04})`,
          boxShadow: '0 40px 120px rgba(0,0,0,0.6)',
        }}
      >
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 5, background: noah.accentGrad }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 26 }}>
          <NoahMark size={40} />
          <NoahLabel size={20}>APPROVAL NEEDED</NoahLabel>
        </div>

        <div style={{ fontSize: 58, fontWeight: 800, color: '#f4f4fb', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
          Can Noah do this?
        </div>
        <div style={{ fontSize: 31, fontWeight: 400, color: '#cfcfe0', marginTop: 16, lineHeight: 1.4 }}>
          Noah needs your OK to continue.
        </div>

        <div style={{ display: 'flex', gap: 14, marginTop: 38 }}>
          {btn('No thanks', false)}
          {btn('Go ahead', true)}
          {btn('Approve all', false)}
        </div>
      </div>

      {/* cursor */}
      <svg
        width="46"
        height="46"
        viewBox="0 0 24 24"
        style={{
          position: 'absolute',
          left: cx,
          top: cy,
          filter: 'drop-shadow(0 3px 7px rgba(0,0,0,0.75))',
          transform: `scale(${pressed ? 0.86 : 1})`,
          opacity: interpolate(local, [10, 16], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        }}
      >
        <path d="M5 2.5l13.2 7.7-5.8 1.2-2.6 5.6L5 2.5z" fill="#fff" stroke="#14141b" strokeWidth="1.1" strokeLinejoin="round" />
      </svg>

      {/* click ripple */}
      {local >= CLICK && local < CLICK + 16 && (
        <span
          style={{
            position: 'absolute',
            left: cx - 6,
            top: cy - 6,
            width: 20,
            height: 20,
            borderRadius: 99,
            border: `2px solid ${noah.green}`,
            transform: `scale(${1 + (local - CLICK) * 0.42})`,
            opacity: Math.max(0, 1 - (local - CLICK) / 16),
          }}
        />
      )}
    </div>
  );
};
