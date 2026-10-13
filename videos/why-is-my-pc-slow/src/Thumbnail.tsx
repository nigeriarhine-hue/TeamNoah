import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Fonts } from './edu/Fonts';
import { edu, FONT } from './edu/theme';
import { SeriesTag } from './edu/Series';
import { SlowPC } from './edu/SlowPC';
import { FIVE } from './scenes/Hook';

/**
 * Shorts thumbnail. The topic dominates; a slow-loading PC shows the problem; the five chapter icons promise a checklist. No Noah branding.
 */
export const Thumbnail: React.FC = () => (
  <AbsoluteFill style={{ background: edu.dark, fontFamily: FONT }}>
    <Fonts />
    <AbsoluteFill style={{ background: 'radial-gradient(70% 45% at 50% 58%, rgba(111,106,230,0.38) 0%, rgba(11,12,18,0) 70%)' }} />
    <div style={{ position: 'absolute', left: 0, right: 0, top: 690, display: 'flex', justifyContent: 'center' }}>
      <SlowPC t={1.6} width={940} />
    </div>
    <div style={{ position: 'absolute', left: 64, top: 150 }}>
      <SeriesTag dark />
    </div>
    <div style={{ position: 'absolute', left: 56, right: 40, top: 236 }}>
      <div style={{ fontSize: 136, fontWeight: 800, lineHeight: 0.94, letterSpacing: '-0.045em', color: '#fff' }}>WHY IS MY PC</div>
      <div
        style={{
          fontSize: 184,
          fontWeight: 800,
          lineHeight: 0.98,
          letterSpacing: '-0.05em',
          backgroundImage: 'linear-gradient(100deg,#8FB2FF 0%,#B4A8FF 50%,#D3A6FF 100%)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
          paddingBottom: 10,
        }}
      >
        SO SLOW?
      </div>
    </div>

    <div style={{ position: 'absolute', left: 64, right: 64, top: 1450 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
        <span style={{ fontSize: 120, fontWeight: 800, lineHeight: 1, padding: '6px 34px 14px', borderRadius: 26, background: edu.grad, color: '#fff' }}>5</span>
        <div style={{ fontSize: 66, fontWeight: 800, lineHeight: 1.0, letterSpacing: '-0.02em', color: '#fff' }}>
          THINGS
          <br />
          TO CHECK FIRST
        </div>
      </div>
      <div style={{ display: 'flex', gap: 14, marginTop: 34 }}>
        {FIVE.map(({ n, Icon }) => (
          <div
            key={n}
            style={{
              flex: 1,
              height: 132,
              borderRadius: 26,
              background: '#fff',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              boxShadow: '0 16px 40px rgba(0,0,0,0.4)',
            }}
          >
            <Icon size={54} color={edu.accent} stroke={2.2} />
            <span style={{ fontSize: 24, fontWeight: 800, color: edu.ink3 }}>0{n}</span>
          </div>
        ))}
      </div>
    </div>
  </AbsoluteFill>
);
