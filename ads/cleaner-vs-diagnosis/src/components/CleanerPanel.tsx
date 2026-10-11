import React from 'react';
import { interpolate, spring, useVideoConfig } from 'remotion';
import { cleaner } from '../theme';
import { FONT } from './Base';

/**
 * A GENERIC cleaning utility. Invented for this ad.
 *
 * Deliberately not modelled on any shipping product: no competitor name, mark,
 * colourway or layout. It stands for the broad "clean everything" category, and
 * its job here is to feel busy and non-specific - lots of motion, nothing that
 * tells you what was actually wrong.
 */

const ROWS = [
  { label: 'Cleaning cache', size: '1.9 GB' },
  { label: 'Removing junk', size: '740 MB' },
  { label: 'Deleting temporary files', size: '2.3 GB' },
  { label: 'Optimizing storage', size: '—' },
];

const Tick: React.FC<{ show: number }> = ({ show }) => (
  <svg width="26" height="26" viewBox="0 0 24 24" style={{ opacity: show }}>
    <circle cx="12" cy="12" r="11" fill={cleaner.accent2} />
    <path
      d="M6.5 12.4l3.6 3.6L17.6 8.4"
      stroke="#fff"
      strokeWidth="2.4"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const CleanerPanel: React.FC<{ frame: number; local: number }> = ({ local }) => {
  const { fps } = useVideoConfig();
  // Everything on this side moves fast and finishes early - the point is that it
  // is already "done" before anyone has said what was wrong.
  const overall = interpolate(local, [0, 70], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: cleaner.bg,
        fontFamily: FONT,
        padding: '34px 30px',
        display: 'flex',
        flexDirection: 'column',
        gap: 18,
      }}
    >
      {/* window chrome */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, opacity: 0.75 }}>
        {['#ff5f57', '#febc2e', '#28c840'].map((c) => (
          <span key={c} style={{ width: 13, height: 13, borderRadius: 99, background: c }} />
        ))}
        <span
          style={{
            marginLeft: 8,
            fontSize: 21,
            fontWeight: 600,
            color: cleaner.txt2,
            letterSpacing: '-0.01em',
          }}
        >
          Quick Clean
        </span>
      </div>

      <div
        style={{
          background: cleaner.panel,
          border: `1px solid ${cleaner.line}`,
          borderRadius: 16,
          padding: '26px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: 22,
        }}
      >
        <div>
          <div style={{ fontSize: 30, fontWeight: 800, color: cleaner.txt, letterSpacing: '-0.02em' }}>
            Cleaning…
          </div>
          <div style={{ fontSize: 20, fontWeight: 500, color: cleaner.txt2, marginTop: 6 }}>
            {Math.round(overall)}% complete
          </div>
        </div>

        {/* master bar, sprinting */}
        <div style={{ height: 14, borderRadius: 99, background: cleaner.barTrack, overflow: 'hidden' }}>
          <div
            style={{
              width: `${overall}%`,
              height: '100%',
              borderRadius: 99,
              background: `linear-gradient(90deg,${cleaner.accent},${cleaner.accent2})`,
            }}
          />
        </div>

        {/* per-row chatter */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 17 }}>
          {ROWS.map((r, i) => {
            const start = i * 12;
            const p = interpolate(local, [start, start + 26], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });
            const done = p >= 1 ? 1 : 0;
            return (
              <div key={r.label} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Tick show={done} />
                  <span
                    style={{
                      fontSize: 21,
                      fontWeight: 600,
                      color: done ? cleaner.txt2 : cleaner.txt,
                      textDecoration: done ? 'line-through' : 'none',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {r.label}
                  </span>
                  <span
                    style={{
                      marginLeft: 'auto',
                      fontSize: 19,
                      fontWeight: 600,
                      color: cleaner.txt2,
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {r.size}
                  </span>
                </div>
                <div
                  style={{ height: 8, borderRadius: 99, background: cleaner.barTrack, overflow: 'hidden' }}
                >
                  <div
                    style={{
                      width: `${p * 100}%`,
                      height: '100%',
                      background: cleaner.accent,
                      borderRadius: 99,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* the clutter: generic chips that say activity but not cause */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9 }}>
        {['Scanning…', 'Freeing space', 'Caches', 'Logs', 'Temp', 'Leftovers'].map((c, i) => {
          const o = interpolate(local, [14 + i * 5, 24 + i * 5], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          const jitter = Math.sin((local + i * 9) / 3.4) * 1.6;
          return (
            <span
              key={c}
              style={{
                opacity: o,
                transform: `translateY(${jitter}px)`,
                fontSize: 17,
                fontWeight: 600,
                color: cleaner.txt2,
                background: cleaner.panel,
                border: `1px solid ${cleaner.line}`,
                borderRadius: 99,
                padding: '7px 13px',
              }}
            >
              {c}
            </span>
          );
        })}
      </div>

      {/* the result: a number, and nothing about cause */}
      <div
        style={{
          background: cleaner.panel,
          border: `1px solid ${cleaner.line}`,
          borderRadius: 16,
          padding: '22px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          opacity: interpolate(local, [52, 66], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
        }}
      >
        <div style={{ fontSize: 44, fontWeight: 800, color: cleaner.accent2, letterSpacing: '-0.025em' }}>
          4.9 GB freed
        </div>
        <div style={{ fontSize: 20, fontWeight: 500, color: cleaner.txt2, lineHeight: 1.35 }}>
          Cleanup complete. Run again anytime.
        </div>
      </div>

      {/* rolling activity log - plenty of motion, no cause anywhere in it */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          overflow: 'hidden',
          borderTop: `1px solid ${cleaner.line}`,
          paddingTop: 14,
          opacity: interpolate(local, [20, 34], [0, 0.85], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
        }}
      >
        <div style={{ transform: `translateY(${-((local * 1.15) % 220)}px)` }}>
          {Array.from({ length: 22 }).map((_, i) => {
            const items = [
              'user/Library/Caches', 'temp/chunk_014.tmp', 'logs/system.log.3',
              'cache/thumbnails', 'temp/installer_old', 'logs/update.log',
              'cache/shader_blob', 'temp/crashdump_22', 'cache/webdata',
              'logs/report.old', 'temp/pkg_cache',
            ];
            return (
              <div
                key={i}
                style={{
                  fontSize: 16,
                  fontWeight: 500,
                  color: cleaner.txt2,
                  fontFamily: 'ui-monospace, monospace',
                  padding: '5px 0',
                  display: 'flex',
                  gap: 10,
                  whiteSpace: 'nowrap',
                }}
              >
                <span style={{ color: cleaner.accent2 }}>✓</span>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  removed {items[i % items.length]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: 62,
          borderRadius: 12,
          background: cleaner.accent,
          color: '#fff',
          fontSize: 23,
          fontWeight: 700,
          letterSpacing: '-0.01em',
          opacity: interpolate(local, [56, 72], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
          transform: `scale(${spring({ frame: local - 56, fps, config: { damping: 14 } }) * 0.06 + 0.94})`,
        }}
      >
        Clean Again
      </div>
    </div>
  );
};
