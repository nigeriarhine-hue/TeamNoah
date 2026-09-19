import React from 'react';
import { Img, staticFile } from 'remotion';
import { type AssetName, heightFor } from '../config/asset-sizes';
import { PremiumAppFrame } from './PremiumAppFrame';

/** Canvas centre. Panel `y` props are offsets from here. */
export const CENTRE = { x: 540, y: 960 } as const;

type Props = {
  /** Name of a processed Noah asset — the height follows from its real aspect. */
  name: AssetName;
  width: number;
  x?: number;
  y?: number;
  tiltX?: number;
  tiltY?: number;
  scale?: number;
  opacity?: number;
  blur?: number;
  glow?: number;
  radius?: number;
  style?: React.CSSProperties;
};

/**
 * A real Noah screen region, drawn at its true aspect ratio inside the shared
 * presentation shell. This is the only way Noah UI enters the film.
 */
export const NoahPanel: React.FC<Props> = ({
  name,
  width,
  x = 0,
  y = 0,
  tiltX = 0,
  tiltY = 0,
  scale = 1,
  opacity = 1,
  blur = 0,
  glow = 1,
  radius,
  style,
}) => (
  <PremiumAppFrame
    width={width}
    height={heightFor(name, width)}
    radius={radius}
    x={x}
    y={y}
    tiltX={tiltX}
    tiltY={tiltY}
    scale={scale}
    opacity={opacity}
    blur={blur}
    glow={glow}
    style={style}
  >
    <Img
      src={staticFile(`noah/${name}.png`)}
      style={{ width: '100%', height: '100%', display: 'block', objectFit: 'fill' }}
    />
  </PremiumAppFrame>
);

/** Where a panel sits on the canvas — for placing a UIFocus or a cursor target. */
export const panelBox = (name: AssetName, width: number, x = 0, y = 0) => {
  const h = heightFor(name, width);
  return { x: CENTRE.x + x - width / 2, y: CENTRE.y + y - h / 2, w: width, h };
};

/**
 * Canvas rect for a normalised region inside a panel, so a highlight can be
 * anchored to a real UI element rather than to a guessed pixel offset.
 */
export const regionRect = (
  name: AssetName,
  width: number,
  region: { u0: number; v0: number; u1: number; v1: number },
  x = 0,
  y = 0,
) => {
  const b = panelBox(name, width, x, y);
  return {
    x: b.x + region.u0 * b.w,
    y: b.y + region.v0 * b.h,
    w: (region.u1 - region.u0) * b.w,
    h: (region.v1 - region.v0) * b.h,
  };
};
