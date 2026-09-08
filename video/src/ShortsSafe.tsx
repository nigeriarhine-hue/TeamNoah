import React from 'react';
import {AbsoluteFill, OffthreadVideo, staticFile, useVideoConfig} from 'remotion';

/**
 * Refits an already-vertical clip so nothing is lost on YouTube Shorts.
 *
 * Two different things eat a Shorts frame on a phone, and they need separate room:
 *
 *  1. HARD CROP. Phones taller than 16:9 (19.5:9, 20:9) scale a 9:16 clip to fill
 *     the screen height, which crops roughly 10% off each side. Those pixels are
 *     gone, not covered.
 *  2. OCCLUSION. The action rail (like / comment / remix / sound) sits over the
 *     right edge, and the title, handle, description and scrubber sit over the
 *     bottom. Those pixels are drawn over.
 *
 * So the clip is scaled to sit inside the intersection of both, and the space that
 * frees up is filled with a blurred copy of itself — the padding then reads as
 * deliberate rather than as a letterbox.
 */

export const SOURCE = 'shorts-source.mp4';
export const SHORTS_FRAMES = 937;

export type Reserved = {top: number; bottom: number; left: number; right: number};

/**
 * Reserved edges in a 1080×1920 frame.
 *
 * `strict` clears everything: the side crop AND every piece of chrome, so no part
 * of the clip is ever cropped or drawn over.
 *
 * `wide` clears the side crop — the part that actually destroys pixels — and
 * accepts that the action rail floats over the right margin and the title sits
 * over the lower edge. It buys back about 25% more picture area.
 */
export const PRESETS: Record<'strict' | 'wide', Reserved> = {
  strict: {top: 160, bottom: 400, left: 48, right: 176},
  wide: {top: 120, bottom: 200, left: 110, right: 110},
};

export const RESERVED = PRESETS.strict;

export const safeBox = (w: number, h: number, r: Reserved = RESERVED) => {
  const boxW = w - r.left - r.right;
  const boxH = h - r.top - r.bottom;
  // fit the source (same 9:16 aspect as the canvas) inside that box
  const scale = Math.min(boxW / w, boxH / h);
  const vidW = Math.round(w * scale);
  const vidH = Math.round(h * scale);
  return {
    boxW,
    boxH,
    scale,
    vidW,
    vidH,
    // centred across the full frame reads better than centring in the safe box,
    // which would push everything visibly left of centre
    left: Math.round((w - vidW) / 2),
    top: r.top + Math.round((boxH - vidH) / 2),
  };
};

export const ShortsSafe: React.FC<{reserved?: Reserved}> = ({reserved = RESERVED}) => {
  const {width, height} = useVideoConfig();
  const {vidW, vidH, left, top} = safeBox(width, height, reserved);
  const src = staticFile(SOURCE);

  return (
    <AbsoluteFill style={{backgroundColor: '#05070F', overflow: 'hidden'}}>
      {/* the clip's own colour, pushed far out of focus, so the margins belong to it */}
      <AbsoluteFill
        style={{
          transform: 'scale(1.28)',
          filter: 'blur(56px) saturate(1.15) brightness(0.38)',
        }}
      >
        <OffthreadVideo src={src} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      </AbsoluteFill>

      {/* the clip itself — contained, never cropped. This copy carries the audio. */}
      <div
        style={{
          position: 'absolute',
          left,
          top,
          width: vidW,
          height: vidH,
          borderRadius: 20,
          overflow: 'hidden',
          boxShadow: '0 0 0 1px rgba(199,203,255,0.10)',
        }}
      >
        <OffthreadVideo
          src={src}
          style={{width: '100%', height: '100%', objectFit: 'contain'}}
        />
      </div>
    </AbsoluteFill>
  );
};

/** Same layout with YouTube's chrome drawn on top, for eyeballing the fit. */
export const ShortsSafeGuides: React.FC<{reserved?: Reserved}> = ({reserved = RESERVED}) => {
  const {width, height} = useVideoConfig();
  const r = reserved;
  const {vidW, vidH, left, top} = safeBox(width, height, r);
  const label: React.CSSProperties = {
    position: 'absolute',
    fontFamily: "'JetBrains Mono', ui-monospace, monospace",
    fontSize: 22,
    letterSpacing: '0.08em',
    color: '#fff',
  };
  const zone = (s: React.CSSProperties): React.CSSProperties => ({
    position: 'absolute',
    background: 'rgba(217,119,6,0.30)',
    outline: '2px dashed rgba(245,158,11,0.9)',
    ...s,
  });

  return (
    <AbsoluteFill>
      <ShortsSafe reserved={r} />
      {/* where the phone crops, and where YouTube draws */}
      <div style={zone({left: 0, top: 0, width, height: r.top})} />
      <div style={zone({left: 0, bottom: 0, width, height: r.bottom})} />
      <div style={zone({right: 0, top: r.top, width: r.right, height: height - r.top - r.bottom})} />
      <div style={zone({left: 0, top: r.top, width: r.left, height: height - r.top - r.bottom})} />
      <div
        style={{
          position: 'absolute',
          left,
          top,
          width: vidW,
          height: vidH,
          outline: '3px solid #14B8A6',
        }}
      />
      <span style={{...label, left: 24, top: r.top / 2 - 12}}>TOP CHROME {r.top}px</span>
      <span style={{...label, left: 24, bottom: r.bottom / 2 - 12}}>
        TITLE · HANDLE · DESCRIPTION · SCRUBBER {r.bottom}px
      </span>
      <span style={{...label, right: 8, top: height / 2, transform: 'rotate(90deg)', transformOrigin: 'right top'}}>
        ACTION RAIL {r.right}px
      </span>
      <span style={{...label, left, top: top - 34, color: '#14B8A6'}}>
        FULL CLIP · {vidW}×{vidH} · NOTHING CROPPED
      </span>
    </AbsoluteFill>
  );
};
