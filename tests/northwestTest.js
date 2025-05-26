const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');

(async function pruebaCompleta() {
  let driver = await new Builder().forBrowser('chrome').build();

  try {
    // Paso 1 - Abrir la página
    await driver.get('https://joshnisth.github.io/Grafos-practica-ATDD/docs/nortwestGrafo.html');
    await driver.manage().setTimeouts({ implicit: 5000 });
    await driver.sleep(1000);

    // Paso 2 - Obtener e ingresar datos en campos de filas/columnas
    const inputFilas = await driver.findElement(By.id('filas'));
    const inputColumnas = await driver.findElement(By.id('columnas'));
    const botonGenerar = await driver.findElement(By.id('generarMatriz'));

    await inputFilas.clear();
    await inputFilas.sendKeys('3');
    await driver.sleep(500);

    await inputColumnas.clear();
    await inputColumnas.sendKeys('3');
    await driver.sleep(500);

    await botonGenerar.click();
    await driver.sleep(1000);

    // Paso 3 - Verificar y llenar la matriz generada
    const contenedor = await driver.wait(until.elementLocated(By.id('matrizInputs')), 3000);
    assert.ok(await contenedor.isDisplayed(), 'No se muestra la matriz generada');

    const inputs = await contenedor.findElements(By.css('input[type="number"]'));
    assert.ok(inputs.length >= 9, `Se esperaban al menos 9 inputs, se encontraron ${inputs.length}`);
    await driver.sleep(1000);

    // Insertar valores en los inputs
    for (let i = 0; i < inputs.length; i++) {
      await inputs[i].clear();
      await inputs[i].sendKeys((i + 1).toString()); // llena con 1, 2, ..., 9
      await driver.sleep(200);
    }

    // Paso 4 - Clic en "Maximizar"
    const botonMaximizar = await driver.findElement(By.id('maximizar'));
    await botonMaximizar.click();
    await driver.sleep(2000); // espera para ver el resultado

    console.log('✅ Prueba extendida completada exitosamente.');
  } catch (error) {
    console.error('❌ Error en la prueba:', error.message);
  } finally {
    await driver.sleep(2000); // pausa final
    await driver.quit();
  }
})();
