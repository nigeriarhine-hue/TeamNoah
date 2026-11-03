import React from 'react';
import {Composition} from 'remotion';
import {DiagnoseEp1, EP1_FRAMES} from './episodes/DiagnoseEp1';
import {loadFonts} from './fonts';

loadFonts();

export const RemotionRoot: React.FC = () => (
  <Composition
    id="DiagnoseEp1"
    component={DiagnoseEp1}
    durationInFrames={EP1_FRAMES}
    fps={30}
    width={1080}
    height={1920}
  />
);
