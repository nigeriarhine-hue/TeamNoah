import React from "react";
import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { SANS } from "./Fonts";

// Branded CTA panel: NOAH / FREE PC CHECK / Describe it. Approve it. Done. / onnoah.app
export const EndCard: React.FC<{ from: number }> = ({ from }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = frame - from;
  if (f < 0) return null;
  const s = (d: number) => spring({ frame: f - d, fps, config: { damping: 14, stiffness: 160 } });
  const panel = s(0);
  const urlPulse = 1 + Math.max(0, Math.sin((f - 30) / 6)) * 0.03 * (f > 30 ? 1 : 0);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 900, transform: `translateY(${(1 - panel) * 950}px)` }}>
      <div style={{
        position: "absolute", left: 40, right: 40, top: 0, bottom: 300, borderRadius: 56,
        background: "linear-gradient(160deg, #1A1D61 0%, #23206e 55%, #3b2a8f 100%)",
        boxShadow: "0 -10px 80px rgba(20,10,80,0.45), inset 0 0 0 3px rgba(199,203,255,0.25)", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", left: -200, right: -200, bottom: -260, height: 420, background: "radial-gradient(50% 50% at 50% 50%, rgba(139,92,246,0.55), rgba(99,102,241,0) 70%)" }} />
        <div style={{ position: "absolute", top: 54, left: 0, right: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 26, transform: `scale(${s(4)})` }}>
          <Img src={staticFile("brand/noah-mark-dark.svg")} style={{ width: 132, height: 132 }} />
          <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 112, color: "#ffffff", letterSpacing: 4 }}>NOAH</div>
        </div>
        <div style={{ position: "absolute", top: 222, left: 0, right: 0, textAlign: "center", opacity: s(9), transform: `translateY(${(1 - s(9)) * 30}px)` }}>
          <span style={{ fontFamily: SANS, fontWeight: 800, fontSize: 50, letterSpacing: 6, color: "#1A1D61", background: "#FFB547", padding: "10px 30px", borderRadius: 999 }}>FREE PC CHECK</span>
        </div>
        <div style={{ position: "absolute", top: 330, left: 0, right: 0, textAlign: "center", fontFamily: SANS, fontWeight: 600, fontSize: 48, color: "#E7E8FF", opacity: s(14), transform: `translateY(${(1 - s(14)) * 30}px)` }}>
          Describe it. Approve it. Done.
        </div>
        <div style={{ position: "absolute", top: 420, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: s(19), transform: `scale(${(0.8 + 0.2 * s(19)) * urlPulse})` }}>
          <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 66, color: "#1A1D61", background: "linear-gradient(90deg, #ffffff, #e6e4ff)", padding: "14px 46px", borderRadius: 26, boxShadow: "0 12px 40px rgba(139,92,246,0.5)" }}>
            onnoah.app
          </div>
        </div>
      </div>
    </div>
  );
};
