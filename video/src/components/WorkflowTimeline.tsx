import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT } from "../theme";
import { pop, prog } from "./motion";

export type WorkflowNode = { label: string; icon: React.ReactNode; at: number; emphasizeAt?: number };

/** Vertical editorial process line: DESCRIBE ↓ CHECK ↓ … ↓ DONE. Frames are local. */
export const WorkflowTimeline: React.FC<{ nodes: WorkflowNode[]; gap?: number }> = ({ nodes, gap = 30 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", fontFamily: FONT }}>
      {nodes.map((n, i) => {
        const a = pop(frame, fps, n.at, 15);
        const em = n.emphasizeAt !== undefined ? pop(frame, fps, n.emphasizeAt, 12) : 0;
        const isLast = i === nodes.length - 1;
        const connector = i < nodes.length - 1 ? prog(frame, nodes[i + 1].at - 8, 8) : 0;
        return (
          <React.Fragment key={n.label}>
            <div
              style={{
                width: 640,
                height: 118,
                borderRadius: 30,
                background: em > 0.01 ? (isLast ? C.commit : C.aurora) : "#fff",
                border: `2px solid ${em > 0.01 ? "transparent" : C.line2}`,
                boxShadow: em > 0.01 ? "0 18px 40px -16px rgba(79,70,229,.6)" : C.cardShadow,
                display: "flex",
                alignItems: "center",
                gap: 28,
                padding: "0 40px",
                opacity: a,
                transform: `translateY(${(1 - a) * 30}px) scale(${0.95 + 0.05 * a + 0.04 * em})`,
              }}
            >
              <div
                style={{
                  width: 66,
                  height: 66,
                  borderRadius: 18,
                  background: em > 0.01 ? "rgba(255,255,255,.18)" : isLast ? C.commitSoft : C.auroraSoft,
                  color: em > 0.01 ? "#fff" : isLast ? C.commit : C.indigo,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {n.icon}
              </div>
              <div style={{ fontSize: 52, fontWeight: 800, letterSpacing: "0.04em", color: em > 0.01 ? "#fff" : C.ink }}>{n.label}</div>
              <div style={{ marginLeft: "auto", fontSize: 26, fontWeight: 700, color: em > 0.01 ? "rgba(255,255,255,.8)" : C.mute }}>{String(i + 1).padStart(2, "0")}</div>
            </div>
            {i < nodes.length - 1 ? (
              <div style={{ height: gap + 20, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 4, height: gap * connector, background: C.aurora, borderRadius: 2 }} />
                <div
                  style={{
                    width: 0,
                    height: 0,
                    borderLeft: "10px solid transparent",
                    borderRight: "10px solid transparent",
                    borderTop: `12px solid ${C.violet}`,
                    opacity: connector,
                  }}
                />
              </div>
            ) : null}
          </React.Fragment>
        );
      })}
    </div>
  );
};
