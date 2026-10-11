import React from 'react';
import { AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame, useVideoConfig, spring } from 'remotion';
import { cleaner, noah, sec } from './theme';
import { Captions } from './components/Captions';
import { CleanerPanel } from './components/CleanerPanel';
import { NoahPanel } from './components/NoahPanel';
import { ApprovalModal } from './components/ApprovalModal';
import { Character, FONT, Fonts, NoahLockup, NoahMark } from './components/Base';

const CHAR_H = 520;

/**
 * The hook is character-led: he fills the frame while the headline lands, then
 * the two interfaces slide up underneath as the argument starts.
 */
const charHeightAt = (t: number) =>
  interpolate(t, [2.0, 2.9], [1240, CHAR_H], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

/** Split ratio over time: even at the hook, then leaning to whichever side is talking. */
const splitAt = (t: number) => {
  if (t < 2.5) return 0.5;
  if (t < 6) return interpolate(t, [2.5, 3.1], [0.5, 0.58], { extrapolateRight: 'clamp' });
  if (t < 16) return interpolate(t, [6, 6.8], [0.58, 0.34], { extrapolateRight: 'clamp' });
  return 0.34;
};

const Label: React.FC<{ text: string; tone: 'cleaner' | 'noah'; show: number; dim: number }> = ({
  text,
  tone,
  show,
  dim,
}) => (
  <div
    style={{
      position: 'absolute',
      top: 28,
      left: 0,
      right: 0,
      display: 'flex',
      justifyContent: 'center',
      opacity: show * (1 - dim * 0.55),
      transform: `translateY(${(1 - show) * -14}px)`,
      zIndex: 5,
    }}
  >
    <div
      style={{
        fontFamily: FONT,
        fontWeight: 800,
        fontSize: 27,
        letterSpacing: '0.17em',
        padding: '12px 22px',
        borderRadius: 99,
        color: tone === 'noah' ? '#e9e9f2' : '#1d2430',
        background: tone === 'noah' ? 'rgba(20,20,27,0.88)' : 'rgba(255,255,255,0.92)',
        border: `1.5px solid ${tone === 'noah' ? noah.indigo : cleaner.line}`,
        boxShadow: tone === 'noah' ? `0 0 34px ${noah.purple}55` : '0 6px 20px rgba(0,0,0,0.18)',
        whiteSpace: 'nowrap',
      }}
    >
      {text}
    </div>
  </div>
);

/** Big beat caption that sits above the captions and never covers the face. */
const Stamp: React.FC<{ text: string; t: number; from: number; to: number; tone?: string }> = ({
  text,
  t,
  from,
  to,
  tone = '#ffffff',
}) => {
  if (t < from || t > to) return null;
  const p = (t - from) / (to - from);
  const o = Math.min(
    interpolate(p, [0, 0.12], [0, 1], { extrapolateRight: 'clamp' }),
    interpolate(p, [0.84, 1], [1, 0], { extrapolateLeft: 'clamp' }),
  );
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 112,
        display: 'flex',
        justifyContent: 'center',
        zIndex: 8,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          fontFamily: FONT,
          fontWeight: 800,
          fontSize: 48,
          letterSpacing: '-0.02em',
          color: tone,
          background: 'rgba(8,8,14,0.78)',
          border: `1.5px solid ${tone}44`,
          borderRadius: 16,
          padding: '16px 30px',
          opacity: o,
          transform: `translateY(${(1 - o) * 14}px)`,
          textShadow: '0 4px 20px rgba(0,0,0,0.8)',
          backdropFilter: 'blur(6px)',
        }}
      >
        {text}
      </div>
    </div>
  );
};

