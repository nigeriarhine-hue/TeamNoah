import React from 'react';
import { Composition, Still } from 'remotion';
import { NoahAd } from './NoahAd/NoahAd';
import { TOTAL_FRAMES } from './NoahAd/config/timing';
import { VIDEO } from './NoahAd/theme';
import { NoahThumbnail } from './Thumbnail/NoahThumbnail';

export const RemotionRoot: React.FC = () => (
  <>
    {/* Primary deliverable — vertical short for Shorts / Reels / TikTok */}
    <Composition
      id="NoahVSCodeGitShort"
      component={NoahAd}
      durationInFrames={TOTAL_FRAMES}
      fps={VIDEO.fps}
      width={VIDEO.width}
      height={VIDEO.height}
      defaultProps={{ withAudio: true }}
    />

    {/* Silent variant — for muted-autoplay placements and for QC passes */}
    <Composition
      id="NoahShortSilent"
      component={NoahAd}
      durationInFrames={TOTAL_FRAMES}
      fps={VIDEO.fps}
      width={VIDEO.width}
      height={VIDEO.height}
      defaultProps={{ withAudio: false }}
    />

    {/* Thumbnail — same design language, editable text (§56 deliverable 5) */}
    <Still
      id="NoahThumbnail"
      component={NoahThumbnail}
      width={1080}
      height={1920}
      defaultProps={{ variant: 'A' as const }}
    />
    <Still
      id="NoahThumbnailB"
      component={NoahThumbnail}
      width={1080}
      height={1920}
      defaultProps={{ variant: 'B' as const }}
    />
    <Still
      id="NoahThumbnailC"
      component={NoahThumbnail}
      width={1080}
      height={1920}
      defaultProps={{ variant: 'C' as const }}
    />
  </>
);
