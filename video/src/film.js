/* Noah — "Mine has one app on it"
   Deterministic timeline. render(t) fully describes the frame at time t (seconds).
   No CSS transitions/animations anywhere, so frame N is always identical. */

const FPS = 30;
const DURATION = 82;

/* ---------- easing / helpers ---------- */
const clamp01 = x => x < 0 ? 0 : x > 1 ? 1 : x;
const p  = (t, a, b) => clamp01((t - a) / (b - a));           // linear progress in window
const eOut  = x => 1 - Math.pow(1 - x, 3);
const eInOut= x => x < .5 ? 4*x*x*x : 1 - Math.pow(-2*x + 2, 3) / 2;
const eOutBack = x => 1 + 2.2*Math.pow(x-1,3) + 1.2*Math.pow(x-1,2);
const lerp = (a, b, x) => a + (b - a) * x;
const $ = id => document.getElementById(id);

/* fade a beat in and out with soft shoulders */
function beat(el, t, start, end, fin = .45, fout = .45) {
  const a = p(t, start, start + fin);
  const b = 1 - p(t, end - fout, end);
  el.style.opacity = String(clamp01(Math.min(a, b)));
}

/* stagger the .ln children of an element into place */
function linesIn(el, t, start, stagger = .13, dur = .62, dy = 30) {
  const kids = el.querySelectorAll('.ln');
  kids.forEach((k, i) => {
    const x = eOut(p(t, start + i * stagger, start + i * stagger + dur));
    k.style.opacity = String(x);
    k.style.transform = `translateY(${lerp(dy, 0, x)}px)`;
  });
}

/* fade an element out (multiplies whatever opacity it has) */
function out(el, t, at, dur = .5) {
  el.style.opacity = String((1 - p(t, at, at + dur)) * Number(el.style.opacity || 1));
}

