import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "../config";
import { SANS_STACK } from "../lib/fonts";

/**
 * Overlay type for the product beats — a small brand kicker or a plain
 * statement. Deliberately lighter than TextHook so the UI stays the hero.
 */
export const ScreenLabel: React.FC<{
  text: string;
  variant?: "kicker" | "statement";
  /** Frames on screen, for the exit fade. */
  durationInFrames: number;
  top?: number;
  bottom?: number;
  fontSize?: number;
  align?: "center" | "left";
}> = ({
  text,
  variant = "statement",
  durationInFrames,
  top,
  bottom,
  fontSize,
  align = "center",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame,
    fps,
    config: { damping: 200, mass: 0.5, stiffness: 120 },
    durationInFrames: 10,
  });
  const exit = interpolate(frame, [durationInFrames - 7, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const isKicker = variant === "kicker";
  const size = fontSize ?? (isKicker ? 40 : 58);

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        ...(top !== undefined ? { top } : {}),
        ...(bottom !== undefined ? { bottom } : {}),
        display: "flex",
        justifyContent: align === "center" ? "center" : "flex-start",
        paddingLeft: align === "left" ? 84 : 0,
        opacity: enter * exit,
        transform: `translateY(${interpolate(enter, [0, 1], [14, 0])}px)`,
      }}
    >
      <div
        style={{
          fontFamily: SANS_STACK,
          fontWeight: isKicker ? 800 : 700,
          fontSize: size,
          letterSpacing: isKicker ? "0.16em" : "-0.018em",
          textTransform: isKicker ? "uppercase" : "none",
          color: isKicker ? COLORS.periwinkle : COLORS.white,
          textAlign: align,
          lineHeight: 1.15,
          textShadow: "0 2px 14px rgba(0,0,0,.6)",
        }}
      >
        {text}
      </div>
    </div>
  );
};
