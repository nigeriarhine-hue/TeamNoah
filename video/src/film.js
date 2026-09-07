/* Noah — "Mine has one app on it"
   Deterministic timeline. render(t) fully describes the frame at time t (seconds).
   No CSS transitions/animations anywhere, so frame N is always identical. */

const FPS = 30;
const DURATION = 76;

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

  /* beat envelopes */
  beat(B1, t,  0.0,  7.2);
  beat(B2, t,  7.0, 21.3);
  beat(B3, t, 21.1, 32.3);
  beat(B4, t, 32.1, 44.3);
  beat(B5, t, 44.1, 56.3);
  beat(B6, t, 56.1, 70.3);
  beat(B7, t, 70.1, DURATION);

  /* ============ B1 · HOOK ============ */
  linesIn($('b1k'), t, 0.55, .30, .70, 26);
  linesIn($('b1h'), t, 2.60, .22, .80, 46);

  /* ============ B2 · THE THEATER ============ */
  linesIn($('b2k'), t, 7.40, .26, .70, 26);

  // card lifts in
  {
    const x = eOut(p(t, 10.40, 11.10));
    const card = $('b2card');
    card.style.opacity = String(x);
    card.style.transform = `translateY(${lerp(34, 0, x)}px)`;
  }
  $('b2scan').style.opacity = String(p(t, 10.80, 11.20) * (1 - p(t, 14.30, 14.70)));

  // the count-up: 0 -> 1,847
  {
    const x = eOut(p(t, 11.20, 14.20));
    const n = Math.round(lerp(0, 1847, x));
    $('b2num').textContent = n.toLocaleString('en-US');
    $('b2num').style.opacity = String(p(t, 11.20, 11.50));
    $('b2lab').style.opacity = String(p(t, 11.60, 12.00));
    $('b2fill').style.transform = `scaleX(${x})`;
    $('b2bar').style.opacity = String(p(t, 11.10, 11.50));
  }

  // "Clean" button, cursor travel, click
  {
    const btn = $('b2btn'), cur = $('b2cur');
    btn.style.opacity = String(p(t, 14.60, 15.00));
    const move = eInOut(p(t, 15.00, 16.20));
    cur.style.left = `${lerp(760, 806, move)}px`;
    cur.style.top  = `${lerp(1290, 886, move)}px`;
    cur.style.opacity = String(p(t, 14.90, 15.30) * (1 - p(t, 16.90, 17.30)));
    const press = p(t, 16.20, 16.34) * (1 - p(t, 16.40, 16.58));   // quick squash
    btn.style.transform = `scale(${1 - .05 * press})`;
  }

  // the card drains away — nothing actually changed
  {
    const g = p(t, 16.70, 17.70);
    const card = $('b2card');
    card.style.opacity = String((1 - g) * Number(p(t, 10.40, 11.10) > 0 ? 1 : 0));
    card.style.transform = `translateY(${lerp(0, -22, eOut(g))}px)`;
    out($('b2k'), t, 16.70, 1.0);
  }

  linesIn($('b2still'), t, 18.00, .20, .70, 34);

  /* ============ B3 · THE TURN ============ */
  linesIn($('b3h'),  t, 21.35, .22, .80, 40);
  linesIn($('b3k'),  t, 24.20, .20, .66, 26);
  linesIn($('b3k2'), t, 28.60, .20, .66, 26);

  /* ============ B4 · NOAH ENTERS ============ */
  {
    // the mark draws itself: ring, then the load line overshooting the disc
    const ring = $('b4ring'), line = $('b4line'), tide = $('b4tide'), mark = $('b4mark');
    const C = 2 * Math.PI * 34, L = 88;
    const r = eInOut(p(t, 32.30, 33.60));
    ring.style.strokeDasharray = String(C);
    ring.style.strokeDashoffset = String(lerp(C, 0, r));
    const l = eOut(p(t, 33.30, 34.20));
    line.style.strokeDasharray = String(L);
    line.style.strokeDashoffset = String(lerp(L, 0, l));
    const w = eOut(p(t, 33.60, 34.60));
    tide.setAttribute('height', String(lerp(0.001, 20, w)));
    tide.setAttribute('y', String(lerp(94, 74, w)));
    mark.style.opacity = String(p(t, 32.25, 32.55));
  }
  linesIn($('b4h'),    t, 33.60, .18, .70, 32);
  linesIn($('b4k'),    t, 35.20, .18, .66, 26);
  {
    const x = eOut(p(t, 37.60, 38.20));
    const card = $('b4card');
    card.style.opacity = String(x);
    card.style.transform = `translateY(${lerp(26, 0, x)}px)`;
    // typed in plain English, with a blinking block caret
    const phrase = "my fan won't stop";
    const n = Math.floor(clamp01(p(t, 38.10, 40.30)) * phrase.length);
    const caret = (t < 40.5 || Math.floor(t * 2) % 2 === 0) ? '<span style="opacity:.45">▍</span>' : '';
    $('b4type').innerHTML = phrase.slice(0, n) + caret;
  }
  linesIn($('b4note'), t, 41.00, .18, .66, 24);

  /* ============ B5 · THE DIAGNOSIS ============ */
  linesIn($('b5k'), t, 44.35, .20, .66, 26);
  {
    // the three audited checks
    const kids = $('b5checks').querySelectorAll('.ln');
    const at = [46.00, 46.60, 47.20];
    kids.forEach((k, i) => {
      const x = eOut(p(t, at[i], at[i] + .55));
      k.style.opacity = String(x);
      k.style.transform = `translateX(${lerp(-18, 0, x)}px)`;
    });
  }
  {
    const x = eOut(p(t, 48.60, 49.30));
    $('b5rule').style.opacity = String(x);
    $('b5rule').style.transform = `scaleX(${x})`;
    $('b5rule').style.transformOrigin = 'left center';
  }
  linesIn($('b5cl'),    t, 48.90, .18, .55, 18);
  linesIn($('b5cause'), t, 49.30, .18, .70, 30);
  linesIn($('b5det'),   t, 50.50, .18, .66, 24);
  linesIn($('b5not'),   t, 51.80, .18, .66, 24);

  /* ============ B6 · THE APPROVAL (hero) ============ */
  linesIn($('b6k'), t, 56.35, .20, .66, 26);
  {
    const x = eOut(p(t, 57.60, 58.25));
    const card = $('b6card');
    card.style.opacity = String(x);
    card.style.transform = `translateY(${lerp(28, 0, x)}px)`;
  }
  linesIn($('b6plan'), t, 58.20, .55, .66, 22);
  {
    // the one primary action — the only place the aurora gradient appears
    const btn = $('b6btn');
    const x = eOutBack(p(t, 60.00, 60.75));
    btn.style.opacity = String(p(t, 60.00, 60.35));
    const press = p(t, 63.00, 63.16) * (1 - p(t, 63.22, 63.42));
    btn.style.transform = `translateY(${lerp(20, 0, x)}px) scale(${(0.985 + .015*x) - .035 * press})`;
  }
  // hero line holds, then hands over to the confirmation
  linesIn($('b6hero'), t, 60.40, .20, .72, 34);
  {
    const on = p(t, 63.55, 63.95);
    const chk = $('b6check');
    chk.style.opacity = String(on);
    const d = eOut(p(t, 63.75, 64.45));
    $('b6tick').style.strokeDasharray = '32';
    $('b6tick').style.strokeDashoffset = String(lerp(32, 0, d));
    $('b6done').style.opacity = String(on);
    linesIn($('b6done'), t, 63.75, .35, .60, 20);
  }

  /* ============ B7 · SIGN-OFF ============ */
  {
    const x = eOut(p(t, 70.35, 71.20));
    const m = $('b7mark');
    m.style.opacity = String(p(t, 70.35, 70.80));
    m.style.transform = `translateY(${lerp(22, 0, x)}px)`;
  }
  linesIn($('b7h'),   t, 70.90, .20, .70, 30);
  linesIn($('b7url'), t, 72.80, .20, .70, 24);
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
