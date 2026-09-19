/* ============================================================
   Deterministic timeline. window.__seek(t) paints frame at t.
   No CSS transitions / no rAF — every pixel is a pure fn of t.
   ============================================================ */

const $ = id => document.getElementById(id);

/* ---------- math ---------- */
const cl   = (v, a = 0, b = 1) => v < a ? a : v > b ? b : v;
const inv  = (t, a, b) => cl((t - a) / (b - a));
const mix  = (a, b, p) => a + (b - a) * p;
const eOut = p => 1 - Math.pow(1 - p, 3);
const eOut4= p => 1 - Math.pow(1 - p, 4);
const eIn  = p => p * p * p;
const eIO  = p => p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
const back = p => { const c = 1.9; return 1 + (c + 1) * Math.pow(p - 1, 3) + c * Math.pow(p - 1, 2); };
/* damped spring, settles at 1 */
const spr  = p => p >= 1 ? 1 : 1 - Math.pow(2, -9 * p) * Math.cos(p * 13.5);

/* rise-and-hold: 0 -> 1 over [a,b] */
const at = (t, a, dur, ease = eOut) => ease(inv(t, a, a + dur));

/* ---------- layer setter ---------- */
function P(el, o) {
  if (!el) return;
  const x = o.x || 0, y = o.y || 0, s = o.s === undefined ? 1 : o.s,
        r = o.r || 0, op = o.o === undefined ? 1 : o.o, bl = o.b || 0;
  el.style.opacity = op;
  el.style.transform =
    `translate3d(${x.toFixed(2)}px,${y.toFixed(2)}px,0) rotate(${r.toFixed(3)}deg) scale(${s.toFixed(4)})`;
  el.style.filter = bl > .02 ? `blur(${bl.toFixed(2)}px)` : 'none';
}
/* slide up + fade, the house entrance */
function rise(el, t, a, dur = .62, dy = 58, ease = eOut) {
  const p = at(t, a, dur, ease);
  P(el, { y: mix(dy, 0, p), o: cl(p * 1.35), b: mix(7, 0, cl(p * 1.6)) });
  return p;
}
function typed(el, full, p) { if (el) el.textContent = full.slice(0, Math.round(full.length * cl(p))); }

/* ============================================================
   TIMELINE
   ============================================================ */
const T = [
  ['s1',  0.00,  4.10],
  ['s2',  4.10,  7.60],
  ['s3',  7.60, 10.90],
  ['s4', 10.90, 16.10],
  ['s5', 16.10, 20.20],
  ['s6', 20.20, 24.20],
  ['s7', 24.20, 28.40],
  ['s8', 28.40, 30.70],
  ['s9', 30.70, 34.00],
];
const DUR = 34.00;
const LAP = 0.26;                       // cross-dissolve overlap
const LEAD = 0.18;                      // incoming content starts inside that overlap

/* ---------- scene 9 burst rays ---------- */
(function () {
  const host = $('s9burst');
  for (let i = 0; i < 26; i++) {
    const d = document.createElement('div');
    d.className = 'ray';
    const pal = ['#FF4D6D', '#FF922B', '#FFC93C', '#0FCFA0', '#23A9FF', '#8B5CF6', '#FF6FC4'];
    d.style.background = pal[i % pal.length];
    d.dataset.ang = (i * (360 / 26)).toFixed(2);
    d.dataset.len = (170 + ((i * 53) % 150)).toFixed(0);
    host.appendChild(d);
  }
})();

/* ============================================================
   BACKGROUND
   ============================================================ */
function bg(t) {
  const w = 1080, h = 1920;
  const drift = (px, py, ax, ay, sx, sy, ph) => ({
    x: px + Math.sin(t * sx + ph) * ax,
    y: py + Math.cos(t * sy + ph * 1.7) * ay
  });
  const cfg = [
    ['blob1',  -90,  120, 150, 110, .21, .17, 0.0],
    ['blob2',  460, -180, 130, 150, .16, .23, 1.3],
    ['blob3', -140, 1050, 165, 120, .19, .15, 2.6],
    ['blob4',  380, 1180, 140, 160, .13, .20, 3.9],
    ['blob5',  560,  640, 190, 170, .24, .18, 5.2],
  ];
  cfg.forEach(([id, px, py, ax, ay, sx, sy, ph], i) => {
    const d = drift(px, py, ax, ay, sx, sy, ph);
    const s = 1 + Math.sin(t * .27 + i * 1.9) * .10;
    const el = $(id);
    el.style.transform = `translate3d(${d.x.toFixed(1)}px,${d.y.toFixed(1)}px,0) scale(${s.toFixed(3)})`;
    el.style.opacity = (.62 + Math.sin(t * .33 + i) * .14).toFixed(3);
  });

  // specular sweep — one pass every 5.5s
  const sp = (t % 5.5) / 5.5;
  $('sweep').style.transform = `translate3d(${mix(-18, 118, sp).toFixed(1)}%,0,0)`;
  $('sweep').style.opacity = (Math.sin(sp * Math.PI) * .55).toFixed(3);

  // whole-frame breathing so nothing ever sits perfectly still
  const br = 1 + Math.sin(t * .42) * .006;
  $('bg').style.setProperty('--br', br);
}

