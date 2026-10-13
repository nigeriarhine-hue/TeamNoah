import React from 'react';
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from 'remotion';
import { accentGradient, colors, fonts } from '../theme';
import { CAPTIONS, FPS } from './timeline';

const ease = Easing.bezier(0.22, 1, 0.36, 1);

export const fadeIn = (frame: number, at: number, dur = 0.35) =>
  interpolate(frame, [at * FPS, (at + dur) * FPS], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: ease,
  });

export const window01 = (frame: number, from: number, to: number, fade = 0.25) =>
  Math.min(fadeIn(frame, from, fade), 1 - fadeIn(frame, to - fade, fade));

// Restrained Aurora backdrop: deep navy, two soft blue/violet glows.
export const AuroraBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame / 90) * 30;
  return (
    <AbsoluteFill style={{ background: colors.bgDeep }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(900px 700px at ${180 + drift}px 260px, rgba(91,141,239,0.22), transparent 70%),
            radial-gradient(900px 800px at ${920 - drift}px 1500px, rgba(139,92,246,0.20), transparent 70%),
            linear-gradient(180deg, ${colors.bg} 0%, ${colors.bgDeep} 100%)`,
        }}
      />
    </AbsoluteFill>
  );
};

// Recurring series identifier, kept small.
export const SeriesTag: React.FC<{ opacity?: number }> = ({ opacity = 1 }) => (
  <div
    style={{
      position: 'absolute',
      top: 92,
      left: 60,
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '10px 18px 10px 14px',
      borderRadius: 999,
      background: 'rgba(11,16,36,0.55)',
      border: '1px solid rgba(199,203,255,0.18)',
      backdropFilter: 'blur(10px)',
      fontFamily: fonts.sans,
      fontWeight: 700,
      fontSize: 24,
      letterSpacing: 2.2,
      color: colors.lilac,
      opacity,
    }}
  >
    <span style={{ width: 9, height: 9, borderRadius: 9, background: accentGradient }} />
    PC CHECK 101
  </div>
);

export const AccentText: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({
  children,
  style,
}) => (
  <span
    style={{
      background: accentGradient,
      WebkitBackgroundClip: 'text',
      backgroundClip: 'text',
      color: 'transparent',
      ...style,
    }}
  >
    {children}
  </span>
);

// Big editorial statement with a slide-up and one soft light sweep.
export const Headline: React.FC<{
  at: number;
  until: number;
  top: number;
  size?: number;
  align?: 'left' | 'center';
  left?: number;
  children: React.ReactNode;
}> = ({ at, until, top, size = 96, align = 'center', left = 60, children }) => {
  const frame = useCurrentFrame();
  const o = window01(frame, at, until, 0.28);
  const y = interpolate(fadeIn(frame, at, 0.45), [0, 1], [28, 0]);
  const sweep = interpolate(frame, [at * FPS, (at + 0.9) * FPS], [-40, 140], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <div
      style={{
        position: 'absolute',
        top,
        left: align === 'center' ? 0 : left,
        right: align === 'center' ? 0 : undefined,
        textAlign: align,
        opacity: o,
        transform: `translateY(${y}px)`,
        fontFamily: fonts.sans,
        fontWeight: 800,
        fontSize: size,
        lineHeight: 1.02,
        letterSpacing: -2,
        color: colors.text,
        textShadow: '0 6px 30px rgba(7,10,24,0.55)',
        WebkitMaskImage: `linear-gradient(100deg, #000 ${sweep - 30}%, rgba(0,0,0,0.78) ${sweep}%, #000 ${sweep + 30}%)`,
      }}
    >
      {children}
    </div>
  );
};

// Small label styled like the app's own section labels ("— WHAT NOAH CHECKED").
export const SectionLabel: React.FC<{ at: number; until: number; top: number; children: React.ReactNode }> = ({
  at,
  until,
  top,
  children,
}) => {
  const frame = useCurrentFrame();
  const o = window01(frame, at, until, 0.25);
  const x = interpolate(fadeIn(frame, at, 0.4), [0, 1], [-18, 0]);
  return (
    <div
      style={{
        position: 'absolute',
        top,
        left: 60,
        opacity: o,
        transform: `translateX(${x}px)`,
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        fontFamily: fonts.sans,
        fontWeight: 800,
        fontSize: 40,
        letterSpacing: 3,
        color: colors.lilac,
      }}
    >
      <span style={{ width: 44, height: 4, borderRadius: 4, background: accentGradient }} />
      {children}
    </div>
  );
};

// Phrase captions, bottom-safe, accent on the key phrase.
export const Captions: React.FC<{ top?: number }> = ({ top = 1410 }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const cap = CAPTIONS.find((c) => t >= c.from && t < c.to);
  if (!cap) {
    return null;
  }
  const o = window01(frame, cap.from, cap.to, 0.12);
  const y = interpolate(fadeIn(frame, cap.from, 0.25), [0, 1], [12, 0]);
  let body: React.ReactNode = cap.text;
  if (cap.hi && cap.text.includes(cap.hi)) {
    const [a, b] = cap.text.split(cap.hi);
    body = (
      <>
        {a}
        <AccentText>{cap.hi}</AccentText>
        {b}
      </>
    );
  }
  return (
    <div style={{ position: 'absolute', top, left: 70, right: 70, display: 'flex', justifyContent: 'center' }}>
      <div
        style={{
          opacity: o,
          transform: `translateY(${y}px)`,
          padding: '18px 30px 20px',
          borderRadius: 26,
          background: 'rgba(7,10,24,0.62)',
          border: '1px solid rgba(199,203,255,0.12)',
          backdropFilter: 'blur(14px)',
          fontFamily: fonts.sans,
          fontWeight: 750,
          fontSize: 52,
          lineHeight: 1.18,
          letterSpacing: -0.6,
          color: colors.text,
          textAlign: 'center',
          maxWidth: 900,
        }}
      >
        {body}
      </div>
    </div>
  );
};

// Pointer drawn like the Windows arrow cursor.
export const Cursor: React.FC<{ x: number; y: number; scale?: number; opacity?: number }> = ({
  x,
  y,
  scale = 1,
  opacity = 1,
}) => (
  <svg
    width={36}
    height={52}
    viewBox="0 0 18 26"
    style={{
      position: 'absolute',
      left: x,
      top: y,
      opacity,
      transform: `scale(${scale})`,
      transformOrigin: '0 0',
      filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.5))',
    }}
  >
    <path d="M1 1 L1 20 L5.6 15.6 L8.8 23.4 L11.8 22.1 L8.7 14.6 L15 14.6 Z" fill="#fff" stroke="#111" strokeWidth={1.3} strokeLinejoin="round" />
  </svg>
);
