import React from 'react';
import {Composition} from 'remotion';
import {MacGamesStuttering, DURATION} from './MacGamesStuttering';
import {ShortsSafe, ShortsSafeGuides, SHORTS_FRAMES, PRESETS} from './ShortsSafe';

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
    <Composition
      id="ShortsSafe"
      component={ShortsSafe}
      durationInFrames={SHORTS_FRAMES}
      fps={30}
      width={1080}
      height={1920}
    />
    <Composition
      id="ShortsSafeWide"
      component={ShortsSafe}
      defaultProps={{reserved: PRESETS.wide}}
      durationInFrames={SHORTS_FRAMES}
      fps={30}
      width={1080}
      height={1920}
    />
    <Composition
      id="ShortsSafeWideGuides"
      component={ShortsSafeGuides}
      defaultProps={{reserved: PRESETS.wide}}
      durationInFrames={SHORTS_FRAMES}
      fps={30}
      width={1080}
      height={1920}
    />
    <Composition
      id="ShortsSafeGuides"
      component={ShortsSafeGuides}
      durationInFrames={SHORTS_FRAMES}
      fps={30}
      width={1080}
      height={1920}
    />
  </>
);
