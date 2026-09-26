import React from 'react';
import { AbsoluteFill, Easing, Img, interpolate, random, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { C, FONT } from '../theme';

export const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);

/** Fade/scale wrapper so every scene enters and leaves with motion instead of a hard cut. */
export const Scene: React.FC<{
  children: React.ReactNode;
  fadeIn?: number;
  fadeOut?: number;
  style?: React.CSSProperties;
}> = ({ children, fadeIn = 8, fadeOut = 0, style }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const inO = fadeIn ? interpolate(frame, [0, fadeIn], [0, 1], clamp) : 1;
  const outO = fadeOut ? interpolate(frame, [durationInFrames - fadeOut, durationInFrames], [1, 0], clamp) : 1;
  return <AbsoluteFill style={{ opacity: inO * outO, ...style }}>{children}</AbsoluteFill>;
};

/** 1920x1080 title-safe box (90%) that on-screen text is laid out inside. */
export const SafeArea: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <AbsoluteFill style={{ padding: '54px 96px', ...style }}>
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>{children}</div>
  </AbsoluteFill>
);

/** Slow floating bokeh particles. */
export const Particles: React.FC<{ count?: number; seed?: string; color?: string; opacity?: number }> = ({
  count = 34,
  seed = 'p',
  color = '#9DB0FF',
  opacity = 0.5,
}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', mixBlendMode: 'screen' }}>
      {Array.from({ length: count }).map((_, i) => {
        const x = random(`${seed}x${i}`) * 1920;
        const y0 = random(`${seed}y${i}`) * 1080;
        const r = 2 + random(`${seed}r${i}`) * 7;
        const speed = 0.2 + random(`${seed}s${i}`) * 0.6;
        const y = ((y0 - frame * speed) % 1180 + 1180) % 1180 - 50;
        const drift = Math.sin(frame / 40 + i) * 14;
        const tw = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(frame / 18 + i * 1.7));
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x + drift,
              top: y,
              width: r,
              height: r,
              borderRadius: '50%',
              background: color,
              opacity: opacity * tw,
              filter: `blur(${r > 6 ? 2 : 0.6}px)`,
              boxShadow: `0 0 ${r * 3}px ${color}`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/** Soft diagonal light streak that sweeps across the frame. */
export const LightSweep: React.FC<{ start?: number; duration?: number; opacity?: number; color?: string }> = ({
  start = 0,
  duration = 40,
  opacity = 0.35,
  color = 'rgba(160,170,255,1)',
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [start, start + duration], [-0.4, 1.4], { ...clamp, easing: easeInOut });
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', mixBlendMode: 'screen', overflow: 'hidden' }}>
      <div
        style={{
          position: 'absolute',
          top: -400,
          left: p * 1920 - 300,
          width: 260,
          height: 1900,
          transform: 'rotate(22deg)',
          background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
          opacity: opacity * Math.sin(Math.PI * Math.min(1, Math.max(0, (p + 0.4) / 1.8))),
          filter: 'blur(30px)',
        }}
      />
    </AbsoluteFill>
  );
};

/** Film grain + vignette for a premium finish. */
export const Finish: React.FC<{ vignette?: number }> = ({ vignette = 0.55 }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <AbsoluteFill
        style={{ background: `radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(0,0,6,${vignette}) 100%)` }}
      />
      <AbsoluteFill
        style={{
          opacity: 0.05,
          backgroundImage:
            'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'220\' height=\'220\'><filter id=\'n\'><feTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'2\'/></filter><rect width=\'100%\' height=\'100%\' filter=\'url(%23n)\'/></svg>")',
          backgroundPosition: `${(frame * 37) % 220}px ${(frame * 53) % 220}px`,
          mixBlendMode: 'overlay',
        }}
      />
    </AbsoluteFill>
  );
};

/** Noah mark. Brand rules: no recolour, no effects, keep proportions. */
export const NoahMark: React.FC<{ size: number; variant?: 'light' | 'dark' | 'white' }> = ({ size, variant = 'light' }) => (
  <Img
    src={staticFile(
      variant === 'light' ? 'brand/noah-mark-light.svg' : variant === 'dark' ? 'brand/noah-mark-dark.svg' : 'brand/noah-mark-1color-white.svg',
    )}
    style={{ width: size, height: size, display: 'block' }}
  />
);

export const NoahLockup: React.FC<{ size: number; color?: string; variant?: 'light' | 'dark' | 'white' }> = ({
  size,
  color = C.navy,
  variant = 'light',
}) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: size * 0.18 }}>
    <NoahMark size={size} variant={variant} />
    <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: size * 0.62, color, letterSpacing: -0.5 }}>Noah</span>
  </div>
);

