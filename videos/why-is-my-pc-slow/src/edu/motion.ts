import { Easing, interpolate, spring } from 'remotion';

export const FPS = 30;

const ease = Easing.bezier(0.22, 1, 0.36, 1);

/** 0→1 between seconds a and b, eased and clamped. */
export const ramp = (t: number, a: number, b: number, easing = ease) =>
  interpolate(t, [a, b], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing });

/** Spring that starts at second `at`. */
export const pop = (t: number, at: number, damping = 15, mass = 0.6) =>
  spring({ frame: Math.max(0, (t - at) * FPS), fps: FPS, config: { damping, mass } });

/** Fade in over [a, a+d], out over [b-d, b]. */
export const inOut = (t: number, a: number, b: number, d = 0.25) =>
  Math.min(ramp(t, a, a + d), 1 - ramp(t, b - d, b));

export const lerp = (p: number, a: number, b: number) => a + (b - a) * p;
