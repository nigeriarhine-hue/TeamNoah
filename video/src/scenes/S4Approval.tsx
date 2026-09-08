import React from 'react';
import {AbsoluteFill, useCurrentFrame, interpolate, Easing} from 'remotion';
import {c, ink, font} from '../theme';
import {useStage, rise, fade} from '../stage';
import {Headline, Kicker, Mono, Card, PrimaryAction, Check} from '../components/ui';

const STEPS = [
  {
    t: 'You describe it in your own words.',
    s: '“games keep stuttering after a while”',
  },
  {
    t: 'Noah runs audited diagnostics on your Mac.',
    s: 'It names the cause. It does not guess, and it does not sell you a clean-up.',
  },
  {
    t: 'Nothing runs until you approve.',
    s: 'Every change shown first. Logged. Reversible.',
  },
];

/** A plain pointer. No trail, no glow — the brand does not do effects. */
const Cursor: React.FC<{size: number; opacity: number}> = ({size, opacity}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{opacity}}>
    <path
      d="M5 3 L5 19.2 L9.1 15.1 L11.7 21 L14.5 19.8 L11.9 14 L17.6 14 Z"
      fill={c.cream}
      stroke={c.night}
      strokeWidth="1.1"
      strokeLinejoin="round"
    />
  </svg>
);

export const S4Approval: React.FC = () => {
  const f = useCurrentFrame();
  const {u, pad, tall} = useStage();

  const PRESS = 452;
  const press = interpolate(f, [PRESS, PRESS + 5, PRESS + 13], [0, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const cursorTravel = interpolate(f, [385, PRESS], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });
  // the button leaves before the confirmation arrives — never both at once
  const buttonOut = fade(f, PRESS + 8, 12);
  const confirmed = fade(f, PRESS + 22, 16);
  const checkDraw = interpolate(f, [PRESS + 26, PRESS + 56], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill
      style={{
        background: c.night,
        padding: pad,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 40 * u,
      }}
    >
      <div style={{display: 'flex', flexDirection: 'column', gap: 16 * u}}>
        <div style={rise(f, 0)}>
          <Kicker u={u}>What Noah does about it</Kicker>
        </div>
        <div style={rise(f, 8)}>
          <Headline u={u} size={tall ? 74 : 82} maxWidth={tall ? '100%' : '76%'}>
            Noah finds which one it is.
          </Headline>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: tall ? 'column' : 'row',
          gap: tall ? 34 * u : 68 * u,
          alignItems: tall ? 'stretch' : 'flex-start',
        }}
      >
        {/* the three beats */}
        <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: 26 * u}}>
          {STEPS.map((s, i) => (
            <div
              key={s.t}
              style={{
                ...rise(f, 40 + i * 40, {distance: 14}),
                display: 'flex',
                gap: 18 * u,
                alignItems: 'flex-start',
              }}
            >
              <div
                style={{
                  width: 34 * u,
                  height: 34 * u,
                  borderRadius: '50%',
                  border: `1px solid ${ink.hairline}`,
                  color: c.litHorizon,
                  fontFamily: font.mono,
                  fontSize: 17 * u,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: 4 * u,
                }}
              >
                {i + 1}
              </div>
              <div>
                <p
                  style={{
                    fontFamily: font.display,
                    fontWeight: 700,
                    fontSize: 30 * u,
                    letterSpacing: '-0.03em',
                    lineHeight: 1.2,
                    color: ink.primary,
                    margin: 0,
                  }}
                >
                  {s.t}
                </p>
                <p
                  style={{
                    fontFamily: font.body,
                    fontSize: 23 * u,
                    lineHeight: 1.45,
                    color: ink.secondary,
                    margin: `${7 * u}px 0 0`,
                  }}
                >
                  {s.s}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* the approval gate — the one idea, if there is room for exactly one */}
        <div style={{flex: tall ? undefined : 1.05, position: 'relative'}}>
          <div style={rise(f, 178, {distance: 22, duration: 30})}>
            <Card u={u} style={{padding: 34 * u, display: 'flex', flexDirection: 'column', gap: 20 * u}}>
              <Mono u={u} size={18} color={ink.muted}>
                NOAH PROPOSES
              </Mono>
              <p
                style={{
                  fontFamily: font.display,
                  fontWeight: 700,
                  fontSize: 33 * u,
                  letterSpacing: '-0.03em',
                  lineHeight: 1.22,
                  color: ink.primary,
                  margin: 0,
                }}
              >
                Turn on Game Mode for this game, and hold the scheduled backup until you quit.
              </p>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10 * u,
                  background: c.nightDeep,
                  borderRadius: 8 * u,
                  padding: `${16 * u}px ${18 * u}px`,
                }}
              >
                {['Game Mode → Automatic', 'backupd → deferred while a game is frontmost'].map((l) => (
                  <div key={l} style={{display: 'flex', gap: 12 * u, alignItems: 'center'}}>
                    <span
                      style={{
                        width: 5 * u,
                        height: 5 * u,
                        borderRadius: '50%',
                        background: c.litHorizon,
                        flexShrink: 0,
                      }}
                    />
                    <Mono u={u} size={20} color={ink.secondary}>
                      {l}
                    </Mono>
                  </div>
                ))}
              </div>

              <p
                style={{
                  fontFamily: font.body,
                  fontSize: 21 * u,
                  color: ink.muted,
                  margin: 0,
                }}
              >
                2 changes &middot; shown before they run &middot; logged &middot; reversible
              </p>

              <div style={{position: 'relative', height: 66 * u}}>
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 22 * u,
                    opacity: 1 - buttonOut,
                  }}
                >
                  <PrimaryAction u={u} pressed={press}>
                    Approve
                  </PrimaryAction>
                  <span style={{fontFamily: font.body, fontSize: 24 * u, color: ink.muted}}>
                    Not now
                  </span>
                </div>
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14 * u,
                    opacity: confirmed,
                  }}
                >
                  <Check size={34 * u} progress={checkDraw} />
                  <span
                    style={{
                      fontFamily: font.body,
                      fontWeight: 600,
                      fontSize: 25 * u,
                      color: c.teal,
                    }}
                  >
                    Done &mdash; and you can undo it.
                  </span>
                </div>
              </div>
            </Card>
          </div>

          <div
            style={{
              position: 'absolute',
              left: `${interpolate(cursorTravel, [0, 1], [64, 20])}%`,
              bottom: `${interpolate(cursorTravel, [0, 1], [-6, 9])}%`,
              opacity: fade(f, 385, 14) * (1 - fade(f, PRESS + 6, 12)),
            }}
          >
            <Cursor size={30 * u} opacity={1} />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
