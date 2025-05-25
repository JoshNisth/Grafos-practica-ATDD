const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');

(async function pruebaGenerarMatriz() {
  let driver = await new Builder().forBrowser('chrome').build();

  try {
    // Paso 1 - Inicio: Abrir la página
    await driver.get('https://joshnisth.github.io/Grafos-practica-ATDD/docs/nortwestGrafo.html');
    await driver.manage().setTimeouts({ implicit: 5000 });

    // Paso 2 - Obtener elementos
    let inputFilas = await driver.findElement(By.id('filas'));
    let inputColumnas = await driver.findElement(By.id('columnas'));
    let botonGenerar = await driver.findElement(By.id('generarMatriz'));

    assert.ok(inputFilas, 'No se encontró el input de filas');
    assert.ok(inputColumnas, 'No se encontró el input de columnas');
    assert.ok(botonGenerar, 'No se encontró el botón de generar');

    // Paso 3 - Ingresar datos
    await inputFilas.clear();
    await inputFilas.sendKeys('3');
    await inputColumnas.clear();
    await inputColumnas.sendKeys('3');

    // Paso 4 - Click en generar matriz
    await botonGenerar.click();

    // Esperar que se genere el contenido
    let contenedor = await driver.wait(until.elementLocated(By.id('matrizInputs')), 3000);
    assert.ok(await contenedor.isDisplayed(), 'El contenedor de la matriz no se muestra');

    // Paso 5 - Verificar cantidad de inputs generados (mínimo 9)
    let inputs = await contenedor.findElements(By.css('input[type="number"]'));
    assert.ok(inputs.length >= 9, `Se esperaban al menos 9 inputs, pero se encontraron ${inputs.length}`);

    // Paso 6 - Verificar que cada input sea de tipo number
    for (let input of inputs) {
      let tipo = await input.getAttribute('type');
      assert.strictEqual(tipo, 'number', 'El input no es de tipo number');
    }

    console.log('✅ Prueba ATDD completada exitosamente.');
  } catch (error) {
    console.error('❌ Error en la prueba:', error.message);
  } finally {
    await driver.quit();
  }
})();
