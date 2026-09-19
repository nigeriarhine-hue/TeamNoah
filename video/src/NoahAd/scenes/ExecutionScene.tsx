import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { GlowBackground } from '../components/GlowBackground';
import { NoahPanel } from '../components/NoahPanel';
import { anim, ease } from '../components/easing';
import type { AssetName } from '../config/asset-sizes';
import { copy } from '../config/copy';
import { font, safe, theme } from '../theme';

/**
 * SCENE 7 — EXECUTION.
 * Four words, four beats, each with the real screen state that earned it. The
 * words are not bullet points: each owns the frame for a moment and is replaced,
 * so the rhythm accelerates into the verification.
 */
const BEATS: Array<{ panel: AssetName; width: number; tiltY: number; second?: AssetName }> = [
  { panel: 'tile-startup', width: 430, tiltY: 4, second: 'tile-background' },
  { panel: 'crop-situation', width: 960, tiltY: -4 },
  { panel: 'crop-dialog', width: 660, tiltY: 3 },
  { panel: 'crop-executing', width: 960, tiltY: -3 },
];

const WORD_Y = 672;
/** Panels share one centre so the four beats cut against a stable frame. */
const PANEL_CENTRE = 1166;

export const ExecutionScene: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = (sec: number) => Math.round(sec * fps);
  const STEP = f(0.6);
  const START = f(0.12);

  return (
    <GlowBackground mood="warm" intensity={0.95} phase={23}>
      {BEATS.map((b, i) => {
        const at = START + i * STEP;
        const last = i === BEATS.length - 1;
        const p = anim(frame, [at, at + 16], [0, 1], ease.out);
        // the final beat holds — the scene dissolve carries it into the payoff
        const out = last ? 0 : anim(frame, [at + STEP - 11, at + STEP - 1], [0, 1], ease.in);
        const vis = p * (1 - out);
        if (vis <= 0.002) return null;
        const pair = b.second !== undefined;
        return (
          <React.Fragment key={b.panel}>
            <NoahPanel
              name={b.panel}
              width={b.width}
              x={pair ? -(b.width / 2 + 14) : 0}
              y={PANEL_CENTRE - 960 + (1 - p) * 44 - out * 32}
              tiltY={b.tiltY * (1 - p * 0.6)}
              radius={18}
              scale={0.94 + p * 0.06}
              opacity={vis}
              blur={(1 - p) * 10 + out * 8}
              glow={vis * 0.9}
            />
            {b.second && (
              <NoahPanel
                name={b.second}
                width={b.width}
                x={b.width / 2 + 14}
                y={PANEL_CENTRE - 960 + (1 - p) * 44 - out * 32}
                tiltY={-b.tiltY * (1 - p * 0.6)}
                radius={18}
                scale={0.94 + p * 0.06}
                opacity={vis}
                blur={(1 - p) * 10 + out * 8}
                glow={vis * 0.9}
              />
            )}
          </React.Fragment>
        );
      })}

      {/* the cadence */}
      <AbsoluteFill>
        {copy.beats.map((word, i) => {
          const at = START + i * STEP;
          const last = i === copy.beats.length - 1;
          const p = anim(frame, [at, at + 12], [0, 1], ease.out);
          const out = last
            // the last word clears before the payoff cuts in; its panel holds
            ? anim(frame, [durationInFrames - 13, durationInFrames - 3], [0, 1], ease.in)
            : anim(frame, [at + STEP - 12, at + STEP - 2], [0, 1], ease.in);
          const vis = p * (1 - out);
          if (vis <= 0.002) return null;
          return (
            <div
              key={word}
              style={{
                position: 'absolute',
                left: safe.x,
                right: safe.x,
                top: WORD_Y,
                fontFamily: font.sans,
                fontSize: 118,
                fontWeight: 800,
                letterSpacing: '-0.045em',
                lineHeight: 1,
                color: theme.ink,
                opacity: vis,
                transform: `translateY(${(1 - p) * 24 - out * 18}px)`,
                filter: p < 0.99 ? `blur(${(1 - p) * 9}px)` : undefined,
              }}
            >
              {word}
            </div>
          );
        })}
      </AbsoluteFill>

      {/* progress spine — the only mechanical motion in the film, deliberately so */}
      <div
        style={{
          position: 'absolute',
          left: safe.x,
          top: WORD_Y + 158,
          height: 5,
          width: anim(frame, [START, durationInFrames - f(0.18)], [0, safe.width], ease.inOut),
          background: theme.aurora,
          borderRadius: 3,
          opacity: 0.92,
        }}
      />
    </GlowBackground>
  );
};
