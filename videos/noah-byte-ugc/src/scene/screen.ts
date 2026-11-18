// 2D canvas drawings used as textures: the monitor screen and the generic app icons.
// No third-party logos or recognisable app branding anywhere.

export type ScreenMode = "off" | "boot" | "busy" | "noah";

const rr = (c: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
  c.beginPath();
  (c as any).roundRect(x, y, w, h, r);
};

export const SCREEN_W = 1280;
export const SCREEN_H = 760;

export const drawScreen = (
  cv: HTMLCanvasElement,
  mode: ScreenMode,
  p: number, // progress within the mode, 0..1
  t: number, // seconds (for spinners)
  img?: HTMLImageElement | null,
) => {
  const c = cv.getContext("2d")!;
  const W = SCREEN_W, H = SCREEN_H;
  c.setTransform(1, 0, 0, 1, 0, 0);
  if (mode === "off") {
    const g = c.createLinearGradient(0, 0, W, H);
    g.addColorStop(0, "#0b0d18");
    g.addColorStop(1, "#141826");
    c.fillStyle = g;
    c.fillRect(0, 0, W, H);
    return;
  }
  if (mode === "boot") {
    c.fillStyle = "#06070d";
    c.fillRect(0, 0, W, H);
    // generic boot: soft glowing ring + spinner dots
    const a = Math.min(1, p * 3);
    c.globalAlpha = a;
    const cx = W / 2, cy = H / 2 - 20;
    const g = c.createRadialGradient(cx, cy, 10, cx, cy, 200);
    g.addColorStop(0, "rgba(120,140,255,0.35)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    c.fillStyle = g;
    c.fillRect(0, 0, W, H);
    for (let i = 0; i < 6; i++) {
      const ang = t * 5 + i * 0.5;
      c.fillStyle = `rgba(220,228,255,${0.25 + 0.12 * i})`;
      c.beginPath();
      c.arc(cx + Math.cos(ang) * 40, cy + 130 + Math.sin(ang) * 40, 7, 0, Math.PI * 2);
      c.fill();
    }
    c.globalAlpha = 1;
    return;
  }
  if (mode === "busy") {
    // generic wallpaper
    const g = c.createLinearGradient(0, 0, W, H);
    g.addColorStop(0, "#1d6f8f");
    g.addColorStop(0.5, "#3b4bb3");
    g.addColorStop(1, "#6a3aa8");
    c.fillStyle = g;
    c.fillRect(0, 0, W, H);
    c.globalAlpha = 0.25;
    c.fillStyle = "#fff";
    for (let i = 0; i < 3; i++) {
      c.beginPath();
      c.ellipse(W * (0.2 + i * 0.35), H * (0.75 - i * 0.12), 420, 120, -0.3, 0, Math.PI * 2);
      c.fill();
    }
    c.globalAlpha = 1;
    // desktop icon grid
    const cols = ["#f59e0b", "#10b981", "#ef4444", "#3b82f6", "#a855f7", "#14b8a6"];
    for (let i = 0; i < 6; i++) {
      c.fillStyle = cols[i];
      rr(c, 34, 30 + i * 96, 62, 62, 14);
      c.fill();
      c.fillStyle = "rgba(255,255,255,0.75)";
      c.fillRect(30, 98 + i * 96, 70, 8);
    }
    // windows piling up as background apps start
    const n = Math.floor(p * 6.99);
    for (let i = 0; i < n; i++) {
      const x = 170 + i * 120, y = 70 + i * 62;
      c.fillStyle = "rgba(0,0,0,0.25)";
      rr(c, x + 10, y + 14, 560, 340, 18);
      c.fill();
      c.fillStyle = "#f3f4f8";
      rr(c, x, y, 560, 340, 18);
      c.fill();
      c.fillStyle = ["#dfe3f3", "#e6dff6", "#dff0ea"][i % 3];
      rr(c, x, y, 560, 44, 18);
      c.fill();
      c.fillStyle = "#c4c8d8";
      for (let k = 0; k < 5; k++) c.fillRect(x + 30, y + 80 + k * 44, 380 - k * 40, 18);
    }
    // busy spinner in the middle
    const cx = W / 2 + 160, cy = H / 2 + 60;
    c.lineWidth = 16;
    c.lineCap = "round";
    c.strokeStyle = "rgba(255,255,255,0.25)";
    c.beginPath();
    c.arc(cx, cy, 52, 0, Math.PI * 2);
    c.stroke();
    c.strokeStyle = "#ffffff";
    c.beginPath();
    c.arc(cx, cy, 52, t * 7, t * 7 + 1.7);
    c.stroke();
    // taskbar
    c.fillStyle = "rgba(15,18,35,0.82)";
    c.fillRect(0, H - 64, W, 64);
    for (let i = 0; i < 9; i++) {
      c.fillStyle = i < 2 + n ? cols[i % 6] : "rgba(255,255,255,0.25)";
      rr(c, W / 2 - 270 + i * 60, H - 52, 40, 40, 10);
      c.fill();
    }
    return;
  }
  // genuine Noah UI screenshot, letterboxed onto the monitor
  c.fillStyle = "#16181f";
  c.fillRect(0, 0, W, H);
  if (img && img.complete && img.naturalWidth) {
    const s = Math.min(W / img.naturalWidth, H / img.naturalHeight);
    const w = img.naturalWidth * s, h = img.naturalHeight * s;
    c.drawImage(img, (W - w) / 2, (H - h) / 2, w, h);
  }
};

export type IconKind = "gear" | "chat" | "cloud" | "note" | "pad" | "folder" | "bell" | "down";
export const ICON_KINDS: IconKind[] = ["chat", "cloud", "note", "pad", "gear", "bell", "down", "folder"];
const ICON_COLORS: Record<IconKind, [string, string]> = {
  chat: ["#5b8cff", "#3b5bdb"],
  cloud: ["#7dd3fc", "#0ea5e9"],
  note: ["#f472b6", "#db2777"],
  pad: ["#34d399", "#059669"],
  gear: ["#a1a1aa", "#52525b"],
  bell: ["#fbbf24", "#d97706"],
  down: ["#a78bfa", "#7c3aed"],
  folder: ["#fcd34d", "#f59e0b"],
};

export const drawIcon = (cv: HTMLCanvasElement, kind: IconKind) => {
  const c = cv.getContext("2d")!;
  const S = cv.width;
  c.clearRect(0, 0, S, S);
  c.fillStyle = "rgba(0,0,0,0.25)";
  rr(c, S * 0.08, S * 0.11, S * 0.84, S * 0.84, S * 0.22);
  c.fill();
  const [a, b] = ICON_COLORS[kind];
  const g = c.createLinearGradient(0, 0, 0, S);
  g.addColorStop(0, a);
  g.addColorStop(1, b);
  c.fillStyle = g;
  rr(c, S * 0.06, S * 0.06, S * 0.84, S * 0.84, S * 0.22);
  c.fill();
  c.fillStyle = "#fff";
  c.strokeStyle = "#fff";
  c.lineWidth = S * 0.07;
  c.lineCap = "round";
  c.lineJoin = "round";
  const cx = S * 0.48, cy = S * 0.48, u = S * 0.2;
  c.beginPath();
  switch (kind) {
    case "chat":
      rr(c, cx - u * 1.2, cy - u * 0.9, u * 2.4, u * 1.6, u * 0.4);
      c.fill();
      c.beginPath();
      c.moveTo(cx - u * 0.6, cy + u * 0.6);
      c.lineTo(cx - u * 0.9, cy + u * 1.2);
      c.lineTo(cx, cy + u * 0.6);
      c.fill();
      break;
    case "cloud":
      c.arc(cx - u * 0.55, cy + u * 0.2, u * 0.6, 0, Math.PI * 2);
      c.arc(cx + u * 0.1, cy - u * 0.2, u * 0.8, 0, Math.PI * 2);
      c.arc(cx + u * 0.75, cy + u * 0.25, u * 0.55, 0, Math.PI * 2);
      c.fill();
      c.fillRect(cx - u * 0.55, cy + u * 0.2, u * 1.3, u * 0.6);
      break;
    case "note":
      c.arc(cx - u * 0.5, cy + u * 0.8, u * 0.45, 0, Math.PI * 2);
      c.arc(cx + u * 0.75, cy + u * 0.55, u * 0.45, 0, Math.PI * 2);
      c.fill();
      c.beginPath();
      c.moveTo(cx - u * 0.1, cy + u * 0.8);
      c.lineTo(cx - u * 0.1, cy - u * 1.0);
      c.lineTo(cx + u * 1.15, cy - u * 1.25);
      c.lineTo(cx + u * 1.15, cy + u * 0.55);
      c.stroke();
      break;
    case "pad":
      rr(c, cx - u * 1.3, cy - u * 0.6, u * 2.6, u * 1.3, u * 0.6);
      c.fill();
      c.fillStyle = b;
      c.fillRect(cx - u * 0.95, cy - u * 0.12, u * 0.6, u * 0.2);
      c.fillRect(cx - u * 0.75, cy - u * 0.32, u * 0.2, u * 0.6);
      c.beginPath();
      c.arc(cx + u * 0.6, cy - u * 0.15, u * 0.13, 0, Math.PI * 2);
      c.arc(cx + u * 0.9, cy + u * 0.15, u * 0.13, 0, Math.PI * 2);
      c.fill();
      break;
    case "gear":
      for (let i = 0; i < 8; i++) {
        const a2 = (i / 8) * Math.PI * 2;
        c.save();
        c.translate(cx, cy);
        c.rotate(a2);
        c.fillRect(-u * 0.22, -u * 1.25, u * 0.44, u * 0.5);
        c.restore();
      }
      c.beginPath();
      c.arc(cx, cy, u * 0.9, 0, Math.PI * 2);
      c.fill();
      c.fillStyle = b;
      c.beginPath();
      c.arc(cx, cy, u * 0.38, 0, Math.PI * 2);
      c.fill();
      break;
    case "bell":
      c.moveTo(cx - u, cy + u * 0.6);
      c.quadraticCurveTo(cx - u * 0.9, cy - u * 1.1, cx, cy - u * 1.1);
      c.quadraticCurveTo(cx + u * 0.9, cy - u * 1.1, cx + u, cy + u * 0.6);
      c.closePath();
      c.fill();
      c.beginPath();
      c.arc(cx, cy + u * 0.85, u * 0.28, 0, Math.PI * 2);
      c.fill();
      break;
    case "down":
      c.moveTo(cx, cy - u * 1.1);
      c.lineTo(cx, cy + u * 0.5);
      c.moveTo(cx - u * 0.7, cy - u * 0.1);
      c.lineTo(cx, cy + u * 0.6);
      c.lineTo(cx + u * 0.7, cy - u * 0.1);
      c.moveTo(cx - u, cy + u * 1.1);
      c.lineTo(cx + u, cy + u * 1.1);
      c.stroke();
      break;
    case "folder":
      rr(c, cx - u * 1.2, cy - u * 0.6, u * 2.4, u * 1.6, u * 0.25);
      c.fill();
      rr(c, cx - u * 1.2, cy - u * 0.95, u * 1.0, u * 0.6, u * 0.2);
      c.fill();
      break;
  }
  // notification badge: these apps all want attention
  c.fillStyle = "#ef4444";
  c.beginPath();
  c.arc(S * 0.84, S * 0.16, S * 0.13, 0, Math.PI * 2);
  c.fill();
  c.fillStyle = "#fff";
  c.font = `800 ${S * 0.16}px sans-serif`;
  c.textAlign = "center";
  c.textBaseline = "middle";
  c.fillText("!", S * 0.84, S * 0.165);
};
