// tests/competTest.js
const { Builder, By } = require('selenium-webdriver');
const assert  = require('assert');
const sleep   = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  const driver = await new Builder().forBrowser('chrome').build();
  try {
    /***** 1. Abre la página *****/
    await driver.get('https://joshnisth.github.io/Grafos-practica-ATDD/docs/compet.html');

    /***** 2. Asegura que #lienzo sea visible y grande *****/
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


    /***** 5. Calcular punto medio *****/
    await driver.findElement(By.css("button[onclick*='calcularPuntoMedioTotal']")).click();
    await sleep(800);

  } catch (e) {
    console.error('❌ sigue fallando:', e);
    await sleep(20_000);
  }
  // sin driver.quit() para inspección manual
})();