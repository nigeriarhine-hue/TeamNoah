import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { CinematicText, WordReveal } from '../components/CinematicText';
import { GlowBackground } from '../components/GlowBackground';
import { anim, ease } from '../components/easing';
import { copy } from '../config/copy';
import { safe, theme } from '../theme';

/**
 * SCENE 1 — THE CONTRADICTION.
 * A wait spinner alone in the dark is the first frame: instantly legible as
 * "this machine is struggling". Then three lines, paced with real pauses.
 */
export const HookScene: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = (sec: number) => Math.round(sec * fps);

  // one continuous, barely perceptible push through the whole scene
  const push = anim(frame, [0, durationInFrames], [1.0, 1.05], ease.inOut);
  const drift = anim(frame, [0, durationInFrames], [16, -16], ease.inOut);

  const OUT = f(2.62);
  const ASK = f(2.95);
  const spinnerOut = anim(frame, [OUT, OUT + 12], [1, 0], ease.in);

  return (
    <GlowBackground mood="quiet" intensity={0.85}>
      <AbsoluteFill style={{ transform: `scale(${push}) translateY(${drift}px)` }}>
        {/* the symptom, abstracted — no OS or product is depicted */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: 520,
            marginLeft: -78,
            opacity: spinnerOut * anim(frame, [0, 12], [0.55, 1], ease.out),
            transform: `scale(${anim(frame, [0, 26], [0.92, 1], ease.soft)})`,
          }}
        >
          <WaitSpinner frame={frame} fps={fps} size={156} />
        </div>

        <div style={{ position: 'absolute', left: safe.x, right: safe.x, top: 880 }}>
          <WordReveal text={copy.hook.a} at={f(0.34)} until={OUT} size={100} weight={700} />

          {/* the contradiction: nothing changed, yet everything did */}
          <div style={{ marginTop: 44 }}>
            <CinematicText at={f(1.52)} until={OUT} size={70} weight={500} color={theme.inkDim}>
              {copy.hook.b[0]}
            </CinematicText>
            <CinematicText
              at={f(1.88)}
              until={OUT}
              size={70}
              weight={500}
              color={theme.inkDim}
              style={{ marginTop: 8 }}
            >
              {copy.hook.b[1]}
            </CinematicText>
          </div>
        </div>

        {/* the question — held, alone, with air around it */}
        <AbsoluteFill
          style={{
            alignItems: 'flex-start',
            justifyContent: 'center',
            paddingLeft: safe.x,
            paddingRight: safe.x,
          }}
        >
          <CinematicText at={ASK} size={104} weight={700} rise={32} maxWidth={860}>
            {copy.hook.c}
          </CinematicText>
        </AbsoluteFill>
      </AbsoluteFill>
    </GlowBackground>
  );
};

/** Generic indeterminate spinner: an arc that never closes. */
const WaitSpinner: React.FC<{ frame: number; fps: number; size: number }> = ({ frame, fps, size }) => {
  const rot = (frame / fps) * 168;
  const sweep = 62 + Math.sin((frame / fps) * 2.1) * 34;
  const r = size / 2 - 7;
  const c = size / 2;
  const rad = (d: number) => ((d - 90) * Math.PI) / 180;
  const large = sweep > 180 ? 1 : 0;

  return (
    <svg width={size} height={size} style={{ transform: `rotate(${rot}deg)`, display: 'block' }}>
      <circle cx={c} cy={c} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={7} />
      <path
        d={`M ${c + r * Math.cos(rad(0))} ${c + r * Math.sin(rad(0))} A ${r} ${r} 0 ${large} 1 ${c + r * Math.cos(rad(sweep))} ${c + r * Math.sin(rad(sweep))}`}
        fill="none"
        stroke={theme.indigo}
        strokeWidth={7}
        strokeLinecap="round"
        opacity={0.92}
      />
    </svg>
  );
};