/* ============================================================
   SCENES
   ============================================================ */
function s1(t, u) {                                   // HOOK
  rise($('s1pill'), u, .00, .55, 34);
  rise($('s1l1'),   u, .14, .55, 40);

  // the two slam lines
  [['s1l2', .30], ['s1l3', .46]].forEach(([id, a]) => {
    const p = at(u, a, .70, eOut4);
    P($(id), { y: mix(46, 0, p), s: mix(1.16, 1, spr(inv(u, a, a + .95))), o: cl(p * 1.6), b: mix(13, 0, cl(p * 1.5)) });
  });

  const tp = rise($('s1term'), u, 1.00, .70, 70);
  typed($('s1cmd'), 'git --version', inv(u, 1.30, 1.86));
  $('s1out').style.opacity = at(u, 1.92, .30);
  $('s1out').style.transform = `translate3d(0,${mix(10, 0, at(u, 1.92, .30))}px,0)`;

  // green stamp overshoots then settles, with a ring pulse
  const sp = inv(u, 2.10, 3.00);
  P($('s1stamp'), { s: mix(.2, 1, spr(sp)), o: cl(sp * 4), r: mix(-26, 0, eOut(cl(sp * 1.5))) });

  rise($('s1kick'), u, 2.55, .65, 46);
  // late micro-push on the whole frame for energy
  const push = at(u, 3.20, .90, eIO) * 0.012;
  $('s1').style.transformOrigin = '50% 46%';
  return 1 + push;
}

function s2(t, u) {                                   // WHAT THEY SAID
  rise($('s2kick'), u, .00, .55, 34);
  const p = inv(u, .18, 1.15);
  P($('s2bub'), { y: mix(64, 0, eOut(p)), s: mix(.955, 1, spr(p)), o: cl(p * 2.2), b: mix(8, 0, cl(p * 2)) });
  rise($('s2meta'), u, .95, .60, 40);
  return 1;
}

function s3(t, u) {                                   // NOAH OPENS
  rise($('s3cap'),  u, .00, .55, 30);
  rise($('s3cap2'), u, .12, .70, 48);

  // the window flies up into a held tilt, then drifts
  const p  = inv(u, .28, 1.45);
  const e  = eOut4(p);
  const dr = Math.sin((u - 1.4) * .8) * 6;
  const el = $('s3win');
  el.style.opacity = cl(p * 2.4);
  el.style.transformOrigin = '50% 50%';
  el.style.transform =
    `perspective(2800px) translate3d(0,${mix(560, 0, e).toFixed(1)}px,0) ` +
    `rotateX(${mix(24, 8.5, e).toFixed(2)}deg) rotateZ(${mix(-3.4, -1.4, e).toFixed(2)}deg) ` +
    `scale(${(mix(.92, .790, e) + at(u, 1.5, 1.8, eIO) * .020).toFixed(4)}) ` +
    `translateY(${dr.toFixed(1)}px)`;
  el.style.filter = p < .9 ? `blur(${mix(14, 0, cl(p * 1.25)).toFixed(1)}px)` : 'none';
  return 1;
}

