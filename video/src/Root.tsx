import React from 'react';
import { Composition } from 'remotion';
import { NoahGoogleSlow, TOTAL } from './Video';

export const RemotionRoot: React.FC = () => (
  <Composition
    id="NoahGoogleSlow"
    component={NoahGoogleSlow}
    durationInFrames={TOTAL}
    fps={30}
    width={1920}
    height={1080}
  />
);
