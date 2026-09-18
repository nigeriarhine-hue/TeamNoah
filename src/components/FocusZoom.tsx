import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {noah} from '../theme';

export type Focus = {
  /** point of interest in source-image coords, 0..1 */
  x: number;
  y: number;
  /** scale where 1 = image width exactly fills the frame width */
  from: number;
  to: number;
};

const clamp = (v: number, lo: number, hi: number) =>
  lo > hi ? (lo + hi) / 2 : Math.min(hi, Math.max(lo, v));

/**
 * Crops a wide desktop screenshot into 9:16 by scaling it up and parking a
 * point of interest near centre. Genuine Noah UI fills a vertical frame
 * without anything being redrawn.
 *
 * Framing is clamped rather than trusted. A landscape capture in a tall frame
 * has very little legal vertical travel, so an unclamped focus point leaves a
 * hard image edge mid-frame. We guarantee the left, right and TOP edges are
 * always off-screen; any shortfall is at the bottom, where the app window
 * ending reads as natural and is blended into the Noah UI dark.
 */
export const FocusZoom: React.FC<{
  src: string;
  /** source width / height, so the crop math is exact */
  aspect: number;
  focus: Focus;
  durationInFrames: number;
  children?: React.ReactNode;
}> = ({src, aspect, focus, durationInFrames, children}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();

  const raw = interpolate(frame, [0, durationInFrames], [focus.from, focus.to], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // never smaller than frame width, and never so small that the top can't cover
  const s = Math.max(raw, 1, (aspect * height) / width * 0.92);
  const imgW = width * s;
  const imgH = imgW / aspect;

  const fx = clamp(focus.x, width / 2 / imgW, 1 - width / 2 / imgW);
  const fy = Math.max(focus.y, height / 2 / imgH); // top edge stays off-screen

  const left = width / 2 - fx * imgW;
  const top = height / 2 - fy * imgH;

  return (
    <AbsoluteFill style={{backgroundColor: noah.uiBg, overflow: 'hidden'}}>
      <Img
        src={staticFile(src)}
        style={{position: 'absolute', left, top, width: imgW, height: imgH}}
      />
      {/* blend any bottom shortfall into the UI dark instead of a hard cut */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(to bottom, rgba(20,23,28,0) 72%, ${noah.uiBg} 94%)`,
        }}
      />
      {children}
    </AbsoluteFill>
  );
};
