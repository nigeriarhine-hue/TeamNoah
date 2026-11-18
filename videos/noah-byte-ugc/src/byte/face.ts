// Byte's face is a glowing screen inside a glossy visor. Everything expressive
// (eyes, lids, brows, mouth, blush) is drawn here onto a canvas texture.

export type Expr = {
  browL: number; // brow tilt, + = inner end raised (worried/sad), - = inner end lowered (angry/frustrated)
  browR: number;
  browY: number; // brow height, + = raised (surprise)
  lidTopL: number; // 0 open .. 1 closed
  lidTopR: number;
  lidTilt: number; // + = outer-down/inner-up(sad), - = inner-down (annoyed)
  lidBottom: number; // 0..1 happy squint from below
  pupilX: number; // -1..1 (screen-space, + = right of frame)
  pupilY: number; // -1..1 (+ = up)
  eyeScale: number; // 1 = normal
  pupilScale: number;
  mouthSmile: number; // -1 frown .. 1 big smile
  mouthW: number; // width multiplier
  mouthOpen: number; // 0..1.2 (driven by audio)
  mouthSkew: number; // -1..1 lopsided smirk
  blush: number; // 0..1
};

export const EXPR: Record<string, Expr> = {
  neutral: { browL: 0, browR: 0, browY: 0, lidTopL: 0.12, lidTopR: 0.12, lidTilt: 0, lidBottom: 0, pupilX: 0, pupilY: 0, eyeScale: 1, pupilScale: 1, mouthSmile: 0.25, mouthW: 1, mouthOpen: 0, mouthSkew: 0, blush: 0.15 },
  frustrated: { browL: -0.45, browR: -0.45, browY: -0.35, lidTopL: 0.38, lidTopR: 0.38, lidTilt: -0.35, lidBottom: 0.1, pupilX: 0, pupilY: 0, eyeScale: 0.97, pupilScale: 0.9, mouthSmile: -0.55, mouthW: 1.05, mouthOpen: 0, mouthSkew: 0.25, blush: 0 },
  exasperated: { browL: 0.5, browR: 0.5, browY: 0.45, lidTopL: 0.2, lidTopR: 0.2, lidTilt: 0.25, lidBottom: 0, pupilX: 0, pupilY: 0.35, eyeScale: 1.05, pupilScale: 0.85, mouthSmile: -0.3, mouthW: 1.1, mouthOpen: 0, mouthSkew: 0, blush: 0 },
  confused: { browL: 0.55, browR: -0.35, browY: 0.15, lidTopL: 0.05, lidTopR: 0.42, lidTilt: 0, lidBottom: 0, pupilX: 0, pupilY: 0, eyeScale: 1.04, pupilScale: 0.8, mouthSmile: -0.25, mouthW: 0.75, mouthOpen: 0, mouthSkew: -0.7, blush: 0 },
  curious: { browL: 0.3, browR: 0.3, browY: 0.35, lidTopL: 0.02, lidTopR: 0.02, lidTilt: 0, lidBottom: 0, pupilX: 0, pupilY: 0, eyeScale: 1.1, pupilScale: 1.12, mouthSmile: 0.35, mouthW: 0.85, mouthOpen: 0, mouthSkew: 0, blush: 0.2 },
  excited: { browL: 0.25, browR: 0.25, browY: 0.5, lidTopL: 0, lidTopR: 0, lidTilt: 0, lidBottom: 0.15, pupilX: 0, pupilY: 0, eyeScale: 1.12, pupilScale: 1.2, mouthSmile: 0.9, mouthW: 1.15, mouthOpen: 0, mouthSkew: 0, blush: 0.55 },
  smug: { browL: -0.1, browR: 0.35, browY: 0.1, lidTopL: 0.35, lidTopR: 0.3, lidTilt: 0, lidBottom: 0.25, pupilX: 0, pupilY: 0, eyeScale: 1, pupilScale: 1, mouthSmile: 0.6, mouthW: 1, mouthOpen: 0, mouthSkew: 0.55, blush: 0.3 },
  happy: { browL: 0.15, browR: 0.15, browY: 0.3, lidTopL: 0, lidTopR: 0, lidTilt: 0, lidBottom: 0.55, pupilX: 0, pupilY: 0, eyeScale: 1.05, pupilScale: 1.1, mouthSmile: 1, mouthW: 1.2, mouthOpen: 0, mouthSkew: 0, blush: 0.8 },
  sincere: { browL: 0.3, browR: 0.3, browY: 0.15, lidTopL: 0.1, lidTopR: 0.1, lidTilt: 0.12, lidBottom: 0.2, pupilX: 0, pupilY: 0, eyeScale: 1.04, pupilScale: 1.15, mouthSmile: 0.45, mouthW: 0.95, mouthOpen: 0, mouthSkew: 0, blush: 0.4 },
  shocked: { browL: 0.3, browR: 0.3, browY: 0.85, lidTopL: 0, lidTopR: 0, lidTilt: 0, lidBottom: 0, pupilX: 0, pupilY: 0, eyeScale: 1.2, pupilScale: 0.6, mouthSmile: -0.1, mouthW: 0.7, mouthOpen: 0.6, mouthSkew: 0, blush: 0 },
};

