import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FONT } from "../theme";
import { TechHostScene } from "../components/TechHostScene";
import { prog } from "../components/motion";

const Line: React.FC<{ text: string; at: number; grad?: boolean; size?: number }> = ({ text, at, grad, size = 92 }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, 12);
  return (
    <div
      style={{
        fontSize: size,
        fontWeight: 800,
        letterSpacing: "-0.035em",
        lineHeight: 1.06,
        color: "#fff",
        opacity: p,
        transform: `translateY(${(1 - p) * 26}px)`,
        ...(grad
          ? {
              background: "linear-gradient(135deg,#8FB8FF 0%,#A9A8FF 50%,#C3A6FF 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }
          : {}),
        textShadow: grad ? "none" : "0 4px 24px rgba(0,0,0,.35)",
      }}
    >
      {text}
    </div>
  );
};

/** Scene 1 — host to camera + headline. No logo animation. */
export const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const swap = 86; // second headline replaces the question
  const q = 1 - prog(f, swap - 6, 8);
  const b = prog(f, swap, 10);
  return (
    <TechHostScene src="host/host-open.mp4" pushFrom={1.0} pushTo={1.07}>
      {/* top scrim for headline legibility */}
      <AbsoluteFill style={{ background: "linear-gradient(to bottom, rgba(10,12,32,.78) 0%, rgba(10,12,32,.35) 30%, rgba(10,12,32,0) 46%)" }} />
      {/* light UI accent: thin aurora scan line */}
      <AbsoluteFill>
        <div
          style={{
            position: "absolute",
            left: 90,
            top: 612,
            height: 4,
            width: 900 * prog(f, 6, 30),
            borderRadius: 2,
            background: "linear-gradient(90deg,#2563EB,#7C3AED)",
            opacity: 0.9,
          }}
        />
      </AbsoluteFill>
      <AbsoluteFill style={{ fontFamily: FONT, padding: "190px 90px 0", alignItems: "flex-start" }}>
        {f < swap + 2 ? (
          <div style={{ opacity: q }}>
            <Line text="WHAT ACTUALLY" at={4} />
            <Line text="HAPPENS WHEN" at={10} />
            <Line text="NOAH CHECKS" at={16} grad />
            <Line text="YOUR PC?" at={22} grad />
          </div>
        ) : null}
        {f >= swap - 2 ? (
          <div style={{ opacity: b }}>
            <Line text="IT DOESN'T JUST" at={swap} />
            <Line text="START CHANGING" at={swap + 5} grad />
            <Line text="THINGS." at={swap + 10} grad />
          </div>
        ) : null}
      </AbsoluteFill>
    </TechHostScene>
  );
};
