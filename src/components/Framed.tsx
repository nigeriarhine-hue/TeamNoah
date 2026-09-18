import React from 'react';
import {AbsoluteFill, OffthreadVideo, staticFile, useCurrentFrame} from 'remotion';
import {HEIGHT, WIDTH} from '../video2/timeline';

/**
 * Every source clip is 1920x1080. The ad is 1080x1920. At "cover" scale the
 * source is drawn 3413x1920, which means only ~32% of its width is on screen —
 * so where that window sits is the whole framing decision, and it is made
 * explicitly per shot rather than defaulting to centre.
 */
const SOURCE_AR = 1920 / 1080;
const COVER_W = HEIGHT * SOURCE_AR; // 3413.33
const COVER_H = HEIGHT;

export type Framing = {
  /** Multiplier on cover scale. 1 = the widest the 9:16 frame can hold. */
  zoom: number;
  /** Which point of the SOURCE width sits at the centre of the frame (0–1). */
  focusX: number;
  /** Same vertically. Only has room to move once zoom > 1. */
  focusY?: number;
};

/** Linearly blends two framings; used for slow push-ins and digital pans. */
export const mixFraming = (a: Framing, b: Framing, t: number): Framing => ({
  zoom: a.zoom + (b.zoom - a.zoom) * t,
  focusX: a.focusX + (b.focusX - a.focusX) * t,
  focusY: (a.focusY ?? 0.5) + ((b.focusY ?? 0.5) - (a.focusY ?? 0.5)) * t,
});

const layout = ({zoom, focusX, focusY = 0.5}: Framing) => {
  const w = COVER_W * zoom;
  const h = COVER_H * zoom;
  // Put the focus point at the centre of the frame, then pull it back inside
  // the source so we never expose an edge.
  const left = Math.min(0, Math.max(WIDTH - w, WIDTH / 2 - focusX * w));
  const top = Math.min(0, Math.max(HEIGHT - h, HEIGHT / 2 - focusY * h));
  return {width: w, height: h, left, top};
};

/**
 * Restrained grade. The footage is already lit teal-and-amber; this only
 * deepens the corners and adds the contrast a phone screen eats.
 */
const Grade: React.FC<{strength?: number}> = ({strength = 1}) => (
  <>
    <AbsoluteFill
      style={{
        background:
          'radial-gradient(118% 78% at 50% 42%, rgba(0,0,0,0) 38%, rgba(4,6,16,0.46) 100%)',
        opacity: strength,
      }}
    />
    <AbsoluteFill
      style={{
        background:
          'linear-gradient(180deg, rgba(4,6,16,0.34) 0%, rgba(4,6,16,0) 22%, rgba(4,6,16,0) 58%, rgba(4,6,16,0.52) 100%)',
        opacity: strength,
      }}
    />
  </>
);

export const Framed: React.FC<{
  src: string;
  /** Seconds into the source file where this shot begins. */
  inPoint: number;
  /** Framing at the first frame of the scene. */
  from: Framing;
  /** Framing at the last frame. Omit to hold `from` (a locked-off shot). */
  to?: Framing;
  /**
   * Frame (relative to this scene) where the clip's own internal cut lands.
   * The framing snaps to `afterCut` there — invisible, because the picture
   * changes on the same frame.
   */
  cutAt?: number;
  afterCut?: {from: Framing; to?: Framing};
  durationInFrames: number;
  volume?: number;
  grade?: number;
  style?: React.CSSProperties;
}> = ({
  src,
  inPoint,
  from,
  to,
  cutAt,
  afterCut,
  durationInFrames,
  volume = 0,
  grade = 1,
  style,
}) => {
  const frame = useCurrentFrame();

  const onSecondShot = cutAt !== undefined && afterCut !== undefined && frame >= cutAt;
  const a = onSecondShot ? afterCut.from : from;
  const b = onSecondShot ? (afterCut.to ?? afterCut.from) : (to ?? from);

  const spanStart = onSecondShot ? cutAt : 0;
  const spanEnd = onSecondShot ? durationInFrames : (cutAt ?? durationInFrames);
  const t = spanEnd > spanStart ? (frame - spanStart) / (spanEnd - spanStart) : 0;

  const box = layout(mixFraming(a, b, Math.max(0, Math.min(1, t))));

  return (
    <AbsoluteFill style={{overflow: 'hidden', backgroundColor: '#04060F', ...style}}>
      <OffthreadVideo
        src={staticFile(src)}
        trimBefore={Math.round(inPoint * 30)}
        volume={volume}
        muted={volume === 0}
        toneMapped={false}
        style={{
          position: 'absolute',
          ...box,
          // Recovers the micro-contrast lost to the 1.78x upscale without
          // tipping into a "sharpened" look.
          filter: 'contrast(1.045) saturate(1.05) brightness(1.01)',
        }}
      />
      {grade > 0 ? <Grade strength={grade} /> : null}
    </AbsoluteFill>
  );
};
