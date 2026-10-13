import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { C } from "../theme";
import { pop, prog } from "./motion";

/**
 * One "WHAT NOAH CHECKED" metric tile. Before `revealAt` it shows a scanning ring,
 * then the real value pops in. Tone follows the brand rule: amber = warning, teal = confirmation.
 */
export const NoahDiagnosticCard: React.FC<{
  label: string;
  value: string;
  sub: string;
  icon: React.ReactNode;
  appearAt: number;
  revealAt: number;
  tone?: "amber" | "commit" | "ink";
  highlight?: number;
  width?: number;
}> = ({ label, value, sub, icon, appearAt, revealAt, tone = "amber", highlight = 0, width = 430 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = pop(frame, fps, appearAt, 15);
  const revealed = frame >= revealAt;
  const v = pop(frame, fps, revealAt, 13);
  const scan = prog(frame, appearAt, revealAt - appearAt);
  const color = tone === "amber" ? C.amber : tone === "commit" ? C.commit : C.ink;
  const soft = tone === "amber" ? C.amberSoft : tone === "commit" ? C.commitSoft : C.auroraSoft;
  return (
    <div
      style={{
        width,
        height: 236,
        background: "#fff",
        borderRadius: 24,
        border: `2px solid ${highlight > 0 ? `rgba(79,70,229,${0.25 + 0.4 * highlight})` : C.line}`,
        boxShadow: highlight > 0 ? `0 0 0 ${8 * highlight}px rgba(79,70,229,.08), ${C.cardShadow}` : C.cardShadow,
        padding: "24px 26px",
        boxSizing: "border-box",
        position: "relative",
        overflow: "hidden",
        opacity: a,
        transform: `translateY(${(1 - a) * 30}px) scale(${0.94 + 0.06 * a})`,
      }}
    >
      {!revealed ? (
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${scan * 100}%`, background: "linear-gradient(90deg, rgba(79,70,229,0), rgba(79,70,229,.07))" }} />
      ) : null}
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 52, height: 52, borderRadius: 14, background: soft, color, display: "flex", alignItems: "center", justifyContent: "center" }}>{icon}</div>
        <div style={{ fontSize: 21, fontWeight: 700, letterSpacing: "0.1em", color: C.mute, textTransform: "uppercase", lineHeight: 1.15 }}>{label}</div>
      </div>
      <div style={{ marginTop: 22, height: 64, display: "flex", alignItems: "center" }}>
        {revealed ? (
          <div style={{ fontSize: width < 300 ? 44 : value.length > 9 ? 44 : 54, fontWeight: 800, whiteSpace: "nowrap", letterSpacing: "-0.02em", color, transform: `scale(${0.85 + 0.15 * v})`, transformOrigin: "left center", opacity: v }}>
            {value}
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <svg width={44} height={44} viewBox="0 0 44 44">
              <circle cx="22" cy="22" r="17" stroke={C.line2} strokeWidth="5" fill="none" />
              <circle
                cx="22"
                cy="22"
                r="17"
                stroke={C.indigo}
                strokeWidth="5"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${scan * 107} 107`}
                transform="rotate(-90 22 22)"
              />
            </svg>
            <div style={{ fontSize: 30, fontWeight: 600, color: C.mute }}>Checking…</div>
          </div>
        )}
      </div>
      <div style={{ marginTop: 12, fontSize: 24, color: C.ink2, opacity: revealed ? v : 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{sub}</div>
    </div>
  );
};
