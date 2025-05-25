const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');

(async function pruebaGenerarMatriz() {
  let driver = await new Builder().forBrowser('chrome').build();

  try {
    // Paso 1 - Inicio: Abrir la página
    await driver.get('https://joshnisth.github.io/Grafos-practica-ATDD/docs/nortwestGrafo.html');
    await driver.manage().setTimeouts({ implicit: 5000 });
    await driver.sleep(1000); // Espera para que cargue visualmente

    // Paso 2 - Obtener elementos
    let inputFilas = await driver.findElement(By.id('filas'));
    let inputColumnas = await driver.findElement(By.id('columnas'));
    let botonGenerar = await driver.findElement(By.id('generarMatriz'));

    assert.ok(inputFilas, 'No se encontró el input de filas');
    assert.ok(inputColumnas, 'No se encontró el input de columnas');
    assert.ok(botonGenerar, 'No se encontró el botón de generar');
    await driver.sleep(1000);

    // Paso 3 - Ingresar datos
    await inputFilas.clear();
    await driver.sleep(500);
    await inputFilas.sendKeys('2');
    await driver.sleep(500);

    await inputColumnas.clear();
    await driver.sleep(500);
    await inputColumnas.sendKeys('2');
    await driver.sleep(1000);

    // Paso 4 - Click en generar matriz
    await botonGenerar.click();
    await driver.sleep(1000); // Esperar animación visual

    // Esperar que se genere el contenido
    let contenedor = await driver.wait(until.elementLocated(By.id('matrizInputs')), 3000);
    assert.ok(await contenedor.isDisplayed(), 'El contenedor de la matriz no se muestra');
    await driver.sleep(1000);

    // Paso 5 - Verificar cantidad de inputs generados (mínimo 9)
    let inputs = await contenedor.findElements(By.css('input[type="number"]'));
    assert.ok(inputs.length >= 9, `Se esperaban al menos 9 inputs, pero se encontraron ${inputs.length}`);
    await driver.sleep(1000);

    // Paso 6 - Verificar que cada input sea de tipo number
    for (let input of inputs) {
      let tipo = await input.getAttribute('type');
      assert.strictEqual(tipo, 'number', 'El input no es de tipo number');
      await driver.sleep(200); // Pequeña pausa para observar cada uno
    }

    console.log('✅ Prueba ATDD completada exitosamente.');
  } catch (error) {
    console.error('❌ Error en la prueba:', error.message);
  } finally {
    await driver.sleep(2000); // Pausa final antes de cerrar
    await driver.quit();
  }
})();
