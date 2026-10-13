import React from "react";
import { AbsoluteFill, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

/**
 * Recurring Noah host footage (the same creator from the RAM video), muted — the VO track
 * carries the exact audio the clip was lip-synced to. Adds a gentle push-in and grade match.
 */
export const TechHostScene: React.FC<{
  src: string;
  pushFrom?: number;
  pushTo?: number;
  originY?: string;
  children?: React.ReactNode;
}> = ({ src, pushFrom = 1.0, pushTo = 1.06, originY = "35%", children }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const s = interpolate(frame, [0, durationInFrames], [pushFrom, pushTo], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: "#0e1020", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${s})`, transformOrigin: `50% ${originY}` }}>
        <OffthreadVideo src={staticFile(src)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
      {children}
    </AbsoluteFill>
  );
};
