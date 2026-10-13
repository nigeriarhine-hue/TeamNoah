import React from "react";
import { C, FONT } from "../theme";
import { ArrowRight, ChatIcon } from "./Icons";

/**
 * Light, video-readable presentation of the real Noah desktop window
 * (title bar "Noah", min/max/close, chat column, composer with the real placeholder copy).
 * Structure and copy come from the genuine Noah screens; only presentation is enhanced.
 */
export const EnhancedLightNoahScreen: React.FC<{
  width?: number;
  height?: number;
  children: React.ReactNode;
  scrollY?: number;
  composerText?: string;
  composerPlaceholder?: string;
  composerFocused?: boolean;
  working?: boolean;
  showCaret?: boolean;
  footerHint?: boolean;
  overlay?: React.ReactNode;
}> = ({
  width = 960,
  height = 1150,
  children,
  scrollY = 0,
  composerText = "",
  composerPlaceholder = "What's broken? Tell Noah and hit go.",
  composerFocused = false,
  working = false,
  showCaret = false,
  footerHint = false,
  overlay,
}) => {
  const hasText = composerText.length > 0;
  return (
    <div
      style={{
        width,
        height,
        borderRadius: 30,
        background: C.surfaceAlt,
        boxShadow: C.shadow,
        border: `1px solid ${C.line2}`,
        overflow: "hidden",
        position: "relative",
        fontFamily: FONT,
        color: C.ink,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* title bar */}
      <div
        style={{
          height: 70,
          flex: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 30px",
          background: "#FFFFFF",
          borderBottom: `1px solid ${C.line}`,
        }}
      >
        <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.01em" }}>Noah</div>
        <div style={{ display: "flex", gap: 34, alignItems: "center", color: C.mute }}>
          <div style={{ width: 20, height: 2, background: "currentColor" }} />
          <div style={{ width: 18, height: 18, border: "2px solid currentColor", borderRadius: 2 }} />
          <div style={{ position: "relative", width: 20, height: 20 }}>
            <div style={{ position: "absolute", left: 9, top: -3, width: 2, height: 26, background: "currentColor", transform: "rotate(45deg)" }} />
            <div style={{ position: "absolute", left: 9, top: -3, width: 2, height: 26, background: "currentColor", transform: "rotate(-45deg)" }} />
          </div>
        </div>
      </div>

      {/* chat column */}
      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, padding: "34px 34px 40px", transform: `translateY(${-scrollY}px)` }}>
          {children}
        </div>
        {/* soft fade under composer */}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 60, background: `linear-gradient(to bottom, rgba(250,248,243,0), ${C.surfaceAlt})` }} />
      </div>

      {/* composer */}
      <div style={{ flex: "none", padding: footerHint ? "14px 30px 16px" : "14px 30px 30px", background: C.surfaceAlt }}>
        <div
          style={{
            height: 98,
            borderRadius: 24,
            background: "#fff",
            border: `2px solid ${composerFocused ? "rgba(79,70,229,.55)" : C.line2}`,
            boxShadow: composerFocused ? "0 0 0 6px rgba(79,70,229,.10)" : "none",
            display: "flex",
            alignItems: "center",
            padding: "0 16px 0 30px",
            gap: 16,
          }}
        >
          <div style={{ flex: 1, fontSize: 32, color: hasText ? C.ink : C.mute, whiteSpace: "nowrap", overflow: "hidden" }}>
            {hasText ? composerText : composerPlaceholder}
            {showCaret ? (
              <span style={{ display: "inline-block", width: 3, height: 36, background: C.indigo, marginLeft: 3, verticalAlign: "middle" }} />
            ) : null}
          </div>
          <div
            style={{
              width: 66,
              height: 66,
              borderRadius: 18,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: working ? "rgba(220,38,38,.10)" : hasText ? C.aurora : C.page2,
              color: hasText ? "#fff" : C.mute,
            }}
          >
            {working ? <div style={{ width: 18, height: 18, borderRadius: 4, background: "#DC2626" }} /> : <ArrowRight size={32} stroke={2.4} />}
          </div>
        </div>
        {footerHint ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginTop: 12, fontSize: 21, color: C.mute }}>
            <ChatIcon size={22} stroke={2} />
            You can always talk to Noah instead of clicking — change the plan, skip part, or ask a question.
          </div>
        ) : null}
      </div>
      {overlay}
    </div>
  );
};

/** Right-aligned user bubble, as in the real chat. */
export const UserBubble: React.FC<{ text: string; style?: React.CSSProperties }> = ({ text, style }) => (
  <div style={{ display: "flex", justifyContent: "flex-end", ...style }}>
    <div
      style={{
        background: "#EAE6F8",
        color: C.ink,
        borderRadius: 26,
        padding: "20px 30px",
        fontSize: 34,
        fontWeight: 600,
        maxWidth: 720,
      }}
    >
      {text}
    </div>
  </div>
);

/** Section eyebrow used inside Noah result cards: "— WHAT NOAH CHECKED". */
export const Eyebrow: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: "0.14em", color: C.mute, textTransform: "uppercase", display: "flex", alignItems: "center", gap: 12, ...style }}>
    <div style={{ width: 22, height: 2, background: C.line2 }} />
    {children}
  </div>
);

/** Card with the aurora (or teal) progress line along its top edge, like the real Noah cards. */
export const AuroraCard: React.FC<{ children: React.ReactNode; line?: number; tone?: "aurora" | "commit"; style?: React.CSSProperties }> = ({
  children,
  line = 1,
  tone = "aurora",
  style,
}) => (
  <div style={{ position: "relative", background: "#fff", borderRadius: 24, border: `1px solid ${C.line}`, boxShadow: C.cardShadow, overflow: "hidden", ...style }}>
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        height: 4,
        width: `${line * 100}%`,
        background: tone === "aurora" ? C.aurora : C.commit,
      }}
    />
    {children}
  </div>
);
