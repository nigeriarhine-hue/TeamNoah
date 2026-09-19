import React from 'react';
import { Img, useCurrentFrame } from 'remotion';
import { assets } from '../config/assets';
import { font, theme } from '../theme';
import { anim, ease } from './easing';

/**
 * The authentic Noah mark (§38) — the shipped SVG, rendered as vector.
 * brand-pack/README.md forbids recolouring, stretching, rotating, tilting the
 * waterline or adding effects to the mark, so the reveal is limited to opacity,
 * uniform scale and a clip. Any glow lives in the environment behind it.
 */
export const NoahLogo: React.FC<{
  size?: number;
  at?: number;
  /** Ambient light behind the mark — never on it. */
  halo?: number;
  opacity?: number;
  style?: React.CSSProperties;
}> = ({ size = 260, at = 0, halo = 1, opacity = 1, style }) => {
  const frame = useCurrentFrame();
  const p = anim(frame, [at, at + 30], [0, 1], ease.soft);
  const settle = anim(frame, [at, at + 46], [0, 1], ease.out);
  // uniform scale only: the circle stays a circle
  const scale = 0.9 + p * 0.1;

  return (
    <div
      style={{
        position: 'relative',
        width: size,
        height: size,
        opacity: opacity * p,
        transform: `scale(${scale})`,
        ...style,
      }}
    >
      {halo > 0 && (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: size * 2.6,
            height: size * 2.6,
            marginLeft: -size * 1.3,
            marginTop: -size * 1.3,
            background:
              'radial-gradient(50% 50% at 50% 50%, rgba(99,102,241,0.34) 0%, rgba(99,102,241,0) 68%)',
            opacity: halo * settle,
            filter: 'blur(30px)',
          }}
        />
      )}
      <Img
        src={assets.brand.logo}
        style={{ position: 'relative', width: size, height: size, display: 'block' }}
      />
    </div>
  );
};

/** The Noah app icon — used for the dock-rise reveal. */
export const NoahAppIcon: React.FC<{ size?: number; style?: React.CSSProperties }> = ({
  size = 180,
  style,
}) => (
  <Img
    src={assets.brand.appIcon}
    style={{
      width: size,
      height: size,
      display: 'block',
      borderRadius: size * 0.23,
      boxShadow:
        '0 10px 30px rgba(0,0,0,0.6), 0 34px 70px -28px rgba(80,90,220,0.75)',
      ...style,
    }}
  />
);

/** Wordmark set in the brand typeface — true text, never an image (§37). */
export const NoahWordmark: React.FC<{
  size?: number;
  at?: number;
  color?: string;
}> = ({ size = 104, at = 0, color = theme.ink }) => {
  const frame = useCurrentFrame();
  const p = anim(frame, [at, at + 26], [0, 1], ease.out);
  return (
    <div
      style={{
        fontFamily: font.sans,
        fontSize: size,
        fontWeight: 700,
        color,
        letterSpacing: `${-0.03 + (1 - p) * 0.06}em`,
        opacity: p,
        lineHeight: 1,
      }}
    >
      Noah
    </div>
  );
};
