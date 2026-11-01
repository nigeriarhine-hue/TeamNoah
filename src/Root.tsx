import React from 'react';
import {Composition, Still} from 'remotion';
import {RESTART_DURATION, WhyRestartingHelps} from './restart/WhyRestartingHelps';
import {RestartThumbnail, RestartThumbnail16x9} from './restart/Thumbnails';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="WhyRestartingHelps"
      component={WhyRestartingHelps}
      durationInFrames={RESTART_DURATION}
      fps={30}
      width={1080}
      height={1920}
    />
    <Still id="RestartThumbnail" component={RestartThumbnail} width={1080} height={1920} />
    <Still id="RestartThumbnail16x9" component={RestartThumbnail16x9} width={1280} height={720} />
  </>
);
