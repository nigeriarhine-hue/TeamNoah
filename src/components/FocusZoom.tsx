import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';

export type Focus = {
  /** point of interest in source-image coords, 0..1 */
  x: number;
  y: number;
  /** scale where 1 = image width exactly fills the frame width */
  from: number;
  to: number;
};

/**
 * Crops a wide desktop screenshot into 9:16 by scaling it up and parking the
 * point of interest dead centre, with a slow drift. Genuine Noah UI fills a
 * vertical frame without anything being redrawn.
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

  const s = interpolate(frame, [0, durationInFrames], [focus.from, focus.to], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const imgW = width * s;
  const imgH = imgW / aspect;
  const left = width / 2 - focus.x * imgW;
  const top = height / 2 - focus.y * imgH;

  return (
    <AbsoluteFill style={{backgroundColor: '#0B0D11', overflow: 'hidden'}}>
      <Img
        src={staticFile(src)}
        style={{position: 'absolute', left, top, width: imgW, height: imgH}}
      />
      {children}
    </AbsoluteFill>
  );
};
