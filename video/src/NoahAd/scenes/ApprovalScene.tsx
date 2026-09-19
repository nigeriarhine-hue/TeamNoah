import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { AnimatedCursor } from '../components/AnimatedCursor';
import { CinematicText } from '../components/CinematicText';
import { GlowBackground } from '../components/GlowBackground';
import { NoahPanel, regionRect } from '../components/NoahPanel';
import { UIFocus } from '../components/UIFocus';
import { anim, ease } from '../components/easing';
import { type AssetName, heightFor } from '../config/asset-sizes';
import { copy } from '../config/copy';
import { headlineH, safe, stack, theme } from '../theme';

/**
 * SCENE 6 — THE TRUST MOMENT.
 * The strongest beat in the film, and the one that must be literally true.
 * This is the order the real session happened in: Noah proposes a plan and
 * stops; the plan can be changed in plain language instead of clicked; and Noah
 * still asks for an explicit OK before it touches anything.
 */
const ITEMS: AssetName[] = ['plan-item-1', 'plan-item-2', 'plan-item-3', 'plan-item-4'];
const ITEM_W = 920;
const DIALOG_W = 960;
/** The real "Go ahead" control inside the dialog capture, normalised. */
const GO_AHEAD = { u0: 0.405, v0: 0.688, u1: 0.645, v1: 0.885 };

