import React from 'react';
import {C, SANS} from '../theme';
import {NoahMark} from './ui';

// macOS-style window chrome (traffic lights + centered title), light theme.
// Generic: no Apple logos or system fonts that imply a real Apple screenshot.

export const MacWindow: React.FC<{
  title: React.ReactNode;
  width: number;
  children: React.ReactNode;
  noah?: boolean; // show the Noah mark in the title bar
  style?: React.CSSProperties;
}> = ({title, width, children, noah, style}) => (
  <div
    style={{
      width,
      borderRadius: 30,
      background: 'rgba(255,255,255,.98)',
      border: '1px solid rgba(60,50,40,.12)',
      boxShadow: '0 2px 4px rgba(15,23,41,.06), 0 40px 90px -30px rgba(15,23,41,.45)',
      overflow: 'hidden',
      ...style,
    }}
  >
    <div
      style={{
        position: 'relative',
        height: 64,
        display: 'flex',
        alignItems: 'center',
        padding: '0 22px',
        background: 'linear-gradient(180deg,#F7F5F0,#EFEBE3)',
        borderBottom: '1px solid rgba(60,50,40,.10)',
      }}
    >
      <div style={{display: 'flex', gap: 11}}>
        {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => (
          <span key={c} style={{width: 19, height: 19, borderRadius: 10, background: c, boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.12)'}} />
        ))}
      </div>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 10,
          fontFamily: SANS,
          fontSize: 25,
          fontWeight: 700,
          color: C.ink2,
          pointerEvents: 'none',
        }}
      >
        {noah && <NoahMark size={30} />}
        {title}
      </div>
    </div>
    {children}
  </div>
);
