import React from 'react';
import { useCurrentFrame } from 'remotion';
import { font, theme } from '../theme';
import { anim, ease } from './easing';

/**
 * A terminal-style line that types itself, for generic shell evidence —
 * never for reproducing Noah's own output, which always comes from a real capture.
 *
 * Not used by the current cut, which has no terminal beat. It is here for the
 * VS Code / Git story in config/copy.ts, whose hook turns on `git --version`
 * working in Terminal and `which git` returning /usr/bin/git after the fix.
 */
export const CodeLine: React.FC<{
  prompt?: string;
  text: string;
  at?: number;
  /** Frames per character. */
  speed?: number;
  size?: number;
  color?: string;
  caret?: boolean;
  style?: React.CSSProperties;
}> = ({ prompt = '$', text, at = 0, speed = 1.1, size = 36, color = theme.ink, caret = true, style }) => {
  const frame = useCurrentFrame();
  const chars = Math.floor(anim(frame, [at, at + text.length * speed], [0, text.length], ease.inOut));
  const shown = text.slice(0, chars);
  const done = chars >= text.length;
  const blink = Math.floor(frame / 8) % 2 === 0;

  return (
    <div
      style={{
        fontFamily: font.mono,
        fontSize: size,
        fontWeight: 500,
        color,
        letterSpacing: '-0.01em',
        whiteSpace: 'pre',
        display: 'flex',
        alignItems: 'baseline',
        gap: 14,
        ...style,
      }}
    >
      {prompt ? <span style={{ color: theme.indigo }}>{prompt}</span> : null}
      <span>
        {shown}
        {caret && (!done || blink) && (
          <span
            style={{
              display: 'inline-block',
              width: size * 0.54,
              height: size * 1.05,
              background: theme.indigo,
              transform: 'translateY(4px)',
              marginLeft: 3,
              opacity: done ? (blink ? 1 : 0) : 1,
            }}
          />
        )}
      </span>
    </div>
  );
};

/** Machine output line — dimmer, no prompt, reveals as a whole. */
export const OutputLine: React.FC<{
  text: string;
  at?: number;
  size?: number;
  color?: string;
  style?: React.CSSProperties;
}> = ({ text, at = 0, size = 34, color = theme.teal, style }) => {
  const frame = useCurrentFrame();
  const p = anim(frame, [at, at + 12], [0, 1], ease.out);
  return (
    <div
      style={{
        fontFamily: font.mono,
        fontSize: size,
        fontWeight: 500,
        color,
        opacity: p,
        transform: `translateY(${(1 - p) * 8}px)`,
        whiteSpace: 'pre',
        ...style,
      }}
    >
      {text}
    </div>
  );
};
