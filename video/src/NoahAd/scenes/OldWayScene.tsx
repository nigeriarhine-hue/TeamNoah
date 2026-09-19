import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { CinematicText } from '../components/CinematicText';
import { BrowserCard } from '../components/FloatingWindow';
import { GlowBackground } from '../components/GlowBackground';
import { Notification } from '../components/Notification';
import { anim, ease } from '../components/easing';
import { copy } from '../config/copy';
import { grid, safe, theme } from '../theme';

/**
 * SCENE 2 — THE OLD WAY.
 * Deliberately faster and more cluttered than everything around it. The windows
 * are anonymous by design (§17): no real site is shown, so nothing appears to
 * endorse Noah. Then everything drops out and the turn lands in silence.
 */
export const OldWayScene: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = (sec: number) => Math.round(sec * fps);

  const BLACKOUT = f(2.1);
  const TURN = f(2.45);

  const collapse = anim(frame, [BLACKOUT, BLACKOUT + 7], [1, 0], ease.in);
  const chaos = anim(frame, [0, BLACKOUT], [0, 1], ease.inOut);

  // the whole pile drifts and tightens as the frustration builds
  const pileY = anim(frame, [0, BLACKOUT], [26, -30], ease.inOut);

  return (
    <GlowBackground mood="tense" intensity={0.5 + chaos * 0.5} phase={3}>
      <AbsoluteFill style={{ opacity: collapse, transform: `translateY(${pileY}px)` }}>
        <BrowserCard
          query="why is my pc so slow"
          seed={1}
          width={760}
          height={520}
          x={-110}
          y={20}
          tiltY={9}
          scale={anim(frame, [0, f(0.55)], [0.88, 1], ease.out)}
          opacity={anim(frame, [0, f(0.3)], [0, 1], ease.out)}
          z={3}
        />
        <BrowserCard
          query="disable startup programs windows 11"
          seed={5}
          width={740}
          height={470}
          x={130}
          y={392}
          tiltY={-8}
          scale={anim(frame, [f(0.65), f(1.15)], [0.88, 1], ease.out)}
          opacity={anim(frame, [f(0.65), f(0.92)], [0, 1], ease.out)}
          blur={anim(frame, [f(1.35), f(1.95)], [0, 3.5], ease.inOut)}
          z={2}
        />
        <BrowserCard
          query="clean temp files safe?"
          seed={11}
          width={700}
          height={430}
          x={-140}
          y={700}
          tiltY={7}
          scale={anim(frame, [f(1.3), f(1.8)], [0.88, 1], ease.out)}
          opacity={anim(frame, [f(1.3), f(1.58)], [0, 1], ease.out)}
          z={1}
        />

        <Notification
          title="Still slow."
          at={f(1.05)}
          x={556}
          y={876}
          from="right"
          tiltY={-10}
          width={400}
          accent={theme.amber}
        />
        <Notification
          title="Now something else broke."
          at={f(1.78)}
          x={64}
          y={1524}
          from="left"
          tiltY={8}
          width={470}
          accent="#E05252"
        />
      </AbsoluteFill>

      {/* the three behaviours — one position, hard-cut, always on top of the pile */}
      <div
        style={{
          position: 'absolute',
          left: safe.x,
          right: safe.x,
          top: grid.headline,
          zIndex: 50,
          opacity: collapse,
        }}
      >
        {copy.oldWay.map((line, i) => {
          const at = f(0.08 + i * 0.66);
          return (
            <CinematicText
              key={line}
              at={at}
              until={at + f(0.27)}
              size={80}
              weight={700}
              focus={false}
              rise={16}
              style={{ position: 'absolute', top: 0, left: 0, right: 0 }}
            >
              {line}
            </CinematicText>
          );
        })}
      </div>

      {/* the turn — near black, one line, room to breathe */}
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(86% 52% at 50% 46%, rgba(20,24,44,1) 0%, rgba(5,7,12,1) 68%)',
          opacity: anim(frame, [BLACKOUT, BLACKOUT + 6], [0, 1], ease.out),
          zIndex: 60,
        }}
      />
      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          paddingLeft: safe.x,
          paddingRight: safe.x,
          zIndex: 61,
        }}
      >
        <CinematicText
          at={TURN}
          until={durationInFrames - f(0.06)}
          size={96}
          weight={700}
          align="center"
          rise={22}
        >
          {copy.turn}
        </CinematicText>
      </AbsoluteFill>
    </GlowBackground>
  );
};
