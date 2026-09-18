import React from 'react';
import {colors, fonts} from '../brand';

export const WINDOW_W = 960;
export const WINDOW_H = 1050;

const Light: React.FC<{color: string}> = ({color}) => (
  <div style={{width: 17, height: 17, borderRadius: 9, backgroundColor: color}} />
);

/**
 * The macOS window the whole Noah sequence lives in.
 *
 * It mounts once and never unmounts — diagnosis, approval, action and result
 * all swap inside it — so the middle of the ad reads as one continuous session
 * on a real Mac rather than four stills in a row.
 */
export const MacWindow: React.FC<{children: React.ReactNode}> = ({children}) => (
  <div
    style={{
      width: WINDOW_W,
      height: WINDOW_H,
      borderRadius: 26,
      overflow: 'hidden',
      backgroundColor: colors.cream,
      display: 'flex',
      flexDirection: 'column',
      // Low shadow, per the brand's screen system. Two layers so the window
      // sits on the footage instead of floating above it.
      boxShadow:
        '0 2px 6px rgba(4,6,16,0.34), 0 34px 90px rgba(4,6,16,0.62), 0 0 0 1px rgba(255,255,255,0.10)',
    }}
  >
    <div
      style={{
        height: 76,
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        paddingLeft: 26,
        paddingRight: 26,
        gap: 11,
        backgroundColor: '#E3DED3',
        borderBottom: '1px solid rgba(42,37,31,0.10)',
      }}
    >
      <Light color="#F05B4F" />
      <Light color="#F5BD4F" />
      <Light color="#61C454" />
      <div
        style={{
          flex: 1,
          textAlign: 'center',
          fontFamily: fonts.sans,
          fontWeight: 600,
          fontSize: 27,
          letterSpacing: '-0.01em',
          color: 'rgba(42,37,31,0.62)',
          marginLeft: -60,
        }}
      >
        Noah
      </div>
    </div>
    <div style={{flex: 1, minHeight: 0, position: 'relative'}}>{children}</div>
  </div>
);
