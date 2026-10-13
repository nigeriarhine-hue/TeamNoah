import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, FONT } from "../theme";
import { BulbIcon, ChatIcon, CheckIcon, ListIcon, SearchIcon, ShieldCheckIcon } from "../components/Icons";
import { WorkflowTimeline } from "../components/WorkflowTimeline";
import { prog } from "../components/motion";

/** Scene 8 — editorial recap. VO "describe it, approve it, done" lights those three nodes. */
export const Recap: React.FC = () => {
  const f = useCurrentFrame();
  const t = prog(f, 0, 14);
  return (
    <AbsoluteFill style={{ fontFamily: FONT, alignItems: "center", opacity: t }}>
      <div style={{ position: "absolute", top: 236, textAlign: "center" }}>
        <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: "0.16em", color: C.indigo, display: "flex", alignItems: "center", gap: 14, justifyContent: "center" }}>
          <div style={{ width: 26, height: 2, background: C.indigo }} />
          HOW NOAH WORKS
          <div style={{ width: 26, height: 2, background: C.indigo }} />
        </div>
      </div>
      <div style={{ position: "absolute", top: 330 }}>
        <WorkflowTimeline
          gap={34}
          nodes={[
            { label: "DESCRIBE", icon: <ChatIcon size={36} />, at: 10, emphasizeAt: 62 },
            { label: "CHECK", icon: <SearchIcon size={36} />, at: 24 },
            { label: "EXPLAIN", icon: <BulbIcon size={36} />, at: 38 },
            { label: "PLAN", icon: <ListIcon size={36} />, at: 52 },
            { label: "APPROVE", icon: <ShieldCheckIcon size={36} />, at: 66, emphasizeAt: 96 },
            { label: "DONE", icon: <CheckIcon size={36} stroke={2.6} />, at: 80, emphasizeAt: 112 },
          ]}
        />
      </div>
    </AbsoluteFill>
  );
};
