import React from 'react';
import { C } from '../theme';

/** Icon-led diagnostic / result card used in "What Noah checked" and "Done." */
export const MetricCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  sub: string;
  tone: string;
  appear: number; // 0..1
  highlight?: number; // 0..1 spotlight
  dimmed?: number; // 0..1
  bar?: number; // optional 0..1 usage bar
  width?: number | string;
  height?: number;
  vertical?: boolean;
}> = ({ icon, label, value, sub, tone, appear, highlight = 0, dimmed = 0, bar, width = '100%', height = 196, vertical }) => (
  <div
    style={{
      position: 'relative',
      width,
      height,
      borderRadius: 20,
      background: '#fff',
      border: `1.5px solid ${highlight > 0.01 ? `rgba(79,70,229,${0.3 + 0.7 * highlight})` : C.line}`,
      boxShadow: `0 ${6 + 18 * highlight}px ${24 + 30 * highlight}px rgba(40,40,120,${0.06 + 0.16 * highlight})`,
      padding: '22px 24px',
      display: 'flex',
      flexDirection: vertical ? 'column' : 'row',
      gap: vertical ? 12 : 18,
      opacity: Math.min(1, appear * 1.3) * (1 - 0.45 * dimmed),
      transform: `translateY(${(1 - appear) * 40}px) scale(${(0.92 + 0.08 * appear) * (1 + 0.035 * highlight)})`,
      boxSizing: 'border-box',
    }}
  >
    <div
      style={{
        flex: '0 0 auto',
        width: vertical ? 56 : 64,
        height: vertical ? 56 : 64,
        borderRadius: 18,
        background: `${tone}14`,
        color: tone,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {icon}
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: vertical ? 4 : 6, minWidth: 0 }}>
      <div style={{ fontSize: 20, fontWeight: 700, color: C.ink }}>{label}</div>
      <div style={{ fontSize: 38, fontWeight: 800, color: tone, letterSpacing: -0.5, lineHeight: 1.05 }}>{value}</div>
      <div style={{ fontSize: 17, fontWeight: 600, color: tone, opacity: 0.85 }}>{sub}</div>
      {bar !== undefined && (
        <div style={{ marginTop: 6, width: vertical ? '100%' : 220, height: 8, borderRadius: 4, background: '#EEF0F6', overflow: 'hidden' }}>
          <div style={{ width: `${bar * 100}%`, height: '100%', borderRadius: 4, background: tone }} />
        </div>
      )}
    </div>
  </div>
);