const CTA: React.FC<{ local: number }> = ({ local }) => {
  const { fps } = useVideoConfig();
  const s = spring({ frame: local, fps, config: { damping: 17, mass: 0.6 } });
  // only 45 frames here - everything must be fully on screen with time to read it
  const line = (i: number) =>
    interpolate(local, [2 + i * 2.6, 10 + i * 2.6], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(120% 80% at 50% 28%, #1b1b2c 0%, ${noah.bg} 62%, #08080e 100%)`,
        fontFamily: FONT,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 30,
        opacity: interpolate(local, [0, 6], [0, 1], { extrapolateRight: 'clamp' }),
      }}
    >
      <div style={{ transform: `scale(${0.9 + s * 0.1})`, marginBottom: 6 }}>
        <NoahLockup size={78} />
      </div>

      <div
        style={{
          fontSize: 96,
          fontWeight: 800,
          letterSpacing: '-0.035em',
          background: noah.ctaGrad,
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
          opacity: line(0),
          transform: `translateY(${(1 - line(0)) * 18}px)`,
        }}
      >
        FREE PC CHECK
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, marginTop: 4 }}>
        {['Describe it.', 'Approve it.', 'Done.'].map((t, i) => (
          <div
            key={t}
            style={{
              fontSize: 46,
              fontWeight: 600,
              color: '#dcdce9',
              letterSpacing: '-0.02em',
              opacity: line(i + 1),
              transform: `translateY(${(1 - line(i + 1)) * 14}px)`,
            }}
          >
            {t}
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: 22,
          fontSize: 38,
          fontWeight: 500,
          color: noah.txt2,
          opacity: line(4),
        }}
      >
        Download Noah. Try it today.
      </div>

      <div
        style={{
          marginTop: 8,
          fontSize: 52,
          fontWeight: 700,
          letterSpacing: '-0.015em',
          color: '#ffffff',
          padding: '18px 44px',
          borderRadius: 99,
          border: `2px solid ${noah.indigo}`,
          background: 'rgba(109,106,224,0.14)',
          opacity: line(5),
          transform: `scale(${0.95 + line(5) * 0.05})`,
          boxShadow: `0 0 50px ${noah.purple}44`,
        }}
      >
        onnoah.app
      </div>
    </AbsoluteFill>
  );
};

