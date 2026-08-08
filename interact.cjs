const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  page.on('console', msg => {
    if (msg.text().includes('same key')) {
      console.log('ERROR FOUND:', msg.text());
      console.log('ARGS:', msg.args().map(a => a.toString()));
    }
  });
  
  await page.goto('http://localhost:3000');
  await new Promise(r => setTimeout(r, 2000));
  
  const buttons = await page.$$('button');
  for (const btn of buttons) {
    try {
      await btn.click();
      await new Promise(r => setTimeout(r, 500));
    } catch(e) {}
  }
  
  await browser.close();
})();
