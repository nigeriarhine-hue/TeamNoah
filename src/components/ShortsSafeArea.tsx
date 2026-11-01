import React from 'react';
import {AbsoluteFill} from 'remotion';

// Mobile-safe layout for 1080x1920 Shorts / TikTok / Reels.
// Top ~170px is covered by status/search UI, bottom ~380px by captions/description/nav,
// and the right edge of the lower half by the like/comment/share column.
export const SAFE = {
  width: 1080,
  height: 1920,
  top: 170,
  bottom: 380,
  side: 96,
  rightRail: 150, // keep the lower-right clear of platform buttons
  captionY: 1450, // top edge of the caption band
};

export const ShortsSafeArea: React.FC<{
  children?: React.ReactNode;
  debug?: boolean;
  style?: React.CSSProperties;
}> = ({children, debug = false, style}) => (
  <AbsoluteFill>
    <div
      style={{
        position: 'absolute',
        left: SAFE.side,
        right: SAFE.side,
        top: SAFE.top,
        bottom: SAFE.bottom,
        display: 'flex',
        flexDirection: 'column',
        ...style,
      }}
    >
      {children}
    </div>
    {debug ? (
      <>
        <div style={{position: 'absolute', inset: 0, border: '2px dashed red', pointerEvents: 'none'}} />
        <div
          style={{
            position: 'absolute',
            left: SAFE.side,
            right: SAFE.side,
            top: SAFE.top,
            bottom: SAFE.bottom,
            outline: '3px solid rgba(255,0,0,0.6)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: 0,
            width: SAFE.rightRail,
            top: 900,
            bottom: SAFE.bottom,
            background: 'rgba(255,0,0,0.15)',
          }}
        />
      </>
    ) : null}
  </AbsoluteFill>
);
