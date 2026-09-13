import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "../config";
import { SANS_STACK } from "../lib/fonts";

/**
 * The opening hook plate. Sits high in the frame so it never covers the
 * creator's face.
 */
export const TextHook: React.FC<{
  lines: string[];
  durationInFrames: number;
  top?: number;
  fontSize?: number;
}> = ({ lines, durationInFrames, top = 250, fontSize = 76 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame,
    fps,
    config: { damping: 200, mass: 0.6, stiffness: 90 },
    durationInFrames: 16,
  });
  const exit = interpolate(
    frame,
    [durationInFrames - 12, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <div
      style={{
        position: "absolute",
        top,
        left: 0,
        right: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        opacity: enter * exit,
        transform: `translateY(${interpolate(enter, [0, 1], [-22, 0])}px)`,
      }}
    >
      {lines.map((line, i) => (
        <div
          key={i}
          style={{
            fontFamily: SANS_STACK,
            fontWeight: 800,
            fontSize,
            lineHeight: 1.04,
            letterSpacing: "-0.018em",
            color: COLORS.white,
            textAlign: "center",
            textShadow:
              "0 2px 12px rgba(0,0,0,.6), 0 8px 40px rgba(0,0,0,.5), 0 0 1px rgba(0,0,0,.9)",
          }}
        >
          {line}
        </div>
      ))}
    </div>
  );
};
