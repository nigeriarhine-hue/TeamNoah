import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import path from 'node:path';

const OUT = path.resolve('screens');
const b = await chromium.launch();
const p = await b.newPage({ viewport:{width:1300,height:1100}, deviceScaleFactor:2 });
await p.goto('file://' + path.resolve('noah-screens.html'));
await p.waitForFunction(() => document.fonts.status === 'loaded');
await p.waitForTimeout(400);

// sanity: confirm the brand face actually rendered, not a fallback
const font = await p.evaluate(() => {
  const el = document.querySelector('.sit');
  return { used: getComputedStyle(el).fontFamily,
           jakarta: document.fonts.check("700 19px 'Plus Jakarta Sans'") };
});
console.log('font ->', JSON.stringify(font));

const names = { s1:'01-looking-into-it', s2:'02-the-plan', s3:'03-can-noah-do-this', s4:'04-done' };
for (const [id, name] of Object.entries(names)) {
  const el = await p.$('#' + id);
  await el.screenshot({ path: `${OUT}/${name}.png` });
  console.log('shot', name);
}
await b.close();