export const Ad: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const ratio = splitAt(t);
  const leftW = `${ratio * 100}%`;
  const rightW = `${(1 - ratio) * 100}%`;

  // which side is being argued right now
  const cleanerFocus = t >= 2.5 && t < 6 ? 1 : 0;
  const noahFocus = t >= 6 ? 1 : 0;
  const cleanerDim = interpolate(t, [6, 6.9], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Noah is already listening while the other side cleans - it just has not
  // concluded anything yet, which is the whole argument.
  const noahMode = t < 6 ? 'prompt' : t < 10 ? 'check' : t < 13 ? 'finding' : 'plan';
  const noahLocal =
    t < 6 ? frame - sec(2.9) : t < 10 ? frame - sec(6) : t < 13 ? frame - sec(10) : frame - sec(13);

  const charH = charHeightAt(t);
  const splitOpen = spring({ frame, fps, config: { damping: 18, mass: 0.5 } });
  const inApproval = t >= 16 && t < 18.5;
  const inCta = t >= 18.5;

  return (
    <AbsoluteFill style={{ background: '#05050a' }}>
      <Fonts />
      <Audio src={staticFile('audio/mix.wav')} />

      {!inCta && (
        <AbsoluteFill style={{ flexDirection: 'row' }}>
          {/* ---------------- LEFT: generic cleaner ---------------- */}
          <div
            style={{
              width: leftW,
              height: '100%',
              position: 'relative',
              overflow: 'hidden',
              filter: `grayscale(${cleanerDim * 0.55}) brightness(${1 - cleanerDim * 0.4})`,
              transform: `scale(${1 + cleanerFocus * 0.006})`,
            }}
          >
            <div style={{ position: 'absolute', inset: `0 0 ${1920 - charH}px 0`, overflow: 'hidden' }}>
              <Character
                src="char/unsure.png"
                frame={frame}
                progress={interpolate(t, [0, 16], [0, 1])}
                zoomFrom={1.1}
                zoomTo={1.2}
                focusX={46}
                focusY={30}
                grayscale={0.15}
                brightness={0.96}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, rgba(5,5,10,0.3) 0%, rgba(5,5,10,0) 38%, rgba(238,241,246,0.92) 100%)',
                }}
              />
            </div>
            <div style={{ position: 'absolute', top: charH, left: 0, right: 0, bottom: 0 }}>
              <CleanerPanel frame={frame} local={frame - sec(2.5)} />
            </div>
            <Label text="CLEANER APP" tone="cleaner" show={splitOpen} dim={cleanerDim} />
          </div>

          {/* ---------------- divider ---------------- */}
          <div
            style={{
              width: 4,
              height: '100%',
              background: `linear-gradient(180deg, ${noah.blue}, ${noah.purple})`,
              boxShadow: `0 0 26px ${noah.purple}cc`,
              opacity: splitOpen,
              zIndex: 6,
            }}
          />

          {/* ---------------- RIGHT: Noah ---------------- */}
          <div
            style={{
              width: rightW,
              height: '100%',
              position: 'relative',
              overflow: 'hidden',
              transform: `scale(${1 + noahFocus * 0.004})`,
            }}
          >
            <div style={{ position: 'absolute', inset: `0 0 ${1920 - charH}px 0`, overflow: 'hidden' }}>
              <Character
                src="char/engaged.png"
                frame={frame}
                progress={interpolate(t, [0, 16], [0, 1])}
                zoomFrom={1.12}
                zoomTo={1.22}
                focusX={54}
                focusY={26}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: `linear-gradient(180deg, rgba(5,5,10,0.35) 0%, rgba(5,5,10,0) 36%, ${noah.bg} 100%)`,
                }}
              />
            </div>
            <div style={{ position: 'absolute', top: charH, left: 0, right: 0, bottom: 0 }}>
              <NoahPanel mode={noahMode as 'prompt' | 'check' | 'finding' | 'plan'} local={noahLocal} />
            </div>
            <Label text="NOAH" tone="noah" show={splitOpen} dim={0} />
          </div>
        </AbsoluteFill>
      )}

      {/* ---------------- hook headline ---------------- */}
      {t < 2.6 && (
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', zIndex: 10, pointerEvents: 'none' }}>
          <div
            style={{
              fontFamily: FONT,
              fontWeight: 800,
              fontSize: 108,
              letterSpacing: '-0.045em',
              lineHeight: 1.02,
              textAlign: 'center',
              color: '#fff',
              textShadow: '0 10px 50px rgba(0,0,0,0.9)',
              opacity: Math.min(
                interpolate(t, [0.18, 0.55], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
                interpolate(t, [2.2, 2.6], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
              ),
              transform: `scale(${interpolate(t, [0.18, 0.7], [0.9, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              })})`,
            }}
          >
            CLEANING
            <br />
            <span style={{ color: '#b9a8ff', fontSize: 132, textShadow: `0 0 50px ${noah.purple}aa` }}>≠</span>
            <br />
            DIAGNOSIS
          </div>
        </AbsoluteFill>
      )}

      {/* ---------------- beat stamps ---------------- */}
      <Stamp text="BUT WHAT WAS ACTUALLY WRONG?" t={t} from={3.9} to={5.9} tone="#ffd9a3" />
      <Stamp text="CHECK FIRST." t={t} from={6.5} to={9.6} tone="#b9a8ff" />
      <Stamp text="SEE THE ISSUE." t={t} from={10.3} to={12.7} tone="#b9a8ff" />
      <Stamp text="SEE THE PLAN." t={t} from={13.3} to={15.7} tone="#b9a8ff" />

      {/* ---------------- approval hero ---------------- */}
      {inApproval && <ApprovalModal local={frame - sec(16)} />}
      {inApproval && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 330,
            display: 'flex',
            justifyContent: 'center',
            zIndex: 20,
          }}
        >
          <div
            style={{
              fontFamily: FONT,
              fontWeight: 800,
              fontSize: 112,
              letterSpacing: '-0.04em',
              color: '#fff',
              textShadow: `0 0 60px ${noah.purple}aa, 0 8px 40px rgba(0,0,0,0.9)`,
              opacity: interpolate(t, [16.25, 16.8, 18.2, 18.5], [0, 1, 1, 0], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              }),
            }}
          >
            YOU DECIDE.
          </div>
        </div>
      )}

      {/* ---------------- CTA ---------------- */}
      {inCta && <CTA local={frame - sec(18.5)} />}

      {/* ---------------- captions ---------------- */}
      {!inCta && <Captions time={t} bottom={inApproval ? 150 : 206} />}

      {/* persistent small brand mark, out of the way of the UI */}
      {!inCta && (
        <div style={{ position: 'absolute', right: 30, bottom: 34, opacity: 0.5, zIndex: 12 }}>
          <NoahMark size={40} />
        </div>
      )}
    </AbsoluteFill>
  );
};
