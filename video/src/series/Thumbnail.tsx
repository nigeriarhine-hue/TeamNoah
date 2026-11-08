import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {Icon, SeriesBadge} from '../components/ui';
import {AURORA, C, SANS} from '../theme';
import type {EpisodeData} from './types';

// 9:16 thumbnail: the host + the actual PC, the question, the clock, and A/B/C. Never the answer.
// Render as a still at frame 40 (after the badge spring settles).

const THUMB_LABELS: Record<string, string> = {RAM: 'RAM', 'Low storage': 'STORAGE', 'Startup apps': 'STARTUP'};

export const Thumbnail: React.FC<{ep: EpisodeData}> = ({ep}) => {
  const text: React.CSSProperties = {
    fontFamily: SANS,
    fontWeight: 800,
    color: 'white',
    letterSpacing: -3,
    lineHeight: 0.98,
    textShadow: '0 8px 34px rgba(10,12,40,.65), 0 2px 4px rgba(10,12,40,.4)',
  };
  return (
    <AbsoluteFill style={{background: '#111'}}>
      <Img
        src={staticFile(ep.thumbStill ?? ep.hostStill)}
        style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 30%'}}
      />
      {/* readability */}
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(14,16,48,.38) 0%, rgba(14,16,48,0) 22%, rgba(14,16,48,0) 46%, rgba(14,16,48,.78) 66%, rgba(14,16,48,.92) 100%)'}} />

      <SeriesBadge episode={ep.episode} at={-30} />

      {/* the clock */}
      <div style={{position: 'absolute', left: 44, top: 196, display: 'flex', alignItems: 'center', gap: 16}}>
        <div
          style={{
            width: 132,
            height: 132,
            borderRadius: 66,
            background: 'white',
            border: `12px solid ${C.amber}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: 76,
            color: C.navy,
            boxShadow: '0 16px 40px -12px rgba(0,0,0,.6)',
          }}
        >
          5
        </div>
        <div style={{...text, fontSize: 44, letterSpacing: 0, lineHeight: 1.02}}>
          YOU HAVE
          <br />
          <span style={{color: '#FCD34D'}}>5 SECONDS</span>
        </div>
      </div>

      {/* point at the actual PC */}
      <div style={{position: 'absolute', left: 770, top: 372, width: 220, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <div
          style={{
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: 32,
            letterSpacing: 2,
            color: 'white',
            backgroundImage: AURORA,
            padding: '10px 18px',
            borderRadius: 16,
            boxShadow: '0 12px 30px -10px rgba(79,70,229,.8)',
          }}
        >
          THIS PC
        </div>
        <svg width={40} height={56} viewBox="0 0 40 56">
          <path d="M20 4 V44 M8 32 L20 46 L32 32" stroke="white" strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* headline */}
      <div style={{position: 'absolute', left: 40, right: 40, top: 1090, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14}}>
        <span style={{...text, fontSize: 112, whiteSpace: 'nowrap'}}>WHAT’S SLOWING</span>
        <span
          style={{
            ...text,
            fontSize: 150,
            backgroundImage: AURORA,
            borderRadius: 30,
            padding: '0 30px 10px',
            textShadow: 'none',
            boxShadow: '0 18px 44px -12px rgba(79,70,229,.85)',
          }}
        >
          THIS PC?
        </span>
        <span style={{fontFamily: SANS, fontWeight: 700, fontSize: 30, letterSpacing: 2, color: 'rgba(255,255,255,.85)', marginTop: 8}}>
          {ep.specs.map((s) => s.value.toUpperCase()).join('  ·  ')}
        </span>
      </div>

      {/* A / B / C */}
      <div style={{position: 'absolute', left: 40, right: 40, top: 1560, display: 'flex', gap: 20}}>
        {ep.options.map((o) => (
          <div
            key={o.key}
            style={{
              flex: 1,
              height: 230,
              borderRadius: 36,
              background: 'white',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 14,
              boxShadow: '0 20px 50px -18px rgba(0,0,0,.6)',
            }}
          >
            <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
              <span
                style={{
                  width: 84,
                  height: 84,
                  borderRadius: 26,
                  backgroundImage: AURORA,
                  color: 'white',
                  fontFamily: SANS,
                  fontWeight: 800,
                  fontSize: 52,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {o.key}
              </span>
              <Icon name={o.icon} color={C.indigo} size={62} />
            </div>
            <span style={{fontFamily: SANS, fontWeight: 800, fontSize: 46, letterSpacing: -0.5, color: C.ink}}>
              {THUMB_LABELS[o.label] ?? o.label.toUpperCase()}
            </span>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
