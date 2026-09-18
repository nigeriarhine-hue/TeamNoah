import React from 'react';
import {Composition, Still} from 'remotion';
import {NoahGameNotTheProblem} from './video2/NoahGameNotTheProblem';
import {Thumbnail} from './video2/Thumbnail';
import {FPS, HEIGHT, TOTAL, WIDTH} from './video2/timeline';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="NoahGameNotTheProblem"
      component={NoahGameNotTheProblem}
      durationInFrames={TOTAL}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
    <Still
      id="NoahGameNotTheProblemThumbnail"
      component={Thumbnail}
      width={WIDTH}
      height={HEIGHT}
    />
  </>
);
