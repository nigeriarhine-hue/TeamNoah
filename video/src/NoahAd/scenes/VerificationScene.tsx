import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { CinematicText } from '../components/CinematicText';
import { GlowBackground } from '../components/GlowBackground';
import { NoahPanel } from '../components/NoahPanel';
import { anim, ease } from '../components/easing';
import { type AssetName, heightFor } from '../config/asset-sizes';
import { copy } from '../config/copy';
import { headlineH, safe, stack } from '../theme';

/**
 * SCENE 8 — VERIFICATION.
 * The payoff is the proof, not a celebration (§22): Noah's own result copy, and
 * the same things it measured before, measured again after the fix.
 */
const RESULTS: AssetName[] = ['res-startup', 'res-temp', 'res-boot'];
const RES_W = 330;
const RES_GAP = 16;

export const VerificationScene: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = (sec: number) => Math.round(sec * fps);

  const VERIFY = f(0.02);
  const PROOF = f(1.15);

  const doneP = anim(frame, [VERIFY + 8, VERIFY + 34], [0, 1], ease.soft);

  const DONE_W = 940;
  const doneH = heightFor('crop-done', DONE_W);
  const resH = heightFor('res-temp', RES_W);
  const INNER_GAP = 54;
  const L = stack(headlineH.big, doneH + INNER_GAP + resH);

  // centre the row of three, each at its own true width
  const widths = RESULTS.map((n) => ({ n, w: RES_W, h: heightFor(n, RES_W) }));
  const total = widths.reduce((a, b) => a + b.w, 0) + RES_GAP * (RESULTS.length - 1);
  let cursor = -total / 2;
  const placed = widths.map((it) => {
    const x = cursor + it.w / 2;
    cursor += it.w + RES_GAP;
    return { ...it, x };
  });

  return (
    <GlowBackground mood="resolve" intensity={0.85 + doneP * 0.3} phase={27}>
      {/* Noah's word, not ours */}
      <NoahPanel
        name="crop-done"
        width={DONE_W}
        y={L.heroTop + doneH / 2 - 960}
        tiltY={anim(frame, [VERIFY, durationInFrames], [5, 1], ease.inOut)}
        tiltX={1.5}
        scale={0.93 + doneP * 0.07}
        opacity={doneP}
        blur={(1 - doneP) * 12}
        glow={doneP * 0.9}
      />

      {/* the same measurements, taken again */}
      {placed.map((it, i) => {
        const at = PROOF + i * 6;
        const p = anim(frame, [at, at + 24], [0, 1], ease.soft);
        return (
          <NoahPanel
            key={it.n}
            name={it.n}
            width={it.w}
            x={it.x}
            y={L.heroTop + doneH + INNER_GAP + resH / 2 - 960 + (1 - p) * 28}
            tiltY={(i - 1) * -3}
            radius={16}
            scale={0.9 + p * 0.1}
            opacity={p}
            blur={(1 - p) * 12}
            glow={p * 1.05}
          />
        );
      })}

      <div style={{ position: 'absolute', left: safe.x, right: safe.x, top: L.headline, zIndex: 50 }}>
        <CinematicText at={VERIFY} until={PROOF - 6} size={108} weight={800}>
          {copy.verify}
        </CinematicText>
        <CinematicText
          at={PROOF + 6}
          until={durationInFrames - f(0.2)}
          size={70}
          weight={600}
          style={{ position: 'absolute', top: 10, left: 0, right: 0 }}
        >
          {copy.payoff}
        </CinematicText>
      </div>
    </GlowBackground>
  );
};
