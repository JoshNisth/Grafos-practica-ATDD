const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');

(async function pruebaCompleta() {
  let driver = await new Builder().forBrowser('chrome').build();

  try {
    // Paso 1 - Abrir la página
    await driver.get('https://joshnisth.github.io/Grafos-practica-ATDD/docs/nortwestGrafo.html');
    await driver.manage().setTimeouts({ implicit: 5000 });
    await driver.sleep(1000);

    // Paso 2 - Ingresar datos en filas y columnas
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

    // Paso 3 - Verificar la matriz generada
    const contenedor = await driver.wait(until.elementLocated(By.id('matrizInputs')), 3000);
    assert.ok(await contenedor.isDisplayed(), '❌ No se muestra la matriz generada');

    //Paso 4 - Llenar la matriz generada

    const inputs = await contenedor.findElements(By.css('input[type="number"]'));
    assert.ok(inputs.length >= 9, `❌ Se esperaban al menos 9 inputs, se encontraron ${inputs.length}`);
    await driver.sleep(1000);

    for (let i = 0; i < inputs.length; i++) {
      await inputs[i].clear();
      await inputs[i].sendKeys((i + 1).toString());
      await driver.sleep(200);
    }

    // Paso 5 - Clic en "Maximizar"
    const botonMaximizar = await driver.findElement(By.id('maximizar'));
    await botonMaximizar.click();
    await driver.sleep(2000);

    // Paso 6 - Verificar resultado tras maximizar
    const matrizResultado = await driver.findElement(By.id('matriz'));
    assert.ok(await matrizResultado.isDisplayed(), '❌ No se muestra el resultado en #matriz');

    const contenidoTexto = await matrizResultado.getText();
    assert.ok(contenidoTexto.length > 0, '❌ El contenido de la matriz está vacío tras maximizar');

    console.log('✅ Prueba extendida completada exitosamente.');
  } catch (error) {
    console.error('❌ Error en la prueba:', error.message);
  } finally {
    await driver.sleep(2000);
    await driver.quit();
  }
})();
