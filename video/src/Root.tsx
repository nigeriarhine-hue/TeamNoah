import React from 'react';
import {Composition} from 'remotion';
import {MacGamesStuttering, DURATION} from './MacGamesStuttering';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="MacGamesStuttering"
      component={MacGamesStuttering}
      durationInFrames={DURATION}
      fps={30}
      width={1920}
      height={1080}
    />
    <Composition
      id="MacGamesStutteringVertical"
      component={MacGamesStuttering}
      durationInFrames={DURATION}
      fps={30}
      width={1080}
      height={1920}
    />
  </>
);
