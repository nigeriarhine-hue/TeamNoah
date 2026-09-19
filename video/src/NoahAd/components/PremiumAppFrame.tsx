import React from 'react';
import { theme } from '../theme';

/**
 * The single presentation shell every Noah surface is shown in (§12).
 * Radius, border, shadow and background separation are defined once here so
 * every screen in the film looks like it belongs to the same advertisement.
 */
export const FRAME = {
  radius: 26,
  border: '1px solid rgba(255,255,255,0.10)',
  /** Layered shadow: contact, mid, and a wide ambient bed. */
  shadow:
    '0 2px 6px rgba(0,0,0,0.5), 0 26px 60px -22px rgba(0,0,0,0.85), 0 70px 150px -60px rgba(64,72,190,0.55)',
  highlight:
    'linear-gradient(180deg, rgba(255,255,255,0.11) 0%, rgba(255,255,255,0) 22%)',
} as const;

type Props = {
  children: React.ReactNode;
  width: number;
  height: number;
  radius?: number;
  /** Degrees. Kept small — a tilt, never a stunt. */
  tiltX?: number;
  tiltY?: number;
  scale?: number;
  x?: number;
  y?: number;
  opacity?: number;
  /** Ambient bloom behind the panel, in brand indigo. */
  glow?: number;
  blur?: number;
  /** Multiplies the panel's luminance — for hover and focus states (§28). */
  brightness?: number;
  style?: React.CSSProperties;
};

export const PremiumAppFrame: React.FC<Props> = ({
  children,
  width,
  height,
  radius = FRAME.radius,
  tiltX = 0,
  tiltY = 0,
  scale = 1,
  x = 0,
  y = 0,
  opacity = 1,
  glow = 1,
  blur = 0,
  brightness = 1,
  style,
}) => (
  <div
    style={{
      position: 'absolute',
      left: '50%',
      top: '50%',
      width,
      height,
      marginLeft: -width / 2,
      marginTop: -height / 2,
      transformStyle: 'preserve-3d',
      transform: `translate3d(${x}px, ${y}px, 0) perspective(2400px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(${scale})`,
      opacity,
      // one filter string: a caller-set brightness must not clobber the blur
      filter:
        [
          blur > 0.05 ? `blur(${blur}px)` : '',
          Math.abs(brightness - 1) > 0.002 ? `brightness(${brightness})` : '',
        ]
          .filter(Boolean)
          .join(' ') || undefined,
      willChange: 'transform, opacity',
      ...style,
    }}
  >
    {/* ambient bed — separates the panel from the environment */}
    {glow > 0 && (
      <div
        style={{
          position: 'absolute',
          inset: '-14%',
          borderRadius: radius * 2.4,
          background:
            'radial-gradient(60% 52% at 50% 52%, rgba(99,102,241,0.30) 0%, rgba(99,102,241,0) 72%)',
          opacity: glow,
          filter: 'blur(42px)',
        }}
      />
    )}
    <div
      style={{
        position: 'absolute',
        inset: 0,
        borderRadius: radius,
        overflow: 'hidden',
        border: FRAME.border,
        boxShadow: FRAME.shadow,
        background: theme.panel,
        // keeps the child image from bleeding past the rounded corner while transformed
        isolation: 'isolate',
      }}
    >
      {children}
      {/* glass top-light */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: radius,
          background: FRAME.highlight,
          pointerEvents: 'none',
        }}
      />
      {/* inner hairline keeps the edge crisp against the dark room */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: radius,
          boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.055)',
          pointerEvents: 'none',
        }}
      />
    </div>
  </div>
);
