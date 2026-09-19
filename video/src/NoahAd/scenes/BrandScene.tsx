import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { CTA } from '../components/CTA';
import { GlowBackground } from '../components/GlowBackground';
import { NoahLogo, NoahWordmark } from '../components/NoahLogo';
import { anim, ease } from '../components/easing';
import { copy } from '../config/copy';
import { font, safe, theme } from '../theme';

/**
 * SCENE 9 — PRODUCT REVEAL, PROMISE, CTA.
 * One continuous frame rather than three cards: the mark comes up and stays up
 * while the promise lands beneath it and resolves into the call to action.
 * No particles, no explosion — the mark is given room, per brand-pack/README.md.
 */
export const BrandScene: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = (sec: number) => Math.round(sec * fps);

  const LOGO = f(0.15);
  const P1 = f(1.1);
  const P2 = f(1.55);
  const P3 = f(2.0);
  const CTA_AT = f(2.95);

  // the promise hands off to the CTA; the mark rises a little to make room
  const handoff = anim(frame, [CTA_AT - 10, CTA_AT + 14], [0, 1], ease.inOut);
  const lift = -handoff * 100;

  return (
    <GlowBackground mood="brand" intensity={0.9}>
      <AbsoluteFill
        style={{
          alignItems: 'center',
          paddingLeft: safe.x,
          paddingRight: safe.x,
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 664 + lift,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 34,
          }}
        >
          <NoahLogo size={288} at={LOGO} halo={1} />
          <NoahWordmark size={110} at={LOGO + 16} />
        </div>

        {/* Describe it. Approve it. Done. */}
        <div
          style={{
            position: 'absolute',
            top: 1128,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12,
            opacity: 1 - handoff,
            transform: `translateY(${-handoff * 40}px)`,
          }}
        >
          {copy.promise.map((phrase, i) => {
            const at = [P1, P2, P3][i];
            const p = anim(frame, [at, at + 20], [0, 1], ease.out);
            return (
              <div
                key={phrase}
                style={{
                  fontFamily: font.sans,
                  fontSize: 64,
                  fontWeight: i === 2 ? 800 : 600,
                  letterSpacing: '-0.03em',
                  color: i === 2 ? theme.ink : theme.inkDim,
                  opacity: p,
                  transform: `translateY(${(1 - p) * 18}px)`,
                  filter: p < 0.99 ? `blur(${(1 - p) * 6}px)` : undefined,
                }}
              >
                {phrase}
              </div>
            );
          })}
        </div>

        {/* final frame */}
        <div
          style={{
            position: 'absolute',
            top: 1136,
            opacity: handoff,
            transform: `translateY(${(1 - handoff) * 26}px)`,
          }}
        >
          <CTA
            action={copy.cta.action}
            url={copy.cta.url}
            line={copy.cta.line}
            at={CTA_AT}
          />
        </div>
      </AbsoluteFill>

      {/* hold the last frame clean — no fade to black inside the scene */}
      <AbsoluteFill
        style={{
          background: '#000',
          opacity: anim(frame, [durationInFrames - 4, durationInFrames], [0, 0], ease.out),
        }}
      />
    </GlowBackground>
  );
};
