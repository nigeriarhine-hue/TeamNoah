import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

/**
 * Motion is calm and unhurried, like the voice: short fades, small rises,
 * no bounce. Springs are overdamped on purpose — nothing here should feel
 * like it is performing.
 */

/** Fade up over `dur` frames starting at `delay`. Returns style props. */
export const useRise = (delay = 0, dur = 18, distance = 14) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame - delay, [0, dur], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: (x) => 1 - Math.pow(1 - x, 3),
  });
  return {
    opacity: t,
    transform: `translateY(${(1 - t) * distance}px)`,
  };
};

/** Plain 0→1 ramp, clamped and eased. */
export const ease = (frame: number, from: number, to: number) =>
  interpolate(frame, [from, to], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: (x) => 1 - Math.pow(1 - x, 3),
  });

/** Overdamped spring for the few things that should settle rather than fade. */
export const useSettle = (delay = 0) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({
    frame: frame - delay,
    fps,
    config: { damping: 200, mass: 0.7, stiffness: 90 },
  });
};

/** Reveal `text` a character at a time — the machine voice, typing. */
export const typed = (text: string, frame: number, start: number, cps = 42, fps = 30) => {
  const chars = Math.floor(((frame - start) / fps) * cps);
  return text.slice(0, Math.max(0, chars));
};

/** Hold at 1 between in/out, fading at each end. Scene-level opacity. */
export const useSceneFade = (dur: number, inF = 12, outF = 12) => {
  const frame = useCurrentFrame();
  return Math.min(ease(frame, 0, inF), 1 - ease(frame, dur - outF, dur));
};
