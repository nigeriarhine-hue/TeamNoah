// Renders the three Noah UI screenshots from noah-ui-source.html.
// Usage: npm i playwright && node render.js
const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1280, height: 1100 },
    deviceScaleFactor: 2,
  });
  await page.goto('file://' + path.join(__dirname, 'noah-ui-source.html'));
  await page.waitForTimeout(1200);
  for (const id of ['a', 'b', 'c']) {
    await page.locator('#' + id).screenshot({ path: path.join(__dirname, `noah-${id}.png`) });
    console.log('rendered', id);
  }
  await browser.close();
})();
