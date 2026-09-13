import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, CTA } from "../config";
import { SANS_STACK } from "../lib/fonts";
import { noahBackdrop } from "./NoahScreen";

const Rise: React.FC<{ delay: number; children: React.ReactNode }> = ({ delay, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = spring({
    frame: frame - delay,
    fps,
    config: { damping: 200, mass: 0.5, stiffness: 110 },
    durationInFrames: 12,
  });
  return (
    <div style={{ opacity: e, transform: `translateY(${interpolate(e, [0, 1], [22, 0])}px)` }}>
      {children}
    </div>
  );
};

/** Beat 6 — the close. */
export const CTAEndCard: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => (
  <AbsoluteFill
    style={{
      background: noahBackdrop(),
      alignItems: "center",
      justifyContent: "center",
      fontFamily: SANS_STACK,
    }}
  >
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0, marginTop: -60 }}>
      <Rise delay={0}>
        <Img src={staticFile("brand/noah-mark-dark-1024.png")} style={{ width: 128, height: 128, marginBottom: 34 }} />
      </Rise>

      <Rise delay={3}>
        <div
          style={{
            fontWeight: 800,
            fontSize: 46,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            background: `linear-gradient(96deg, ${COLORS.periwinkle} 0%, ${COLORS.violetLight} 100%)`,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: 54,
          }}
        >
          {CTA.kicker}
        </div>
      </Rise>

      {CTA.steps.map((step, i) => (
        <Rise key={step} delay={8 + i * 5}>
          <div
            style={{
              fontWeight: 750,
              fontSize: 76,
              lineHeight: 1.24,
              letterSpacing: "-0.022em",
              color: COLORS.white,
              textAlign: "center",
            }}
          >
            {step}
          </div>
        </Rise>
      ))}

      <Rise delay={26}>
        <div
          style={{
            marginTop: 58,
            fontWeight: 700,
            fontSize: 48,
            lineHeight: 1.32,
            color: "#C9CEDA",
            textAlign: "center",
            letterSpacing: "-0.012em",
          }}
        >
          {CTA.action.map((l) => (
            <div key={l}>{l}</div>
          ))}
        </div>
      </Rise>

      <Rise delay={34}>
        <div
          style={{
            marginTop: 46,
            padding: "26px 74px",
            borderRadius: 999,
            background: `linear-gradient(96deg, ${COLORS.blue} 0%, ${COLORS.violet} 100%)`,
            boxShadow: "0 18px 48px rgba(79,70,229,.42)",
            fontWeight: 800,
            fontSize: 56,
            letterSpacing: "-0.01em",
            color: COLORS.white,
          }}
        >
          {CTA.url}
        </div>
      </Rise>
    </div>
  </AbsoluteFill>
);