/* ---------- the timeline ---------- */
function render(t) {
  const B1 = $('b1'), B2 = $('b2'), B3 = $('b3'), B4 = $('b4'),
        B5 = $('b5'), B6 = $('b6'), B7 = $('b7');

  /* beat envelopes — cut to the voiceover timing sheet in SCRIPT.md */
  beat(B1, t,  0.0,  9.4);
  beat(B2, t,  9.2, 24.4);
  beat(B3, t, 24.2, 39.5);
  beat(B4, t, 39.3, 52.6);
  beat(B5, t, 52.4, 62.6);
  beat(B6, t, 62.4, 74.5);
  beat(B7, t, 74.3, DURATION);

  /* ============ B1 · HOOK ============ */
  linesIn($('b1k'), t, 0.55, .30, .70, 26);   // VO 1 @ 0.6
  linesIn($('b1h'), t, 6.30, .22, .80, 46);   // VO 2 @ 6.6

  /* ============ B2 · THE THEATER ============ */
  linesIn($('b2k'), t, 9.50, .26, .70, 26);   // VO 3 @ 9.7

  {                                            // card lifts in — VO 4 "It scans." @ 13.8
    const x = eOut(p(t, 13.40, 14.10));
    const card = $('b2card');
    card.style.opacity = String(x);
    card.style.transform = `translateY(${lerp(34, 0, x)}px)`;
  }
  $('b2scan').style.opacity = String(p(t, 13.70, 14.10) * (1 - p(t, 17.90, 18.30)));

  {                                            // count-up 0 -> 1,847 — VO 5 @ 15.3
    const x = eOut(p(t, 15.00, 18.00));
    $('b2num').textContent = Math.round(lerp(0, 1847, x)).toLocaleString('en-US');
    $('b2num').style.opacity = String(p(t, 15.00, 15.30));
    $('b2lab').style.opacity = String(p(t, 15.40, 15.80));
    $('b2fill').style.transform = `scaleX(${x})`;
    $('b2bar').style.opacity = String(p(t, 14.90, 15.30));
  }

  {                                            // click — VO 6 "You click clean." @ 18.3
    const btn = $('b2btn'), cur = $('b2cur');
    btn.style.opacity = String(p(t, 18.00, 18.40));
    const move = eInOut(p(t, 18.30, 19.40));
    cur.style.left = `${lerp(760, 806, move)}px`;
    cur.style.top  = `${lerp(1290, 886, move)}px`;
    cur.style.opacity = String(p(t, 18.20, 18.60) * (1 - p(t, 20.10, 20.50)));
    const press = p(t, 19.40, 19.54) * (1 - p(t, 19.60, 19.78));
    btn.style.transform = `scale(${1 - .05 * press})`;
  }

  {                                            // the card drains — nothing actually changed
    const g = p(t, 19.90, 20.90);
    const card = $('b2card');
    card.style.opacity = String((1 - g) * (p(t, 13.40, 14.10) > 0 ? 1 : 0));
    card.style.transform = `translateY(${lerp(0, -22, eOut(g))}px)`;
    out($('b2k'), t, 19.90, 1.0);
  }
  linesIn($('b2still'), t, 20.70, .20, .70, 34);  // VO 7 @ 20.8

  /* ============ B3 · THE TURN ============ */
  linesIn($('b3h'),  t, 24.50, .22, .80, 40);  // VO 8  @ 24.6
  linesIn($('b3k'),  t, 27.70, .20, .66, 26);  // VO 9  @ 27.8
  linesIn($('b3k2'), t, 34.30, .20, .66, 26);  // VO 10 @ 34.4

  /* ============ B4 · NOAH ENTERS ============ */
  {                                            // the mark draws itself — VO 11 @ 39.7
    const ring = $('b4ring'), line = $('b4line'), tide = $('b4tide'), mark = $('b4mark');
    const C = 2 * Math.PI * 34, L = 88;
    const r = eInOut(p(t, 39.50, 40.80));
    ring.style.strokeDasharray = String(C);
    ring.style.strokeDashoffset = String(lerp(C, 0, r));
    const l = eOut(p(t, 40.50, 41.40));
    line.style.strokeDasharray = String(L);
    line.style.strokeDashoffset = String(lerp(L, 0, l));
    const w = eOut(p(t, 40.80, 41.80));
    tide.setAttribute('height', String(lerp(0.001, 20, w)));
    tide.setAttribute('y', String(lerp(94, 74, w)));
    mark.style.opacity = String(p(t, 39.45, 39.75));
  }
  linesIn($('b4h'), t, 40.20, .18, .70, 32);   // "One app. Noah."
  linesIn($('b4k'), t, 42.90, .18, .66, 26);   // VO 12 @ 43.0
  {                                            // typed in plain English — VO 13 @ 47.0
    const x = eOut(p(t, 46.30, 46.90));
    const card = $('b4card');
    card.style.opacity = String(x);
    card.style.transform = `translateY(${lerp(26, 0, x)}px)`;
    const phrase = "my fan won't stop";
    const n = Math.floor(clamp01(p(t, 46.90, 48.90)) * phrase.length);
    const caret = (t < 49.1 || Math.floor(t * 2) % 2 === 0) ? '<span style="opacity:.45">▍</span>' : '';
    $('b4type').innerHTML = phrase.slice(0, n) + caret;
  }
  linesIn($('b4note'), t, 49.50, .18, .66, 24); // VO 14 @ 49.6

  /* ============ B5 · THE DIAGNOSIS ============ */
  linesIn($('b5k'), t, 52.70, .20, .66, 26);   // VO 15 @ 52.8
  {
    const kids = $('b5checks').querySelectorAll('.ln');
    const at = [54.00, 54.60, 55.20];
    kids.forEach((k, i) => {
      const x = eOut(p(t, at[i], at[i] + .55));
      k.style.opacity = String(x);
      k.style.transform = `translateX(${lerp(-18, 0, x)}px)`;
    });
  }
  {
    const x = eOut(p(t, 56.20, 56.90));
    $('b5rule').style.opacity = String(x);
    $('b5rule').style.transform = `scaleX(${x})`;
    $('b5rule').style.transformOrigin = 'left center';
  }
  linesIn($('b5cl'),    t, 56.40, .18, .55, 18);
  linesIn($('b5cause'), t, 57.00, .18, .70, 30);  // lands on "...the actual cause"
  linesIn($('b5det'),   t, 58.00, .18, .66, 24);
  linesIn($('b5not'),   t, 59.20, .18, .66, 24);  // VO 16 @ 58.6

  /* ============ B6 · THE APPROVAL (hero) ============ */
  linesIn($('b6k'), t, 62.60, .20, .66, 26);   // VO 17 @ 62.7
  {
    const x = eOut(p(t, 64.00, 64.65));
    const card = $('b6card');
    card.style.opacity = String(x);
    card.style.transform = `translateY(${lerp(28, 0, x)}px)`;
  }
  linesIn($('b6plan'), t, 64.60, .55, .66, 22);
  {                                            // the one primary action
    const btn = $('b6btn');
    const x = eOutBack(p(t, 66.20, 66.95));
    btn.style.opacity = String(p(t, 66.20, 66.55));
    const press = p(t, 70.00, 70.16) * (1 - p(t, 70.22, 70.42));
    btn.style.transform = `translateY(${lerp(20, 0, x)}px) scale(${(0.985 + .015 * x) - .035 * press})`;
  }
  linesIn($('b6hero'), t, 66.70, .20, .72, 34);   // VO 18 @ 66.8 — holds to the end of the beat
  {                                               // VO 19 @ 70.6
    const on = p(t, 70.55, 70.95);
    $('b6check').style.opacity = String(on);
    const d = eOut(p(t, 70.75, 71.45));
    $('b6tick').style.strokeDasharray = '32';
    $('b6tick').style.strokeDashoffset = String(lerp(32, 0, d));
    $('b6done').style.opacity = String(on);
    linesIn($('b6done'), t, 70.75, .35, .60, 20);
  }

  /* ============ B7 · SIGN-OFF ============ */
  {
    const x = eOut(p(t, 74.50, 75.35));
    const m = $('b7mark');
    m.style.opacity = String(p(t, 74.50, 74.95));
    m.style.transform = `translateY(${lerp(22, 0, x)}px)`;
  }
  linesIn($('b7h'),   t, 74.90, .20, .70, 30);  // VO 20 @ 74.7
  linesIn($('b7url'), t, 78.60, .20, .70, 24);  // VO 21 @ 78.7
}

/* expose for the frame grabber + allow live preview in a browser */
window.render = render;
window.FILM = { FPS, DURATION, FRAMES: Math.round(FPS * DURATION) };
if (!window.__GRAB__) {
  const t0 = performance.now();
  (function loop() {
    render(((performance.now() - t0) / 1000) % DURATION);
    requestAnimationFrame(loop);
  })();
}
