const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  page.on('pageerror', error => console.log('BROWSER ERROR:', error.message));
  page.on('requestfailed', request => console.log('REQUEST FAILED:', request.url(), request.failure().errorText));

  await page.goto('file:///c:/Users/User/Documents/New%20project/index.html', { waitUntil: 'networkidle' });
  
  await page.screenshot({ path: 'screenshot.png' });
  await browser.close();
})();
