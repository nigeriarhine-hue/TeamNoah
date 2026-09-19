import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {fontStack, noah} from '../theme';

export type CaptionPart = {text: string; emphasis?: boolean};

/**
 * Short-phrase caption. Deliberately NOT karaoke: the whole phrase lands at once
 * and only chosen words carry emphasis, so the eye isn't dragged word to word.
 */
export const AnimatedCaption: React.FC<{
  parts: CaptionPart[];
  size?: number;
  accent?: string;
}> = ({parts, size = 68, accent = noah.periwinkle}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const enter = spring({frame, fps, config: {damping: 200, mass: 0.5}});
  const y = interpolate(enter, [0, 1], [26, 0]);
  const opacity = interpolate(frame, [0, 4], [0, 1], {extrapolateRight: 'clamp'});

  return (
    <div
      style={{
        transform: `translateY(${y}px)`,
        opacity,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '0 16px',
        maxWidth: 840,
      }}
    >
      {parts.map((p, i) => {
        const pop = p.emphasis
          ? spring({frame, fps, delay: 2 + i * 2, config: {damping: 10, mass: 0.4}})
          : 1;
        return (
        <span
          key={i}
          style={{
            display: 'inline-block',
            transform: p.emphasis ? `scale(${interpolate(pop, [0, 1], [0.7, 1])})` : undefined,
            fontFamily: fontStack,
            fontSize: size,
            lineHeight: 1.12,
            fontWeight: p.emphasis ? 900 : 700,
            letterSpacing: p.emphasis ? '-0.02em' : '-0.015em',
            color: p.emphasis ? accent : '#FFFFFF',
            textShadow: '0 4px 28px rgba(0,0,0,0.62), 0 1px 3px rgba(0,0,0,0.5)',
            textAlign: 'center',
          }}
        >
          {p.text}
        </span>
        );
      })}
    </div>
  );
};
