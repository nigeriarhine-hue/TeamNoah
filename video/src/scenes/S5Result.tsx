import React from 'react';
import {AbsoluteFill, useCurrentFrame, interpolate, Easing} from 'remotion';
import {c, ink, font} from '../theme';
import {useStage, rise, fade} from '../stage';
import {Headline, Kicker, Accent} from '../components/ui';
import {FrameTimeChart} from '../components/FrameTimeChart';
import {NoahLockup} from '../components/NoahMark';

export const S5Result: React.FC = () => {
  const f = useCurrentFrame();
  const {u, pad, tall, width} = useStage();

  const draw = interpolate(f, [26, 104], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.quad),
  });

  const chartW = tall ? width - pad * 2 : (width - pad * 2) * 0.5;

  return (
    <AbsoluteFill
      style={{
        background: c.night,
        padding: pad,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: tall ? 48 * u : 60 * u,
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: tall ? 'column' : 'row',
          gap: tall ? 34 * u : 70 * u,
          alignItems: tall ? 'stretch' : 'center',
        }}
      >
        <div style={rise(f, 18, {distance: 14})}>
          <FrameTimeChart
            kind="fixed"
            width={chartW}
            height={tall ? 230 * u : 270 * u}
            u={u}
            progress={draw}
            ghost="stutter"
            title="After"
            caption="Same game. Same settings. Same graphics card. The hitches are gone, because they were never the graphics card."
          />
        </div>

        <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: 22 * u}}>
          <div style={rise(f, 118)}>
            <Kicker u={u}>The point</Kicker>
          </div>
          <div style={rise(f, 128)}>
            <Headline u={u} size={tall ? 70 : 76}>
              Noah finds what&rsquo;s actually wrong with your Mac.
            </Headline>
          </div>
          <div style={rise(f, 152)}>
            <Accent u={u} size={tall ? 44 : 50} color={c.litHorizon}>
              It&rsquo;s probably not junk.
            </Accent>
          </div>
        </div>
      </div>

      <div
        style={{
          ...rise(f, 190),
          display: 'flex',
          flexDirection: tall ? 'column' : 'row',
          alignItems: tall ? 'flex-start' : 'center',
          justifyContent: 'space-between',
          gap: 22 * u,
          borderTop: `1px solid ${ink.hairline}`,
          paddingTop: 28 * u,
        }}
      >
        <NoahLockup size={48 * u} u={u} dark />
        <span
          style={{
            fontFamily: font.mono,
            fontSize: 22 * u,
            color: ink.muted,
            opacity: fade(f, 206, 20),
          }}
        >
          onnoah.app/fix/mac-games-stuttering-low-fps
        </span>
      </div>
    </AbsoluteFill>
  );
};
