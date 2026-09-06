import React from 'react';
import { AbsoluteFill } from 'remotion';
import { color, font, headlineTracking, inkFaint, inkMuted, rule } from '../brand';
import { useRise } from './anim';

/** The cream ground everything sits on. Generous margins, few elements. */
export const Frame: React.FC<{
  children: React.ReactNode;
  opacity?: number;
  footer?: string;
}> = ({ children, opacity = 1, footer }) => (
  <AbsoluteFill style={{ backgroundColor: color.cream, opacity }}>
    <AbsoluteFill
      style={{
        padding: '104px 132px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      {children}
    </AbsoluteFill>
    {footer ? (
      <div
        style={{
          position: 'absolute',
          left: 132,
          bottom: 56,
          fontFamily: font.mono,
          fontSize: 19,
          letterSpacing: '0.04em',
          color: inkFaint,
        }}
      >
        {footer}
      </div>
    ) : null}
  </AbsoluteFill>
);

/** Small label above a headline. Says what kind of thing you're looking at. */
export const Eyebrow: React.FC<{ children: React.ReactNode; delay?: number; tone?: string }> = ({
  children,
  delay = 0,
  tone = inkMuted,
}) => (
  <div
    style={{
      ...useRise(delay),
      fontFamily: font.sans,
      fontWeight: 700,
      fontSize: 22,
      letterSpacing: '0.16em',
      textTransform: 'uppercase',
      color: tone,
      marginBottom: 26,
    }}
  >
    {children}
  </div>
);

export const Headline: React.FC<{
  children: React.ReactNode;
  delay?: number;
  size?: number;
  tone?: string;
}> = ({ children, delay = 0, size = 92, tone = color.ink }) => (
  <div
    style={{
      ...useRise(delay),
      fontFamily: font.sans,
      fontWeight: 700,
      fontSize: size,
      lineHeight: 1.06,
      letterSpacing: headlineTracking,
      color: tone,
      maxWidth: 1500,
    }}
  >
    {children}
  </div>
);

/** The accent voice. Italic serif, never a headline, never more than a line. */
export const Accent: React.FC<{ children: React.ReactNode; delay?: number; size?: number }> = ({
  children,
  delay = 0,
  size = 76,
}) => (
  <div
    style={{
      ...useRise(delay),
      fontFamily: font.serif,
      fontStyle: 'italic',
      fontSize: size,
      lineHeight: 1.12,
      color: color.structure,
      letterSpacing: '-0.01em',
    }}
  >
    {children}
  </div>
);

export const Body: React.FC<{
  children: React.ReactNode;
  delay?: number;
  size?: number;
  tone?: string;
  width?: number;
}> = ({ children, delay = 0, size = 34, tone = inkMuted, width = 1180 }) => (
  <div
    style={{
      ...useRise(delay),
      fontFamily: font.sans,
      fontWeight: 400,
      fontSize: size,
      lineHeight: 1.5,
      color: tone,
      maxWidth: width,
    }}
  >
    {children}
  </div>
);

/** Soft card: 12px radius, low shadow. */
export const Card: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ children, style }) => (
  <div
    style={{
      background: '#F7F4EF',
      border: `1px solid ${rule}`,
      borderRadius: 12,
      boxShadow: '0 1px 2px rgba(42,37,31,0.04), 0 10px 30px rgba(42,37,31,0.05)',
      ...style,
    }}
  >
    {children}
  </div>
);
