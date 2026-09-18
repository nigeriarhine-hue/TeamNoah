/**
 * Noah UI source of truth for this ad.
 *
 * The four screens below are built in code from the canonical brand system
 * (cream ground, warm ink, 12px radii, low shadows, aurora on the primary
 * action only, teal confirms, amber cautions) and they only ever show product
 * behaviour Noah actually has: describe the symptom → diagnose the real cause →
 * show the exact change → wait for approval → run it → report what changed,
 * logged and reversible.
 *
 * If you have real captures of the macOS app, drop them in `public/noah-ui/`
 * and name them here. A named file wins over the coded screen with no other
 * change — the composition, timings and push-ins all stay as they are.
 *
 * Captures must be 4:4.5-ish portrait (the window is drawn 960x1050) and
 * taken on a Retina display so the type survives the push-in.
 */
export type NoahScreenId = 'diagnosis' | 'approval' | 'action' | 'result';

export const NOAH_UI_SCREENSHOTS: Partial<Record<NoahScreenId, string>> = {
  // diagnosis: 'noah-ui/diagnosis@2x.png',
  // approval:  'noah-ui/approval@2x.png',
  // action:    'noah-ui/action@2x.png',
  // result:    'noah-ui/result@2x.png',
};
