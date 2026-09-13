import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

/**
 * A pointer that travels to a target and clicks, with a ripple on impact.
 * Coordinates are SOURCE pixels, so it is placed inside a FocusZoom layer and
 * scales with the screenshot.
 */
export const CursorClick: React.FC<{
  /** Where the click lands, in source pixels. */
  x: number;
  y: number;
  /** Where the pointer enters from. Defaults to just below-right of target. */
  fromX?: number;
  fromY?: number;
  /** Frame the pointer starts moving (relative to the enclosing Sequence). */
  startFrame?: number;
  /** Frames spent travelling before the click fires. */
  travelFrames?: number;
  /** Drawn at source scale; bump if the screenshot is zoomed out. */
  size?: number;
}> = ({
  x,
  y,
  fromX,
  fromY,
  startFrame = 0,
  travelFrames = 18,
  size = 26,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - startFrame;

  const sx = fromX ?? x + 120;
  const sy = fromY ?? y + 130;

  const travel = spring({
    frame: local,
    fps,
    config: { damping: 200, mass: 0.7, stiffness: 70 },
    durationInFrames: travelFrames,
  });

  const cx = interpolate(travel, [0, 1], [sx, x]);
  const cy = interpolate(travel, [0, 1], [sy, y]);

  const sinceClick = local - travelFrames;
  const pressed = sinceClick >= 0 && sinceClick < 5;
  const ripple = interpolate(sinceClick, [0, 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        left: cx,
        top: cy,
        opacity: interpolate(local, [0, 4], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
        pointerEvents: "none",
      }}
    >
      {sinceClick >= 0 ? (
        <div
          style={{
            position: "absolute",
            left: -size * 1.6,
            top: -size * 1.6,
            width: size * 3.2,
            height: size * 3.2,
            borderRadius: "50%",
            border: `${Math.max(1, size * 0.09)}px solid rgba(199,203,255,${0.85 * (1 - ripple)})`,
            transform: `scale(${0.25 + ripple * 0.95})`,
          }}
        />
      ) : null}
      <svg
        width={size}
        height={size * 1.35}
        viewBox="0 0 24 32"
        style={{
          display: "block",
          transform: `scale(${pressed ? 0.86 : 1})`,
          filter: "drop-shadow(0 2px 5px rgba(0,0,0,.65))",
        }}
      >
        <path
          d="M3 2 L3 24 L9 18.5 L13 27.5 L16.5 26 L12.6 17.2 L20.5 16.8 Z"
          fill="#FFFFFF"
          stroke="rgba(0,0,0,.55)"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};
