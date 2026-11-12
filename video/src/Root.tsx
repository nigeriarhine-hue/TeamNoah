import React from 'react';
import {Composition, Still} from 'remotion';
import {ep1} from './episodes/ep1.data';
import {loadFonts} from './fonts';
import {DiagnoseEpisode} from './series/DiagnoseEpisode';
import {Thumbnail} from './series/Thumbnail';
import {Thumbnail16x9} from './series/Thumbnail16x9';
import {MAC_AI_HOMEWORK_FRAMES, MacAiHomework, MacAiHomeworkThumb} from './shorts/MacAiHomework';
import {MAC_SYSDATA_FRAMES, MacSystemData, MacSystemDataThumb} from './shorts/MacSystemData';

loadFonts();

// One entry per episode; the series components take all content from the episode data.
const EP1: React.FC = () => <DiagnoseEpisode ep={ep1} />;
const EP1_THUMB: React.FC = () => <Thumbnail ep={ep1} />;
const EP1_THUMB_16X9: React.FC = () => <Thumbnail16x9 ep={ep1} />;

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="DiagnoseEp1" component={EP1} durationInFrames={ep1.total} fps={30} width={1080} height={1920} />
    <Still id="ThumbnailEp1" component={EP1_THUMB} width={1080} height={1920} />
    <Composition id="MacAiHomework" component={MacAiHomework} durationInFrames={MAC_AI_HOMEWORK_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="MacSystemData" component={MacSystemData} durationInFrames={MAC_SYSDATA_FRAMES} fps={30} width={1080} height={1920} />
    <Still id="MacSystemDataThumb" component={MacSystemDataThumb} width={1080} height={1920} />
    <Still id="MacAiHomeworkThumb" component={MacAiHomeworkThumb} width={1080} height={1920} />
    <Still id="ThumbnailEp1Wide" component={EP1_THUMB_16X9} width={1920} height={1080} />
  </>
);
