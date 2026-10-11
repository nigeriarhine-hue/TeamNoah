import React from 'react';
import { AbsoluteFill } from 'remotion';
import { cleaner, noah } from './theme';
import { Character, FONT, Fonts, NoahLockup } from './components/Base';
import { CleanerPanel } from './components/CleanerPanel';
import { NoahPanel } from './components/NoahPanel';

/**
 * Shorts thumbnail. Same split idea as the ad, pushed to maximum contrast for a
 * small tile: bright cluttered cleaner on the left, calm dark Noah on the right,
 * the recurring character on both sides, and one claim in the middle.
 */
export const Thumbnail: React.FC = () => (
  <AbsoluteFill style={{ background: '#05050a', fontFamily: FONT }}>
    <Fonts />

    <AbsoluteFill style={{ flexDirection: 'row' }}>
      <div style={{ width: '50%', height: '100%', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: '0 0 1100px 0', overflow: 'hidden' }}>
          <Character src="char/unsure.png" frame={0} progress={0.45} zoomFrom={1.2} zoomTo={1.2} focusX={46} focusY={28} grayscale={0.2} brightness={0.95} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(5,5,10,.35),rgba(5,5,10,0) 40%,rgba(238,241,246,.95))' }} />
        </div>
        <div style={{ position: 'absolute', top: 820, left: 0, right: 0, bottom: 0 }}>
          <CleanerPanel frame={70} local={70} />
        </div>
      </div>

      <div style={{ width: 6, background: `linear-gradient(180deg,${noah.blue},${noah.purple})`, boxShadow: `0 0 40px ${noah.purple}` }} />

      <div style={{ width: '50%', height: '100%', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: '0 0 1100px 0', overflow: 'hidden' }}>
          <Character src="char/engaged.png" frame={0} progress={0.45} zoomFrom={1.22} zoomTo={1.22} focusX={54} focusY={25} />
          <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg,rgba(5,5,10,.4),rgba(5,5,10,0) 38%,${noah.bg})` }} />
        </div>
        <div style={{ position: 'absolute', top: 820, left: 0, right: 0, bottom: 0 }}>
          <NoahPanel mode="check" local={95} />
        </div>
      </div>
    </AbsoluteFill>

    {/* dark band so the headline always reads on a small tile */}
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 560,
        padding: '52px 60px 56px',
        background: 'linear-gradient(180deg,rgba(5,5,10,0) 0%,rgba(5,5,10,0.93) 16%,rgba(5,5,10,0.93) 84%,rgba(5,5,10,0) 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 10,
      }}
    >
      <div style={{ fontSize: 96, fontWeight: 800, color: '#fff', letterSpacing: '-0.035em', lineHeight: 1 }}>
        CLEANER APP
      </div>
      <div
        style={{
          fontSize: 62,
          fontWeight: 800,
          letterSpacing: '0.06em',
          color: '#ffd9a3',
          margin: '2px 0',
        }}
      >
        VS
      </div>
      <div
        style={{
          fontSize: 96,
          fontWeight: 800,
          letterSpacing: '-0.035em',
          lineHeight: 1,
          textAlign: 'center',
          background: noah.ctaGrad,
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
        }}
      >
        ACTUAL
        <br />
        DIAGNOSIS
      </div>
    </div>

    {/* supporting line + branding, on their own dark strip so nothing collides */}
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        paddingTop: 150,
        paddingBottom: 74,
        background: 'linear-gradient(180deg,rgba(5,5,10,0) 0%,rgba(5,5,10,0.92) 42%,rgba(5,5,10,0.98) 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 36,
      }}
    >
      <div
        style={{
          fontSize: 62,
          fontWeight: 800,
          letterSpacing: '-0.02em',
          color: '#fff',
          background: 'rgba(10,10,18,0.94)',
          border: `2px solid ${noah.indigo}`,
          borderRadius: 18,
          padding: '22px 44px',
          boxShadow: `0 0 54px ${noah.purple}66`,
        }}
      >
        NOAH CHECKS FIRST
      </div>
      <NoahLockup size={66} />
    </div>
  </AbsoluteFill>
);
