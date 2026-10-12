import React from 'react';
import { Composition, Still } from 'remotion';
import { WhyIsMyPcSlow } from './Video';
import { Thumbnail } from './Thumbnail';
import { TOTAL_FRAMES } from './timeline';
import { FPS } from './edu/motion';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="WhyIsMyPcSlow" component={WhyIsMyPcSlow} durationInFrames={TOTAL_FRAMES} fps={FPS} width={1080} height={1920} />
    <Still id="Thumbnail" component={Thumbnail} width={1080} height={1920} />
  </>
);
