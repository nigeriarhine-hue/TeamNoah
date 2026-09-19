import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from 'remotion';
import { assets } from './config/assets';
import { OVERLAP, scenes } from './config/timing';
import { ApprovalScene } from './scenes/ApprovalScene';
import { BrandScene } from './scenes/BrandScene';
import { DiagnosisScene } from './scenes/DiagnosisScene';
import { ExecutionScene } from './scenes/ExecutionScene';
import { HookScene } from './scenes/HookScene';
import { InvestigationScene } from './scenes/InvestigationScene';
import { NoahRevealScene } from './scenes/NoahRevealScene';
import { OldWayScene } from './scenes/OldWayScene';
import { VerificationScene } from './scenes/VerificationScene';
import { theme } from './theme';

const ORDER = [
  { key: 'hook', Comp: HookScene },
  { key: 'oldWay', Comp: OldWayScene },
  { key: 'reveal', Comp: NoahRevealScene },
  { key: 'investigate', Comp: InvestigationScene },
  { key: 'diagnose', Comp: DiagnosisScene },
  { key: 'approval', Comp: ApprovalScene },
  { key: 'execution', Comp: ExecutionScene },
  { key: 'verify', Comp: VerificationScene },
  { key: 'brand', Comp: BrandScene },
] as const;

/**
 * Noah — "Describe it. Approve it. Done."
 * Vertical short, 1080x1920 @ 30fps.
 *
 * Scene placement lives in config/timing.ts, the script in config/copy.ts and
 * every file the film touches in config/assets.ts. Each Noah surface on screen
 * is a real capture — see ASSET_MANIFEST.md for the source of every frame.
 */
export const NoahAd: React.FC<{ withAudio?: boolean }> = ({ withAudio = true }) => (
  <AbsoluteFill style={{ backgroundColor: theme.bg }}>
    <link rel="stylesheet" href={staticFile('fonts/fonts.css')} />

    {ORDER.map(({ key, Comp }, i) => {
      const s = scenes[key];
      const isLast = i === ORDER.length - 1;
      // A scene lingers past its own end so the next one can dissolve in over it.
      const tail = isLast ? 0 : OVERLAP;
      return (
        <Sequence
          key={key}
          from={s.start}
          durationInFrames={s.duration + tail}
          name={key}
          layout="none"
        >
          {/* first scene opens cold; every other one dissolves up from the last */}
          <DissolveIn frames={i === 0 ? 0 : OVERLAP}>
            <Comp durationInFrames={s.duration} />
          </DissolveIn>
        </Sequence>
      );
    })}

    {withAudio && <Audio src={assets.audio.score} />}
  </AbsoluteFill>
);

/**
 * Smoothstep opacity ramp on the incoming scene. The outgoing scene is still
 * mounted underneath during this window, which is what makes it a dissolve
 * rather than a fade through black.
 */
const DissolveIn: React.FC<{ frames: number; children: React.ReactNode }> = ({
  frames,
  children,
}) => {
  const frame = useCurrentFrame();
  const t = frames <= 0 ? 1 : Math.min(1, Math.max(0, frame / frames));
  const eased = t * t * (3 - 2 * t);
  return (
    // `isolation` keeps each scene's internal z-index inside the scene. Without
    // it, a scene's stacking layers can paint over the scene dissolving in
    // above it and punch a black hole through the cut.
    <AbsoluteFill style={{ opacity: eased, isolation: 'isolate' }}>{children}</AbsoluteFill>
  );
};
