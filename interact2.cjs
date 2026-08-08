const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  let currentBtn = 0;
  page.on('console', msg => {
    if (msg.text().includes('same key')) {
      console.log('ERROR ON BUTTON:', currentBtn);
    }
  });
  
  await page.goto('http://localhost:3000');
  await new Promise(r => setTimeout(r, 2000));
  
  const buttons = await page.$$('button');
  for (let i = 0; i < buttons.length; i++) {
    currentBtn = i;
    try {
      await buttons[i].click();
      await new Promise(r => setTimeout(r, 500));
    } catch(e) {}
  }
  
  await browser.close();
})();
