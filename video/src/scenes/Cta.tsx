import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT, SERIF } from "../theme";
import { NoahLogo } from "../components/NoahLogo";
import { TechHostScene } from "../components/TechHostScene";
import { pop, prog } from "../components/motion";

/** Scene 9 — host returns, calm CTA, end card. The one place the Noah logo appears. */
export const Cta: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const card = pop(f, fps, 18, 18);
  return (
    <TechHostScene src="host/host-close.mp4" pushFrom={1.03} pushTo={1.08} originY="30%">
      <AbsoluteFill style={{ background: "linear-gradient(to top, rgba(236,232,223,.98) 0%, rgba(236,232,223,.92) 30%, rgba(236,232,223,0) 52%)", opacity: prog(f, 8, 14) }} />
      <AbsoluteFill style={{ fontFamily: FONT, alignItems: "center" }}>
        <div
          style={{
            position: "absolute",
            top: 1040,
            width: 860,
            borderRadius: 40,
            background: "#fff",
            border: `1px solid ${C.line}`,
            boxShadow: C.shadow,
            padding: "46px 50px 44px",
            textAlign: "center",
            opacity: card,
            transform: `translateY(${(1 - card) * 60}px)`,
          }}
        >
          <div style={{ display: "flex", justifyContent: "center" }}>
            <NoahLogo size={120} />
          </div>
          <div style={{ marginTop: 18, fontSize: 30, fontWeight: 700, letterSpacing: "0.16em", color: C.mute }}>FREE PC CHECK</div>
          <div style={{ marginTop: 10, fontSize: 92, fontWeight: 800, letterSpacing: "-0.035em", color: C.ink, lineHeight: 1.05 }}>
            onnoah<span style={{ background: C.aurora, WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>.app</span>
          </div>
          <div style={{ marginTop: 22, fontFamily: SERIF, fontStyle: "italic", fontSize: 44, color: C.ink2, opacity: prog(f, 34, 14) }}>
            Describe it. Approve it. Done.
          </div>
        </div>
      </AbsoluteFill>
    </TechHostScene>
  );
};
