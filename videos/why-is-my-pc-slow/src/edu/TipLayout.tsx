import React from 'react';
import { Stage } from './Stage';
import { ChapterHeader, ChapterRail, SeriesTag } from './Series';
import { SAFE } from './theme';

/**
 * One numbered chapter of a PC CHECK 101 episode.
 *
 *   y 196   series tag ··········· 01 02 03 04 05
 *   y 270   [ 01 ][icon]
 *           TITLE
 *   y ~650  ┌ diagram slot ─────────────────────┐
 *   y 1410  └───────────────────────────────────┘
 *   y 1452  captions
 *
 * Reuse for any five-step explainer: supply n, title, icon and a diagram.
 */
export const TipLayout: React.FC<{
  n: number;
  title: string[];
  titleSize?: number;
  icon: React.ReactNode;
  t: number;
  dur: number;
  diagramTop?: number;
  children: React.ReactNode;
}> = ({ n, title, titleSize, icon, t, dur, diagramTop = 660, children }) => {
  return (
    <Stage t={t} dur={dur}>
      <div style={{ position: 'absolute', left: SAFE.left, right: SAFE.left, top: 196, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <SeriesTag />
        <ChapterRail active={n} t={t} />
      </div>
      <div style={{ position: 'absolute', left: SAFE.left, top: 290 }}>
        <ChapterHeader n={n} title={title} icon={icon} t={t} titleSize={titleSize} />
      </div>
      <div style={{ position: 'absolute', left: SAFE.left, right: SAFE.left, top: diagramTop, bottom: 1920 - 1412 }}>{children}</div>
    </Stage>
  );
};
