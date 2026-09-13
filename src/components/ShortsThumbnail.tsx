import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { COLORS, THUMBNAIL } from "../config";
import { SANS_STACK } from "../lib/fonts";
import { SCREEN_SIZE } from "../lib/macSubstitutions";

/** Dark at the top so it meets the photo's fade seamlessly, glow at the base. */
const THUMB_BACKDROP = [
  "radial-gradient(90% 46% at 50% 92%, rgba(124,58,237,.30) 0%, rgba(8,11,17,0) 70%)",
  "radial-gradient(70% 30% at 50% 74%, rgba(37,99,235,.16) 0%, rgba(8,11,17,0) 72%)",
  "linear-gradient(180deg, #080B11 0%, #080B11 46%, #0A0E17 76%, #0B1020 100%)",
].join(", ");

/**
 * Dedicated 1080x1920 YouTube Shorts thumbnail — composed, not a grabbed
 * frame. Creator face up top, the genuine approval modal as proof below.
 */
export const ShortsThumbnail: React.FC = () => {
  const modal = SCREEN_SIZE["03-approval"];

  // Source region of the genuine modal, with a little breathing room.
  const crop = { x: 318, y: 368, w: 540, h: 284 };
  const cardW = 920;
  const cardH = Math.round((cardW * crop.h) / crop.w);
  const cardScale = cardW / crop.w;

  return (
    <AbsoluteFill style={{ background: THUMB_BACKDROP, fontFamily: SANS_STACK }}>
      {/* Creator */}
      <div style={{ position: "absolute", top: 0, left: 0, width: 1080, height: 900, overflow: "hidden" }}>
        <Img
          src={staticFile("creator/korean-creator.png")}
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 22%" }}
        />
        <AbsoluteFill
          style={{
            background:
              "linear-gradient(180deg, rgba(8,11,17,.30) 0%, rgba(8,11,17,0) 26%, rgba(8,11,17,0) 52%, rgba(8,11,17,.86) 88%, #080B11 100%)",
          }}
        />
      </div>

      {/* Noah mark — present, not dominant */}
      <Img
        src={staticFile("brand/noah-mark-dark-1024.png")}
        style={{ position: "absolute", top: 250, right: 74, width: 78, height: 78, opacity: 0.92 }}
      />

      {/* Headline */}
      <div style={{ position: "absolute", top: 800, left: 0, right: 0, textAlign: "center" }}>
        {THUMBNAIL.headline.map((line) => (
          <div
            key={line}
            style={{
              fontWeight: 800,
              fontSize: 74,
              lineHeight: 1.08,
              letterSpacing: "-0.008em",
              wordSpacing: "0.06em",
              color: COLORS.white,
              textShadow: "0 3px 18px rgba(0,0,0,.75), 0 0 2px rgba(0,0,0,.9)",
            }}
          >
            {line}
          </div>
        ))}
      </div>

      {/* Support line */}
      <div
        style={{
          position: "absolute",
          top: 978,
          left: 0,
          right: 0,
          textAlign: "center",
          fontWeight: 800,
          fontSize: 96,
          letterSpacing: "-0.006em",
          wordSpacing: "0.06em",
          background: `linear-gradient(96deg, ${COLORS.periwinkle} 0%, #9FB4FF 40%, ${COLORS.violetLight} 100%)`,
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          WebkitTextFillColor: "transparent",
          filter: "drop-shadow(0 4px 20px rgba(0,0,0,.6))",
        }}
      >
        {THUMBNAIL.support}
      </div>

      {/* Genuine approval modal */}
      <div
        style={{
          position: "absolute",
          left: (1080 - cardW) / 2,
          top: 1152,
          width: cardW,
          height: cardH,
          borderRadius: 24,
          overflow: "hidden",
          border: "1px solid rgba(160,172,255,0.20)",
          boxShadow: "0 34px 80px rgba(0,0,0,.7), 0 0 0 10px rgba(124,58,237,.10)",
          background: COLORS.appBg,
        }}
      >
        <div
          style={{
            position: "absolute",
            width: modal.w,
            height: modal.h,
            transformOrigin: "0 0",
            transform: `translate(${-crop.x * cardScale}px, ${-crop.y * cardScale}px) scale(${cardScale})`,
          }}
        >
          <Img src={staticFile("noah-screens/03-approval.png")} style={{ width: modal.w, height: modal.h, display: "block" }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
