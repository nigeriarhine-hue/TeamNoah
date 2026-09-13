import React from "react";
import { AbsoluteFill } from "remotion";
import { SAFE } from "../config";

/**
 * Keeps content inside the TikTok / Shorts safe area. Set `debug` to see the
 * guides while composing.
 */
export const SafeArea: React.FC<{
  children?: React.ReactNode;
  debug?: boolean;
  /** Override individual insets (e.g. a full-bleed scene that only needs sides). */
  inset?: Partial<typeof SAFE>;
  style?: React.CSSProperties;
}> = ({ children, debug = false, inset, style }) => {
  const s = { ...SAFE, ...inset };
  return (
    <AbsoluteFill
      style={{
        paddingTop: s.top,
        paddingBottom: s.bottom,
        paddingLeft: s.left,
        paddingRight: s.right,
        ...style,
      }}
    >
      {children}
      {debug ? (
        <AbsoluteFill
          style={{
            border: "2px dashed rgba(255,0,128,.6)",
            margin: `${s.top}px ${s.right}px ${s.bottom}px ${s.left}px`,
            pointerEvents: "none",
          }}
        />
      ) : null}
    </AbsoluteFill>
  );
};
