import React from 'react';
import {AbsoluteFill} from 'remotion';

/**
 * TikTok/Shorts chrome guard. The right rail eats ~140px and the bottom
 * caption/handle area eats ~420px, so nothing load-bearing goes there.
 */
export const SAFE = {
  top: 190,
  bottom: 420,
  left: 60,
  right: 150,
} as const;

export const SafeArea: React.FC<{
  children: React.ReactNode;
  justify?: React.CSSProperties['justifyContent'];
  align?: React.CSSProperties['alignItems'];
  /** override the bottom inset, e.g. to clear the creator's counting hand */
  bottom?: number;
}> = ({children, justify = 'flex-start', align = 'center', bottom}) => {
  return (
    <AbsoluteFill
      style={{
        paddingTop: SAFE.top,
        paddingBottom: bottom ?? SAFE.bottom,
        paddingLeft: SAFE.left,
        paddingRight: SAFE.right,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: justify,
        alignItems: align,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
