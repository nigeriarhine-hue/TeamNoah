import { continueRender, delayRender, staticFile } from "remotion";

// Noah Aurora light tokens — mirrors brand-kit.html (light is the marketing default).
// Aurora gradient is reserved for the one thing to do next; teal = confirmation; amber = warning.
export const C = {
  page: "#ECE8DF",
  page2: "#F4F0E6",
  page3: "#E0DCCF",
  surface: "#FFFFFF",
  surfaceAlt: "#FAF8F3",
  ink: "#2A251F",
  ink2: "rgba(60,50,40,.78)",
  mute: "rgba(60,50,40,.58)",
  line: "rgba(60,50,40,.10)",
  line2: "rgba(60,50,40,.16)",
  navy: "#1A1D61",
  blue: "#2563EB",
  indigo: "#4F46E5",
  violet: "#7C3AED",
  aurora: "linear-gradient(135deg,#2563EB 0%,#4F46E5 50%,#7C3AED 100%)",
  auroraSoft: "rgba(79,70,229,.08)",
  commit: "#0D9488",
  commitSoft: "rgba(13,148,136,.10)",
  amber: "#D97706",
  amberSoft: "rgba(217,119,6,.10)",
  shadow: "0 2px 4px rgba(15,23,41,.05), 0 24px 60px -24px rgba(15,23,41,.28)",
  cardShadow: "0 1px 2px rgba(15,23,41,.04), 0 8px 24px -12px rgba(15,23,41,.14)",
};

export const FONT = "'Plus Jakarta Sans', -apple-system, 'Segoe UI', sans-serif";
export const SERIF = "'Instrument Serif', Georgia, serif";

export const FPS = 30;
export const W = 1080;
export const H = 1920;

let fontsRequested = false;
export const ensureFonts = () => {
  if (fontsRequested || typeof document === "undefined") return;
  fontsRequested = true;
  const handle = delayRender("Loading brand fonts");
  const faces = [
    new FontFace("Plus Jakarta Sans", `url(${staticFile("fonts/PlusJakartaSans.woff2")}) format('woff2')`, {
      weight: "100 900",
    }),
    new FontFace("Instrument Serif", `url(${staticFile("fonts/InstrumentSerif.woff2")}) format('woff2')`, {
      style: "normal",
    }),
  ];
  Promise.all(faces.map((f) => f.load()))
    .then((loaded) => {
      loaded.forEach((f) => document.fonts.add(f));
      continueRender(handle);
    })
    .catch((err) => {
      console.error(err);
      continueRender(handle);
    });
};
