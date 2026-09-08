import React from 'react';
import {AbsoluteFill, useCurrentFrame, interpolate, Easing} from 'remotion';
import {c, ink} from '../theme';
import {useStage, rise} from '../stage';
import {Headline, Accent, Kicker} from '../components/ui';
import {FrameTimeChart} from '../components/FrameTimeChart';

export const S2TwoProblems: React.FC = () => {
  const f = useCurrentFrame();
  const {u, pad, tall, width} = useStage();

  const chartW = tall ? width - pad * 2 : (width - pad * 2 - 72 * u) / 2;
  const chartH = tall ? 250 * u : 300 * u;

  const draw = (start: number) =>
    interpolate(f, [start, start + 78], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.inOut(Easing.quad),
    });

  return (
    <AbsoluteFill
      style={{
        background: c.night,
        padding: pad,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 44 * u,
      }}
    >
      <div style={{display: 'flex', flexDirection: 'column', gap: 18 * u}}>
        <div style={rise(f, 0)}>
          <Kicker u={u}>First, the useful distinction</Kicker>
        </div>
        <div style={rise(f, 8)}>
          <Headline u={u} size={tall ? 74 : 82} maxWidth={tall ? '100%' : '84%'}>
            Low frame rate and stutter are two different problems.
          </Headline>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: tall ? 'column' : 'row',
          gap: tall ? 40 * u : 72 * u,
          alignItems: 'flex-start',
        }}
      >
        <div style={rise(f, 34, {distance: 14})}>
          <FrameTimeChart
            kind="lowfps"
            width={chartW}
            height={chartH}
            u={u}
            progress={draw(38)}
            title="Low frame rate"
            caption={
              <>
                Every frame takes about the same time to draw &mdash; just too long. Steady, and
                slow. That is a <strong style={{color: ink.primary, fontWeight: 600}}>settings</strong>{' '}
                problem: resolution, shadows, effects.
              </>
            }
          />
        </div>

        <div style={rise(f, 76, {distance: 14})}>
          <FrameTimeChart
            kind="stutter"
            width={chartW}
            height={chartH}
            u={u}
            progress={draw(84)}
            title="Stutter"
            annotate
            caption={
              <>
                Most frames are fine. Then one takes six times as long, and you feel it. That is a{' '}
                <strong style={{color: ink.primary, fontWeight: 600}}>pacing</strong> problem &mdash;
                something else took the machine for a moment.
              </>
            }
          />
        </div>
      </div>

      <div style={rise(f, 208)}>
        <Accent u={u} size={tall ? 42 : 48} color={c.litHorizon}>
          A spike every few seconds is not your graphics card.
        </Accent>
      </div>
    </AbsoluteFill>
  );
};
