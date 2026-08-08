const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER_LOG:', msg.text()));
  
  await page.goto('http://localhost:3000');
  await page.waitForTimeout(2000);
  
  await browser.close();
})();
