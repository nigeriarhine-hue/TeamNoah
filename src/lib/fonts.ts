import { continueRender, delayRender, staticFile } from "remotion";

export const BRAND_SANS = "Plus Jakarta Sans";
export const BRAND_SERIF = "Instrument Serif";

let injected = false;

/**
 * Registers the Noah brand faces (extracted from brand-kit.html into
 * public/fonts) and blocks rendering until they are actually usable, so frames
 * never flash a fallback face.
 */
export function useBrandFonts(): void {
  if (typeof document === "undefined") return;

  if (!injected) {
    injected = true;
    const style = document.createElement("style");
    style.textContent = `
      @font-face {
        font-family: "${BRAND_SANS}";
        src: url("${staticFile("fonts/plus-jakarta-sans.woff2")}") format("woff2");
        font-weight: 100 900;
        font-style: normal;
        font-display: block;
      }
      @font-face {
        font-family: "${BRAND_SERIF}";
        src: url("${staticFile("fonts/instrument-serif.woff2")}") format("woff2");
        font-weight: 400;
        font-style: normal;
        font-display: block;
      }
    `;
    document.head.appendChild(style);

    const handle = delayRender("Loading Noah brand fonts");
    Promise.all([
      document.fonts.load(`800 64px "${BRAND_SANS}"`),
      document.fonts.load(`500 32px "${BRAND_SANS}"`),
      document.fonts.load(`400 64px "${BRAND_SERIF}"`),
    ])
      .then(() => continueRender(handle))
      .catch(() => continueRender(handle));
  }
}

export const SANS_STACK = `"${BRAND_SANS}", "Inter", "Helvetica Neue", Arial, sans-serif`;
