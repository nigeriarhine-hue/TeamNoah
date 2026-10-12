import React from 'react';
import { edu, FONT } from '../edu/theme';
import { Stage } from '../edu/Stage';
import { SeriesTag } from '../edu/Series';
import { pop, ramp } from '../edu/motion';
import { NoahMark } from '../noah/NoahMark';

/**
 * Clean tech-channel end card. The only place the Noah logo appears as
 * branding in the whole video.
 */
export const EndCard: React.FC<{ t: number; dur: number }> = ({ t, dur }) => {
  const mark = pop(t, 0.1, 16, 0.8);
  const h = pop(t, 0.25, 16);
  const sub = ramp(t, 0.5, 0.8);
  const url = pop(t, 0.6, 14);
  const small = ramp(t, 1.0, 1.4);
  return (
    <Stage t={t} dur={dur}>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 440, display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: FONT, textAlign: 'center' }}>
        <div style={{ opacity: mark, transform: `scale(${0.8 + mark * 0.2})` }}>
          <NoahMark size={170} />
        </div>
        <div style={{ overflow: 'hidden', marginTop: 40 }}>
          <div style={{ fontSize: 132, fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1, color: edu.ink, transform: `translateY(${(1 - h) * 105}%)` }}>
            FREE PC CHECK
          </div>
        </div>
        <div style={{ marginTop: 26, fontSize: 50, fontWeight: 600, color: edu.ink2, letterSpacing: '-0.015em', opacity: sub }}>See what’s slowing your PC.</div>
        <div
          style={{
            marginTop: 70,
            padding: '26px 60px',
            borderRadius: 999,
            background: edu.ink,
            color: '#fff',
            fontSize: 72,
            fontWeight: 800,
            letterSpacing: '-0.02em',
            transform: `scale(${0.85 + url * 0.15})`,
            opacity: url,
            boxShadow: '0 24px 60px rgba(14,18,34,0.25)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 6, background: edu.grad }} />
          onnoah.app
        </div>
        <div style={{ marginTop: 64, fontSize: 38, fontWeight: 700, color: edu.ink3, letterSpacing: '0.01em', opacity: small }}>
          Describe it. Approve it. Done.
        </div>
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 1420, display: 'flex', justifyContent: 'center', opacity: small }}>
        <SeriesTag t={10} />
      </div>
    </Stage>
  );
};
