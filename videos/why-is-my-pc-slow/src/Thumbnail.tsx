import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { Fonts } from './edu/Fonts';
import { edu, FONT } from './edu/theme';
import { SeriesTag } from './edu/Series';
import { HOST } from './edu/Host';
import { FIVE } from './scenes/Hook';

/**
 * Shorts thumbnail. The topic dominates; the host and his desk sell "real tech
 * channel"; the five chapter icons promise a checklist. No Noah branding.
 */
export const Thumbnail: React.FC = () => (
  <AbsoluteFill style={{ background: edu.dark, fontFamily: FONT }}>
    <Fonts />
    <Img
      src={staticFile(HOST.toCamera)}
      style={{
        position: 'absolute',
        left: -60,
        top: 330,
        width: 1200,
        height: 2133,
        objectFit: 'cover',
        filter: 'brightness(1.12) contrast(1.06) saturate(0.8)',
      }}
    />
    <AbsoluteFill
      style={{
        background:
          'linear-gradient(180deg, #0B0C12 0%, #0B0C12 22%, rgba(11,12,18,0.5) 34%, rgba(11,12,18,0) 44%, rgba(11,12,18,0) 64%, rgba(11,12,18,0.85) 76%, #0B0C12 88%)',
      }}
    />
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