export const ApprovalScene: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = (sec: number) => Math.round(sec * fps);

  const STOP = f(0.1);
  const FIX = f(1.1);
  const TYPED = f(2.15);
  const DIALOG = f(2.95);
  const CLICK = f(3.95);

  const itemH = heightFor(ITEMS[0], ITEM_W);
  const stackGap = 18;
  const ctaH = heightFor('crop-cta-hover', ITEM_W);
  const noteH = heightFor('crop-talk-note', 890);
  const typedH = heightFor('crop-typed', ITEM_W);
  const planH = itemH * 4 + stackGap * 3;

  // beat 1-2: the plan and its button, centred with the headline
  const PLAN = stack(headlineH.one, planH + 34 + ctaH);
  const planTop = PLAN.heroTop;
  // beat 4: the dialog gets the frame to itself
  const dlgH = heightFor('crop-dialog', DIALOG_W);
  const sentH = heightFor('crop-sent', 760);
  const DLG = stack(headlineH.one, dlgH + 42 + sentH);
  const dialogY = DLG.heroTop + dlgH / 2 - 960;
  const sentY = DLG.heroTop + dlgH + 42 + sentH / 2 - 960;

  // the plan clears the frame when Noah asks the question
  const planOut = anim(frame, [TYPED + 10, DIALOG - 2], [0, 1], ease.inOut);
  const ctaP = anim(frame, [FIX, FIX + 22], [0, 1], ease.soft);
  const typedP = anim(frame, [TYPED, TYPED + 20], [0, 1], ease.out);
  const dlgP = anim(frame, [DIALOG, DIALOG + 24], [0, 1], ease.soft);
  const approved = anim(frame, [CLICK + 2, CLICK + 20], [0, 1], ease.out);

  const ctaY = planTop + planH + 34 + ctaH / 2 - 960;
  const ctaBox = regionRect('crop-cta-hover', ITEM_W, { u0: 0.02, v0: 0.08, u1: 0.98, v1: 0.92 }, 0, ctaY);

  return (
    <GlowBackground mood="tense" intensity={0.8 + dlgP * 0.25} phase={19}>
      {/* the proposed plan — Noah's own rows, one at a time */}
      {ITEMS.map((name, i) => {
        const at = STOP + f(0.12) + i * 5;
        const p = anim(frame, [at, at + 20], [0, 1], ease.soft);
        return (
          <NoahPanel
            key={name}
            name={name}
            width={ITEM_W}
            y={planTop + itemH / 2 + i * (itemH + stackGap) - 960 - planOut * 360}
            tiltY={anim(frame, [at, DIALOG], [4, 0.5], ease.inOut)}
            radius={14}
            scale={(0.94 + p * 0.06) * (1 - planOut * 0.06)}
            opacity={p * (1 - planOut)}
            blur={(1 - p) * 10 + planOut * 8}
            glow={p * 0.55 * (1 - planOut)}
          />
        );
      })}

      {/* the control Noah offers, and the promise printed under it */}
      <NoahPanel
        name="crop-cta-hover"
        width={ITEM_W}
        y={ctaY - planOut * 360}
        radius={14}
        scale={0.94 + ctaP * 0.06}
        opacity={ctaP * (1 - planOut)}
        blur={(1 - ctaP) * 10 + planOut * 8}
        glow={ctaP * 0.8 * (1 - planOut)}
      />
      <UIFocus rect={ctaBox} at={FIX + 8} until={TYPED - 2} radius={14} dim={0.45} bloom={0.6} />

      <NoahPanel
        name="crop-talk-note"
        width={890}
        y={ctaY + ctaH / 2 + 28 + noteH / 2 - planOut * 360}
        radius={10}
        scale={0.95 + typedP * 0.05}
        opacity={typedP * 0.95 * (1 - planOut)}
        blur={(1 - typedP) * 8}
        glow={0}
      />
      {/* so the plan gets changed in words, not clicks */}
      <NoahPanel
        name="crop-typed"
        width={920}
        y={ctaY + ctaH / 2 + 28 + noteH + 26 + typedH / 2 - planOut * 360}
        tiltY={2}
        radius={14}
        scale={0.94 + typedP * 0.06}
        opacity={typedP * (1 - planOut)}
        blur={(1 - typedP) * 10}
        glow={typedP * 0.6}
      />

      {/* and Noah still asks. This dialog is the whole product in one frame. */}
      <NoahPanel
        name="crop-dialog"
        width={DIALOG_W}
        y={dialogY}
        tiltX={anim(frame, [DIALOG, DIALOG + 40], [4, 0], ease.soft)}
        scale={0.9 + dlgP * 0.1}
        opacity={dlgP}
        blur={(1 - dlgP) * 16}
        glow={dlgP * 1.25}
      />
      {/* click flash on the real approval control */}
      {frame >= CLICK && (
        <div
          style={{
            position: 'absolute',
            ...toStyle(regionRect('crop-dialog', DIALOG_W, GO_AHEAD, 0, dialogY)),
            borderRadius: 12,
            background: 'rgba(199,203,255,0.5)',
            opacity: anim(frame, [CLICK, CLICK + 9], [0.8, 0], ease.out),
            mixBlendMode: 'screen',
            zIndex: 55,
          }}
        />
      )}

      {/* confirmation, straight from the capture */}
      <NoahPanel
        name="crop-sent"
        width={760}
        y={sentY}
        radius={12}
        scale={0.94 + approved * 0.06}
        opacity={approved}
        blur={(1 - approved) * 8}
        glow={approved * 0.8}
      />

      {/* cursor: hesitates, then commits */}
      {frame >= DIALOG && <ApprovalCursor at={DIALOG + 12} clickAt={CLICK} dialogY={dialogY} />}

      <div style={{ position: 'absolute', left: safe.x, right: safe.x, top: PLAN.headline, zIndex: 50 }}>
        <CinematicText at={STOP} until={FIX - 6} size={88} weight={700}>
          {copy.stop}
        </CinematicText>
        <CinematicText
          at={FIX}
          until={DIALOG - 8}
          size={66}
          weight={600}
          color={theme.inkDim}
          style={{ position: 'absolute', top: 0, left: 0, right: 0 }}
        >
          {copy.showFix}
        </CinematicText>
        <CinematicText
          at={DIALOG}
          until={durationInFrames - f(0.2)}
          size={66}
          weight={600}
          style={{ position: 'absolute', top: 0, left: 0, right: 0 }}
        >
          {copy.waited}
        </CinematicText>
      </div>
    </GlowBackground>
  );
};

const ApprovalCursor: React.FC<{ at: number; clickAt: number; dialogY: number }> = ({ at, clickAt, dialogY }) => {
  const target = regionRect('crop-dialog', DIALOG_W, GO_AHEAD, 0, dialogY);
  return (
    <AnimatedCursor
      from={{ x: 840, y: 1520 }}
      to={{ x: target.x + target.w * 0.42, y: target.y + target.h * 0.45 }}
      at={at}
      travel={24}
      clickAt={clickAt}
      bow={64}
      size={46}
    />
  );
};

const toStyle = (r: { x: number; y: number; w: number; h: number }) => ({
  left: r.x,
  top: r.y,
  width: r.w,
  height: r.h,
});
