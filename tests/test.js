const { Builder, By, until, Key } = require('selenium-webdriver');
(async function prueba() {
  let driver = await new Builder().forBrowser('chrome').build();
  try {
    // Apunta a tu GitHub Pages:
    await driver.get('https://joshnisth.github.io/Grafos-practica-ATDD/docs/index.html');
    const caja = await driver.wait(until.elementLocated(By.name('q')), 5000);
    // ...ajusta los selectores a tu página
  } finally {
    await driver.quit();
  }
})();
