import { Easing, interpolate, spring } from "remotion";

export const ease = Easing.bezier(0.22, 1, 0.36, 1);

/** 0→1 over [start, start+dur] with a smooth ease-out. */
export const prog = (frame: number, start: number, dur: number) =>
  interpolate(frame, [start, start + dur], [0, 1], {
    easing: ease,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

export const pop = (frame: number, fps: number, start: number, damping = 16) =>
  spring({ frame: frame - start, fps, config: { damping, stiffness: 170, mass: 0.7 } });

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Fade in at `start`, fade out ending at `end`. */
export const window01 = (frame: number, start: number, end: number, fade = 8) =>
  Math.min(prog(frame, start, fade), 1 - prog(frame, end - fade, fade));
