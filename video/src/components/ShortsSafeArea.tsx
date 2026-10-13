import React from "react";
import { AbsoluteFill } from "remotion";

/**
 * Keeps content clear of the YouTube Shorts / TikTok overlays
 * (top status + search, right-hand action rail, bottom caption/CTA stack).
 * Set `debug` to visualise the zones in Studio.
 */
export const SAFE = { top: 180, bottom: 340, left: 60, right: 130 };

export const ShortsSafeArea: React.FC<{ children: React.ReactNode; debug?: boolean }> = ({ children, debug }) => (
  <AbsoluteFill>
    <AbsoluteFill
      style={{
        top: SAFE.top,
        bottom: SAFE.bottom,
        left: SAFE.left,
        right: SAFE.right,
        width: "auto",
        height: "auto",
      }}
    >
      {children}
    </AbsoluteFill>
    {debug ? (
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <div style={{ position: "absolute", inset: 0, height: SAFE.top, background: "rgba(255,0,0,.18)" }} />
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: SAFE.bottom, background: "rgba(255,0,0,.18)" }} />
        <div style={{ position: "absolute", top: 0, bottom: 0, right: 0, width: SAFE.right, background: "rgba(255,0,0,.12)" }} />
      </AbsoluteFill>
    ) : null}
  </AbsoluteFill>
);
