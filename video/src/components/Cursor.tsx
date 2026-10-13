import React from "react";

/** Windows-style arrow cursor with an optional click ripple (0..1). */
export const Cursor: React.FC<{ x: number; y: number; scale?: number; click?: number; opacity?: number }> = ({
  x,
  y,
  scale = 1.6,
  click = 0,
  opacity = 1,
}) => (
  <div style={{ position: "absolute", left: x, top: y, opacity, pointerEvents: "none", zIndex: 50 }}>
    {click > 0 && click < 1 ? (
      <div
        style={{
          position: "absolute",
          left: -40 * (0.4 + click),
          top: -40 * (0.4 + click),
          width: 80 * (0.4 + click),
          height: 80 * (0.4 + click),
          borderRadius: "50%",
          border: "3px solid rgba(79,70,229,.55)",
          opacity: 1 - click,
        }}
      />
    ) : null}
    <svg
      width={22 * scale}
      height={32 * scale}
      viewBox="0 0 22 32"
      style={{ transform: `scale(${1 - 0.12 * Math.sin(Math.PI * Math.min(1, click * 2))})`, transformOrigin: "0 0", filter: "drop-shadow(0 3px 5px rgba(0,0,0,.25))" }}
    >
      <path d="M1 1v25l6.5-6 4.2 10 4-1.7-4.2-9.8H20z" fill="#111" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  </div>
);
