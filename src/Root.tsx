import React from 'react';
import {Composition, Still} from 'remotion';
import {MacListVideo, TOTAL} from './MacListVideo';
import {ShortsThumbnail} from './components/ShortsThumbnail';
import {VIDEO} from './theme';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MacList"
        component={MacListVideo}
        durationInFrames={TOTAL}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
      />
      <Still
        id="Thumbnail"
        component={ShortsThumbnail}
        width={VIDEO.width}
        height={VIDEO.height}
      />
    </>
  );
};
