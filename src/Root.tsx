import React from 'react';
import { Composition, Still } from 'remotion';
import { DURATION, FPS, H, W } from './theme';
import { NoahAd } from './NoahAd';
import { ShortsThumbnail } from './components/ShortsThumbnail';
import './fonts';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="NoahAiTechSupport"
      component={NoahAd}
      durationInFrames={DURATION}
      fps={FPS}
      width={W}
      height={H}
    />
    <Still id="ShortsThumbnail" component={ShortsThumbnail} width={W} height={H} />
  </>
);
