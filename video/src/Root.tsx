import React from 'react';
import {Composition, Still} from 'remotion';
import {ep1} from './episodes/ep1.data';
import {loadFonts} from './fonts';
import {DiagnoseEpisode} from './series/DiagnoseEpisode';
import {Thumbnail} from './series/Thumbnail';

loadFonts();

// One entry per episode; the series components take all content from the episode data.
const EP1: React.FC = () => <DiagnoseEpisode ep={ep1} />;
const EP1_THUMB: React.FC = () => <Thumbnail ep={ep1} />;

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="DiagnoseEp1" component={EP1} durationInFrames={ep1.total} fps={30} width={1080} height={1920} />
    <Still id="ThumbnailEp1" component={EP1_THUMB} width={1080} height={1920} />
  </>
);
