import React from 'react';
import { AbsoluteFill, Img, interpolate, random, staticFile, useCurrentFrame } from 'remotion';
import { CamKey, clamp, useCamera } from './primitives';

// Source image is 1536x1024; cover-fit into 1920x1080 => 1920x1280, shifted up 100px.
const IMG_W = 1920;
const IMG_H = 1280;
const IMG_TOP = -100;

/**
 * Brings the single supplied character still to life with layered 2.5D motion:
 * a softly defocused room plate + a cut-out character layer moving at different
 * parallax rates, subtle breathing, monitor glow flicker and RGB-light pulse.
 */
export const GamerCharacterScene: React.FC<{
  cam: CamKey[];
  bgBlur?: number;
  grade?: string;
  tint?: string;
  glow?: number;
  breathe?: boolean;
  rimPulse?: number;
}> = ({ cam, bgBlur = 5, grade = '', tint, glow = 1, breathe = true, rimPulse = 0.5 }) => {
  const frame = useCurrentFrame();
  const c = useCamera(cam);
  const flicker = 0.75 + 0.12 * Math.sin(frame / 3.1) + 0.08 * (random(`fl${Math.floor(frame / 2)}`) - 0.5);
  const breath = breathe ? 1 + 0.006 * Math.sin(frame / 22) : 1;
  const sway = Math.sin(frame / 45) * 3;
  // parallax: background moves less than the character
  const bgS = 1 + (c.s - 1) * 0.8;
  const layer = (s: number, x: number, y: number): React.CSSProperties => ({
    position: 'absolute',
    left: 0,
    top: IMG_TOP,
    width: IMG_W,
    height: IMG_H,
    transform: `translate(${x}px, ${y}px) scale(${s})`,
    transformOrigin: '50% 50%',
  });
  const rim = interpolate(Math.sin(frame / 20), [-1, 1], [0.15, 0.45]) * rimPulse;

  return (
    <AbsoluteFill style={{ background: '#05060c', overflow: 'hidden', filter: grade || undefined }}>
      {/* room plate */}
      <div style={layer(bgS * 1.02, c.x * 0.6 - sway, c.y * 0.6)}>
        <Img src={staticFile('img/gamer.png')} style={{ width: '100%', height: '100%', filter: `blur(${bgBlur}px) brightness(0.8)` }} />
        {/* monitor glow flicker, anchored to the monitor in the plate */}
        <div
          style={{
            position: 'absolute',
            left: -160,
            top: 60,
            width: 760,
            height: 760,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(120,110,255,0.55), rgba(90,80,230,0.0) 65%)',
            opacity: flicker * glow,
            mixBlendMode: 'screen',
          }}
        />
      </div>
      {/* character cut-out */}
      <div style={layer(c.s * breath, c.x + sway * 0.4, c.y)}>
        <Img src={staticFile('img/gamer-cutout.png')} style={{ width: '100%', height: '100%' }} />
        {/* RGB rim light on the left edge of the character */}
        <div
          style={{
            position: 'absolute',
            left: 420,
            top: 200,
            width: 700,
            height: 900,
            background: 'radial-gradient(ellipse at 20% 40%, rgba(110,120,255,0.9), transparent 60%)',
            mixBlendMode: 'soft-light',
            opacity: rim,
            WebkitMaskImage: `url(${staticFile('img/gamer-cutout.png')})`,
            WebkitMaskSize: `${IMG_W}px ${IMG_H}px`,
            WebkitMaskPosition: '-420px -200px',
          }}
        />
      </div>
      {tint && <AbsoluteFill style={{ background: tint, mixBlendMode: 'soft-light' }} />}
      <AbsoluteFill
        style={{
          background: 'linear-gradient(0deg, rgba(3,4,12,0.75), transparent 38%)',
          opacity: interpolate(frame, [0, 10], [0.6, 1], clamp),
        }}
      />
    </AbsoluteFill>
  );
};
