const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  page.on('console', msg => {
    if (msg.text().includes('REACT_ERROR') || msg.text().includes('COMPONENT_STACK:')) {
      console.log(msg.text());
    }
  });
  
  await page.goto('http://localhost:3000');
  await new Promise(r => setTimeout(r, 2000));
  
  await page.evaluate(() => {
    const originalConsoleError = console.error;
    console.error = function(...args) {
      if (args[0] && typeof args[0] === 'string' && args[0].includes('same key')) {
        console.log('REACT_ERROR:', args[0], args[1]);
        if (args.length > 2) {
          console.log('COMPONENT_STACK:', args[2]);
        }
      }
      originalConsoleError.apply(console, args);
    };
  });
  
  const buttons = await page.$$('button');
  if (buttons.length > 8) {
    await buttons[8].click();
    await new Promise(r => setTimeout(r, 1000));
  }
  
  await browser.close();
})();
