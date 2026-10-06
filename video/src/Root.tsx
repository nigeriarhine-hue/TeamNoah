import { Composition } from 'remotion';
import { NoahGamingAd } from './NoahGamingAd';
import { NoahShort, SHORT_FRAMES } from './short/NoahShort';
import { FPS, TOTAL_FRAMES } from './timeline';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="NoahGamingPCReady" component={NoahGamingAd} durationInFrames={TOTAL_FRAMES} fps={FPS} width={1920} height={1080} />
    {/* 9:16 cut-down for Shorts / Reels / TikTok */}
    <Composition id="NoahGamingShort" component={NoahShort} durationInFrames={SHORT_FRAMES} fps={FPS} width={1080} height={1920} />
  </>
);
