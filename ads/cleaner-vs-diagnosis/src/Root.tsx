import React from 'react';
import { Composition, Still } from 'remotion';
import { Ad } from './Ad';
import { Thumbnail } from './Thumbnail';
import { DURATION, FPS, H, W } from './theme';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Ad" component={Ad} durationInFrames={DURATION} fps={FPS} width={W} height={H} />
    <Still id="Thumbnail" component={Thumbnail} width={W} height={H} />
  </>
);
