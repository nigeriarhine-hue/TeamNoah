/**
 * Windows -> Mac product-text replacements, approved for all 12 rows of
 * MAC-TEXT-REPLACEMENTS.md.
 *
 * These are Remotion overlays positioned in the SOURCE screenshot's own pixel
 * space; the underlying captures are never edited, so the originals stay intact
 * and auditable. Cover colours and glyph colours were sampled from the
 * screenshots themselves (scripts/sample.mjs, scripts/textcolor.mjs) so a patch
 * sits flush with the surrounding panel.
 */
export type TextPatch = {
  /** cover box in source-image pixels */
  x: number;
  y: number;
  w: number;
  h: number;
  /** colour painted over the original string */
  bg: string;
  /** replacement string */
  text: string;
  /** font size in source-image pixels */
  size: number;
  weight: number;
  color: string;
  letterSpacing?: string;
  /** left inset so the glyphs start where the originals did */
  inset?: number;
};

const PANEL = '#1d2127';
const TILE_02 = '#22262e';
const TILE_03 = '#23252e';
const BUBBLE_01 = '#363849';
const BUBBLE_03 = '#363848';
const CHROME = '#221e20';

/**
 * Covers the Windows minimise / maximise / close buttons in the title bar.
 * macOS puts traffic lights at the top LEFT, so the Windows chrome cannot be
 * fixed by substituting text -- it is painted out instead. Listed as item D of
 * MAC-TEXT-REPLACEMENTS.md, option 1 (crop / cover).
 */
const chromeCover = (w: number): TextPatch => ({
  x: 0, y: 0, w, h: 36, bg: CHROME, text: '', size: 1, weight: 400, color: CHROME,
});

// 01 — problem screen (1170x985)
export const PATCHES_01: TextPatch[] = [
  chromeCover(1170),
  // row 1: My PC feels slow -> My Mac feels slow
  {x: 948, y: 62, w: 180, h: 40, bg: BUBBLE_01, inset: 7,
   text: 'My Mac feels slow', size: 22, weight: 600, color: '#eaf0f8'},
  // row 7: temp files -> cache files
  {x: 427, y: 181, w: 534, h: 28, bg: PANEL, inset: 2,
   text: 'Measure the common large disk consumers (Downloads, cache files,…',
   size: 17, weight: 600, color: '#cdccda'},
  // row 9: Temp, and AppData -> Caches, and Library
  {x: 427, y: 257, w: 534, h: 28, bg: PANEL, inset: 2,
   text: 'Accurately measure Downloads, Caches, and Library sizes to find w…',
   size: 17, weight: 600, color: '#cdccda'},
  {x: 427, y: 296, w: 544, h: 28, bg: PANEL, inset: 2,
   text: 'Accurately measure Downloads, Caches, and Library sizes using Whe…',
   size: 17, weight: 600, color: '#cdccda'},
];

