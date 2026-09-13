import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

/** Frames of cross-dissolve between beats. */
export const OVERLAP = 7;

/**
 * Fades and eases an incoming beat over the outgoing one. Scenes keep their
 * exact start frames; the outgoing scene simply lingers underneath.
 */
export const SceneTransition: React.FC<{
  children: React.ReactNode;
  /** First scene has nothing to dissolve from. */
  enabled?: boolean;
}> = ({ children, enabled = true }) => {
  const frame = useCurrentFrame();
  if (!enabled) return <AbsoluteFill>{children}</AbsoluteFill>;

  const t = interpolate(frame, [0, OVERLAP], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        opacity: t,
        transform: `scale(${interpolate(t, [0, 1], [1.035, 1])})`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
