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
 * The strongest beat in the film, and the one that has to be literally true.
 *
 * Noah is approved by clicking, so the sequence is two real gates and nothing
 * else: the proposed plan with its action button, and then Noah asking outright
 * before it touches anything. Every state here exists in a capture —
 * IMG_0588 (plan), IMG_0593 (permission dialog), IMG_0594 (approved).
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
  const FIX = f(1.15);
  const HOVER = f(2.0);
  const CLICK1 = f(2.3);
  const DIALOG = f(2.75);
  const CLICK2 = f(3.95);
  const APPROVED = f(4.15);

  const itemH = heightFor(ITEMS[0], ITEM_W);
  const stackGap = 18;
  const ctaH = heightFor('crop-cta', ITEM_W);
  const planH = itemH * 4 + stackGap * 3;

  // beats 1-2: the plan and its button, centred with the headline
  const PLAN = stack(headlineH.one, planH + 34 + ctaH);
  const planTop = PLAN.heroTop;
  const ctaY = planTop + planH + 34 + ctaH / 2 - 960;

  // beat 3: Noah's question gets the frame to itself
  const dlgH = heightFor('crop-dialog', DIALOG_W);
  const apprH = heightFor('crop-approved', 700);
  const DLG = stack(headlineH.one, dlgH + 46 + apprH);
  const dialogY = DLG.heroTop + dlgH / 2 - 960;
  const approvedY = DLG.heroTop + dlgH + 46 + apprH / 2 - 960;

  const planOut = anim(frame, [CLICK1 + 4, DIALOG], [0, 1], ease.inOut);
  const ctaP = anim(frame, [FIX, FIX + 22], [0, 1], ease.soft);
  const dlgP = anim(frame, [DIALOG, DIALOG + 24], [0, 1], ease.soft);
  const approved = anim(frame, [APPROVED, APPROVED + 18], [0, 1], ease.out);
  // once answered, the question recedes and the confirmation takes the frame
  const answered = anim(frame, [CLICK2 + 5, APPROVED + 12], [0, 1], ease.inOut);

  const ctaBox = regionRect('crop-cta', ITEM_W, { u0: 0.02, v0: 0.08, u1: 0.98, v1: 0.92 }, 0, ctaY);
  const goAheadBox = regionRect('crop-dialog', DIALOG_W, GO_AHEAD, 0, dialogY);

  // the button lifts under the pointer, then compresses on the click (§28)
  const hover = anim(frame, [HOVER - 6, HOVER + 6], [0, 1], ease.out);
  const press =
    anim(frame, [CLICK1 - 2, CLICK1], [0, 1], ease.out) *
    (1 - anim(frame, [CLICK1, CLICK1 + 8], [0, 1], ease.out));

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

      {/* the one control that starts the fix */}
      <NoahPanel
        name="crop-cta"
        width={ITEM_W}
        y={ctaY - planOut * 360}
        radius={14}
        scale={(0.94 + ctaP * 0.06) * (1 + hover * 0.012 - press * 0.02)}
        opacity={ctaP * (1 - planOut)}
        blur={(1 - ctaP) * 10 + planOut * 8}
        brightness={1 + hover * 0.09}
        glow={ctaP * (0.8 + hover * 0.5) * (1 - planOut)}
      />
      <UIFocus rect={ctaBox} at={FIX + 8} until={CLICK1 - 8} radius={14} dim={0.45} bloom={0.6} />

      {/* Noah asks before it touches anything. This is the whole product. */}
      <NoahPanel
        name="crop-dialog"
        width={DIALOG_W}
        y={dialogY}
        tiltX={anim(frame, [DIALOG, DIALOG + 40], [4, 0], ease.soft)}
        scale={(0.9 + dlgP * 0.1) * (1 - answered * 0.05)}
        opacity={dlgP * (1 - answered * 0.62)}
        blur={(1 - dlgP) * 16 + answered * 3}
        glow={dlgP * 1.25 * (1 - answered * 0.7)}
      />
      {frame >= CLICK2 && (
        <div
          style={{
            position: 'absolute',
            left: goAheadBox.x,
            top: goAheadBox.y,
            width: goAheadBox.w,
            height: goAheadBox.h,
            borderRadius: 12,
            background: 'rgba(199,203,255,0.5)',
            opacity: anim(frame, [CLICK2, CLICK2 + 9], [0.8, 0], ease.out),
            mixBlendMode: 'screen',
            zIndex: 55,
          }}
        />
      )}

      {/* and only then does it act — Noah's own confirmation */}
      <NoahPanel
        name="crop-approved"
        width={700}
        y={approvedY}
        radius={12}
        scale={0.94 + approved * 0.06}
        opacity={approved}
        blur={(1 - approved) * 8}
        glow={approved * 0.8}
      />

      {/* one pointer, two gates: it reaches the button, waits, clicks — then
          travels to Noah's question and waits again before answering it */}
      {frame < DIALOG ? (
        <AnimatedCursor
          from={{ x: 902, y: 1664 }}
          to={{ x: ctaBox.x + ctaBox.w * 0.53, y: ctaBox.y + ctaBox.h * 0.5 }}
          at={FIX + 8}
          travel={HOVER - (FIX + 8)}
          clickAt={CLICK1}
          bow={70}
          size={46}
        />
      ) : (
        <AnimatedCursor
          from={{ x: ctaBox.x + ctaBox.w * 0.53, y: ctaBox.y + ctaBox.h * 0.5 }}
          to={{ x: goAheadBox.x + goAheadBox.w * 0.42, y: goAheadBox.y + goAheadBox.h * 0.45 }}
          at={DIALOG + 18}
          travel={18}
          clickAt={CLICK2}
          appearAt={DIALOG - 12}
          bow={54}
          size={46}
        />
      )}

      <div style={{ position: 'absolute', left: safe.x, right: safe.x, top: PLAN.headline, zIndex: 50 }}>
        <CinematicText at={STOP} until={FIX - 15} size={88} weight={700}>
          {copy.stop}
        </CinematicText>
        <CinematicText
          at={FIX}
          until={DIALOG - 15}
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
