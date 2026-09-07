import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { AURORA, C, MONO, SANS, headline } from '../theme';

export const STAGE_X = 92;

export const useFade = (a: number, b: number) => {
  const f = useCurrentFrame();
  return interpolate(f, [a, b], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
};

/** Soft card, 12px radii, low shadow — the kit's screen surface. */
export const Panel: React.FC<{
  style?: React.CSSProperties;
  dark?: boolean;
  children?: React.ReactNode;
}> = ({ style, dark, children }) => (
  <div
    style={{
      backgroundColor: dark ? C.night : C.card,
      borderRadius: 12,
      boxShadow: '0 1px 2px rgba(15,23,41,.04), 0 8px 24px -12px rgba(15,23,41,.12)',
      padding: 34,
      ...style,
    }}
  >
    {children}
  </div>
);

export const Mono: React.FC<{
  children: React.ReactNode;
  size?: number;
  color?: string;
  style?: React.CSSProperties;
}> = ({ children, size = 24, color = C.ink, style }) => (
  <div style={{ fontFamily: MONO, fontSize: size, color, ...style }}>{children}</div>
);

export const Label: React.FC<{ children: React.ReactNode; color?: string }> = ({
  children,
  color = C.mute,
}) => (
  <div
    style={{
      fontFamily: SANS,
      fontWeight: 500,
      fontSize: 17,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color,
      marginBottom: 18,
    }}
  >
    {children}
  </div>
);

/** The one primary action in the whole video. Aurora appears here and nowhere else. */
export const ApproveButton: React.FC<{ pressed: number }> = ({ pressed }) => (
  <div
    style={{
      background: AURORA,
      borderRadius: 12,
      padding: '22px 54px',
      display: 'inline-block',
      transform: `scale(${1 - pressed * 0.03})`,
      boxShadow: `0 ${10 - pressed * 6}px ${26 - pressed * 12}px -8px rgba(79,70,229,.55)`,
    }}
  >
    <span style={{ ...headline(31), color: '#fff', letterSpacing: '-0.02em' }}>Approve</span>
  </div>
);

export const Tick: React.FC<{ o: number }> = ({ o }) => (
  <svg width="26" height="26" viewBox="0 0 26 26" style={{ opacity: o, flexShrink: 0 }}>
    <path d="M5 13.5 L10.5 19 L21 7" fill="none" stroke={C.commit} strokeWidth="3.2"
      strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const Headline: React.FC<{ children: React.ReactNode; size?: number; style?: React.CSSProperties }> = ({
  children, size = 40, style,
}) => <div style={{ ...headline(size), ...style }}>{children}</div>;
