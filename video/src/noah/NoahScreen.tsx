import React from 'react';
import { C, FONT } from '../theme';
import { NoahMark } from '../components/primitives';
import { IconGear, IconHome, IconScan, IconTools } from '../components/Icons';

export const WIN = { x: 690, y: 150, w: 1150, h: 780, bar: 76, rail: 116 };
export const CONTENT_W = WIN.w - WIN.rail;
export const CONTENT_H = WIN.h - WIN.bar;

const RailItem: React.FC<{ icon: React.ReactNode; label: string; active?: boolean }> = ({ icon, label, active }) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 6,
      padding: '12px 0',
      margin: '0 12px',
      borderRadius: 14,
      background: active ? 'rgba(79,70,229,0.08)' : 'transparent',
      color: active ? C.indigo : C.mute,
      fontSize: 15,
      fontWeight: active ? 700 : 500,
    }}
  >
    {icon}
    {label}
  </div>
);

/** Light, gaming-focused Noah window shell (storyboard style). */
export const NoahScreen: React.FC<{ children: React.ReactNode; dim?: number }> = ({ children, dim = 0 }) => (
  <div
    style={{
      position: 'absolute',
      left: WIN.x,
      top: WIN.y,
      width: WIN.w,
      height: WIN.h,
      borderRadius: 26,
      background: C.panel,
      overflow: 'hidden',
      fontFamily: FONT,
      color: C.ink,
      boxShadow: '0 40px 120px rgba(20,16,80,0.55), 0 0 0 1px rgba(255,255,255,0.6), 0 0 80px rgba(99,102,241,0.25)',
    }}
  >
    {/* title bar */}
    <div
      style={{
        height: WIN.bar,
        display: 'flex',
        alignItems: 'center',
        padding: '0 28px',
        borderBottom: `1px solid ${C.line}`,
        gap: 14,
      }}
    >
      <NoahMark size={42} />
      <span style={{ fontSize: 30, fontWeight: 700, color: C.navy, letterSpacing: -0.5 }}>Noah</span>
      <div style={{ flex: 1 }} />
      <div style={{ display: 'flex', gap: 22, color: '#A0A6B8', fontSize: 22 }}>
        <span>—</span>
        <span>▢</span>
        <span>✕</span>
      </div>
    </div>
    <div style={{ display: 'flex', height: WIN.h - WIN.bar }}>
      {/* left rail */}
      <div style={{ width: WIN.rail, background: C.rail, borderRight: `1px solid ${C.line}`, paddingTop: 18, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <RailItem icon={<IconHome size={26} />} label="Home" />
        <RailItem icon={<IconScan size={26} />} label="Check" active />
        <RailItem icon={<IconTools size={26} />} label="Tools" />
        <RailItem icon={<IconGear size={26} />} label="Settings" />
      </div>
      <div style={{ position: 'relative', flex: 1, overflow: 'hidden' }}>{children}</div>
    </div>
    {dim > 0 && <div style={{ position: 'absolute', inset: 0, background: `rgba(14,16,48,${0.5 * dim})`, backdropFilter: `blur(${3 * dim}px)` }} />}
  </div>
);

/** "— WHAT NOAH CHECKED" style section label, taken from the real Noah app. */
export const SectionLabel: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: 2.4, color: C.mute, textTransform: 'uppercase', ...style }}>
    — {children}
  </div>
);
