import React from 'react';
import {Composition, Still} from 'remotion';
import {BeforeYouBuyMoreRam, RAM_DURATION} from './videos/BeforeYouBuyMoreRam';
import {RamThumbnail, RamThumbnail16x9} from './videos/RamThumbnail';

export const Root: React.FC = () => (
	<>
		<Composition id="BeforeYouBuyMoreRam" component={BeforeYouBuyMoreRam} durationInFrames={RAM_DURATION} fps={30} width={1080} height={1920} />
		<Still id="RamThumbnail" component={RamThumbnail} width={1080} height={1920} />
		<Still id="RamThumbnail16x9" component={RamThumbnail16x9} width={1280} height={720} />
	</>
);
