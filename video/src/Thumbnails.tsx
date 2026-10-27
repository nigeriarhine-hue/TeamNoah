import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { C, FONT, ensureFonts } from "./theme";
import { AuroraCard, Eyebrow } from "./components/EnhancedLightNoahScreen";
import { DriveIcon, LayersIcon, PackageIcon, StartupIcon } from "./components/Icons";
import { NoahApprovalModal } from "./components/NoahApprovalFocus";
import { NoahDiagnosticCard } from "./components/NoahDiagnosticCard";
import { ShortsSafeArea } from "./components/ShortsSafeArea";

ensureFonts();

const gradText: React.CSSProperties = {
  background: C.aurora,
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  WebkitTextFillColor: "transparent",
};

// Static diagnosis card (real "What Noah checked" content) for thumbnails.
const DiagnosisCard: React.FC<{ width: number; cardW: number }> = ({ width, cardW }) => (
  <AuroraCard style={{ width, padding: "28px 28px 30px" }}>
    <Eyebrow>What Noah checked</Eyebrow>
    <div style={{ display: "grid", gridTemplateColumns: `${cardW}px ${cardW}px`, gap: 14, marginTop: 18 }}>
      <NoahDiagnosticCard label="Startup items" value="7 launch" sub="Battle.net, Teams, Avid…" icon={<StartupIcon size={30} />} appearAt={-30} revealAt={-20} width={cardW} />
      <NoahDiagnosticCard label="Background apps" value="~30 apps" sub="Xbox, Avid, Teams, E…" icon={<LayersIcon size={30} />} appearAt={-30} revealAt={-20} width={cardW} />
      <NoahDiagnosticCard label="C: drive free" value="58 GB / 476 GB" sub="87% full — tight but…" icon={<DriveIcon size={30} />} appearAt={-30} revealAt={-20} width={cardW} />
      <NoahDiagnosticCard label="Old FL Studio installers" value="~12 GB" sub="in Downloads, old versions" icon={<PackageIcon size={30} />} appearAt={-30} revealAt={-20} width={cardW} />
    </div>
  </AuroraCard>
);

export const ThumbnailShorts: React.FC<{ host?: string }> = ({ host = "host/thumb-host-calm.png" }) => (
  <AbsoluteFill style={{ background: C.page, fontFamily: FONT, overflow: "hidden" }}>
    {/* host, upper half */}
    <AbsoluteFill style={{ height: 1300 }}>
      <Img src={staticFile(host)} style={{ width: 1080, height: 1920, objectFit: "cover", transform: "translateY(150px) scale(1.06)" }} />
    </AbsoluteFill>
    <AbsoluteFill style={{ background: "linear-gradient(to bottom, rgba(10,12,32,.92) 0%, rgba(10,12,32,.7) 16%, rgba(10,12,32,0) 30%)" }} />
    <AbsoluteFill style={{ background: "linear-gradient(to top, #ECE8DF 0%, #ECE8DF 36%, rgba(236,232,223,.0) 58%)" }} />
    <AbsoluteFill
      style={{
        backgroundImage: "radial-gradient(circle at 85% 90%, rgba(139,92,246,.16), transparent 40%), radial-gradient(circle at 10% 80%, rgba(37,99,235,.12), transparent 40%)",
      }}
    />
    <ShortsSafeArea>
      <></>
    </ShortsSafeArea>
    {/* headline — full width (thumbnail grid shows no player UI) */}
    <AbsoluteFill style={{ padding: "96px 40px 0" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 112, fontWeight: 800, letterSpacing: "-0.045em", lineHeight: 0.98, color: "#fff", whiteSpace: "nowrap", textShadow: "0 6px 30px rgba(0,0,0,.45)" }}>WHAT DOES NOAH</div>
        <div
          style={{
            fontSize: 112,
            whiteSpace: "nowrap",
            fontWeight: 800,
            letterSpacing: "-0.04em",
            lineHeight: 1.02,
            background: "linear-gradient(135deg,#8FB8FF 0%,#A9A8FF 50%,#C3A6FF 100%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          ACTUALLY DO?
        </div>
      </div>
    </AbsoluteFill>
    {/* product UI */}
    <div style={{ position: "absolute", left: 60, top: 1010, transform: "rotate(-2deg) scale(.94)", transformOrigin: "0 0" }}>
      <DiagnosisCard width={860} cardW={395} />
    </div>
    <div style={{ position: "absolute", left: 190, top: 1380, transform: "rotate(1.5deg) scale(.92)", transformOrigin: "0 0" }}>
      <NoahApprovalModal width={820} pulse={0.6} />
    </div>
    {/* secondary */}
    <div style={{ position: "absolute", left: 0, right: 0, top: 1770, textAlign: "center" }}>
      <div
        style={{
          display: "inline-block",
          padding: "18px 40px",
          borderRadius: 50,
          background: C.ink,
          color: "#fff",
          fontSize: 50,
          fontWeight: 800,
          letterSpacing: "0.02em",
        }}
      >
        HERE&apos;S WHAT HAPPENS <span style={{ ...gradText, background: "linear-gradient(135deg,#8FB8FF,#C3A6FF)" }}>↓</span>
      </div>
    </div>
  </AbsoluteFill>
);

export const Thumbnail16x9: React.FC = () => (
  <AbsoluteFill style={{ background: C.page, fontFamily: FONT, overflow: "hidden" }}>
    <AbsoluteFill
      style={{
        backgroundImage: "radial-gradient(circle at 12% 15%, rgba(99,102,241,.16), transparent 45%), radial-gradient(circle at 60% 95%, rgba(139,92,246,.14), transparent 45%)",
      }}
    />
    {/* host on the right */}
    <div style={{ position: "absolute", right: 0, top: 0, width: 560, height: 720, overflow: "hidden" }}>
      <Img src={staticFile("host/thumb-host-calm.png")} style={{ width: 560, height: 996, objectFit: "cover", transform: "translateY(-120px)" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, #ECE8DF 0%, rgba(236,232,223,0) 28%)" }} />
    </div>
    {/* headline */}
    <div style={{ position: "absolute", left: 56, top: 48, width: 760 }}>
      <div style={{ fontSize: 76, fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 0.98, color: C.ink }}>
        WHAT DOES NOAH <span style={gradText}>ACTUALLY DO?</span>
      </div>
      <div style={{ marginTop: 18, display: "inline-block", padding: "10px 24px", borderRadius: 40, background: C.ink, color: "#fff", fontSize: 30, fontWeight: 800, letterSpacing: "0.02em" }}>
        HERE&apos;S WHAT HAPPENS
      </div>
    </div>
    {/* UI */}
    <div style={{ position: "absolute", left: 40, top: 300, transform: "scale(.62) rotate(-1.5deg)", transformOrigin: "0 0" }}>
      <DiagnosisCard width={860} cardW={395} />
    </div>
    <div style={{ position: "absolute", left: 400, top: 430, transform: "scale(.52) rotate(1.5deg)", transformOrigin: "0 0" }}>
      <NoahApprovalModal width={820} pulse={0.6} />
    </div>
  </AbsoluteFill>
);
