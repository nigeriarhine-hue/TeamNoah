import React from 'react';
import { AbsoluteFill } from 'remotion';
import { color } from '../theme';
import { FocusZoom, Shot } from './FocusZoom';

/** Source screenshots are 2240 x 2816. */
export const UI_ASPECT = 2240 / 2816;
const DIR = 'noah-ui/mac-ai-tech-support/';

export const SCREEN = {
  problem: DIR + 'noah-ai-tech-support-01-problem.png',
  diagnosis: DIR + 'noah-ai-tech-support-02-diagnosis.png',
  approval: DIR + 'noah-ai-tech-support-03-approval.png',
  action: DIR + 'noah-ai-tech-support-04-action.png',
  result: DIR + 'noah-ai-tech-support-05-result.png',
} as const;

/** The film's ground: the brand's night, lit from behind the screen. */
export const NoahGround: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill
    style={{ background: `linear-gradient(180deg, #0C1128 0%, ${color.night} 46%, #060913 100%)` }}
  >
    <AbsoluteFill
      style={{
        background:
          'radial-gradient(86% 42% at 50% 40%, rgba(99,102,241,.26) 0%, rgba(11,16,36,0) 68%)',
      }}
    />
    {children}
  </AbsoluteFill>
);

export const NoahScreen: React.FC<{
  src: string;
  from: Shot;
  to?: Shot;
  progress: number;
  easing?: (t: number) => number;
  children?: React.ReactNode;
}> = ({ src, from, to, progress, easing, children }) => (
  <NoahGround>
    <FocusZoom
      src={src}
      aspect={UI_ASPECT}
      from={from}
      to={to}
      progress={progress}
      easing={easing}
    />
    {children}
  </NoahGround>
);
