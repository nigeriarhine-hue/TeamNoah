import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import './fonts';
import { Caption, Chrome } from './components/Frame';
import { CardStack } from './components/CardStack';
import { BLOCKS } from './script';
import { SCENES } from './scenes';
import { C, SANS, SCENE_FRAMES, WATERLINE_Y } from './theme';

export const TOTAL_FRAMES = BLOCKS.length * SCENE_FRAMES;

export const NoahExplainer: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.page, fontFamily: SANS }}>
    {/* SKY — scene visuals, plus the through-line stack which reads the
        global frame so it grows continuously across block boundaries. */}
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: WATERLINE_Y, overflow: 'hidden' }}>
      {SCENES.map((Scene, i) => (
        <Sequence key={i} from={i * SCENE_FRAMES} durationInFrames={SCENE_FRAMES} name={`Block ${i + 1}`}>
          <Scene />
        </Sequence>
      ))}
      <CardStack />
    </div>

    <Chrome />

    {/* TIDE — the narration. One line per block, revealed at speaking pace. */}
    {BLOCKS.map((b, i) => (
      <Sequence key={b.n} from={i * SCENE_FRAMES} durationInFrames={SCENE_FRAMES} name={`Line ${b.n}`}>
        <div style={{ position: 'absolute', top: WATERLINE_Y + 62, left: 84, right: 84 }}>
          <Caption text={b.line} />
        </div>
      </Sequence>
    ))}
  </AbsoluteFill>
);
