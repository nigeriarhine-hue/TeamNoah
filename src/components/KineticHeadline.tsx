import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import {AURORA, AURORA_LIGHT, C, FONT} from '../brand/theme';

export type HeadlineLine = {
  text: string;
  /** frame (relative to parent Sequence) the line starts revealing */
  at: number;
  accent?: boolean; // blue/violet gradient fill
  size?: number;
  color?: string;
};

// Line-by-line clean reveal: each line slides up from a mask with a short spring.
export const KineticHeadline: React.FC<{
  lines: HeadlineLine[];
  size?: number;
  align?: 'left' | 'center';
  dark?: boolean; // on a dark background
  lineHeight?: number;
  exitAt?: number; // frame at which the whole headline fades out
  style?: React.CSSProperties;
}> = ({lines, size = 104, align = 'left', dark = false, lineHeight = 1.0, exitAt, style}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const exit = exitAt === undefined ? 1 : interpolate(frame, [exitAt, exitAt + 8], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div style={{fontFamily: FONT, textAlign: align, opacity: exit, ...style}}>
      {lines.map((l, i) => {
        const p = spring({frame: frame - l.at, fps, config: {damping: 200, mass: 0.6}, durationInFrames: 14});
        const y = interpolate(p, [0, 1], [1.05, 0]);
        const fs = l.size ?? size;
        const color = l.color ?? (dark ? '#FFFFFF' : C.ink);
        return (
          <div key={i} style={{overflow: 'hidden', lineHeight, paddingBottom: fs * 0.08, marginBottom: -fs * 0.04}}>
            <div
              style={{
                transform: `translateY(${y * 100}%)`,
                opacity: interpolate(p, [0, 0.3], [0, 1], {extrapolateRight: 'clamp'}),
                fontSize: fs,
                fontWeight: 800,
                whiteSpace: 'nowrap',
                letterSpacing: '-0.035em',
                color,
                ...(l.accent
                  ? {
                      backgroundImage: dark ? AURORA_LIGHT : AURORA,
                      WebkitBackgroundClip: 'text',
                      backgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }
                  : {}),
              }}
            >
              {l.text}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Small uppercase eyebrow label with a leading rule (Noah site convention).
export const Eyebrow: React.FC<{text: string; at?: number; dark?: boolean; style?: React.CSSProperties}> = ({
  text,
  at = 0,
  dark,
  style,
}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame - at, [0, 10], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  const color = dark ? C.blueLight : C.indigo;
  return (
    <div
      style={{
        fontFamily: FONT,
        fontSize: 30,
        fontWeight: 800,
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
        color,
        display: 'flex',
        alignItems: 'center',
        gap: 18,
        opacity: o,
        transform: `translateX(${(1 - o) * -20}px)`,
        ...style,
      }}
    >
      <span style={{width: 40 * o, height: 4, background: color, borderRadius: 2}} />
      {text}
    </div>
  );
};
