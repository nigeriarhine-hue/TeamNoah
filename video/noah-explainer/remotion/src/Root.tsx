import React from 'react';
import { Composition } from 'remotion';
import { NoahExplainer, TOTAL_FRAMES } from './NoahExplainer';
import { FPS } from './theme';

export const RemotionRoot: React.FC = () => (
  <Composition
    id="NoahExplainer"
    component={NoahExplainer}
    durationInFrames={TOTAL_FRAMES}
    fps={FPS}
    width={1920}
    height={1080}
  />
);
