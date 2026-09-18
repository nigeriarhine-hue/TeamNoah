import React from 'react';
import {AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {aurora, colors, fonts, HEADLINE_TRACKING, surface} from '../brand';
import {loadBrandFonts} from '../fonts';
import {MacWindow} from '../noah-ui/MacWindow';
import {DiagnosisScreen} from '../noah-ui/screens';

loadBrandFonts();

/**
 * Purpose-built Shorts thumbnail — not an exported frame.
 *
 * It has a job the video does not: survive being 300px wide in a feed. So the
 * headline is bigger than anything in the ad, the creator sets the mood rather
 * than carrying it, and the Noah diagnosis window is the focal object — the
 * thing that makes "found the real cause" a claim you can see.
 */
export const Thumbnail: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: colors.night, overflow: 'hidden'}}>
    {/* The creator's frustrated close-up, held back but still legible as a
        person at a desk at night. */}
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <OffthreadVideo
        src={staticFile('ugc/gamer/video2-hook.mp4')}
        trimBefore={Math.round(2.7 * 30)}
        muted
        toneMapped={false}
        style={{
          position: 'absolute',
          width: 1920 * (1920 / 1080) * 1.02,
          height: 1920 * 1.02,
          left: -1520,
          top: -230,
          filter: 'saturate(0.95) contrast(1.1) brightness(0.92)',
        }}
      />
    </AbsoluteFill>

    {/* Night wash: heavy where the type goes, lighter across his eyes. */}
    <AbsoluteFill
      style={{
        background:
          'linear-gradient(178deg, rgba(4,6,16,0.93) 0%, rgba(11,16,36,0.86) 26%, rgba(11,16,36,0.44) 40%, rgba(4,6,16,0.80) 56%, rgba(4,6,16,0.95) 70%)',
      }}
    />
    <AbsoluteFill
      style={{
        background:
          'radial-gradient(56% 32% at 10% 86%, rgba(124,58,237,0.42) 0%, rgba(37,99,235,0.16) 48%, rgba(0,0,0,0) 78%)',
      }}
    />

    {/* One soft horizontal tear — the stutter, implied rather than drawn. */}
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 726,
        height: 13,
        background:
          'linear-gradient(90deg, rgba(199,203,255,0) 0%, rgba(199,203,255,0.34) 26%, rgba(124,58,237,0.38) 62%, rgba(199,203,255,0) 100%)',
        filter: 'blur(5px)',
      }}
    />

    <div style={{position: 'absolute', left: 74, right: 74, top: 150}}>
      <div
        style={{
          fontFamily: fonts.sans,
          fontWeight: 800,
          fontSize: 134,
          lineHeight: 0.95,
          letterSpacing: HEADLINE_TRACKING,
          color: colors.white,
          textShadow: '0 6px 48px rgba(4,6,16,0.95), 0 2px 6px rgba(4,6,16,0.8)',
        }}
      >
        YOUR GAME
        <br />
        MIGHT NOT BE
        <br />
        THE PROBLEM
      </div>
      <div
        style={{
          marginTop: 34,
          display: 'inline-block',
          padding: '16px 32px',
          borderRadius: 13,
          background: aurora,
          fontFamily: fonts.sans,
          fontWeight: 800,
          fontSize: 46,
          letterSpacing: '-0.03em',
          color: colors.white,
          boxShadow: '0 12px 44px rgba(37,99,235,0.5)',
        }}
      >
        NOAH FOUND THE REAL CAUSE
      </div>
    </div>

    {/* The diagnosis window, angled so it reads as a screen in the room rather
        than a pasted-on screenshot.

        The negative `from` is the point: a Still sits at frame 0, where every
        build-in animation inside the screen is still at zero. Offsetting the
        sequence renders the screen at frame 70 — fully settled. */}
    <div
      style={{
        position: 'absolute',
        left: 108,
        top: 820,
        width: 960,
        height: 1050,
        transform: 'perspective(2400px) rotateY(-11deg) rotateX(2.5deg) scale(0.9)',
        transformOrigin: '0% 0%',
        filter: 'drop-shadow(0 44px 96px rgba(4,6,16,0.92))',
      }}
    >
      <Sequence from={-70} layout="none">
        <MacWindow>
          <DiagnosisScreen />
        </MacWindow>
      </Sequence>
    </div>

    {/* Sink the bottom of the window into the dark so the crop looks chosen. */}
    <AbsoluteFill
      style={{
        background:
          'linear-gradient(180deg, rgba(4,6,16,0) 78%, rgba(4,6,16,0.80) 91%, rgba(4,6,16,0.99) 100%)',
      }}
    />

    <div
      style={{
        position: 'absolute',
        left: 74,
        bottom: 74,
        display: 'flex',
        alignItems: 'center',
        gap: 20,
      }}
    >
      <Img src={staticFile('brand/noah-appicon-dark.svg')} style={{width: 84, height: 84}} />
      <div>
        <div
          style={{
            fontFamily: fonts.sans,
            fontWeight: 800,
            fontSize: 44,
            letterSpacing: '-0.03em',
            color: colors.white,
          }}
        >
          Noah
        </div>
        <div
          style={{
            fontFamily: fonts.mono,
            fontSize: 27,
            letterSpacing: '-0.01em',
            color: surface.textDim,
            marginTop: 2,
          }}
        >
          onnoah.app
        </div>
      </div>
    </div>
  </AbsoluteFill>
);
