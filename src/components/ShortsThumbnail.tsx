import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {fontStack, noah} from '../theme';

/**
 * Purpose-built 1080x1920 Shorts cover — not a lifted video frame.
 * Headline carries the top third; a genuine Noah UI card anchors the middle so
 * the frame reads as a real product, not a text plate.
 */
export const ShortsThumbnail: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#05070F', overflow: 'hidden'}}>
      {/* deep tech backdrop */}
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(90% 46% at 50% 16%, rgba(37,99,235,0.30) 0%, rgba(11,16,36,0.92) 58%, #04060C 100%)',
        }}
      />

      {/* genuine Noah UI, angled as a product card in the middle band */}
      <div
        style={{
          position: 'absolute',
          left: -108,
          right: -108,
          top: 890,
          transform: 'rotate(-7deg)',
          borderRadius: 26,
          overflow: 'hidden',
          border: '2px solid rgba(199,203,255,0.22)',
          boxShadow: '0 40px 120px rgba(0,0,0,0.85), 0 0 90px rgba(59,90,220,0.30)',
        }}
      >
        <Img
          src={staticFile('noah-ui/02-diagnosis.jpg')}
          style={{
            width: '100%',
            display: 'block',
            objectFit: 'cover',
            filter: 'blur(3.4px) saturate(1.1) brightness(0.62)',
          }}
        />
        {/* fade the card's lower half into the background */}
        <AbsoluteFill
          style={{
            background:
              'linear-gradient(to bottom, rgba(4,6,12,0.30) 0%, rgba(4,6,12,0.40) 34%, rgba(4,6,12,0.90) 62%, rgba(4,6,12,0.99) 82%)',
          }}
        />
      </div>

      {/* keep the headline zone clean over the card */}
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(to bottom, rgba(4,6,12,0.86) 0%, rgba(4,6,12,0.62) 34%, rgba(4,6,12,0) 46%)',
        }}
      />

      {/* ---- headline, upper third ---- */}
      <div
        style={{
          position: 'absolute',
          top: 168,
          left: 62,
          right: 62,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 22,
        }}
      >
        <div style={{fontSize: 118, lineHeight: 1, filter: 'drop-shadow(0 8px 26px rgba(255,60,60,0.55))'}}>
          {'❌'}
        </div>
        <div
          style={{
            fontFamily: fontStack,
            fontSize: 136,
            fontWeight: 900,
            letterSpacing: '-0.055em',
            lineHeight: 0.88,
            color: '#FFFFFF',
            textAlign: 'center',
            textShadow: '0 12px 52px rgba(0,0,0,0.95), 0 2px 5px rgba(0,0,0,0.9)',
          }}
        >
          3 THINGS
          <br />
          I WON&rsquo;T DO
        </div>
        <div
          style={{
            fontFamily: fontStack,
            fontSize: 80,
            fontWeight: 800,
            letterSpacing: '-0.038em',
            lineHeight: 1,
            textAlign: 'center',
            background: `linear-gradient(90deg, #7FB0FF, ${noah.periwinkle})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 6px 24px rgba(0,0,0,0.8))',
          }}
        >
          TO FIX MY MAC
        </div>
      </div>

      {/* ---- curiosity hook + signature, lower third ---- */}
      <div
        style={{
          position: 'absolute',
          bottom: 210,
          left: 0,
          right: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 44,
        }}
      >
        <div
          style={{
            transform: 'rotate(-2.5deg)',
            background: 'linear-gradient(90deg, #FF3B3B, #FF7A18)',
            padding: '22px 52px',
            borderRadius: 18,
            boxShadow: '0 18px 58px rgba(255,59,59,0.5)',
          }}
        >
          <span
            style={{
              fontFamily: fontStack,
              fontSize: 86,
              fontWeight: 900,
              letterSpacing: '-0.038em',
              color: '#FFFFFF',
            }}
          >
            #3 IS WILD
          </span>
        </div>

        <div style={{display: 'flex', alignItems: 'center', gap: 18, opacity: 0.94}}>
          <Img src={staticFile('brand/noah-mark-dark.png')} style={{width: 64}} />
          <span
            style={{
              fontFamily: fontStack,
              fontSize: 42,
              fontWeight: 700,
              color: 'rgba(255,255,255,0.9)',
            }}
          >
            onnoah.app
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
