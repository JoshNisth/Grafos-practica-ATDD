const { Builder, By, until, Key } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

(async function pruebaChrome137() {
  // Si Chrome.exe no está en tu PATH, descomenta y ajusta esta línea:
  // const options = new chrome.Options().setChromeBinaryPath('C:/chrome-for-testing/137/chrome/chrome.exe');
  const driver = await new Builder()
    .forBrowser('chrome')
    // .setChromeOptions(options)
    .build();

  try {
    await driver.get('https://www.google.com');
    const caja = await driver.wait(until.elementLocated(By.name('q')), 5000);
    await caja.sendKeys('Hola Selenium', Key.RETURN);
    await driver.wait(until.titleContains('Hola Selenium'), 5000);
  } finally {
    await driver.quit();
  }
})();
