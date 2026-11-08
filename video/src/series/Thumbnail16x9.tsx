import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {Icon, NoahMark} from '../components/ui';
import {AURORA, C, SANS} from '../theme';
import type {EpisodeData} from './types';

// 16:9 thumbnail (1920x1080): same elements as the 9:16 one — host + the actual PC, the question,
// the clock, A/B/C — laid out side by side. Never shows the answer.

const THUMB_LABELS: Record<string, string> = {RAM: 'RAM', 'Low storage': 'STORAGE', 'Startup apps': 'STARTUP'};

// Photo panel: the right part of the frame. The source still is portrait, so it is scaled to the
// panel width and cropped vertically to keep his face and the PC tower in view.
const PHOTO_X = 1000;
const PHOTO_W = 1920 - PHOTO_X;

export const Thumbnail16x9: React.FC<{ep: EpisodeData}> = ({ep}) => {
  const text: React.CSSProperties = {
    fontFamily: SANS,
    fontWeight: 800,
    color: 'white',
    letterSpacing: -3,
    lineHeight: 0.98,
    textShadow: '0 8px 34px rgba(10,12,40,.55)',
  };
  return (
    <AbsoluteFill style={{background: '#0F1236'}}>
      {/* host + the actual PC */}
      <Img
        src={staticFile(ep.hostStill)}
        style={{
          position: 'absolute',
          left: PHOTO_X,
          top: 0,
          width: PHOTO_W,
          height: 1080,
          objectFit: 'cover',
          objectPosition: '50% 24%',
        }}
      />
      {/* blend the photo into the dark left panel */}
      <div
        style={{
          position: 'absolute',
          left: PHOTO_X - 2,
          top: 0,
          width: 380,
          height: 1080,
          background: 'linear-gradient(90deg, #0F1236 0%, rgba(15,18,54,.7) 35%, rgba(15,18,54,0) 100%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: PHOTO_X,
          height: 1080,
          background:
            'radial-gradient(70% 60% at 20% 30%, rgba(79,70,229,.45) 0%, rgba(79,70,229,0) 70%), radial-gradient(60% 50% at 60% 95%, rgba(124,58,237,.35) 0%, rgba(124,58,237,0) 70%)',
        }}
      />

      {/* point at the actual PC */}
      <div style={{position: 'absolute', left: 1665, top: 168, width: 220, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <div
          style={{
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: 34,
            letterSpacing: 2,
            color: 'white',
            backgroundImage: AURORA,
            padding: '10px 20px',
            borderRadius: 16,
            boxShadow: '0 12px 30px -10px rgba(79,70,229,.8)',
          }}
        >
          THIS PC
        </div>
        <svg width={44} height={60} viewBox="0 0 40 56">
          <path d="M20 4 V44 M8 32 L20 46 L32 32" stroke="white" strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* series badge (small Noah mark) */}
      <div
        style={{
          position: 'absolute',
          left: 70,
          top: 60,
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          padding: '12px 18px 12px 14px',
          borderRadius: 999,
          background: 'rgba(255,255,255,.95)',
          fontFamily: SANS,
        }}
      >
        <NoahMark size={40} />
        <span style={{fontSize: 28, fontWeight: 800, color: C.ink, letterSpacing: -0.3}}>Can You Diagnose This PC?</span>
        <span style={{fontSize: 20, fontWeight: 800, color: 'white', background: AURORA, borderRadius: 999, padding: '6px 12px', letterSpacing: 1}}>
          EP. {String(ep.episode).padStart(2, '0')}
        </span>
      </div>

      {/* headline */}
      <div style={{position: 'absolute', left: 70, top: 190, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 16}}>
        <span style={{...text, fontSize: 118, whiteSpace: 'nowrap'}}>WHAT’S SLOWING</span>
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
      </div>

      {/* the clock + specs */}
      <div style={{position: 'absolute', left: 70, top: 560, display: 'flex', alignItems: 'center', gap: 20}}>
        <div
          style={{
            width: 118,
            height: 118,
            borderRadius: 59,
            background: 'white',
            border: `11px solid ${C.amber}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: 68,
            color: C.navy,
          }}
        >
          5
        </div>
        <div style={{...text, fontSize: 46, letterSpacing: 0, lineHeight: 1.02}}>
          YOU HAVE
          <br />
          <span style={{color: '#FCD34D'}}>5 SECONDS</span>
        </div>
        <div
          style={{
            marginLeft: 26,
            fontFamily: SANS,
            fontWeight: 700,
            fontSize: 26,
            letterSpacing: 1.5,
            color: 'rgba(255,255,255,.85)',
            lineHeight: 1.5,
          }}
        >
          {ep.specs.map((s) => (
            <div key={s.label}>{s.value.toUpperCase()}</div>
          ))}
        </div>
      </div>

      {/* A / B / C */}
      <div style={{position: 'absolute', left: 70, top: 750, width: 900, display: 'flex', gap: 20}}>
        {ep.options.map((o) => (
          <div
            key={o.key}
            style={{
              flex: 1,
              height: 250,
              borderRadius: 34,
              background: 'white',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 16,
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
            <span style={{fontFamily: SANS, fontWeight: 800, fontSize: 48, letterSpacing: -0.5, color: C.ink}}>
              {THUMB_LABELS[o.label] ?? o.label.toUpperCase()}
            </span>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
