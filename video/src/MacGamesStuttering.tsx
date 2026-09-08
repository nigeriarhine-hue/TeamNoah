import React from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame} from 'remotion';
import {c} from './theme';
import {envelope} from './stage';
import {loadFonts} from './fonts';
import {S1Symptom} from './scenes/S1Symptom';
import {S2TwoProblems} from './scenes/S2TwoProblems';
import {S3Causes} from './scenes/S3Causes';
import {S4Approval} from './scenes/S4Approval';
import {S5Result} from './scenes/S5Result';

/** Scene lengths in frames @30fps. Held long enough to actually read. */
export const SCENES = [
  {Comp: S1Symptom, len: 160},
  {Comp: S2TwoProblems, len: 380},
  {Comp: S3Causes, len: 600},
  {Comp: S4Approval, len: 630},
  {Comp: S5Result, len: 360},
] as const;

/** Scenes dissolve into each other over a shared night ground — no flash, no swoosh. */
const OVERLAP = 14;

export const DURATION = SCENES.reduce((a, s) => a + s.len, 0);

const Wrap: React.FC<{len: number; children: React.ReactNode}> = ({len, children}) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{opacity: envelope(f, len, OVERLAP, OVERLAP)}}>{children}</AbsoluteFill>;
};

export const MacGamesStuttering: React.FC = () => {
  // must run during render — delayRender at module scope has no render to hold
  loadFonts();
  let at = 0;
  return (
    <AbsoluteFill style={{background: c.night}}>
      {SCENES.map(({Comp, len}, i) => {
        const from = at;
        at += len;
        return (
          <Sequence key={i} from={from} durationInFrames={len + OVERLAP}>
            <Wrap len={len + OVERLAP}>
              <Comp />
            </Wrap>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
