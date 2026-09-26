import { Composition } from 'remotion';
import { NoahGamingAd } from './NoahGamingAd';
import { FPS, TOTAL_FRAMES } from './timeline';

export const RemotionRoot: React.FC = () => (
  <Composition
    id="NoahGamingPCReady"
    component={NoahGamingAd}
    durationInFrames={TOTAL_FRAMES}
    fps={FPS}
    width={1920}
    height={1080}
  />
);