// 02 — diagnosis screen (1170x979)
export const PATCHES_02: TextPatch[] = [
  chromeCover(1170),
  // row 5: Your PC ... at every startup -> Your Mac ... at every login
  {x: 398, y: 155, w: 618, h: 37, bg: PANEL, inset: 3,
   text: 'Your Mac is loading seven programs at every login plus a busy',
   size: 21, weight: 500, color: '#f2f4f8'},
  // row 2: STARTUP ITEMS -> LOGIN ITEMS
  {x: 421, y: 343, w: 148, h: 20, bg: TILE_02, inset: 3,
   text: 'LOGIN ITEMS', size: 12, weight: 700, color: '#878c94', letterSpacing: '0.09em'},
  // row 3: C: DRIVE FREE -> STORAGE FREE
  {x: 595, y: 343, w: 152, h: 20, bg: TILE_02, inset: 3,
   text: 'STORAGE FREE', size: 12, weight: 700, color: '#878c94', letterSpacing: '0.09em'},
  // row 12: Xbox -> Slack
  {x: 940, y: 393, w: 142, h: 22, bg: TILE_02, inset: 3,
   text: 'Slack, Avid, Teams, E…', size: 12.5, weight: 500, color: '#82868c'},
  // row 6: at boot -> at login
  {x: 445, y: 501, w: 444, h: 31, bg: PANEL, inset: 2,
   text: 'Stop 3 heavy apps from auto-launching at login',
   size: 19, weight: 700, color: '#f5f6fa'},
  // row 12: Edge autolaunch -> Chrome autolaunch
  {x: 445, y: 531, w: 432, h: 26, bg: PANEL, inset: 2,
   text: 'Battle.net, Avid Link, Chrome autolaunch — reversible anytime',
   size: 14.5, weight: 500, color: '#7a848c'},
  // row 4: Teams at boot -> Teams at login
  {x: 445, y: 566, w: 364, h: 31, bg: PANEL, inset: 2,
   text: 'Stop Teams from auto-starting at login',
   size: 19, weight: 700, color: '#f5f6fa'},
  // row 7: temp files -> cache files
  {x: 445, y: 631, w: 286, h: 31, bg: PANEL, inset: 2,
   text: 'Clear cache files to free space',
   size: 19, weight: 700, color: '#f5f6fa'},
  // row 8: temp cache -> cache
  {x: 445, y: 660, w: 204, h: 26, bg: PANEL, inset: 2,
   text: 'Safe, ~0.5 GB cache', size: 14.5, weight: 500, color: '#7a848c'},
];

// 03 — approval / action screen (1170x985); this view is dimmed, so the
// sampled colours here are darker than their 02 equivalents.
export const PATCHES_03: TextPatch[] = [
  chromeCover(1170),
  {x: 421, y: 88, w: 148, h: 20, bg: TILE_03, inset: 3,
   text: 'LOGIN ITEMS', size: 12, weight: 700, color: '#7a7e84', letterSpacing: '0.09em'},
  {x: 595, y: 88, w: 152, h: 20, bg: TILE_03, inset: 3,
   text: 'STORAGE FREE', size: 12, weight: 700, color: '#7a7e84', letterSpacing: '0.09em'},
  {x: 940, y: 141, w: 142, h: 22, bg: TILE_03, inset: 3,
   text: 'Slack, Avid, Teams, E…', size: 12.5, weight: 500, color: '#68767a'},
  {x: 445, y: 246, w: 444, h: 31, bg: PANEL, inset: 2,
   text: 'Stop 3 heavy apps from auto-launching at login',
   size: 19, weight: 700, color: '#f5f6fa'},
  {x: 445, y: 276, w: 432, h: 26, bg: PANEL, inset: 2,
   text: 'Battle.net, Avid Link, Chrome autolaunch — reversible anytime',
   size: 14.5, weight: 500, color: '#78838f'},
  {x: 445, y: 311, w: 364, h: 31, bg: PANEL, inset: 2,
   text: 'Stop Teams from auto-starting at login',
   size: 19, weight: 700, color: '#f5f6fa'},
  {x: 445, y: 376, w: 286, h: 31, bg: PANEL, inset: 2,
   text: 'Clear cache files to free space',
   size: 19, weight: 700, color: '#f5f6fa'},
  {x: 445, y: 405, w: 204, h: 26, bg: PANEL, inset: 2,
   text: 'Safe, ~0.5 GB cache', size: 14.5, weight: 500, color: '#78838f'},
  // row 11: the user-typed line
  {x: 643, y: 621, w: 472, h: 33, bg: BUBBLE_03, inset: 4,
   text: 'stop teams from auto starting and clear cache files',
   size: 19, weight: 500, color: '#f2f4f8'},
  // row 10: startup program -> login item
  {x: 427, y: 823, w: 314, h: 31, bg: PANEL, inset: 2,
   text: 'Turning off a login item — Teams',
   size: 17, weight: 600, color: '#bcbac6'},
];
