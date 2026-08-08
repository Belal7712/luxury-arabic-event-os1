const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3000');
  await new Promise(r => setTimeout(r, 2000));
  
  // Inject script to monkey-patch React.createElement
  await page.evaluate(() => {
    // We cannot easily monkey patch React if it's imported, but we can hook into console.error
    const originalConsoleError = console.error;
    console.error = function(...args) {
      if (args[0] && typeof args[0] === 'string' && args[0].includes('same key')) {
        console.log('REACT_ERROR:', args[0], args[1]);
        // Let's print the stack trace!
        console.log('STACK:', new Error().stack);
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
