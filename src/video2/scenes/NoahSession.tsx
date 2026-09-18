import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  OffthreadVideo,
  Sequence,
  staticFile,
  useCurrentFrame,
} from 'remotion';
import {Statement} from '../../components/Statement';
import {MacWindow, WINDOW_H, WINDOW_W} from '../../noah-ui/MacWindow';
import {
  pushIn,
  type Shot,
  shotScreenPoint,
  shotTransform,
  WINDOW_LEFT,
  WINDOW_TOP,
} from '../../noah-ui/camera';
import {NoahScreen} from '../../noah-ui/NoahScreen';
import {clips, SESSION} from '../timeline';

const {diagnosis, approval, action, result} = SESSION;

/**
 * The shot list.
 *
 * `ty` is chosen per shot so the narrator line always has dark to sit in:
 * the wide shots park the window low and keep the top clear, and the close
 * shot on the Approve button lifts the window so "YOU decide." can land
 * underneath it.
 */
const SHOTS: Record<string, Shot> = {
  establish: {scale: 0.88, fx: 0.5, fy: 0.5, ty: 1075},
  findings: {scale: 1.15, fx: 0.5, fy: 0.7, ty: 1030},
  theFix: {scale: 1.0, fx: 0.5, fy: 0.45, ty: 1000},
  approveButton: {scale: 1.12, fx: 0.52, fy: 0.885, ty: 1021},
  working: {scale: 1.1, fx: 0.5, fy: 0.5, ty: 1010},
  changed: {scale: 0.95, fx: 0.5, fy: 0.5, ty: 1060},
};

/** Camera beats, relative to the start of the session. */
const CAM = {
  toFindings: [diagnosis.from + 58, diagnosis.from + 132] as const,
  toTheFix: [approval.from, approval.from + 26] as const,
  toApprove: [approval.from + 46, approval.from + 84] as const,
  toWorking: [action.from, action.from + 24] as const,
  toChanged: [result.from, result.from + 26] as const,
};

const cameraAt = (f: number): Shot => {
  if (f < approval.from) {
    return pushIn(f, CAM.toFindings[0], CAM.toFindings[1], SHOTS.establish!, SHOTS.findings!);
  }
  if (f < action.from) {
    const back = pushIn(f, CAM.toTheFix[0], CAM.toTheFix[1], SHOTS.findings!, SHOTS.theFix!);
    return pushIn(f, CAM.toApprove[0], CAM.toApprove[1], back, SHOTS.approveButton!);
  }
  if (f < result.from) {
    return pushIn(f, CAM.toWorking[0], CAM.toWorking[1], SHOTS.approveButton!, SHOTS.working!);
  }
  return pushIn(f, CAM.toChanged[0], CAM.toChanged[1], SHOTS.working!, SHOTS.changed!);
};

/** Dims what the camera is not looking at. Emphasis, not theatre. */
const Spotlight: React.FC<{shot: Shot; strength: number}> = ({shot, strength}) => {
  const {x, y} = shotScreenPoint(shot);
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(78% 48% at ${x}px ${y}px, rgba(4,6,16,0) 36%, rgba(4,6,16,${(
          0.52 * strength
        ).toFixed(3)}) 100%)`,
        pointerEvents: 'none',
      }}
    />
  );
};

export const NoahSession: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const shot = cameraAt(frame);

  const spot = interpolate(
    frame,
    [0, 24, approval.from + 40, approval.from + 90, action.from + 20, durationInFrames],
    [0.25, 0.5, 0.6, 1, 0.55, 0.4],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );

  const enter = interpolate(frame, [0, 16], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });

  return (
    <AbsoluteFill style={{backgroundColor: '#04060F', overflow: 'hidden'}}>
      {/* The desk keeps moving behind the app — slowed hard and blurred out, so
          the frame is never static but nothing competes with the UI. */}
      <AbsoluteFill style={{overflow: 'hidden'}}>
        <OffthreadVideo
          src={staticFile(clips.broll.src)}
          trimBefore={Math.round(0.2 * 30)}
          playbackRate={0.176}
          muted
          toneMapped={false}
          style={{
            position: 'absolute',
            width: 1080 * 1.35,
            height: 1920 * 1.35,
            left: -1080 * 0.175,
            top: -1920 * 0.175,
            objectFit: 'cover',
            filter: 'blur(54px) brightness(0.30) saturate(1.1)',
          }}
        />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(180deg, rgba(11,16,36,0.88) 0%, rgba(4,6,16,0.60) 45%, rgba(4,6,16,0.94) 100%)',
        }}
      />

      <AbsoluteFill style={{opacity: enter}}>
        <div
          style={{
            position: 'absolute',
            left: WINDOW_LEFT,
            top: WINDOW_TOP,
            width: WINDOW_W,
            height: WINDOW_H,
            transformOrigin: '50% 50%',
            ...shotTransform(shot),
          }}
        >
          <MacWindow>
            <Sequence from={diagnosis.from} durationInFrames={diagnosis.duration} layout="none">
              <NoahScreen id="diagnosis" />
            </Sequence>
            <Sequence from={approval.from} durationInFrames={approval.duration} layout="none">
              <NoahScreen id="approval" />
            </Sequence>
            <Sequence from={action.from} durationInFrames={action.duration} layout="none">
              <NoahScreen id="action" />
            </Sequence>
            <Sequence from={result.from} durationInFrames={result.duration} layout="none">
              <NoahScreen id="result" />
            </Sequence>
          </MacWindow>
        </div>
      </AbsoluteFill>

      <Spotlight shot={shot} strength={spot} />

      {/* Narrator beats. Each one is scheduled to be off screen before the
          camera move that would put the window underneath it. */}
      <Sequence from={12} durationInFrames={52} layout="none">
        <Statement text="It found the real cause." durationInFrames={52} offset={250} />
      </Sequence>
      <Sequence from={approval.from + 8} durationInFrames={44} layout="none">
        <Statement text="It shows the fix." durationInFrames={44} offset={250} />
      </Sequence>
      <Sequence from={approval.from + 86} durationInFrames={38} layout="none">
        <Statement
          text="YOU decide."
          durationInFrames={38}
          anchor="bottom"
          offset={618}
          size={86}
          emphasis
        />
      </Sequence>
      <Sequence from={action.from + 24} durationInFrames={31} layout="none">
        <Statement
          text="Then it gets to work."
          durationInFrames={31}
          offset={226}
          size={56}
        />
      </Sequence>
      <Sequence from={result.from + 3} durationInFrames={result.duration - 3} layout="none">
        <Statement
          text="And shows what changed."
          durationInFrames={result.duration - 3}
          offset={250}
        />
      </Sequence>
    </AbsoluteFill>
  );
};