function s4(t, u) {                                   // WHAT NOAH CHECKED
  rise($('s4kick'), u, .00, .60, 38);
  const starts = [.34, .62, .90, 1.18];
  ['s4t1', 's4t2', 's4t3', 's4t4'].forEach((id, i) => {
    const a = starts[i], p = inv(u, a, a + .80);
    P($(id), { x: mix(-70, 0, eOut4(p)), s: mix(.93, 1, spr(p)), o: cl(p * 2.4), b: mix(9, 0, cl(p * 2)) });
  });

  // tile 2 is the cause — it gets called out
  const hp = inv(u, 2.35, 3.30);
  const el = $('s4t2');
  if (hp > 0 && hp < 1) {
    const k = Math.sin(hp * Math.PI);
    el.style.boxShadow = `0 24px 54px -22px rgba(16,23,51,.24), 0 0 0 ${(k * 7).toFixed(1)}px rgba(255,77,109,${(k * .30).toFixed(3)})`;
    const sh = Math.sin(hp * 46) * 7 * (1 - hp);
    P(el, { x: sh, s: 1 + k * .028, o: 1 });
  } else if (hp >= 1) {
    el.style.boxShadow = `0 24px 54px -22px rgba(16,23,51,.24), 0 0 0 4px rgba(255,77,109,.22)`;
  }
  return 1;
}

function s5(t, u) {                                   // THE CULPRIT
  rise($('s5kick'), u, .00, .60, 38);
  const p = inv(u, .22, 1.10);
  P($('s5box'), { y: mix(70, 0, eOut4(p)), s: mix(.955, 1, spr(p)), o: cl(p * 2.2), b: mix(9, 0, cl(p * 2)) });

  const fr = inv(u, .70, 1.05);
  P($('s5from'), { s: mix(.97, 1, spr(fr)), o: cl(fr * 3) });

  const ar = inv(u, 1.00, 1.45);
  P($('s5arrow'), { y: mix(-24, 0, eOut4(ar)), o: cl(ar * 2) });

  const to = inv(u, 1.25, 1.70);
  P($('s5to'), { o: cl(to * 2), s: mix(.98, 1, spr(to)) });
  $('s5strike').style.transform = `scaleX(${eOut(inv(u, 1.62, 2.05)).toFixed(3)})`;

  const gn = inv(u, 1.95, 2.45);
  const shake = gn < 1 ? Math.sin(gn * 40) * 9 * (1 - gn) : 0;
  P($('s5gone'), { x: shake, o: cl(gn * 2.6), s: mix(.94, 1, spr(gn)) });

  rise($('s5expl'), u, 2.45, .70, 46);
  return 1;
}

function s6(t, u) {                                   // THE FIX
  rise($('s6kick'), u, .00, .60, 38);
  const p = inv(u, .20, 1.05);
  P($('s6card'), { y: mix(66, 0, eOut4(p)), s: mix(.96, 1, spr(p)), o: cl(p * 2.2), b: mix(8, 0, cl(p * 2)) });

  [['s6p1', .55], ['s6p2', .78], ['s6p3', 1.01]].forEach(([id, a]) => {
    const q = inv(u, a, a + .55);
    P($(id), { x: mix(-34, 0, eOut4(q)), o: cl(q * 2.2) });
  });

  // cursor travels to the button, presses
  const mv = inv(u, 1.35, 2.05);
  const cx = mix(0, S6T.dx, eIO(mv)), cy = mix(0, S6T.dy, eIO(mv));
  const press = inv(u, 2.10, 2.26);
  const rel   = inv(u, 2.26, 2.44);
  const pk    = press - rel;                                   // 0..1..0
  P($('s6cursor'), { x: cx + pk * 5, y: cy + pk * 7, o: cl(inv(u, 1.25, 1.50) * 2) * (1 - inv(u, 2.75, 3.05)), s: 1 - pk * .10 });

  const btn = $('s6btn');
  btn.style.transform = `scale(${(1 - pk * .035).toFixed(4)})`;
  btn.style.opacity   = (1 - inv(u, 2.40, 2.70)).toFixed(3);

  const sent = $('s6sent');
  const sp = inv(u, 2.42, 2.80);
  sent.style.opacity = cl(sp * 1.5).toFixed(3);
  sent.style.transform = `scale(${mix(.96, 1, spr(sp)).toFixed(4)})`;
  return 1;
}

function s7(t, u) {                                   // PROOF
  rise($('s7kick'), u, .00, .60, 38);
  const p = inv(u, .18, 1.00);
  P($('s7term'), { y: mix(70, 0, eOut4(p)), s: mix(.96, 1, spr(p)), o: cl(p * 2.2), b: mix(8, 0, cl(p * 2)) });

  typed($('t1c'), 'which git', inv(u, .60, 1.12));
  $('t2').style.opacity = at(u, 1.20, .22);
  typed($('t2c'), '/usr/bin/git', inv(u, 1.20, 1.52));

  $('t3').style.opacity = at(u, 1.70, .18);
  typed($('t3c'), 'git --version', inv(u, 1.74, 2.34));
  $('t4').style.opacity = at(u, 2.44, .22);
  typed($('t4c'), 'git version 2.54.0 (Apple Git-157)', inv(u, 2.44, 2.96));

  // caret blinks at 1.8 Hz, hidden while a line is still typing
  $('tcar').style.opacity = (u > 2.96 && Math.sin(u * 11.3) > 0) ? 1 : (u > 2.96 ? 0 : .85);

  const tp = inv(u, 2.95, 3.55);
  P($('s7toast'), { y: mix(48, 0, eOut4(tp)), s: mix(.94, 1, spr(tp)), o: cl(tp * 2.4) });
  return 1;
}

