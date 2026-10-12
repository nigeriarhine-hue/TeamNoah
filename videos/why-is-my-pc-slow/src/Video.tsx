import React from 'react';
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from 'remotion';
import { Fonts } from './edu/Fonts';
import { Captions, Word } from './edu/Captions';
import { FPS } from './edu/motion';
import { SCENES, SceneId, S, WORDS } from './timeline';
import { Hook } from './scenes/Hook';
import { Tip1, Tip2, Tip3, Tip4, Tip5 } from './scenes/Tips';
import { NoahSection } from './scenes/Noah';
import { EndCard } from './scenes/EndCard';

/** Each scene stays mounted a beat past its end so the next one can fade over it. */
const OVERLAP = 0.3;

const RENDER: Record<SceneId, React.FC<{ t: number; dur: number; t0: number }>> = {
  hook: Hook,
  tip1: Tip1,
  tip2: Tip2,
  tip3: Tip3,
  tip4: Tip4,
  tip5: Tip5,
  noah: NoahSection,
  cta: EndCard,
};

export const WhyIsMyPcSlow: React.FC = () => {
  const T = useCurrentFrame() / FPS;
  return (
    <AbsoluteFill style={{ background: '#0B0C12' }}>
      <Fonts />
      <Audio src={staticFile('audio/mix.wav')} />
      {(Object.keys(SCENES) as SceneId[]).map((id) => {
        const [a, b] = SCENES[id];
        if (T < a || T >= b + OVERLAP) return null;
        const C = RENDER[id];
        return (
          <AbsoluteFill key={id}>
            <C t={T - a} dur={b - a} t0={a} />
          </AbsoluteFill>
        );
      })}
      <Captions words={WORDS as Word[]} t={T} y={1452} hideAfter={S('n5') - 0.3} />
    </AbsoluteFill>
  );
};
