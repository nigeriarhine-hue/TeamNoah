import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {AURORA, AURORA_LIGHT, C, FONT} from '../brand/theme';
import {KineticHeadline} from './KineticHeadline';
import {SAFE} from './ShortsSafeArea';

// Light page background with soft blue/violet washes; dark variant for contrast sections.
export const PageBackground: React.FC<{dark?: boolean}> = ({dark}) => (
  <AbsoluteFill
    style={{
      background: dark ? C.dark : C.page,
      backgroundImage: dark
        ? 'radial-gradient(circle at 15% 10%, rgba(99,102,241,0.22), transparent 45%), radial-gradient(circle at 90% 85%, rgba(139,92,246,0.18), transparent 50%)'
        : 'radial-gradient(circle at 12% 8%, rgba(99,102,241,0.10), transparent 45%), radial-gradient(circle at 88% 90%, rgba(139,92,246,0.09), transparent 50%)',
    }}
  >
    {/* faint grid for a tech-explainer feel */}
    <AbsoluteFill
      style={{
        backgroundImage: `linear-gradient(${dark ? 'rgba(255,255,255,0.035)' : 'rgba(18,20,42,0.035)'} 2px, transparent 2px), linear-gradient(90deg, ${dark ? 'rgba(255,255,255,0.035)' : 'rgba(18,20,42,0.035)'} 2px, transparent 2px)`,
        backgroundSize: '90px 90px',
        maskImage: 'linear-gradient(180deg, black 0%, transparent 70%)',
      }}
    />
  </AbsoluteFill>
);

/**
 * Numbered educational section: big section number, two-line heading, then the section body.
 * Enters with a short upward slide so sections read as chapters.
 */
export const EducationalSection: React.FC<{
  number: string;
  heading: [string, string];
  headingSize?: number;
  dark?: boolean;
  children?: React.ReactNode;
  accentLine?: 0 | 1 | null; // which heading line gets the gradient
}> = ({number, heading, headingSize = 76, dark = false, children, accentLine = 1}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 200}, durationInFrames: 14});
  return (
    <AbsoluteFill style={{transform: `translateY(${(1 - enter) * 80}px)`, opacity: enter}}>
      <PageBackground dark={dark} />
      <div style={{position: 'absolute', left: SAFE.side, right: SAFE.side, top: SAFE.top + 20, fontFamily: FONT}}>
        <div style={{display: 'flex', alignItems: 'flex-end', gap: 26, marginBottom: 18}}>
          <div
            style={{
              fontSize: 150,
              fontWeight: 800,
              lineHeight: 0.85,
              letterSpacing: '-0.05em',
              backgroundImage: dark ? AURORA_LIGHT : AURORA,
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              transform: `scale(${interpolate(enter, [0, 1], [0.7, 1])})`,
              transformOrigin: 'left bottom',
            }}
          >
            {number}
          </div>
          <div
            style={{
              height: 6,
              flex: 1,
              marginBottom: 16,
              borderRadius: 3,
              background: dark ? 'rgba(255,255,255,0.14)' : C.line2,
              transform: `scaleX(${enter})`,
              transformOrigin: 'left',
            }}
          />
        </div>
        <KineticHeadline
          dark={dark}
          size={headingSize}
          lines={[
            {text: heading[0], at: 4, accent: accentLine === 0},
            {text: heading[1], at: 9, accent: accentLine === 1},
          ]}
        />
      </div>
      {children}
    </AbsoluteFill>
  );
};
