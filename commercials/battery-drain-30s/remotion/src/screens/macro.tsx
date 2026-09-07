import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {t, font} from '../theme';
import {BATTERY, STOPWATCH_START_SECONDS} from '../copy';
import {Battery, Fonts, Wifi} from '../components/chrome';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/**
 * The menu-bar battery cluster, rendered oversized because clips 02 and 05 are
 * extreme macro — the cluster fills the frame and needs far more resolution than
 * a full-desktop capture can give it.
 *
 * The percentage NEVER ticks inside continuous sharp time. It changes across a
 * defocus, so the shot reads as two moments rather than one impossible one. A
 * number visibly dropping three points in under two seconds of unbroken time is a
 * fabrication, and it is the exact species of fabrication this brand is built
 * against. See 04-onscreen-text.md, rule 1.
 */
const Cluster: React.FC<{pct: number; clock: string; charging: boolean; blur: number}> = ({
  pct, clock, charging, blur,
}) => (
  <AbsoluteFill style={{background: 'linear-gradient(178deg,#0B1024,#101427)',
    fontFamily: font.sans, filter: blur > 0.05 ? `blur(${blur}px)` : undefined}}>
    <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 150,
      background: 'rgba(8,12,28,.66)', borderBottom: '1px solid rgba(255,255,255,.05)'}} />
    <div style={{position: 'absolute', right: 70, top: 0, height: 150, display: 'flex',
      alignItems: 'center', gap: 52}}>
      <Wifi size={60} />
      <Battery pct={pct} charging={charging} scale={2.9} />
      <span style={{fontWeight: 500, fontSize: 76, color: t.ink,
        fontVariantNumeric: 'tabular-nums'}}>{pct}%</span>
      <span style={{fontWeight: 500, fontSize: 76, color: t.ink,
        fontVariantNumeric: 'tabular-nums'}}>{clock}</span>
    </div>
  </AbsoluteFill>
);

/* ── UI-01 · plugged in, 41% → 38% · clip 02 · 43 frames ─────────────────────
   Plugged in and losing charge. Real when draw exceeds a compact adapter's
   supply — which is why the small charger is a required prop in clip 04.      */
export const UI01: React.FC = () => {
  const f = useCurrentFrame();
  const b = BATTERY.plugged;
  const blur = interpolate(f, [19, 23, 25, 29], [0, 30, 30, 0], clamp);
  const past = f >= 24;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Fonts />
      <Cluster pct={past ? b.to : b.from} clock={past ? b.clockTo : b.clockFrom}
        charging blur={blur} />
    </AbsoluteFill>
  );
};

/* ── UI-02 · on battery, 34% → 29% · clip 05 · 34 frames ────────────────────
   Bolt gone — she unplugged it in clip 04. The defocus is shorter than clip
   02's, which makes the second reading feel closer to the first.             */
export const UI02: React.FC = () => {
  const f = useCurrentFrame();
  const b = BATTERY.onBattery;
  const blur = interpolate(f, [10, 12, 14, 16], [0, 30, 30, 0], clamp);
  const past = f >= 13;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Fonts />
      <Cluster pct={past ? b.to : b.from} clock={past ? b.clockTo : b.clockFrom}
        charging={false} blur={blur} />
    </AbsoluteFill>
  );
};

/* ── UI-03 · phone stopwatch · clip 06 · 29 frames ───────────────────────────
   Twelve points of battery in fifteen minutes — exactly the drain rate implied
   by the 2h 06m projection in UI-09. The film never explains it and doesn't
   need to.                                                                    */
export const UI03: React.FC = () => {
  const f = useCurrentFrame();
  const total = STOPWATCH_START_SECONDS + f / 24;
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = Math.floor(total % 60);
  const hs = Math.floor((total % 1) * 100);
  const p2 = (n: number) => String(n).padStart(2, '0');
  return (
    <AbsoluteFill style={{background: '#000', fontFamily: font.sans}}>
      <Fonts />
      <div style={{position: 'absolute', top: 70, left: 0, right: 0, display: 'flex',
        flexDirection: 'row', justifyContent: 'space-between', padding: '0 120px',
        fontSize: 46, fontWeight: 600, color: '#fff', fontVariantNumeric: 'tabular-nums'}}>
        <span>23:56</span><span>29%</span>
      </div>
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', gap: 150}}>
        <div style={{fontWeight: 200, fontSize: 186, letterSpacing: '-.03em', color: '#fff',
          fontVariantNumeric: 'tabular-nums', display: 'flex', alignItems: 'baseline'}}>
          {`${p2(h)}:${p2(m)}:${p2(s)}`}
          {/* hundredths stay blurred — a sharp hundredths digit reads as a still */}
          <span style={{fontSize: 112, fontWeight: 200, color: 'rgba(255,255,255,.55)',
            marginLeft: 8, filter: 'blur(5px)'}}>.{p2(hs)}</span>
        </div>
        <div style={{display: 'flex', gap: 170}}>
          <span style={{width: 190, height: 190, borderRadius: '50%', background: '#2a2a2c',
            color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 44, fontWeight: 500}}>Lap</span>
          <span style={{width: 190, height: 190, borderRadius: '50%', background: '#3a2226',
            color: '#eb5545', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 44, fontWeight: 500}}>Stop</span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