export const lerpExpr = (a: Expr, b: Expr, t: number): Expr => {
  const o = {} as Expr;
  (Object.keys(a) as (keyof Expr)[]).forEach((k) => {
    o[k] = a[k] + (b[k] - a[k]) * t;
  });
  return o;
};

export const FACE_W = 1024;
export const FACE_H = 560;

const BG = "#070a1f";

const drawEye = (
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  side: -1 | 1, // -1 = frame-left eye
  e: Expr,
) => {
  const rx = 98 * e.eyeScale;
  const ry = 124 * e.eyeScale;
  const lidTop = side < 0 ? e.lidTopL : e.lidTopR;
  ctx.save();
  // eye shape clip
  ctx.beginPath();
  ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
  ctx.clip();
  // sclera: luminous cool white
  const g = ctx.createRadialGradient(cx - rx * 0.25, cy - ry * 0.35, 10, cx, cy, ry * 1.1);
  g.addColorStop(0, "#ffffff");
  g.addColorStop(0.55, "#e6f6ff");
  g.addColorStop(1, "#9fd2ff");
  ctx.fillStyle = g;
  ctx.fillRect(cx - rx, cy - ry, rx * 2, ry * 2);
  // iris + pupil
  const px = cx + e.pupilX * rx * 0.36;
  const py = cy - e.pupilY * ry * 0.3 + 8;
  const ir = 64 * e.pupilScale;
  const ig = ctx.createRadialGradient(px, py + ir * 0.35, ir * 0.1, px, py, ir);
  ig.addColorStop(0, "#9b7bff");
  ig.addColorStop(0.55, "#5b5ef5");
  ig.addColorStop(1, "#2a2f9e");
  ctx.fillStyle = ig;
  ctx.beginPath();
  ctx.arc(px, py, ir, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#0b0d2b";
  ctx.beginPath();
  ctx.arc(px, py, ir * 0.55, 0, Math.PI * 2);
  ctx.fill();
  // catch-lights (sell the "glossy cartoon eye")
  ctx.fillStyle = "rgba(255,255,255,0.95)";
  ctx.beginPath();
  ctx.ellipse(px - ir * 0.35, py - ir * 0.4, ir * 0.24, ir * 0.2, -0.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(px + ir * 0.3, py + ir * 0.32, ir * 0.1, 0, Math.PI * 2);
  ctx.fill();

  // top lid (tilted). tilt sign mirrored so "inner" means toward face centre
  ctx.fillStyle = BG;
  const lidY = cy - ry + lidTop * ry * 2.05;
  const tilt = e.lidTilt * side; // inner corner for left eye is on the right
  ctx.beginPath();
  ctx.moveTo(cx - rx - 20, cy - ry - 400);
  ctx.lineTo(cx + rx + 20, cy - ry - 400);
  ctx.lineTo(cx + rx + 20, lidY - tilt * rx * 0.9);
  ctx.quadraticCurveTo(cx, lidY + 18 * (1 - lidTop), cx - rx - 20, lidY + tilt * rx * 0.9);
  ctx.closePath();
  ctx.fill();
  // lid edge glow line
  if (lidTop > 0.04) {
    ctx.strokeStyle = "rgba(170,200,255,0.55)";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(cx + rx + 20, lidY - tilt * rx * 0.9);
    ctx.quadraticCurveTo(cx, lidY + 18 * (1 - lidTop), cx - rx - 20, lidY + tilt * rx * 0.9);
    ctx.stroke();
  }
  // bottom lid (happy squint = upward arc)
  if (e.lidBottom > 0.01) {
    const by = cy + ry - e.lidBottom * ry * 1.1;
    ctx.fillStyle = BG;
    ctx.beginPath();
    ctx.moveTo(cx - rx - 20, cy + ry + 300);
    ctx.lineTo(cx - rx - 20, by + 40);
    ctx.quadraticCurveTo(cx, by - 70 * e.lidBottom, cx + rx + 20, by + 40);
    ctx.lineTo(cx + rx + 20, cy + ry + 300);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
};

export const drawFace = (canvas: HTMLCanvasElement, e: Expr) => {
  const ctx = canvas.getContext("2d")!;
  const W = FACE_W;
  const H = FACE_H;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = BG;
  ctx.fillRect(0, 0, W, H);
  // faint screen vignette
  const vg = ctx.createRadialGradient(W / 2, H * 0.45, 40, W / 2, H / 2, W * 0.6);
  vg.addColorStop(0, "rgba(60,70,170,0.28)");
  vg.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = vg;
  ctx.fillRect(0, 0, W, H);

  const eyeY = 250;
  const eyeDX = 178;

  // eyes rendered with soft glow via an offscreen layer
  const off = document.createElement("canvas");
  off.width = W;
  off.height = H;
  const o = off.getContext("2d")!;
  o.fillStyle = BG;
  o.fillRect(0, 0, W, H);
  drawEye(o, W / 2 - eyeDX, eyeY, -1, e);
  drawEye(o, W / 2 + eyeDX, eyeY, 1, e);
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.filter = "blur(14px)";
  ctx.globalAlpha = 0.45;
  ctx.drawImage(off, 0, 0);
  ctx.restore();
  ctx.drawImage(off, 0, 0);

  // blush
  if (e.blush > 0.01) {
    for (const s of [-1, 1]) {
      const bx = W / 2 + s * (eyeDX + 70);
      const by = eyeY + 150;
      const bg = ctx.createRadialGradient(bx, by, 4, bx, by, 70);
      bg.addColorStop(0, `rgba(255,120,190,${0.55 * e.blush})`);
      bg.addColorStop(1, "rgba(255,120,190,0)");
      ctx.fillStyle = bg;
      ctx.beginPath();
      ctx.ellipse(bx, by, 80, 45, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // brows: thick rounded light bars
  ctx.save();
  ctx.strokeStyle = "#cfe6ff";
  ctx.lineCap = "round";
  ctx.lineWidth = 30;
  ctx.shadowColor = "rgba(150,200,255,0.9)";
  ctx.shadowBlur = 18;
  for (const s of [-1, 1] as const) {
    const tilt = s < 0 ? e.browL : e.browR;
    const bx = W / 2 + s * eyeDX;
    const by = eyeY - 124 * e.eyeScale - 46 - e.browY * 42 + (s < 0 ? e.lidTopL : e.lidTopR) * 30;
    const len = 76;
    // inner end is towards the centre (x direction -s)
    const innerX = bx - s * len;
    const outerX = bx + s * len;
    const innerY = by - tilt * 34;
    const outerY = by + tilt * 22;
    ctx.beginPath();
    ctx.moveTo(innerX, innerY);
    ctx.quadraticCurveTo(bx, by - 14 - Math.abs(tilt) * 6, outerX, outerY);
    ctx.stroke();
  }
  ctx.restore();

  // mouth
  const mx = W / 2 + e.mouthSkew * 22;
  const my = 468;
  const w = 92 * e.mouthW * (1 - Math.min(e.mouthOpen, 1) * 0.18);
  const open = Math.max(0, e.mouthOpen) * 62;
  const sm = e.mouthSmile * 28;
  const skew = e.mouthSkew * 16;
  const lY = my - sm - skew; // left corner
  const rY = my - sm + skew; // right corner
  ctx.save();
  ctx.shadowColor = "rgba(150,200,255,0.9)";
  ctx.shadowBlur = 16;
  if (open < 6) {
    ctx.strokeStyle = "#d9ecff";
    ctx.lineCap = "round";
    ctx.lineWidth = 20;
    ctx.beginPath();
    ctx.moveTo(mx - w, lY);
    ctx.quadraticCurveTo(mx, my + sm * 1.25 + open, mx + w, rY);
    ctx.stroke();
  } else {
    ctx.beginPath();
    ctx.moveTo(mx - w, lY);
    ctx.quadraticCurveTo(mx, my + sm * 0.55 - open * 0.25, mx + w, rY);
    ctx.quadraticCurveTo(mx, my + sm * 1.3 + open * 1.7, mx - w, lY);
    ctx.closePath();
    ctx.fillStyle = "#1a0f3d";
    ctx.fill();
    ctx.save();
    ctx.clip();
    // tongue
    ctx.fillStyle = "#ff7fb8";
    ctx.beginPath();
    ctx.ellipse(mx, my + sm * 1.1 + open * 1.35, w * 0.55, open * 0.55, 0, 0, Math.PI * 2);
    ctx.fill();
    // teeth strip on smiles
    if (e.mouthSmile > 0.3) {
      ctx.fillStyle = "rgba(235,245,255,0.95)";
      ctx.fillRect(mx - w, my - sm - 30, w * 2, 30 + open * 0.05);
    }
    ctx.restore();
    ctx.strokeStyle = "#d9ecff";
    ctx.lineWidth = 12;
    ctx.lineJoin = "round";
    ctx.stroke();
  }
  ctx.restore();

  // scanlines for a subtle "screen" read
  ctx.fillStyle = "rgba(0,0,0,0.10)";
  for (let y = 0; y < H; y += 6) ctx.fillRect(0, y, W, 2);
};
