import React from 'react';
import {AbsoluteFill, interpolate, Sequence, useCurrentFrame} from 'remotion';
import {Caption} from '../components/Caption';
import {EndCard} from '../components/EndCard';
import {Framed} from '../components/Framed';
import {Statement} from '../components/Statement';
import {TitleCard} from '../components/TitleCard';
import {loadBrandFonts} from '../fonts';
import {SoundDesign} from './Sound';
import {NoahSession} from './scenes/NoahSession';
import {CAPTIONS, clips, D, S, TOTAL, XFADE} from './timeline';

loadBrandFonts();

/**
 * Cross-dissolve helper. Each scene is mounted XFADE frames longer than its
 * nominal length; the next scene draws on top and fades up over that overlap,
 * so the two pictures genuinely mix instead of one popping in.
 *
 * Boundaries meant to be hard cuts simply pass `fade={false}`.
 */
const Scene: React.FC<{
  from: number;
  durationInFrames: number;
  fade?: boolean;
  /**
   * Whether this scene stays mounted XFADE frames past its end so the next one
   * can dissolve over it. Turn it off when the clip has nothing good left to
   * show — the talking clip cuts to a third shot two frames after the line
   * ends, and holding it would flash that shot mid-dissolve.
   */
  tail?: boolean;
  children: React.ReactNode;
}> = ({from, durationInFrames, fade = true, tail = true, children}) => (
  <Sequence
    from={from}
    durationInFrames={durationInFrames + (tail ? XFADE : 0)}
    layout="none"
  >
    <FadeIn enabled={fade}>{children}</FadeIn>
  </Sequence>
);

const FadeIn: React.FC<{enabled: boolean; children: React.ReactNode}> = ({
  enabled,
  children,
}) => {
  const frame = useCurrentFrame();
  const opacity = enabled
    ? interpolate(frame, [0, XFADE], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 1;
  // A whisper of blur on the way in reads as a focus pull rather than a wipe.
  const blur = enabled ? (1 - opacity) * 12 : 0;
  return (
    <AbsoluteFill style={{opacity, filter: blur > 0.05 ? `blur(${blur}px)` : undefined}}>
      {children}
    </AbsoluteFill>
  );
};

export const NoahGameNotTheProblem: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: '#04060F'}}>
    {/* 0:00–0:02.9 — the stutter. Wide desk, then his own cut to the
        frustrated close-up at 1.4s in. */}
    <Scene from={S.hook} durationInFrames={D.hook} fade={false}>
      <Framed
        src={clips.hook.src}
        inPoint={clips.hook.inPoint}
        durationInFrames={D.hook + XFADE}
        volume={0.16}
        from={{zoom: 1.0, focusX: 0.56}}
        to={{zoom: 1.05, focusX: 0.575}}
        cutAt={Math.round((clips.hook.cut - clips.hook.inPoint) * 30)}
        afterCut={{
          from: {zoom: 1.0, focusX: 0.645},
          to: {zoom: 1.06, focusX: 0.652},
        }}
      />
      <TitleCard durationInFrames={D.hook + XFADE} />
    </Scene>

    {/* 0:02.9–0:09.3 — the locked line, in full. */}
    <Scene from={S.talking} durationInFrames={D.talking} fade={false} tail={false}>
      <Framed
        src={clips.talking.src}
        inPoint={clips.talking.inPoint}
        durationInFrames={D.talking}
        volume={1}
        grade={0.85}
        from={{zoom: 1.0, focusX: 0.645}}
        to={{zoom: 1.055, focusX: 0.65}}
        cutAt={Math.round((clips.talking.cut - clips.talking.inPoint) * 30)}
        afterCut={{
          from: {zoom: 1.02, focusX: 0.645},
          to: {zoom: 1.07, focusX: 0.652},
        }}
      />
      {CAPTIONS.map((c) => (
        <Sequence key={c.text} from={c.from} durationInFrames={c.duration} layout="none">
          <Caption text={c.text} durationInFrames={c.duration} />
        </Sequence>
      ))}
    </Scene>

    {/* 0:09.3–0:12 — b-roll: a digital pan toward the screen, then his own cut
        to the hand on the mouse. */}
    <Scene from={S.broll} durationInFrames={D.broll} fade={false}>
      <Framed
        src={clips.broll.src}
        inPoint={clips.broll.inPoint}
        durationInFrames={D.broll + XFADE}
        volume={0.14}
        from={{zoom: 1.04, focusX: 0.63}}
        to={{zoom: 1.0, focusX: 0.545}}
        cutAt={Math.round((clips.broll.cut - clips.broll.inPoint) * 30)}
        afterCut={{
          from: {zoom: 1.0, focusX: 0.5},
          to: {zoom: 1.08, focusX: 0.485},
        }}
      />
      <Sequence from={4} durationInFrames={D.broll + XFADE - 4} layout="none">
        <Statement
          text={'So Noah checked\nwhat was actually happening.'}
          durationInFrames={D.broll + XFADE - 4}
          anchor="bottom"
          offset={470}
          size={58}
        />
      </Sequence>
    </Scene>

    {/* 0:12–0:23.9 — one Noah session: diagnosis → approval → action → result. */}
    <Scene from={S.session} durationInFrames={D.session}>
      <NoahSession durationInFrames={D.session + XFADE} />
    </Scene>

    {/* 0:23.9–0:27.1 — relief, then the one thing to do next. */}
    <Scene from={S.payoff} durationInFrames={D.payoff}>
      <Framed
        src={clips.payoff.src}
        inPoint={clips.payoff.inPoint}
        durationInFrames={D.payoff}
        volume={0.1}
        grade={0.7}
        from={{zoom: 1.02, focusX: 0.575}}
        to={{zoom: 1.06, focusX: 0.585}}
        cutAt={Math.round((clips.payoff.cut - clips.payoff.inPoint) * 30)}
        afterCut={{
          from: {zoom: 1.0, focusX: 0.505},
          to: {zoom: 1.05, focusX: 0.512},
        }}
      />
      <Sequence from={22} durationInFrames={D.payoff - 22} layout="none">
        <EndCard />
      </Sequence>
    </Scene>

    <SoundDesign />
  </AbsoluteFill>
);

export const TOTAL_FRAMES = TOTAL;
