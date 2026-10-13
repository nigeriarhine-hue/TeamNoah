import React from "react";
import { C, FONT } from "../theme";
import { WarnIcon } from "./Icons";

/**
 * The genuine Noah approval modal ("Can Noah do this?" / "Noah needs your OK to continue." /
 * No thanks · Go ahead · Approve all), rendered light, with spotlight + dim controls for video.
 */
export const NoahApprovalModal: React.FC<{
  scale?: number;
  appear?: number; // 0..1
  pulse?: number; // 0..1 restrained glow on "Go ahead"
  pressed?: number; // 0..1 press state on "Go ahead"
  width?: number;
}> = ({ scale = 1, appear = 1, pulse = 0, pressed = 0, width = 820 }) => (
  <div
    style={{
      width,
      borderRadius: 34,
      background: "#fff",
      border: `1px solid ${C.line2}`,
      boxShadow: "0 40px 120px -30px rgba(26,29,97,.55), 0 8px 24px rgba(15,23,41,.10)",
      fontFamily: FONT,
      color: C.ink,
      overflow: "hidden",
      opacity: appear,
      transform: `scale(${scale * (0.92 + 0.08 * appear)}) translateY(${(1 - appear) * 30}px)`,
    }}
  >
    <div style={{ padding: "44px 48px 34px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
        <div style={{ width: 84, height: 84, borderRadius: 22, background: C.amberSoft, color: C.amber, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <WarnIcon size={44} stroke={2.2} />
        </div>
        <div style={{ fontSize: 46, fontWeight: 800, letterSpacing: "-0.02em" }}>Can Noah do this?</div>
      </div>
      <div style={{ fontSize: 36, color: C.ink2, marginTop: 30 }}>Noah needs your OK to continue.</div>
    </div>
    <div style={{ borderTop: `1px solid ${C.line}`, padding: "28px 36px 34px", display: "flex", gap: 18, justifyContent: "flex-end" }}>
      <Btn kind="ghost">No thanks</Btn>
      <Btn kind="primary" pulse={pulse} pressed={pressed}>
        Go ahead
      </Btn>
      <Btn kind="outline">Approve all</Btn>
    </div>
  </div>
);

const Btn: React.FC<{ kind: "ghost" | "primary" | "outline"; children: React.ReactNode; pulse?: number; pressed?: number }> = ({
  kind,
  children,
  pulse = 0,
  pressed = 0,
}) => (
  <div
    style={{
      height: 84,
      padding: "0 34px",
      borderRadius: 20,
      display: "flex",
      alignItems: "center",
      fontSize: 32,
      fontWeight: 700,
      background: kind === "primary" ? C.aurora : kind === "ghost" ? C.page2 : "#fff",
      color: kind === "primary" ? "#fff" : kind === "ghost" ? C.ink2 : C.indigo,
      border: kind === "outline" ? `2px solid rgba(79,70,229,.45)` : "2px solid transparent",
      boxShadow: kind === "primary" ? `0 0 0 ${10 * pulse}px rgba(79,70,229,${0.16 * pulse}), 0 10px 26px -10px rgba(79,70,229,.8)` : "none",
      transform: `scale(${1 - 0.05 * pressed})`,
    }}
  >
    {children}
  </div>
);

/** Full-frame dim + blur that pushes the app back so the modal owns the screen. */
export const SpotlightDim: React.FC<{ amount: number; children: React.ReactNode }> = ({ amount, children }) => (
  <div style={{ position: "relative", width: "100%", height: "100%" }}>
    <div style={{ position: "absolute", inset: 0, filter: `blur(${amount * 7}px)`, transform: `scale(${1 - 0.03 * amount})` }}>{children}</div>
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: `radial-gradient(ellipse 70% 40% at 50% 52%, rgba(20,22,48,${0.25 * amount}), rgba(20,22,48,${0.62 * amount}))`,
      }}
    />
  </div>
);
