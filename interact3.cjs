const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3000');
  await new Promise(r => setTimeout(r, 2000));
  
  const buttons = await page.$$('button');
  if (buttons.length > 8) {
    const text = await page.evaluate(el => el.innerText || el.textContent || el.className, buttons[8]);
    const html = await page.evaluate(el => el.outerHTML, buttons[8]);
    console.log('BUTTON 8 is:', text);
    console.log('HTML is:', html);
  }
  
  await browser.close();
})();
