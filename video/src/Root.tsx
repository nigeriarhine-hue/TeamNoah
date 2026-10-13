import React from 'react';
import { Composition, Still } from 'remotion';
import { NoahOneQuestion } from './one-question/NoahOneQuestion';
import { NoahOneQuestionThumbnail } from './one-question/Thumbnail';
import { DURATION_S, FPS } from './one-question/timeline';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="NoahOneQuestion"
      component={NoahOneQuestion}
      durationInFrames={DURATION_S * FPS}
      fps={FPS}
      width={1080}
      height={1920}
    />
    <Still id="NoahOneQuestionThumbnail" component={NoahOneQuestionThumbnail} width={1080} height={1920} />
  </>
);