/** Animated mouse pointer that glides between points and presses at `clickAt`. */
export const CursorClick: React.FC<{
  path: { f: number; x: number; y: number }[];
  clickAt?: number;
  appearAt?: number;
}> = ({ path, clickAt, appearAt = path[0].f }) => {
  const frame = useCurrentFrame();
  const fs = path.map((p) => p.f);
  const x = interpolate(frame, fs, path.map((p) => p.x), { ...clamp, easing: easeInOut });
  const y = interpolate(frame, fs, path.map((p) => p.y), { ...clamp, easing: easeInOut });
  const o = interpolate(frame, [appearAt, appearAt + 6], [0, 1], clamp);
  const press = clickAt !== undefined ? interpolate(frame, [clickAt - 2, clickAt, clickAt + 5], [1, 0.82, 1], clamp) : 1;
  const ring = clickAt !== undefined ? interpolate(frame, [clickAt, clickAt + 14], [0, 1], clamp) : 0;
  return (
    <div style={{ position: 'absolute', left: x, top: y, opacity: o, zIndex: 50, pointerEvents: 'none' }}>
      {clickAt !== undefined && frame >= clickAt && (
        <div
          style={{
            position: 'absolute',
            left: -28 * (0.4 + ring),
            top: -28 * (0.4 + ring),
            width: 56 * (0.4 + ring),
            height: 56 * (0.4 + ring),
            borderRadius: '50%',
            border: `3px solid rgba(99,102,241,${1 - ring})`,
          }}
        />
      )}
      <svg width="34" height="40" viewBox="0 0 17 20" style={{ transform: `scale(${press})`, transformOrigin: '0 0', filter: 'drop-shadow(0 3px 5px rgba(0,0,0,0.35))' }}>
        <path d="M1 1v15.5l4.2-4 2.7 6.2 2.6-1.1-2.7-6.1H14z" fill="#fff" stroke="#111" strokeWidth="1.2" strokeLinejoin="round" />
      </svg>
    </div>
  );
};

/**
 * Keyframed camera for any layer: scale + translate, eased between keys.
 * Used for push-ins on the character and focus zooms on the Noah UI.
 */
export type CamKey = { f: number; s: number; x: number; y: number };
export const useCamera = (keys: CamKey[]) => {
  const frame = useCurrentFrame();
  const fs = keys.map((k) => k.f);
  if (keys.length === 1) return keys[0];
  const opt = { ...clamp, easing: easeInOut };
  return {
    s: interpolate(frame, fs, keys.map((k) => k.s), opt),
    x: interpolate(frame, fs, keys.map((k) => k.x), opt),
    y: interpolate(frame, fs, keys.map((k) => k.y), opt),
  };
};

export const FocusZoom: React.FC<{ keys: CamKey[]; origin?: string; children: React.ReactNode }> = ({
  keys,
  origin = '50% 50%',
  children,
}) => {
  const c = useCamera(keys);
  return (
    <AbsoluteFill style={{ transform: `translate(${c.x}px, ${c.y}px) scale(${c.s})`, transformOrigin: origin }}>
      {children}
    </AbsoluteFill>
  );
};
