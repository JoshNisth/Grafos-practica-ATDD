const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const assert = require('assert');

// Función auxiliar para pausas
const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

// Configuración para entornos CI/CD (como GitHub Actions)
const opts = new chrome.Options();
if (process.env.CI) {
  opts.addArguments('--headless', '--no-sandbox', '--disable-dev-shm-usage');
}
const svc = process.env.CI
  ? new chrome.ServiceBuilder('/usr/bin/chromedriver') // ruta común en CI Linux
  : new chrome.ServiceBuilder();

(async function pruebaNorthwest() {
  const driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(opts)
    .setChromeService(svc)
    .build();

  try {
    /* Paso 1 – Abrir la página */
    await driver.get('https://joshnisth.github.io/Grafos-practica-ATDD/docs/nortwestGrafo.html');
    await driver.manage().setTimeouts({ implicit: 5000 });
    await sleep(1000);

    /* Paso 2 – Ingresar filas y columnas */
    const filas = await driver.findElement(By.id('filas'));
    const columnas = await driver.findElement(By.id('columnas'));
    const btnGenerar = await driver.findElement(By.id('generarMatriz'));
    await filas.clear();
    await filas.sendKeys('3');
    await columnas.clear();
    await columnas.sendKeys('3');
    await sleep(500);
    await btnGenerar.click();
    await sleep(1000);

    /* Paso 3 – Verificar que se genera la matriz */
    const contenedor = await driver.wait(until.elementLocated(By.id('matrizInputs')), 3000);
    assert.ok(await contenedor.isDisplayed(), 'No se muestra el contenedor de la matriz');
    const inputs = await contenedor.findElements(By.css('input[type="number"]'));
    assert.ok(inputs.length >= 9, `Se esperaban al menos 9 inputs, se encontraron ${inputs.length}`);
    await sleep(1000);

    /* Paso 4 – Llenar la matriz con valores del 1 al 9 */
    for (let i = 0; i < inputs.length; i++) {
      await inputs[i].clear();
      await inputs[i].sendKeys((i + 1).toString());
      await sleep(1000);
    }

    /* Paso 5 – Clic en "Maximizar" */
    const btnMaximizar = await driver.findElement(By.id('maximizar'));
    //par a minimizar:const btnMaximizar = await driver.findElement(By.id('minimizar'));
    await btnMaximizar.click();
    await sleep(1000);

    /* Paso 6 – Verificar resultado generado */
    const matrizResultado = await driver.findElement(By.id('matriz'));
    assert.ok(await matrizResultado.isDisplayed(), 'No se muestra el resultado en #matriz');
    const resultadoTexto = await matrizResultado.getText();
    assert.ok(resultadoTexto.length > 0, 'El resultado está vacío tras maximizar');
    console.log('Prueba completa ejecutada correctamente.');
    if (!process.env.CI) await sleep(10000); 

  } catch (error) {
    console.error('Error en la prueba:', error);
    if (!process.env.CI) await sleep(1000); 
  } finally {
    await driver.quit();
  }
})();
