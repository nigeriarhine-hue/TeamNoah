import React from 'react';
import {AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {PJS} from '../fonts';
import type {TextPatch} from '../macPatches';
import {noah} from '../theme';

const clamp = (v: number, lo: number, hi: number) =>
  lo > hi ? (lo + hi) / 2 : Math.min(hi, Math.max(lo, v));

/**
 * Presents a wide desktop screenshot inside a 9:16 frame by fitting a source
 * COLUMN to the frame width, then anchoring vertically on a row of interest.
 *
 * Fitting the column rather than covering the frame is deliberate. A 1170x985
 * capture that covers 1080x1920 has to be scaled ~2.1x, which slices the text
 * column in half and cuts words mid-glyph -- fatal here, because the words are
 * the payload. Fitting the column keeps every line whole; the leftover vertical
 * space becomes dark bands blended into the Noah UI colour, which also keeps
 * the Windows window chrome out of frame.
 */
export type SourceRing = {
  /** ring box in SOURCE image pixels */
  x: number; y: number; w: number; h: number;
  appearAt?: number;
};

export type SourceCursor = {
  /** travel in SOURCE image pixels */
  fromX: number; fromY: number; toX: number; toY: number;
  clickAt: number;
};

export const FocusZoom: React.FC<{
  src: string;
  /** source pixel dimensions, so fit and patch math are exact */
  srcW: number;
  srcH: number;
  /** source column to fit to the frame width */
  colX: number;
  colW: number;
  /** source row to centre on */
  anchorY: number;
  /** slow drift; 1 = column exactly fills the frame width */
  zoom: {from: number; to: number};
  durationInFrames: number;
  patches?: TextPatch[];
  /** ring + cursor live in source space so they track the UI through any crop */
  ring?: SourceRing;
  cursor?: SourceCursor;
  children?: React.ReactNode;
}> = ({
  src, srcW, srcH, colX, colW, anchorY, zoom, durationInFrames,
  patches = [], ring, cursor, children,
}) => {
  const frame = useCurrentFrame();
  const {width: W, height: H, fps} = useVideoConfig();

  const z = interpolate(frame, [0, durationInFrames], [zoom.from, zoom.to], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // source pixel -> rendered pixel
  const k = (W / colW) * z;
  const imgW = srcW * k;
  const imgH = srcH * k;

  const left = W / 2 - (colX + colW / 2) * k;
  const top = clamp(H / 2 - anchorY * k, Math.min(0, H - imgH), Math.max(0, H - imgH));

  return (
    <AbsoluteFill style={{backgroundColor: noah.uiBg, overflow: 'hidden'}}>
      <div style={{position: 'absolute', left, top, width: imgW, height: imgH}}>
        <Img src={staticFile(src)} style={{width: '100%', height: '100%'}} />
        {patches.map((p, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: p.x * k,
              top: p.y * k,
              width: p.w * k,
              height: p.h * k,
              backgroundColor: p.bg,
              display: 'flex',
              alignItems: 'center',
              paddingLeft: (p.inset ?? 0) * k,
              boxSizing: 'border-box',
              overflow: 'hidden',
            }}
          >
            <span
              style={{
                fontFamily: `${PJS}, sans-serif`,
                fontSize: p.size * k,
                fontWeight: p.weight,
                color: p.color,
                letterSpacing: p.letterSpacing,
                whiteSpace: 'nowrap',
                lineHeight: 1.1,
              }}
            >
              {p.text}
            </span>
          </div>
        ))}

        {ring ? (() => {
          const a = interpolate(
            frame,
            [ring.appearAt ?? 0, (ring.appearAt ?? 0) + 10],
            [0, 1],
            {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
          );
          const pulse = 1 + Math.sin(frame / 7) * 0.012;
          return (
            <div
              style={{
                position: 'absolute',
                left: ring.x * k,
                top: ring.y * k,
                width: ring.w * k,
                height: ring.h * k,
                borderRadius: 14 * k,
                // white core with a dark halo, so the ring reads over the
                // bright approve button as well as over dark panel rows
                border: `${3 * k}px solid #FFFFFF`,
                boxShadow: `0 0 0 ${1.6 * k}px rgba(0,0,0,0.60), 0 0 ${24 * k}px rgba(199,203,255,0.85)`,
                opacity: a,
                transform: `scale(${pulse})`,
              }}
            />
          );
        })() : null}

        {cursor ? (() => {
          const travel = spring({frame, fps, config: {damping: 200, mass: 1.1}});
          const cx = interpolate(travel, [0, 1], [cursor.fromX, cursor.toX]) * k;
          const cy = interpolate(travel, [0, 1], [cursor.fromY, cursor.toY]) * k;
          const rippled = interpolate(frame, [cursor.clickAt, cursor.clickAt + 12], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          const press = frame >= cursor.clickAt && frame < cursor.clickAt + 4 ? 0.88 : 1;
          return (
            <div style={{position: 'absolute', left: cx, top: cy, transform: `scale(${press})`}}>
              {rippled > 0 && rippled < 1 ? (
                <div
                  style={{
                    position: 'absolute',
                    left: -34, top: -34, width: 68, height: 68, borderRadius: 34,
                    border: '3px solid rgba(255,255,255,0.85)',
                    transform: `scale(${0.4 + rippled * 1.4})`,
                    opacity: 1 - rippled,
                  }}
                />
              ) : null}
              <svg width={46} height={52} viewBox="0 0 24 28"
                style={{filter: 'drop-shadow(0 3px 7px rgba(0,0,0,0.65))'}}>
                <path
                  d="M3 2 L3 22 L8.5 17 L12 25 L15.5 23.4 L12 15.6 L19 15.6 Z"
                  fill="#fff" stroke="#111" strokeWidth="1.1" strokeLinejoin="round"
                />
              </svg>
            </div>
          );
        })() : null}
      </div>
      {/* blend both exposed edges into the UI dark instead of a hard cut */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(to bottom, ${noah.uiBg} 0%, rgba(20,23,28,0) 14%, rgba(20,23,28,0) 82%, ${noah.uiBg} 97%)`,
        }}
      />
      {children}
    </AbsoluteFill>
  );
};
