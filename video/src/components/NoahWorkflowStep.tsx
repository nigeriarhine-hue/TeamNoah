import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT } from "../theme";
import { pop, prog } from "./motion";

/** Numbered workflow step label, e.g. "1  DESCRIBE THE PROBLEM". Frames are local to the step. */
export const NoahWorkflowStep: React.FC<{
  n: number;
  label: string;
  start?: number;
  end?: number;
  total?: number;
}> = ({ n, label, start = 0, end = 9999, total = 6 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = pop(frame, fps, start, 18);
  const out = prog(frame, end - 8, 8);
  const words = label.split(" ");
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18, opacity: 1 - out, fontFamily: FONT }}>
      <div style={{ display: "flex", gap: 10 }}>
        {Array.from({ length: total }, (_, i) => (
          <div
            key={i}
            style={{
              width: i + 1 === n ? 46 : 14,
              height: 8,
              borderRadius: 4,
              background: i + 1 <= n ? C.aurora : C.line2,
              opacity: i + 1 === n ? 1 : i + 1 < n ? 0.55 : 1,
              transform: `scaleX(${i + 1 === n ? s : 1})`,
            }}
          />
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 22, transform: `translateY(${(1 - s) * 24}px)`, opacity: s }}>
        <div
          style={{
            width: 76,
            height: 76,
            borderRadius: 22,
            background: C.aurora,
            color: "#fff",
            fontSize: 44,
            fontWeight: 800,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 10px 26px -10px rgba(79,70,229,.7)",
          }}
        >
          {n}
        </div>
        <div style={{ fontSize: 50, fontWeight: 800, letterSpacing: "-0.02em", color: C.ink, lineHeight: 1 }}>
          {words.map((w, i) => (
            <span key={i} style={{ opacity: prog(frame, start + 3 + i * 3, 8), marginRight: 14 }}>
              {w}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
