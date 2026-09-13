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
import { COLORS, CTA, VO_TRACK } from "../config";
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

const STEP_LINE_HEIGHT = 94;

/**
 * Beat 6 — the close.
 *
 * When `voiced`, the three steps appear exactly as she speaks them (frames
 * measured from the silence between sentences in the VO track). The download
 * line and URL come in early and hold, so the call to action is never waiting
 * on the voiceover to finish — the steps animate inside reserved space, so
 * nothing below them shifts.
 */
export const CTAEndCard: React.FC<{ durationInFrames: number; voiced?: boolean }> = ({
  voiced = false,
}) => {
  const stepDelays = voiced ? VO_TRACK.lines.cta.stepFrames : ([8, 13, 18] as const);
  // Footer leads the spoken steps so the URL holds for the whole beat.
  const footerDelay = voiced ? 14 : 26;
  const urlDelay = voiced ? 22 : 34;

  return (
    <AbsoluteFill
      style={{
        background: noahBackdrop(),
        alignItems: "center",
        justifyContent: "center",
        fontFamily: SANS_STACK,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: -60,
        }}
      >
        <Rise delay={0}>
          <Img
            src={staticFile("brand/noah-mark-dark-1024.png")}
            style={{ width: 128, height: 128, marginBottom: 34 }}
          />
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

        {/* Reserved space: the steps fade in without moving the footer. */}
        <div style={{ height: STEP_LINE_HEIGHT * CTA.steps.length }}>
          {CTA.steps.map((step, i) => (
            <div key={step} style={{ height: STEP_LINE_HEIGHT }}>
              <Rise delay={stepDelays[i]}>
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
            </div>
          ))}
        </div>

        <Rise delay={footerDelay}>
          <div
            style={{
              marginTop: 44,
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

        <Rise delay={urlDelay}>
          <div
            style={{
              marginTop: 42,
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
};
