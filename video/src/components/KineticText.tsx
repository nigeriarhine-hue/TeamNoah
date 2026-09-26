import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { FONT, GRAD_TEXT } from '../theme';
import { clamp, easeOut } from './primitives';

export type KLine = { text: string; accent?: boolean; size?: number; emphasize?: boolean };

/**
 * Word-by-word kinetic headline in the storyboard style: heavy italic caps,
 * gradient accent lines, masked rise + de-blur, optional emphasis pop.
 */
export const KineticText: React.FC<{
  lines: KLine[];
  start?: number;
  stagger?: number;
  size?: number;
  exitAt?: number;
  kicker?: string;
  align?: 'left' | 'center' | 'right';
  color?: string;
  shadow?: boolean;
  style?: React.CSSProperties;
}> = ({ lines, start = 0, stagger = 3, size = 104, exitAt, kicker, align = 'left', color = '#fff', shadow = true, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  let wi = 0;
  const exit = exitAt !== undefined ? interpolate(frame, [exitAt, exitAt + 8], [0, 1], clamp) : 0;
  const kickerIn = interpolate(frame, [start - 4, start + 8], [0, 1], clamp);
  return (
    <div
      style={{
        fontFamily: FONT,
        textAlign: align,
        opacity: 1 - exit,
        transform: `translateY(${-exit * 30}px)`,
        filter: exit > 0 ? `blur(${exit * 8}px)` : undefined,
        ...style,
      }}
    >
      {kicker && (
        <div
          style={{
            fontWeight: 800,
            fontStyle: 'italic',
            fontSize: size * 0.3,
            letterSpacing: 4,
            color: 'rgba(255,255,255,0.8)',
            marginBottom: size * 0.12,
            opacity: kickerIn,
            transform: `translateX(${(1 - kickerIn) * -30}px)`,
            textShadow: shadow ? '0 4px 24px rgba(0,0,0,0.6)' : undefined,
          }}
        >
          {kicker}
        </div>
      )}
      {lines.map((line, li) => {
        const fs = line.size ?? size;
        const words = line.text.split(' ');
        const lineStart = start + wi * stagger;
        const emph = line.emphasize
          ? spring({ frame: frame - lineStart - 10, fps, config: { damping: 9, stiffness: 140 } })
          : 0;
        const node = (
          <div
            key={li}
            style={{
              display: 'block',
              lineHeight: 0.98,
              whiteSpace: 'nowrap',
              transform: line.emphasize ? `scale(${1 + 0.08 * Math.sin(Math.min(1, emph) * Math.PI)})` : undefined,
              transformOrigin: align === 'left' ? '0% 60%' : '50% 60%',
            }}
          >
            {words.map((w, i) => {
              const s = start + wi * stagger;
              wi++;
              const p = spring({ frame: frame - s, fps, config: { damping: 18, stiffness: 170, mass: 0.8 } });
              const blur = interpolate(frame - s, [0, 8], [10, 0], { ...clamp, easing: easeOut });
              return (
                <span key={i} style={{ display: 'inline-block', overflow: 'hidden', paddingBottom: fs * 0.08, paddingRight: fs * 0.08, marginRight: fs * 0.14 - fs * 0.08 }}>
                  <span
                    style={{
                      display: 'inline-block',
                      fontWeight: 800,
                      fontStyle: 'italic',
                      fontSize: fs,
                      letterSpacing: -fs * 0.02,
                      textTransform: 'uppercase',
                      transform: `translateY(${(1 - p) * fs * 1.1}px) skewX(${(1 - p) * -8}deg)`,
                      filter: `blur(${blur}px)`,
                      opacity: Math.min(1, p * 1.4),
                      color: line.accent ? 'transparent' : color,
                      backgroundImage: line.accent ? GRAD_TEXT : undefined,
                      backgroundClip: line.accent ? 'text' : undefined,
                      WebkitBackgroundClip: line.accent ? 'text' : undefined,
                      textShadow: shadow && !line.accent ? '0 6px 30px rgba(0,0,0,0.55)' : undefined,
                    }}
                  >
                    {w}
                  </span>
                </span>
              );
            })}
          </div>
        );
        return node;
      })}
    </div>
  );
};
