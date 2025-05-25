const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');

/* Pequeño helper para pausar */
const sleep = ms => new Promise(res => setTimeout(res, ms));

(async function shellSortRandom() {
  const driver = await new Builder().forBrowser('chrome').build();
  try {
    /* Paso 1 – abrir la página remota */
    await driver.get(
      'https://joshnisth.github.io/Grafos-practica-ATDD/docs/sort.html'
    );
    await sleep(1500);                                       

    /* Paso 2 – marcar “Input Aleatorio” */
    const chk = await driver.findElement(By.id('inputAleatorio'));
    if (!(await chk.isSelected())) await chk.click();
    await sleep(1500);                                       
    /* Paso 3 - Selecciona 50 elementos para la lista*/
    const numElements = await driver.findElement(By.id('numElements'));
    await numElements.clear();
    await numElements.sendKeys('50');
    await sleep(1500); 

    /* —— Mantén el navegador abierto 30 s para inspección —— */
    await sleep(30000);
  } catch (e) {
    console.error(e);
    await sleep(30000);
  } 
})();
