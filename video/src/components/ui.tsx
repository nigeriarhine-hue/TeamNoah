import React from 'react';
import {c, ink, font, displayTracking, aurora, card} from '../theme';

export const Kicker: React.FC<{children: React.ReactNode; u: number; tone?: 'muted' | 'amber'}> = ({
  children,
  u,
  tone = 'muted',
}) => (
  <div
    style={{
      fontFamily: font.mono,
      fontSize: 19 * u,
      fontWeight: 500,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: tone === 'amber' ? c.amber : ink.muted,
    }}
  >
    {children}
  </div>
);

export const Headline: React.FC<{
  children: React.ReactNode;
  u: number;
  size?: number;
  color?: string;
  maxWidth?: number | string;
}> = ({children, u, size = 88, color = ink.primary, maxWidth}) => (
  <h1
    style={{
      fontFamily: font.display,
      fontWeight: 700,
      fontSize: size * u,
      lineHeight: 1.06,
      letterSpacing: displayTracking,
      color,
      margin: 0,
      maxWidth,
      textWrap: 'balance',
    }}
  >
    {children}
  </h1>
);

export const Lede: React.FC<{
  children: React.ReactNode;
  u: number;
  size?: number;
  color?: string;
  maxWidth?: number | string;
}> = ({children, u, size = 32, color = ink.secondary, maxWidth}) => (
  <p
    style={{
      fontFamily: font.body,
      fontWeight: 400,
      fontSize: size * u,
      lineHeight: 1.45,
      color,
      margin: 0,
      maxWidth,
    }}
  >
    {children}
  </p>
);

/** Instrument Serif italic — the accent voice. Never a headline. */
export const Accent: React.FC<{children: React.ReactNode; u: number; size?: number; color?: string}> = ({
  children,
  u,
  size = 44,
  color = ink.primary,
}) => (
  <p
    style={{
      fontFamily: font.accent,
      fontStyle: 'italic',
      fontWeight: 400,
      fontSize: size * u,
      lineHeight: 1.25,
      color,
      margin: 0,
    }}
  >
    {children}
  </p>
);

/** The machine voice. Paths, process names, settings — never marketing copy. */
export const Mono: React.FC<{
  children: React.ReactNode;
  u: number;
  size?: number;
  color?: string;
}> = ({children, u, size = 24, color = ink.secondary}) => (
  <span
    style={{
      fontFamily: font.mono,
      fontWeight: 400,
      fontSize: size * u,
      letterSpacing: '-0.01em',
      color,
    }}
  >
    {children}
  </span>
);

export const Card: React.FC<{
  children: React.ReactNode;
  u: number;
  style?: React.CSSProperties;
}> = ({children, u, style}) => (
  <div
    style={{
      background: card.background,
      borderRadius: card.radius * u,
      border: card.border,
      boxShadow: card.shadow,
      padding: 30 * u,
      ...style,
    }}
  >
    {children}
  </div>
);

/** The one thing to do next. The aurora gradient lives here and nowhere else. */
export const PrimaryAction: React.FC<{
  children: React.ReactNode;
  u: number;
  pressed?: number;
}> = ({children, u, pressed = 0}) => (
  <div
    style={{
      background: aurora,
      color: c.white,
      fontFamily: font.body,
      fontWeight: 700,
      fontSize: 27 * u,
      letterSpacing: '-0.01em',
      padding: `${17 * u}px ${44 * u}px`,
      borderRadius: 10 * u,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      transform: `scale(${1 - pressed * 0.025})`,
    }}
  >
    {children}
  </div>
);

export const Check: React.FC<{size: number; color?: string; progress?: number}> = ({
  size,
  color = c.teal,
  progress = 1,
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10.5" stroke={color} strokeWidth="1.6" opacity={progress} />
    <path
      d="M7.2 12.4 L10.6 15.6 L16.9 8.9"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray="16"
      strokeDashoffset={16 * (1 - progress)}
    />
  </svg>
);
