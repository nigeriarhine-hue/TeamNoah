import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { CinematicText } from '../components/CinematicText';
import { GlowBackground } from '../components/GlowBackground';
import { NoahPanel } from '../components/NoahPanel';
import { heightFor } from '../config/asset-sizes';
import { anim, ease } from '../components/easing';
import { copy } from '../config/copy';
import { grid, headlineH, safe, stack, theme } from '../theme';

/**
 * SCENE 4 — INVESTIGATION.
 * Five real captures of the same run, cut in sequence over a fixed window on
 * the checklist, so it visibly fills in. No theatrical "hacking" graphics — the
 * product's own progress list is the whole effect.
 */
const STATES = [
  'card-listening',
  'card-checks-2',
  'card-checks-4',
  'card-thinking',
  'card-thinking-5s',
] as const;

export const InvestigationScene: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = (sec: number) => Math.round(sec * fps);

  const CARD_W = grid.heroWide;
  const L = stack(headlineH.oneRuled, heightFor('card-checks-4', CARD_W));

  const cues = [0, f(0.5), f(1.0), f(1.5), f(2.0)];
  const active = cues.reduce((acc, c, i) => (frame >= c ? i : acc), 0);

  // a single slow push across the whole scene, independent of the cuts
  const push = anim(frame, [0, durationInFrames], [0.99, 1.045], ease.inOut);
  const sweep = ((frame % Math.round(fps * 1.4)) / (fps * 1.4)) * 1.7 - 0.35;

  return (
    <GlowBackground mood="warm" intensity={0.85} phase={11}>
      <NoahPanel
        name={STATES[active]}
        width={CARD_W}
        y={L.heroY}
        tiltY={anim(frame, [0, durationInFrames], [3, -1.5], ease.inOut)}
        tiltX={1.5}
        scale={push}
        glow={0.95}
      />

      {/* a light passes over the panel while Noah works — motion with a reason */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: `${sweep * 100}%`,
          height: 300,
          background:
            'linear-gradient(180deg, rgba(139,143,248,0) 0%, rgba(139,143,248,0.085) 50%, rgba(139,143,248,0) 100%)',
          pointerEvents: 'none',
          mixBlendMode: 'screen',
        }}
      />

      <div style={{ position: 'absolute', left: safe.x, right: safe.x, top: L.headline, zIndex: 50 }}>
        <CinematicText at={f(0.08)} until={durationInFrames - f(0.22)} size={82} weight={700}>
          {copy.investigate}
        </CinematicText>
        <div
          style={{
            marginTop: 22,
            height: 4,
            width: anim(frame, [f(0.3), durationInFrames - f(0.18)], [0, 470], ease.inOut),
            background: theme.aurora,
            borderRadius: 2,
            opacity: 0.9,
          }}
        />
      </div>
    </GlowBackground>
  );
};