function s8(t, u) {                                   // THEY CONFIRM
  rise($('s8kick'), u, .00, .50, 30);
  const p = inv(u, .16, 1.05);
  P($('s8bub'), { y: mix(58, 0, eOut4(p)), s: mix(.93, 1, spr(p)), o: cl(p * 2.4), b: mix(9, 0, cl(p * 2)) });
  rise($('s8meta'), u, .85, .60, 38);
  return 1 + at(u, 1.30, 1.00, eIO) * .015;
}

function s9(t, u) {                                   // CLOSER
  // radial burst
  const bp = inv(u, .05, 1.05);
  document.querySelectorAll('#s9burst .ray').forEach((d, i) => {
    const ang = +d.dataset.ang, len = +d.dataset.len;
    const lag = (i % 5) * .035;
    const q = eOut4(cl((bp - lag) / (1 - lag)));
    d.style.height = (len * q).toFixed(1) + 'px';
    d.style.opacity = (Math.sin(cl(bp) * Math.PI) * .55).toFixed(3);
    d.style.transform = `rotate(${ang}deg) translateY(${(120 + q * 90).toFixed(1)}px)`;
  });

  [['s9a', .18], ['s9b', .36]].forEach(([id, a]) => {
    const p = inv(u, a, a + .85);
    P($(id), { y: mix(52, 0, eOut4(p)), s: mix(1.14, 1, spr(p)), o: cl(p * 1.8), b: mix(12, 0, cl(p * 1.6)) });
  });
  rise($('s9c'), u, .95, .70, 44);
  const lp = inv(u, 1.35, 2.15);
  P($('s9d'), { y: mix(46, 0, eOut4(lp)), s: mix(.94, 1, spr(lp)), o: cl(lp * 2.2) });
  return 1 + at(u, 1.9, 1.4, eIO) * .018;
}

const FN = { s1, s2, s3, s4, s5, s6, s7, s8, s9 };

/* ============================================================
   MASTER
   ============================================================ */
function seek(t) {
  t = cl(t, 0, DUR);
  bg(t);

  T.forEach(([id, a, b]) => {
    const el = $(id);
    const visible = t >= a - LAP && t < b + .001;
    if (!visible) { el.classList.remove('on'); return; }
    el.classList.add('on');

    const ein  = inv(t, a - LAP, a + .14);
    const eoutP= inv(t, b - LAP, b);
    const u    = t - a + LEAD;

    const extra = (FN[id] ? FN[id](t, u) : 1);

    const sIn  = mix(1.045, 1, eOut4(ein));
    const sOut = mix(1, .930, eIn(eoutP));
    const yIn  = mix(34, 0, eOut4(ein));
    const yOut = mix(0, -96, eIn(eoutP));
    const blur = mix(10, 0, cl(ein * 1.5)) + eIn(eoutP) * 17;

    el.style.opacity = (cl(ein * 1.5) * (1 - eIO(eoutP))).toFixed(3);
    el.style.transformOrigin = '50% 48%';
    el.style.transform =
      `translate3d(0,${(yIn + yOut).toFixed(1)}px,0) scale(${(sIn * sOut * extra).toFixed(4)})`;
    el.style.filter = blur > .05 ? `blur(${blur.toFixed(2)}px)` : 'none';
  });
}

/* measured once at load: exact vector from the cursor's resting spot to the button */
let S6T = { dx: -140, dy: -440 };
(function measureS6() {
  const sc = $('s6'), had = sc.classList.contains('on');
  sc.classList.add('on');
  const b = $('s6btn').getBoundingClientRect();
  const c = $('s6cursor').getBoundingClientRect();
  if (b.width && c.width) S6T = { dx: (b.left + b.width * .46) - c.left,
                                  dy: (b.top  + b.height * .52) - c.top };
  if (!had) sc.classList.remove('on');
})();

window.__seek = seek;
window.__DUR  = DUR;
window.__FPS  = 60;
seek(0);
