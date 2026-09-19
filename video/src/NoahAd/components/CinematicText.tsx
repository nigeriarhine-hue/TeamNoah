import React from 'react';
import { useCurrentFrame } from 'remotion';
import { font, theme } from '../theme';
import { anim, ease } from './easing';

export type TextAlign = 'left' | 'center';

type Props = {
  children: React.ReactNode;
  /** Frame (scene-relative) at which the line starts arriving. */
  at?: number;
  /** Frame at which the line starts leaving. Omit to hold. */
  until?: number;
  size?: number;
  weight?: number;
  color?: string;
  align?: TextAlign;
  tracking?: number;
  lineHeight?: number;
  maxWidth?: number;
  style?: React.CSSProperties;
  /** Travel distance for the rise-in, px. */
  rise?: number;
  /** Slight blur on entry reads as a focus pull. */
  focus?: boolean;
};

/**
 * One thought at a time (§14). Real HTML text — never a flattened image (§37).
 * Rises, settles, and optionally pulls focus. No bounce, no spin.
 */
export const CinematicText: React.FC<Props> = ({
  children,
  at = 0,
  until,
  size = 82,
  weight = 600,
  color = theme.ink,
  align = 'left',
  tracking = -0.032,
  lineHeight = 1.1,
  maxWidth,
  style,
  rise = 26,
  focus = true,
}) => {
  const frame = useCurrentFrame();
  const inP = anim(frame, [at, at + 16], [0, 1], ease.out);
  const outP = until === undefined ? 0 : anim(frame, [until, until + 12], [0, 1], ease.in);
  const opacity = inP * (1 - outP);
  const y = (1 - inP) * rise - outP * 14;
  const blur = focus ? (1 - inP) * 7 + outP * 5 : 0;

  return (
    <div
      style={{
        fontFamily: font.sans,
        fontSize: size,
        fontWeight: weight,
        color,
        letterSpacing: `${tracking}em`,
        lineHeight,
        textAlign: align,
        maxWidth,
        opacity,
        transform: `translateY(${y}px)`,
        filter: blur > 0.05 ? `blur(${blur}px)` : undefined,
        willChange: 'transform, opacity, filter',
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/**
 * Word-by-word settle, the reference's signature move. Each word arrives on its
 * own slightly-offset curve, so the line assembles instead of appearing.
 */
export const WordReveal: React.FC<
  Omit<Props, 'children'> & { text: string; stagger?: number }
> = ({ text, at = 0, until, stagger = 3.2, size = 82, weight = 600, color = theme.ink, align = 'left', tracking = -0.032, lineHeight = 1.1, maxWidth, style, rise = 22 }) => {
  const frame = useCurrentFrame();
  const words = text.split(' ');
  const outP = until === undefined ? 0 : anim(frame, [until, until + 12], [0, 1], ease.in);

  return (
    <div
      style={{
        fontFamily: font.sans,
        fontSize: size,
        fontWeight: weight,
        color,
        letterSpacing: `${tracking}em`,
        lineHeight,
        textAlign: align,
        maxWidth,
        opacity: 1 - outP,
        transform: `translateY(${-outP * 14}px)`,
        ...style,
      }}
    >
      {words.map((w, i) => {
        const start = at + i * stagger;
        const p = anim(frame, [start, start + 18], [0, 1], ease.out);
        return (
          <span
            key={`${w}-${i}`}
            style={{
              display: 'inline-block',
              opacity: p,
              transform: `translateY(${(1 - p) * rise}px)`,
              filter: p < 0.99 ? `blur(${(1 - p) * 6}px)` : undefined,
              willChange: 'transform, opacity',
            }}
          >
            {w}
            {i < words.length - 1 ? ' ' : ''}
          </span>
        );
      })}
    </div>
  );
};
