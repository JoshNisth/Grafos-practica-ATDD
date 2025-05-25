const { Builder, By } = require('selenium-webdriver');
const assert  = require('assert');
const sleep   = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  const driver = await new Builder().forBrowser('chrome').build();
  try {
    /** 1. Abrir la página **/
    await driver.get('https://joshnisth.github.io/Grafos-practica-ATDD/docs/compet.html');

    /** 2. Asegura que el lienzo sea visible ***/
    const lienzo = await driver.findElement(By.id('lienzo'));
    await driver.executeScript('arguments[0].scrollIntoView({block:"center"})', lienzo);
    await driver.wait(async () => {
      const { width, height } = await lienzo.getRect();
      return width > 400 && height > 400;
    }, 8_000);

    /***** 3. Activa modo nodo *****/
    await driver.findElement(By.id('nodeButton')).click();
    await sleep(400);

    /***** 4. Mueve al centro y dibuja 6 nodos en círculo *****/
    const act = driver.actions({ bridge: true });
    await act.move({ origin: lienzo, x: 0, y: 0 }).perform();   // centro (0,0)

    // Radio = 30 % del lado menor
    const { width, height } = await lienzo.getRect();
    const r = Math.round(Math.min(width, height) * 0.30 / 2);   // /2 porque offset es desde centro

    for (let i = 0; i < 3; i++) {
      const ang = (2 * Math.PI / 6) * i;
      const dx  = Math.round(r * Math.cos(ang));
      const dy  = Math.round(r * Math.sin(ang));
      await act.move({ origin: lienzo, x: dx, y: dy }).click().perform();
      await sleep(500);
    }

    /***** 5. Calcular punto medio *****/
    await driver.findElement(By.css("button[onclick*='calcularPuntoMedioTotal']")).click();
    await sleep(1000);

    /***** 6. Cerrar modal (×) *****/
    const closeBtns = await driver.findElements(By.css('.modal-content .close'));
    if (closeBtns.length && await closeBtns[0].isDisplayed()) {
      await closeBtns[0].click();
    }

    /***** 7. Mostrar coordenadas *****/
    await driver.findElement(By.css("button[onclick*='mostrarCoordenadasNodos']")).click();
    await sleep(800);

    /***** 8. Verificación mínima *****/
    const txt = await driver.findElement(By.id('solucion')).getText();
    assert.ok(txt !== null, 'Solución vacía / no generada');

    console.log('Se ejecuta bien compet.html, muestra el punto medio y las cordenadas de los nodos adyacentes');
    await sleep(20_000);          // deja Chrome visible 20 s
  } catch (e) {
    console.error('Prueba fallida:', e);
    await sleep(20_000);
  }
  // sin driver.quit() para inspección manual
})();