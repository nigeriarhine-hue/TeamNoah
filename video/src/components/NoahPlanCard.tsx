import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { C } from "../theme";
import { pop } from "./motion";

/** One numbered row of "WHAT NOAH WOULD DO", revealed at `at` (local frame). */
export const NoahPlanCard: React.FC<{
  n: number;
  title: string;
  sub: string;
  icon: React.ReactNode;
  at: number;
  dim?: number;
}> = ({ n, title, sub, icon, at, dim = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = pop(frame, fps, at, 16);
  const glow = Math.max(0, 1 - (frame - at) / 24);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 24,
        padding: "20px 24px",
        borderRadius: 22,
        background: glow > 0 && frame >= at ? `rgba(79,70,229,${0.06 * glow})` : "transparent",
        opacity: a * (1 - 0.55 * dim),
        transform: `translateX(${(1 - a) * 40}px)`,
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 28,
          border: `2px solid ${C.line2}`,
          color: C.indigo,
          fontWeight: 700,
          fontSize: 28,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flex: "none",
        }}
      >
        {n}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 31, fontWeight: 700, lineHeight: 1.2, color: C.ink, letterSpacing: "-0.01em" }}>{title}</div>
        <div style={{ fontSize: 25, color: C.mute, marginTop: 6, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{sub}</div>
      </div>
      <div style={{ width: 54, height: 54, borderRadius: 14, background: C.auroraSoft, color: C.indigo, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
        {icon}
      </div>
    </div>
  );
};
