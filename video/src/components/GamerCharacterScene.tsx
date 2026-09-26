import React from 'react';
import { AbsoluteFill, Img, interpolate, OffthreadVideo, random, Sequence, staticFile, useCurrentFrame } from 'remotion';
import { CamKey, clamp, useCamera } from './primitives';

// Source image is 1536x1024; cover-fit into 1920x1080 => 1920x1280, shifted up 100px.
const IMG_W = 1920;
const IMG_H = 1280;
const IMG_TOP = -100;
const K = IMG_W / 1536;

// Wav2Lip mouth patch: crop of the source image at (780,330) 260x160 px.
const LIP = { x: 780 * K, y: 330 * K, w: 260 * K, h: 160 * K };
export type LipClip = { file: string; from: number; frames: number };

const LipPatch: React.FC<{ frames: number; file: string }> = ({ frames, file }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 6, frames - 6, frames], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <OffthreadVideo
      src={staticFile(`lipsync/${file}.mp4`)}
      muted
      style={{
        position: 'absolute',
        left: LIP.x,
        top: LIP.y,
        width: LIP.w,
        height: LIP.h,
        opacity: o,
        WebkitMaskImage: 'radial-gradient(ellipse 46% 44% at 50% 50%, #000 55%, transparent 100%)',
        maskImage: 'radial-gradient(ellipse 46% 44% at 50% 50%, #000 55%, transparent 100%)',
      }}
    />
  );
};

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
  lipsync?: LipClip[];
}> = ({ cam, bgBlur = 5, grade = '', tint, glow = 1, breathe = true, rimPulse = 0.5, lipsync = [] }) => {
  const frame = useCurrentFrame();
  const c = useCamera(cam);
  const flicker = 0.75 + 0.12 * Math.sin(frame / 3.1) + 0.08 * (random(`fl${Math.floor(frame / 2)}`) - 0.5);
  const breath = breathe ? 1 + 0.006 * Math.sin(frame / 22) : 1;
  const sway = Math.sin(frame / 45) * 3;
  // parallax: background moves less than the character
  const bgS = 1 + (c.s - 1) * 0.9;
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
      <div style={layer(bgS * 1.02, c.x * 0.8 - sway, c.y * 0.8)}>
        {/* clean plate: person painted out, so parallax never shows a second copy */}
        <Img src={staticFile('img/gamer-plate.jpg')} style={{ width: '100%', height: '100%', filter: `blur(${bgBlur}px) brightness(0.8)` }} />
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
        {lipsync.map((l) => (
          <Sequence key={l.file} from={l.from} durationInFrames={l.frames} layout="none">
            <LipPatch file={l.file} frames={l.frames} />
          </Sequence>
        ))}
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
