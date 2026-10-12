import React from 'react';
import { Img, staticFile } from 'remotion';
import { edu } from './theme';

/**
 * The series host — the recurring young Black creator already used across
 * Noah's channel. Graded brighter and more neutral than the gaming spots
 * (lifted exposure, pulled saturation, cool lift) so his desk reads as a clean
 * tech workspace instead of an RGB gaming den.
 */
export const HOST = {
  toCamera: 'host/to-camera.jpg',
  atDesk: 'host/at-desk.jpg',
  /** square crops for the chapter bubble */
  toCameraFace: 'host/to-camera-face.jpg',
  atDeskFace: 'host/at-desk-face.jpg',
} as const;

const GRADE = 'brightness(1.1) contrast(1.05) saturate(0.78)';

type Props = {
  src: string;
  t: number;
  /** object-position focus (%) */
  fx?: number;
  fy?: number;
  zoomFrom?: number;
  zoomTo?: number;
  dur?: number;
  /** horizontal parallax drift in px over `dur` */
  drift?: number;
};

/** Full-bleed host plate with slow push-in + parallax drift. */
export const HostPlate: React.FC<Props> = ({ src, t, fx = 50, fy = 30, zoomFrom = 1.04, zoomTo = 1.14, dur = 6, drift = -18 }) => {
  const p = Math.min(1, Math.max(0, t / dur));
  const s = zoomFrom + (zoomTo - zoomFrom) * p;
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: edu.dark }}>
      <Img
        src={staticFile(src)}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: `${fx}% ${fy}%`,
          transform: `scale(${s}) translateX(${drift * p}px)`,
          transformOrigin: `${fx}% ${fy}%`,
          filter: GRADE,
        }}
      />
      {/* cool, neutral lift — tames the warm/RGB cast */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(120,140,220,0.10), rgba(160,150,255,0.06))', mixBlendMode: 'screen' }} />
    </div>
  );
};

/**
 * Picture-in-picture host card for teaching sections: he stays present while
 * the diagram does the explaining.
 */
export const HostCard: React.FC<Props & { w: number; h: number; enter?: number; label?: string }> = ({
  w,
  h,
  enter = 1,
  label,
  ...plate
}) => (
  <div
    style={{
      width: w,
      height: h,
      borderRadius: 30,
      overflow: 'hidden',
      position: 'relative',
      boxShadow: '0 22px 50px rgba(20,24,60,0.22)',
      border: '4px solid #fff',
      transform: `scale(${0.9 + enter * 0.1})`,
      opacity: enter,
    }}
  >
    <HostPlate {...plate} />
    {label && (
      <div
        style={{
          position: 'absolute',
          left: 14,
          bottom: 14,
          padding: '6px 12px',
          borderRadius: 10,
          background: 'rgba(11,12,18,0.62)',
          color: '#fff',
          fontSize: 20,
          fontWeight: 700,
          letterSpacing: '0.06em',
          fontFamily: "'Figtree', sans-serif",
        }}
      >
        {label}
      </div>
    )}
  </div>
);
