import React from 'react';
import { edu, FONT } from './theme';
import { ramp } from './motion';

/**
 * Illustrated "slow PC": a monitor with an app stuck loading, a busy cursor and
 * a pegged CPU meter. Pure CSS/SVG — no people, no vendor UI. Animated by `t`
 * (seconds); pass a fixed `t` for stills.
 */
export const SlowPC: React.FC<{ t: number; width?: number }> = ({ t, width = 820 }) => {
  const k = width / 820;
  const W = 820;
  const H = 500;
  // progress crawls, then stalls
  const prog = 0.12 + 0.26 * ramp(t, 0.2, 2.2) + 0.02 * Math.sin(t * 0.7);
  const spin = (t * 280) % 360;
  const cpu = 0.86 + 0.08 * Math.abs(Math.sin(t * 2.3));
  const bars = Array.from({ length: 14 }).map((_, i) => 0.45 + 0.5 * Math.abs(Math.sin(t * 2 + i * 0.9)));
  return (
    <div style={{ width: W * k, height: (H + 120) * k, position: 'relative' }}>
      <div style={{ width: W, height: H + 120, transform: `scale(${k})`, transformOrigin: '0 0', fontFamily: FONT }}>
        {/* monitor */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: W,
            height: H,
            borderRadius: 30,
            background: '#1A1C26',
            padding: 18,
            boxShadow: '0 40px 100px rgba(0,0,0,0.55), inset 0 0 0 2px rgba(255,255,255,0.08)',
          }}
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              borderRadius: 16,
              overflow: 'hidden',
              position: 'relative',
              background: 'radial-gradient(120% 90% at 20% 10%, #3A3F8F 0%, #262A5E 40%, #151733 100%)',
            }}
          >
            {/* app window */}
            <div
              style={{
                position: 'absolute',
                left: 70,
                top: 58,
                width: 520,
                height: 300,
                borderRadius: 16,
                background: '#F5F6FA',
                boxShadow: '0 20px 50px rgba(0,0,0,0.35)',
                overflow: 'hidden',
              }}
            >
              <div style={{ height: 40, background: '#E4E6EE', display: 'flex', alignItems: 'center', gap: 8, padding: '0 16px' }}>
                {['#E0454B', '#E39410', '#16A574'].map((c) => (
                  <span key={c} style={{ width: 12, height: 12, borderRadius: 99, background: c }} />
                ))}
                <span style={{ marginLeft: 14, width: 180, height: 10, borderRadius: 6, background: '#CDD0DB' }} />
              </div>
              <div style={{ padding: '30px 34px' }}>
                {[0.9, 0.7, 0.8].map((w, i) => (
                  <div key={i} style={{ height: 14, width: `${w * 100}%`, borderRadius: 7, background: '#E3E5EE', marginBottom: 14 }} />
                ))}
                <div style={{ marginTop: 26, fontSize: 24, fontWeight: 700, color: edu.ink2 }}>Loading…</div>
                <div style={{ marginTop: 12, height: 16, borderRadius: 9, background: '#E3E5EE', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${prog * 100}%`, background: edu.grad, borderRadius: 9 }} />
                </div>
              </div>
            </div>
            {/* busy cursor over the window */}
            <svg width="70" height="70" viewBox="0 0 24 24" style={{ position: 'absolute', left: 520, top: 250, transform: `rotate(${spin}deg)` }}>
              <circle cx="12" cy="12" r="9" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="3" />
              <path d="M12 3a9 9 0 019 9" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
            </svg>
            {/* CPU meter */}
            <div
              style={{
                position: 'absolute',
                right: 36,
                top: 58,
                width: 168,
                height: 300,
                borderRadius: 16,
                background: 'rgba(11,12,18,0.55)',
                border: '2px solid rgba(255,255,255,0.12)',
                padding: '18px 18px',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <span style={{ fontSize: 18, fontWeight: 800, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.65)' }}>CPU</span>
              <span style={{ fontSize: 46, fontWeight: 800, color: '#FF8A8E', fontVariantNumeric: 'tabular-nums' }}>{Math.round(cpu * 100)}%</span>
              <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: 4, marginTop: 10 }}>
                {bars.map((b, i) => (
                  <div key={i} style={{ flex: 1, height: `${b * 100}%`, borderRadius: 3, background: b > 0.8 ? '#FF8A8E' : '#8E8BFF' }} />
                ))}
              </div>
            </div>
            {/* taskbar */}
            <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 52, background: 'rgba(11,12,18,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
              {['#5865D8', '#2E86DE', '#16A574', '#D9488F', '#E07B2E'].map((c) => (
                <span key={c} style={{ width: 30, height: 30, borderRadius: 8, background: c, opacity: 0.9 }} />
              ))}
            </div>
          </div>
        </div>
        {/* stand */}
        <div style={{ position: 'absolute', left: W / 2 - 50, top: H, width: 100, height: 70, background: 'linear-gradient(180deg,#14151E,#232532)' }} />
        <div style={{ position: 'absolute', left: W / 2 - 170, top: H + 66, width: 340, height: 22, borderRadius: 12, background: '#262836' }} />
      </div>
    </div>
  );
};
