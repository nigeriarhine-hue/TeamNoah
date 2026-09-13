/**
 * Windows -> Mac terminology substitutions for the genuine Noah screenshots.
 *
 * The screenshots are NOT repainted. Each entry covers one text run with a
 * colour-matched rectangle and redraws the replacement in the Noah brand face,
 * so the original pixels survive underneath and any single substitution can be
 * switched off without re-exporting an image.
 *
 * Rects are in SOURCE pixels of the named screenshot. A whole text run is
 * always replaced (never a word spliced mid-string) so kerning stays even.
 *
 * Approved by the client 2026-09-13, including the six extensions beyond the
 * original list (boot -> login x4, Xbox -> Spotify, Next boot -> Next restart).
 */

export interface TextPatch {
  id: string;
  /** Verbatim original, kept for audit. */
  original: string;
  replacement: string;
  rect: { x: number; y: number; w: number; h: number };
  /** Cover fill, sampled from the screenshot behind the glyphs. */
  bg: string;
  fontSize: number;
  fontWeight: number;
  color: string;
  letterSpacing?: string;
  textTransform?: "uppercase" | "none";
  /** Vertical nudge of the redrawn text inside the rect. */
  offsetY?: number;
}

/** Screenshot natural sizes. */
export const SCREEN_SIZE = {
  "01-diagnosis-thinking": { w: 1170, h: 985 },
  "02-diagnosis": { w: 1170, h: 979 },
  "03-approval": { w: 1170, h: 985 },
  "04-action": { w: 1170, h: 985 },
  "05-result": { w: 1170, h: 970 },
} as const;

const LABEL = {
  fontSize: 13,
  fontWeight: 700,
  color: "#868C96",
  letterSpacing: "0.085em",
  textTransform: "uppercase" as const,
};

export const DIAGNOSIS_PATCHES: TextPatch[] = [
  {
    id: "diag-startup-items",
    original: "STARTUP ITEMS",
    replacement: "LOGIN ITEMS",
    rect: { x: 421, y: 342, w: 134, h: 21 },
    bg: "#22252A",
    ...LABEL,
  },
  {
    id: "diag-c-drive-free",
    original: "C: DRIVE FREE",
    replacement: "STORAGE FREE",
    rect: { x: 600, y: 342, w: 130, h: 21 },
    bg: "#22252A",
    ...LABEL,
  },
  {
    id: "diag-background-apps",
    original: "Xbox, Avid, Teams, E…",
    replacement: "Spotify, Avid, Teams…",
    rect: { x: 941, y: 395, w: 142, h: 19 },
    bg: "#22252C",
    fontSize: 12,
    fontWeight: 500,
    color: "#7E838C",
  },
  {
    id: "diag-item1-boot",
    original: "Stop 3 heavy apps from auto-launching at boot",
    replacement: "Stop 3 heavy apps from auto-launching at login",
    rect: { x: 443, y: 503, w: 436, h: 26 },
    bg: "#1E2126",
    fontSize: 17,
    fontWeight: 700,
    color: "#F0F1F4",
  },
  {
    id: "diag-item2-boot",
    original: "Stop Teams from auto-starting at boot",
    replacement: "Stop Teams from auto-starting at login",
    rect: { x: 443, y: 568, w: 356, h: 26 },
    bg: "#1D2025",
    fontSize: 17,
    fontWeight: 700,
    color: "#F0F1F4",
  },
];

/** The approval modal carries no Windows terminology — nothing is altered. */
export const APPROVAL_PATCHES: TextPatch[] = [];

export const ACTION_PATCHES: TextPatch[] = [
  {
    id: "action-startup-program",
    original: "Turning off a startup program — Teams",
    replacement: "Turning off a login item — Teams",
    rect: { x: 426, y: 824, w: 310, h: 27 },
    bg: "#1E2126",
    fontSize: 15,
    fontWeight: 600,
    color: "#C3C6CD",
  },
];

export const RESULT_PATCHES: TextPatch[] = [
  {
    id: "result-body-1",
    original:
      "Teams no longer launches at startup (it still opens fine on demand), and I",
    replacement:
      "Teams no longer launches at login (it still opens fine on demand), and I",
    rect: { x: 397, y: 404, w: 722, h: 30 },
    bg: "#1E2126",
    fontSize: 21,
    fontWeight: 500,
    color: "#E4E6E9",
  },
  {
    id: "result-body-2",
    original: "cleared ~450 MB of temp files. Next boot should feel a bit lighter.",
    replacement:
      "cleared ~450 MB of temp files. Next restart should feel a bit lighter.",
    rect: { x: 397, y: 441, w: 700, h: 30 },
    bg: "#1E2126",
    fontSize: 21,
    fontWeight: 500,
    color: "#E4E6E9",
  },
  {
    id: "result-teams-at-startup",
    original: "TEAMS AT STARTUP",
    replacement: "TEAMS AT LOGIN",
    rect: { x: 418, y: 554, w: 168, h: 21 },
    bg: "#21252E",
    ...LABEL,
  },
  {
    id: "result-still-on-at-boot",
    original: "STILL ON AT BOOT",
    replacement: "STILL ON AT LOGIN",
    rect: { x: 882, y: 554, w: 165, h: 21 },
    bg: "#22252C",
    ...LABEL,
  },
  {
    id: "result-noah-here-pc",
    original:
      "Noah's here whenever the PC needs attention again — unlimited help, all year",
    replacement:
      "Noah's here whenever the Mac needs attention again — unlimited help, all year",
    rect: { x: 369, y: 745, w: 748, h: 30 },
    bg: "#1A1E21",
    fontSize: 20,
    fontWeight: 500,
    color: "#E4E6E9",
  },
];

/** Every substitution in the video, for the audit log. */
export const ALL_PATCHES: TextPatch[] = [
  ...DIAGNOSIS_PATCHES,
  ...APPROVAL_PATCHES,
  ...ACTION_PATCHES,
  ...RESULT_PATCHES,
];
