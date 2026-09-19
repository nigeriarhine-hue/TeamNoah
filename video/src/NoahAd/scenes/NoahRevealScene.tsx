import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { CinematicText } from '../components/CinematicText';
import { GlowBackground } from '../components/GlowBackground';
import { NoahAppIcon } from '../components/NoahLogo';
import { NoahPanel, regionRect } from '../components/NoahPanel';
import { UIFocus } from '../components/UIFocus';
import { anim, ease } from '../components/easing';
import { heightFor } from '../config/asset-sizes';
import { copy } from '../config/copy';
import { headlineH, safe, stack } from '../theme';

/** Where the user's own message sits inside the card capture, normalised. */
const BUBBLE = { u0: 0.703, v0: 0.018, u1: 0.998, v1: 0.228 };

const CALLOUT_W = 720;
const CARD_W = 900;
const INNER_GAP = 58;

/**
 * SCENE 3 — ENTER NOAH.
 * The icon arrives first, out of blur, and only then the app. What follows is
 * the real capture of the moment the problem was described: the user's own
 * words, enlarged so they are readable, and Noah already working below them.
 */
export const NoahRevealScene: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = (sec: number) => Math.round(sec * fps);

  const ICON = f(0.12);
  const WIN = f(0.95);

  const calloutH = heightFor('crop-bubble', CALLOUT_W);
  const cardH = heightFor('card-listening', CARD_W);
  const L = stack(headlineH.two, calloutH + INNER_GAP + cardH);

  const iconP = anim(frame, [ICON, ICON + 26], [0, 1], ease.soft);
  const iconOut = anim(frame, [WIN - 4, WIN + 14], [0, 1], ease.in);
  const iconY = (1 - iconP) * 130 - iconOut * 46;
  const iconBlur = (1 - iconP) * 24 + iconOut * 12;

  const winP = anim(frame, [WIN, WIN + 30], [0, 1], ease.soft);
  const calloutP = anim(frame, [WIN + 14, WIN + 40], [0, 1], ease.soft);

  const cardY = L.heroTop + calloutH + INNER_GAP + cardH / 2 - 960;

  return (
    <GlowBackground mood="warm" intensity={0.55 + winP * 0.5} phase={7}>
      {/* Noah, already working */}
      <NoahPanel
        name="card-listening"
        width={CARD_W}
        y={cardY + (1 - winP) * 64}
        tiltY={anim(frame, [WIN, durationInFrames], [6, 1.5], ease.inOut)}
        tiltX={1.5}
        scale={0.94 + winP * 0.06}
        opacity={winP}
        blur={(1 - winP) * 14}
        glow={winP}
      />
      <UIFocus
        rect={regionRect('card-listening', CARD_W, BUBBLE, 0, cardY)}
        at={WIN + 12}
        until={WIN + 44}
        radius={14}
        dim={0.22}
        bloom={0.45}
        ring
      />

      {/* the only thing the user had to do, read out large */}
      <NoahPanel
        name="crop-bubble"
        width={CALLOUT_W}
        y={L.heroTop + calloutH / 2 - 960}
        tiltY={-2.5}
        radius={22}
        scale={0.9 + calloutP * 0.1}
        opacity={calloutP}
        blur={(1 - calloutP) * 12}
        glow={calloutP * 1.15}
      />

      {/* the icon, ahead of the app */}
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div
          style={{
            transform: `translateY(${iconY}px) scale(${0.8 + iconP * 0.2})`,
            opacity: iconP * (1 - iconOut),
            filter: iconBlur > 0.1 ? `blur(${iconBlur}px)` : undefined,
          }}
        >
          <NoahAppIcon size={224} />
        </div>
      </AbsoluteFill>

      <div style={{ position: 'absolute', left: safe.x, right: safe.x, top: L.headline, zIndex: 50 }}>
        <CinematicText
          at={WIN + 4}
          until={durationInFrames - f(0.2)}
          size={72}
          weight={600}
          maxWidth={840}
        >
          {copy.reveal}
        </CinematicText>
      </div>
    </GlowBackground>
  );
};
