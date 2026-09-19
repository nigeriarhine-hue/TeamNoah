import React from 'react';
import { font, theme } from '../theme';
import { FRAME } from './PremiumAppFrame';

type Props = {
  width: number;
  height: number;
  x?: number;
  y?: number;
  tiltX?: number;
  tiltY?: number;
  scale?: number;
  opacity?: number;
  blur?: number;
  z?: number;
  children?: React.ReactNode;
  style?: React.CSSProperties;
};

/** Generic floating surface — same shell language as PremiumAppFrame, lighter weight. */
export const FloatingWindow: React.FC<Props> = ({
  width,
  height,
  x = 0,
  y = 0,
  tiltX = 0,
  tiltY = 0,
  scale = 1,
  opacity = 1,
  blur = 0,
  z = 0,
  children,
  style,
}) => (
  <div
    style={{
      position: 'absolute',
      left: '50%',
      top: '50%',
      width,
      height,
      marginLeft: -width / 2,
      marginTop: -height / 2,
      transform: `translate3d(${x}px, ${y}px, 0) perspective(2200px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(${scale})`,
      opacity,
      filter: blur > 0.05 ? `blur(${blur}px)` : undefined,
      zIndex: z,
      borderRadius: 20,
      overflow: 'hidden',
      border: FRAME.border,
      boxShadow: '0 2px 5px rgba(0,0,0,0.45), 0 22px 48px -20px rgba(0,0,0,0.8)',
      background: '#11141A',
      willChange: 'transform, opacity',
      ...style,
    }}
  >
    {children}
  </div>
);

/**
 * A deliberately anonymous browser window for the "old way" montage (§17).
 * No real site is depicted or named — these stand for generic forum-trawling,
 * so no third party appears to endorse Noah.
 */
export const BrowserCard: React.FC<{
  query: string;
  rows?: number;
  width: number;
  height: number;
  x?: number;
  y?: number;
  tiltY?: number;
  scale?: number;
  opacity?: number;
  blur?: number;
  z?: number;
  seed?: number;
}> = ({ query, rows = 4, width, height, x, y, tiltY = 0, scale = 1, opacity = 1, blur = 0, z = 0, seed = 1 }) => {
  const rand = (i: number) => {
    const v = Math.sin((i + 1) * 12.9898 * seed) * 43758.5453;
    return v - Math.floor(v);
  };
  return (
    <FloatingWindow
      width={width}
      height={height}
      x={x}
      y={y}
      tiltY={tiltY}
      scale={scale}
      opacity={opacity}
      blur={blur}
      z={z}
    >
      {/* chrome */}
      <div
        style={{
          height: 52,
          display: 'flex',
          alignItems: 'center',
          gap: 9,
          padding: '0 18px',
          background: '#181C23',
          borderBottom: `1px solid ${theme.line}`,
        }}
      >
        {['#3A3F49', '#3A3F49', '#3A3F49'].map((c, i) => (
          <span key={i} style={{ width: 11, height: 11, borderRadius: 6, background: c }} />
        ))}
        <div
          style={{
            marginLeft: 12,
            flex: 1,
            height: 28,
            borderRadius: 14,
            background: '#0F1218',
            display: 'flex',
            alignItems: 'center',
            padding: '0 14px',
            fontFamily: font.sans,
            fontSize: 16,
            color: theme.mute,
            letterSpacing: '-0.01em',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
          }}
        >
          {query}
        </div>
      </div>
      {/* anonymous result rows */}
      <div style={{ padding: '20px 20px 0' }}>
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} style={{ marginBottom: 20 }}>
            <div
              style={{
                height: 13,
                width: `${52 + rand(i) * 40}%`,
                borderRadius: 7,
                background: 'rgba(120,132,176,0.42)',
              }}
            />
            <div
              style={{
                height: 9,
                width: `${64 + rand(i + 9) * 28}%`,
                borderRadius: 5,
                background: 'rgba(255,255,255,0.09)',
                marginTop: 9,
              }}
            />
            <div
              style={{
                height: 9,
                width: `${38 + rand(i + 21) * 30}%`,
                borderRadius: 5,
                background: 'rgba(255,255,255,0.07)',
                marginTop: 7,
              }}
            />
          </div>
        ))}
      </div>
    </FloatingWindow>
  );
};
