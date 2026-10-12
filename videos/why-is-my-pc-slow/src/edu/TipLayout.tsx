import React from 'react';
import { Stage } from './Stage';
import { ChapterHeader, ChapterRail, SeriesTag } from './Series';
import { HostPlate } from './Host';
import { pop } from './motion';
import { SAFE } from './theme';

/**
 * One numbered chapter of a PC CHECK 101 episode.
 *
 *   y 196   series tag ··········· 01 02 03 04 05
 *   y 270   [ 01 ][icon]                 (host)
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
  host: { src: string; fx?: number; fy?: number; zoom?: number };
  diagramTop?: number;
  children: React.ReactNode;
}> = ({ n, title, titleSize, icon, t, dur, host, diagramTop = 660, children }) => {
  const hostIn = pop(t, 0.25, 16, 0.7);
  return (
    <Stage t={t} dur={dur}>
      <div style={{ position: 'absolute', left: SAFE.left, right: SAFE.left, top: 196, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <SeriesTag />
        <ChapterRail active={n} t={t} />
      </div>
      <div style={{ position: 'absolute', left: SAFE.left, top: 290 }}>
        <ChapterHeader n={n} title={title} icon={icon} t={t} titleSize={titleSize} />
      </div>
      {/* host bubble: present, but the diagram does the teaching */}
      <div style={{ position: 'absolute', right: SAFE.left, top: 282 }}>
        <div style={{ borderRadius: '50%', overflow: 'hidden', width: 214, height: 214, boxShadow: '0 18px 44px rgba(20,24,60,0.22)', border: '5px solid #fff', transform: `scale(${0.7 + hostIn * 0.3})`, opacity: hostIn }}>
          <div style={{ width: 214, height: 214, position: 'relative' }}>
            <HostPlate src={host.src} fx={host.fx ?? 50} fy={host.fy ?? 50} t={t} dur={dur} zoomFrom={host.zoom ?? 1.02} zoomTo={(host.zoom ?? 1.02) * 1.07} drift={-4} />
          </div>
        </div>
      </div>
      <div style={{ position: 'absolute', left: SAFE.left, right: SAFE.left, top: diagramTop, bottom: 1920 - 1412 }}>{children}</div>
    </Stage>
  );
};
