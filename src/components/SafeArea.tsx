import React from 'react';
import { AbsoluteFill } from 'remotion';
import { SAFE } from '../theme';

/**
 * Constrains its children to the mobile-safe region so nothing lands under
 * the platform's own UI. `align` picks which edge the content hugs.
 */
export const SafeArea: React.FC<{
  children: React.ReactNode;
  align?: 'top' | 'center' | 'bottom';
  style?: React.CSSProperties;
}> = ({ children, align = 'bottom', style }) => (
  <AbsoluteFill
    style={{
      paddingTop: SAFE.top,
      paddingBottom: SAFE.bottom,
      paddingLeft: SAFE.side,
      paddingRight: SAFE.side,
      display: 'flex',
      flexDirection: 'column',
      justifyContent:
        align === 'top' ? 'flex-start' : align === 'center' ? 'center' : 'flex-end',
      alignItems: 'center',
      ...style,
    }}
  >
    {children}
  </AbsoluteFill>
);
