import React from 'react';
import {Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {aurora, colors, fonts, HEADLINE_TRACKING} from '../brand';

const rise = (frame: number, delay: number) =>
  interpolate(frame - delay, [0, 13], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });

/**
 * Closing card, laid over the payoff shot rather than cutting to a flat panel —
 * the creator stays on screen, which is what keeps it feeling like a post
 * instead of an ad break.
 *
 * Aurora appears once, on the one thing to do next. The mark is the dark-ground
 * "Lantern" file, used at its own proportions with its clear space intact.
 */
export const EndCard: React.FC = () => {
  const frame = useCurrentFrame();

  const scrim = interpolate(frame, [0, 18], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(4,6,16,0) 28%, rgba(4,6,16,0.62) 52%, rgba(4,6,16,0.93) 78%)',
          opacity: scrim,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 84,
          right: 84,
          bottom: 430,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <div style={{opacity: rise(frame, 4), transform: `translateY(${(1 - rise(frame, 4)) * 16}px)`}}>
          <Img src={staticFile('brand/noah-appicon-dark.svg')} style={{width: 104, height: 104}} />
        </div>

        <div
          style={{
            marginTop: 18,
            fontFamily: fonts.sans,
            fontWeight: 800,
            fontSize: 88,
            lineHeight: 1.04,
            letterSpacing: HEADLINE_TRACKING,
            color: colors.white,
            textShadow: '0 4px 34px rgba(4,6,16,0.78)',
            opacity: rise(frame, 9),
            transform: `translateY(${(1 - rise(frame, 9)) * 20}px)`,
          }}
        >
          FREE MAC CHECK
        </div>

        <div
          style={{
            marginTop: 20,
            fontFamily: fonts.sans,
            fontWeight: 600,
            fontSize: 40,
            lineHeight: 1.3,
            letterSpacing: '-0.02em',
            color: colors.litHorizon,
            opacity: rise(frame, 15),
            transform: `translateY(${(1 - rise(frame, 15)) * 18}px)`,
          }}
        >
          Download Noah. Try it today.
        </div>

        <div
          style={{
            marginTop: 30,
            padding: '24px 58px',
            borderRadius: 18,
            background: aurora,
            boxShadow: '0 14px 44px rgba(37,99,235,0.42)',
            fontFamily: fonts.sans,
            fontWeight: 800,
            fontSize: 46,
            letterSpacing: '-0.03em',
            color: colors.white,
            opacity: rise(frame, 21),
            transform: `translateY(${(1 - rise(frame, 21)) * 22}px) scale(${
              0.94 + rise(frame, 21) * 0.06
            })`,
          }}
        >
          onnoah.app
        </div>
      </div>
    </>
  );
};
