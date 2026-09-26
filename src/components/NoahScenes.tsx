import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { NoahScreen, SCREEN, UI_ASPECT } from './NoahScreen';
import { CursorClick } from './CursorClick';
import { projectPoint, Shot, Spotlight, spot } from './FocusZoom';
import { H, W } from '../theme';

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/** progress across this Sequence, 0 -> 1 */
const useProgress = (durationInFrames: number) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
};

/** A short dissolve at the head of a shot, for the fast finale. */
const Dissolve: React.FC<{ frames: number; children: React.ReactNode }> = ({ frames, children }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, frames], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};

/**
 * Every shot is framed on the main pane, so the sidebar falls outside the
 * screen and the answer carries the frame.
 */
const PANE_X = 0.646;

/** 01 — Noah takes the problem and starts checking. */
const PROBLEM_END: Shot = { scale: 1.50, cx: 0.638, cy: 0.348 };

export const NoahProblem: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const p = useProgress(durationInFrames);
  // a fresh conversation really is mostly empty pane, so the spotlight puts
  // the weight on the question and the checks running under it
  const lit = interpolate(p, [0, 0.3], [0.35, 1], { extrapolateRight: 'clamp' });
  return (
    <NoahScreen
      src={SCREEN.problem}
      from={{ scale: 1.40, cx: PANE_X, cy: 0.360 }}
      to={PROBLEM_END}
      progress={p}
      easing={easeInOut}
    >
      <Spotlight shot={PROBLEM_END} aspect={UI_ASPECT} rect={spot('s01.ask')} strength={lit} pad={24} />
    </NoahScreen>
  );
};

/** 02a — the evidence. Settles on WHAT NOAH CHECKED. */
const DIAGNOSIS_END: Shot = { scale: 1.55, cx: 0.641, cy: 0.59 };

export const NoahDiagnosis: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const p = useProgress(durationInFrames);
  // the spotlight arrives once the push has landed, and lets go before the cut
  const lit = interpolate(p, [0.34, 0.56, 0.86, 1], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <NoahScreen
      src={SCREEN.diagnosis}
      from={{ scale: 1.42, cx: PANE_X, cy: 0.50 }}
      to={DIAGNOSIS_END}
      progress={p}
      easing={easeInOut}
    >
      <Spotlight
        shot={DIAGNOSIS_END}
        aspect={UI_ASPECT}
        rect={spot('s02.checked')}
        strength={lit}
        pad={20}
      />
    </NoahScreen>
  );
};

/** 02b — the fix. The same move continues down into WHAT NOAH WOULD DO. */
const PLAN_END: Shot = { scale: 1.62, cx: 0.641, cy: 0.69 };

export const NoahPlan: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const p = useProgress(durationInFrames);
  const lit = interpolate(p, [0.3, 0.52, 0.88, 1], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <NoahScreen
      src={SCREEN.diagnosis}
      from={DIAGNOSIS_END}
      to={PLAN_END}
      progress={p}
      easing={easeInOut}
    >
      <Spotlight shot={PLAN_END} aspect={UI_ASPECT} rect={spot('s02.would')} strength={lit} pad={22} />
    </NoahScreen>
  );
};

/** 03 — the gate. The pointer arrives, waits, and presses Go ahead. */
export const NoahApproval: React.FC<{
  durationInFrames: number;
  travelStart: number;
  travelFrames: number;
  clickAt: number;
}> = ({ durationInFrames, travelStart, travelFrames, clickAt }) => {
  const go = spot('s03.goahead');
  const from: Shot = { scale: 1.30, cx: 0.5, cy: 0.5 };
  const to: Shot = { scale: 1.55, cx: 0.5, cy: 0.5 };

  const p = useProgress(durationInFrames);
  // the push lands well before the click, so the button is steady when pressed
  const settle = interpolate(p, [0, 0.42], [0, 1], { extrapolateRight: 'clamp' });

  const target = projectPoint(to, UI_ASPECT, { x: go.x + go.w * 0.46, y: go.y + go.h * 0.52 });

  return (
    <NoahScreen src={SCREEN.approval} from={from} to={to} progress={settle} easing={easeOut}>
      <CursorClick
        from={{ x: W * 0.88, y: H * 0.68 }}
        to={target}
        travelStart={travelStart}
        travelFrames={travelFrames}
        clickAt={clickAt}
      />
    </NoahScreen>
  );
};

/** 04 — approved, and working. */
export const NoahAction: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => (
  <Dissolve frames={4}>
    <NoahScreen
      src={SCREEN.action}
      from={{ scale: 1.46, cx: PANE_X, cy: 0.655 }}
      to={{ scale: 1.52, cx: PANE_X, cy: 0.668 }}
      progress={useProgress(durationInFrames)}
    />
  </Dissolve>
);

/** 05 — done, and what changed. */
export const NoahResult: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => (
  <Dissolve frames={4}>
    <NoahScreen
      src={SCREEN.result}
      from={{ scale: 1.54, cx: 0.630, cy: 0.672 }}
      to={{ scale: 1.60, cx: 0.630, cy: 0.686 }}
      progress={useProgress(durationInFrames)}
    />
  </Dissolve>
);
