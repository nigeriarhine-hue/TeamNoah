import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { COLORS, THUMBNAIL } from "../config";
import { SANS_STACK } from "../lib/fonts";
import { SCREEN_SIZE } from "../lib/macSubstitutions";

export const YT_WIDTH = 1920;
export const YT_HEIGHT = 1080;

const YT_BACKDROP = [
  "radial-gradient(58% 88% at 80% 74%, rgba(124,58,237,.28) 0%, rgba(8,11,17,0) 70%)",
  "radial-gradient(48% 66% at 64% 18%, rgba(37,99,235,.17) 0%, rgba(8,11,17,0) 72%)",
  "linear-gradient(118deg, #080B11 0%, #0A0E17 56%, #0C1226 100%)",
].join(", ");

/**
 * 16:9 YouTube thumbnail — its own composition, not a crop of the 9:16 Shorts
 * card.
 *
 * Landscape does a different job: at search-result size the face carries it, so
 * she is placed at a deliberate scale (face ~330px wide) rather than fitted to
 * a block. The long headline drops to a kicker and "YOU DECIDE." becomes the
 * hero, because the full line cannot be read at thumbnail size.
 *
 * The photo sits under the backdrop, which is re-applied over its right side
 * through a soft mask — so the two blend with no container edge to show as a
 * seam.
 */
export const YouTubeThumbnail: React.FC = () => {
  const modal = SCREEN_SIZE["03-approval"];
  const crop = { x: 322, y: 372, w: 532, h: 278 };

  // Place her face explicitly so its size in frame is deterministic.
  const FACE = { cx: 455, cy: 360, w: 230 };
  const faceScale = 330 / FACE.w;
  const photoLeft = 430 - FACE.cx * faceScale;
  const photoTop = 430 - FACE.cy * faceScale;

  const COL_X = 980;
  const cardW = 856;
  const cardScale = cardW / crop.w;
  const cardH = Math.round(crop.h * cardScale);

  const blend =
    "linear-gradient(90deg, rgba(0,0,0,0) 24%, rgba(0,0,0,.55) 38%, rgba(0,0,0,.92) 47%, rgba(0,0,0,1) 53%)";

  return (
    <AbsoluteFill style={{ background: YT_BACKDROP, fontFamily: SANS_STACK }}>
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <Img
          src={staticFile("creator/korean-creator.png")}
          style={{
            position: "absolute",
            left: photoLeft,
            top: photoTop,
            width: 896 * faceScale,
            height: 1200 * faceScale,
            maxWidth: "none",
          }}
        />
        {/* Top and bottom vignette so the type always has something to sit on */}
        <AbsoluteFill
          style={{
            background:
              "linear-gradient(180deg, rgba(8,11,17,.42) 0%, rgba(8,11,17,0) 26%, rgba(8,11,17,0) 76%, rgba(8,11,17,.55) 100%)",
          }}
        />
      </AbsoluteFill>

      {/* Backdrop re-applied over the photo's right side — no hard edge */}
      <AbsoluteFill
        style={{
          background: YT_BACKDROP,
          WebkitMaskImage: blend,
          maskImage: blend,
        }}
      />

      {/* Kicker — the full line, demoted so it never has to be read small */}
      <div style={{ position: "absolute", left: COL_X, top: 142, width: 760 }}>
        {THUMBNAIL.headline.map((line) => (
          <div
            key={line}
            style={{
              fontWeight: 800,
              fontSize: 43,
              lineHeight: 1.18,
              letterSpacing: "-0.004em",
              wordSpacing: "0.05em",
              color: "#AEB6C6",
              whiteSpace: "nowrap",
            }}
          >
            {line}
          </div>
        ))}
      </div>

      {/* Hero */}
      <div
        style={{
          position: "absolute",
          left: COL_X,
          top: 262,
          fontWeight: 800,
          fontSize: 134,
          lineHeight: 1.0,
          letterSpacing: "-0.018em",
          wordSpacing: "0.03em",
          background: `linear-gradient(96deg, ${COLORS.periwinkle} 0%, #9FB4FF 42%, ${COLORS.violetLight} 100%)`,
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          WebkitTextFillColor: "transparent",
          filter: "drop-shadow(0 6px 26px rgba(0,0,0,.7))",
        }}
      >
        {THUMBNAIL.support}
      </div>

      {/* Genuine approval modal — the proof */}
      <div
        style={{
          position: "absolute",
          left: COL_X,
          top: 452,
          width: cardW,
          height: cardH,
          borderRadius: 22,
          overflow: "hidden",
          border: "1px solid rgba(160,172,255,0.22)",
          boxShadow: "0 34px 84px rgba(0,0,0,.72), 0 0 0 9px rgba(124,58,237,.11)",
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
          <Img
            src={staticFile("noah-screens/03-approval.png")}
            style={{ width: modal.w, height: modal.h, display: "block" }}
          />
        </div>
      </div>

      {/* Noah mark — clear of the type, present but not dominant */}
      <Img
        src={staticFile("brand/noah-mark-dark-1024.png")}
        style={{ position: "absolute", right: 72, bottom: 66, width: 78, height: 78, opacity: 0.9 }}
      />
    </AbsoluteFill>
  );
};
