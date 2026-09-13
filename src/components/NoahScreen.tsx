import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { COLORS } from "../config";
import { SANS_STACK } from "../lib/fonts";
import { SCREEN_SIZE, type TextPatch } from "../lib/macSubstitutions";
import { FocusZoom, type Rect } from "./FocusZoom";

export type ScreenKey = keyof typeof SCREEN_SIZE;

/** Windows title-bar height, in source pixels. Crops start below it. */
export const TITLEBAR_H = 30;

export interface NoahScreenProps {
  screen: ScreenKey;
  from: Rect;
  to?: Rect;
  durationInFrames: number;
  patches?: TextPatch[];
  /** Card geometry inside the 1080x1920 frame. */
  cardWidth?: number;
  cardHeight?: number;
  cardTop?: number;
  /** Gentle scale on the whole card — a push that can never clip content. */
  cardScaleTo?: number;
  /** Overlays drawn OUTSIDE the card (titles, labels). */
  children?: React.ReactNode;
  /** Overlays drawn INSIDE the card, in source pixels — travels with the push. */
  inScreen?: React.ReactNode;
}

/**
 * A genuine Noah screenshot presented as a device card, with a slow push and
 * the approved Mac terminology composited over the original pixels.
 *
 * The Windows title bar is never in frame: every crop starts below TITLEBAR_H.
 */
export const NoahScreen: React.FC<NoahScreenProps> = ({
  screen,
  from,
  to,
  durationInFrames,
  patches = [],
  cardWidth = 1010,
  cardHeight = 673,
  cardTop = 620,
  cardScaleTo = 1.035,
  children,
  inScreen,
}) => {
  const size = SCREEN_SIZE[screen];
  const frame = useCurrentFrame();

  // The push lives on the card, not the crop, so the UI is never cut off at
  // the edges — the crop only drifts vertically.
  const cardScale = interpolate(
    frame,
    [0, Math.max(1, durationInFrames - 1)],
    [1, cardScaleTo],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.33, 0, 0.15, 1),
    },
  );

  if (process.env.NODE_ENV !== "production") {
    for (const r of [from, to].filter(Boolean) as Rect[]) {
      if (r.y < TITLEBAR_H) {
        throw new Error(
          `${screen}: crop y=${r.y} would reveal the Windows title bar (min ${TITLEBAR_H}).`,
        );
      }
    }
  }

  return (
    <AbsoluteFill style={{ background: noahBackdrop() }}>
      <div
        style={{
          position: "absolute",
          left: (1080 - cardWidth) / 2,
          top: cardTop,
          width: cardWidth,
          height: cardHeight,
          borderRadius: 26,
          overflow: "hidden",
          border: "1px solid rgba(160,172,255,0.16)",
          boxShadow:
            "0 40px 90px rgba(0,0,0,.62), 0 8px 26px rgba(0,0,0,.45), inset 0 1px 0 rgba(255,255,255,.05)",
          background: COLORS.appBg,
          transform: `scale(${cardScale})`,
          willChange: "transform",
        }}
      >
        <FocusZoom
          src={`noah-screens/${screen}.png`}
          imageWidth={size.w}
          imageHeight={size.h}
          width={cardWidth}
          height={cardHeight}
          from={from}
          to={to}
          durationInFrames={durationInFrames}
        >
          {patches.map((p) => (
            <PatchedText key={p.id} patch={p} />
          ))}
          {inScreen}
        </FocusZoom>
      </div>
      {children}
    </AbsoluteFill>
  );
};

/**
 * Covers one original text run and redraws the Mac wording in its place.
 * Positioned in source pixels so it travels with the push.
 */
const PatchedText: React.FC<{ patch: TextPatch }> = ({ patch }) => (
  <div
    style={{
      position: "absolute",
      left: patch.rect.x,
      top: patch.rect.y,
      width: patch.rect.w,
      height: patch.rect.h,
      background: patch.bg,
      display: "flex",
      alignItems: "center",
      overflow: "hidden",
    }}
  >
    <span
      style={{
        fontFamily: SANS_STACK,
        fontSize: patch.fontSize,
        fontWeight: patch.fontWeight,
        color: patch.color,
        letterSpacing: patch.letterSpacing,
        textTransform: patch.textTransform,
        whiteSpace: "nowrap",
        transform: `translateY(${patch.offsetY ?? 0}px)`,
        paddingLeft: 3,
      }}
    >
      {patch.replacement}
    </span>
  </div>
);

export function noahBackdrop(): string {
  return [
    `radial-gradient(120% 80% at 50% 12%, rgba(79,70,229,.24) 0%, rgba(11,16,36,0) 62%)`,
    `radial-gradient(100% 70% at 50% 96%, rgba(124,58,237,.18) 0%, rgba(11,16,36,0) 60%)`,
    `linear-gradient(180deg, #0C1018 0%, #0A0D14 55%, #080B11 100%)`,
  ].join(", ");
}
