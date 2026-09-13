import React from "react";
import { Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";

/** A region of the source image, in source pixels. */
export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface FocusZoomProps {
  /** Path under public/, e.g. "noah-screens/02-diagnosis.png". */
  src: string;
  /** Natural pixel size of that file. */
  imageWidth: number;
  imageHeight: number;
  /** Viewport to fill, in composition pixels. */
  width: number;
  height: number;
  /** Source region visible at the start and end of the move. */
  from: Rect;
  to?: Rect;
  /** Frames over which `from` becomes `to`. */
  durationInFrames: number;
  /**
   * Overlays positioned in SOURCE pixel coordinates — they travel with the
   * image, so a text patch stays glued to the word it covers.
   */
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

/**
 * Slow push across a still. The crop rect is fitted "cover" into the viewport,
 * so `from` and `to` need not share an aspect ratio.
 */
export const FocusZoom: React.FC<FocusZoomProps> = ({
  src,
  imageWidth,
  imageHeight,
  width,
  height,
  from,
  to,
  durationInFrames,
  children,
  style,
}) => {
  const frame = useCurrentFrame();
  const target = to ?? from;

  const t = interpolate(frame, [0, Math.max(1, durationInFrames - 1)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.33, 0, 0.15, 1),
  });

  const r: Rect = {
    x: interpolate(t, [0, 1], [from.x, target.x]),
    y: interpolate(t, [0, 1], [from.y, target.y]),
    w: interpolate(t, [0, 1], [from.w, target.w]),
    h: interpolate(t, [0, 1], [from.h, target.h]),
  };

  const scale = Math.max(width / r.w, height / r.h);
  const left = width / 2 - (r.x + r.w / 2) * scale;
  const top = height / 2 - (r.y + r.h / 2) * scale;

  return (
    <div style={{ width, height, overflow: "hidden", position: "relative", ...style }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: imageWidth,
          height: imageHeight,
          transformOrigin: "0 0",
          transform: `translate(${left}px, ${top}px) scale(${scale})`,
          willChange: "transform",
        }}
      >
        <Img
          src={staticFile(src)}
          style={{ width: imageWidth, height: imageHeight, display: "block" }}
        />
        {children}
      </div>
    </div>
  );
};
