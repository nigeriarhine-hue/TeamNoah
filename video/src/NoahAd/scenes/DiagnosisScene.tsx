import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { CinematicText } from '../components/CinematicText';
import { GlowBackground } from '../components/GlowBackground';
import { NoahPanel } from '../components/NoahPanel';
import { anim, ease } from '../components/easing';
import { type AssetName, heightFor } from '../config/asset-sizes';
import { copy } from '../config/copy';
import { grid, headlineH, safe, stack, theme } from '../theme';

/**
 * SCENE 5 — THE REAL CAUSE.
 * Noah's conclusion in its own words, then the four measurements it rests on,
 * each enlarged from the real screen so the numbers are readable on a phone.
 * The emotional point: the obvious answer — "the laptop is old" — was wrong.
 */
const TILES: AssetName[] = ['tile-startup', 'tile-background', 'tile-disk', 'tile-installers'];
const TILE_W = 420;
const GAP = 26;

export const DiagnosisScene: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = (sec: number) => Math.round(sec * fps);

  const SIT = f(0.45);
  const TILES_AT = f(1.55);

  const sitP = anim(frame, [SIT, SIT + 26], [0, 1], ease.soft);
  const sitOut = anim(frame, [TILES_AT - 8, TILES_AT + 14], [0, 1], ease.inOut);

  const tileH = heightFor(TILES[0], TILE_W);
  const rowY = tileH / 2 + GAP / 2;
  const L = stack(headlineH.one, tileH * 2 + GAP);

  return (
    <GlowBackground mood="tense" intensity={0.95} phase={15}>
      {/* what Noah concluded, verbatim */}
      <NoahPanel
        name="crop-situation"
        width={grid.heroWide}
        y={L.heroY - sitOut * 260}
        tiltY={anim(frame, [SIT, durationInFrames], [6, 1], ease.inOut)}
        tiltX={1.5}
        scale={(0.93 + sitP * 0.07) * (1 - sitOut * 0.08)}
        opacity={sitP * (1 - sitOut)}
        blur={(1 - sitP) * 12 + sitOut * 8}
        glow={sitP * 0.9 * (1 - sitOut)}
      />

      {/* the receipts — a 2x2 grid of real measurements, one beat apart */}
      {TILES.map((name, i) => {
        const at = TILES_AT + i * 5;
        const p = anim(frame, [at, at + 22], [0, 1], ease.soft);
        const col = i % 2 === 0 ? -1 : 1;
        const row = i < 2 ? -1 : 1;
        return (
          <NoahPanel
            key={name}
            name={name}
            width={TILE_W}
            x={col * (TILE_W / 2 + GAP / 2)}
            y={L.heroY + row * rowY + (1 - p) * 26}
            tiltY={col * -3}
            tiltX={row * -2}
            radius={18}
            scale={0.9 + p * 0.1}
            opacity={p}
            blur={(1 - p) * 12}
            glow={p * 0.85}
          />
        );
      })}

      <div style={{ position: 'absolute', left: safe.x, right: safe.x, top: L.headline, zIndex: 50 }}>
        <CinematicText at={f(0.08)} until={durationInFrames - f(0.22)} size={82} weight={700}>
          {copy.diagnose}
        </CinematicText>
      </div>

      {/* plain-language translation, kept visually subordinate (§19) */}
      <div style={{ position: 'absolute', left: safe.x, right: safe.x, top: L.heroBottom + 96, zIndex: 50 }}>
        <CinematicText
          at={TILES_AT + 16}
          until={durationInFrames - f(0.22)}
          size={40}
          weight={500}
          color={theme.mute}
          tracking={-0.012}
          rise={14}
        >
          {copy.diagnoseSub}
        </CinematicText>
      </div>
    </GlowBackground>
  );
};
