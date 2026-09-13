import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "../config";
import { SANS_STACK } from "../lib/fonts";

export interface AnimatedCaptionProps {
  /** Visual line breaks for this caption group. Max two lines reads best. */
  lines: string[];
  /** Lines drawn in the Noah accent (uppercased). Match by exact string. */
  emphasis?: string[];
  /**
   * A single word highlighted inline inside a non-emphasised line — used
   * sparingly (the product name), never word-by-word karaoke.
   */
  heroWord?: string;
  /** Frame this group appeared, relative to the enclosing Sequence. */
  enterFrame?: number;
  /** Total frames this group is on screen, for the exit animation. */
  durationInFrames: number;
  fontSize?: number;
  /** Distance from the bottom of the 1920px frame. */
  bottom?: number;
}

/**
 * Premium social caption block. One group animates in as a unit — no
 * per-word karaoke, no solid caption box.
 */
export const AnimatedCaption: React.FC<AnimatedCaptionProps> = ({
  lines,
  emphasis = [],
  heroWord,
  enterFrame = 0,
  durationInFrames,
  fontSize = 68,
  bottom = 470,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - enterFrame;

  const enter = spring({
    frame: local,
    fps,
    config: { damping: 200, mass: 0.5, stiffness: 110 },
    durationInFrames: 12,
  });

  // Ease out over the last 6 frames so groups hand off cleanly.
  const exit = interpolate(
    local,
    [durationInFrames - 6, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const opacity = enter * exit;
  const translateY = interpolate(enter, [0, 1], [26, 0]);
  const scale = interpolate(enter, [0, 1], [0.965, 1]);

  // Layered shadows keep the type readable over moving footage without
  // resorting to a filled box.
  const textShadow = [
    "0 2px 10px rgba(0,0,0,.55)",
    "0 6px 30px rgba(0,0,0,.45)",
    "0 0 1px rgba(0,0,0,.9)",
  ].join(", ");

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
        opacity,
        transform: `translateY(${translateY}px) scale(${scale})`,
        willChange: "transform, opacity",
      }}
    >
      {lines.map((line, i) => {
        const isEmphasis = emphasis.includes(line);
        return (
          <div
            key={i}
            style={{
              fontFamily: SANS_STACK,
              fontWeight: isEmphasis ? 800 : 750,
              fontSize: isEmphasis ? fontSize * 1.02 : fontSize,
              lineHeight: 1.06,
              letterSpacing: isEmphasis ? "-0.012em" : "-0.02em",
              textAlign: "center",
              color: COLORS.white,
              textShadow,
              textTransform: isEmphasis ? "uppercase" : "none",
              padding: "0 40px",
              ...(isEmphasis
                ? {
                    background: `linear-gradient(96deg, ${COLORS.periwinkle} 0%, #9FB4FF 38%, ${COLORS.violetLight} 100%)`,
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    // The gradient replaces the fill, so re-apply depth with a
                    // shadow on a wrapper-safe property.
                    filter: "drop-shadow(0 3px 14px rgba(0,0,0,.6))",
                    textShadow: "none",
                  }
                : {}),
            }}
          >
            {!isEmphasis && heroWord && line.includes(heroWord)
              ? renderWithHeroWord(line, heroWord)
              : line}
          </div>
        );
      })}
    </div>
  );
};

function renderWithHeroWord(line: string, heroWord: string): React.ReactNode {
  const at = line.indexOf(heroWord);
  if (at < 0) return line;
  return (
    <>
      {line.slice(0, at)}
      <span
        style={{
          background: `linear-gradient(96deg, ${COLORS.periwinkle} 0%, ${COLORS.violetLight} 100%)`,
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          WebkitTextFillColor: "transparent",
          fontWeight: 800,
        }}
      >
        {heroWord}
      </span>
      {line.slice(at + heroWord.length)}
    </>
  );
}
