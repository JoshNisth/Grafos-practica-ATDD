// tests/test.js
const { Builder, By, until, Key } = require('selenium-webdriver');

(async function pruebaGrafos() {
  // Crea el driver de Chrome
  let driver = await new Builder().forBrowser('chrome').build();
  try {
    // Abre tu página de GitHub Pages
    await driver.get('https://joshnisth.github.io/Grafos-practica-ATDD/docs/index.html');

    // Ejemplo: busca un elemento, aquí como si fuera un input con name="q"
    const caja = await driver.wait(until.elementLocated(By.name('q')), 5000);
    await caja.sendKeys('Test automático', Key.RETURN);

    // Espera a que el título cambie (o cualquier otra condición)
    await driver.wait(until.titleContains('Test automático'), 5000);
  } finally {
    // Cierra el navegador
    await driver.quit();
  }
})();
