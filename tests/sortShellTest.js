const { Builder, By } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const assert = require('assert');

const sleep = ms => new Promise(res => setTimeout(res, ms));

(async function shellSortRandom() {
  // Configurar opciones de Chrome
  const options = new chrome.Options();

  // Modo headless si está en entorno CI como GitHub Actions
  if (process.env.CI) {
    options.addArguments('--headless');                // sin interfaz
    options.addArguments('--no-sandbox');              // evitar problemas de seguridad
    options.addArguments('--disable-dev-shm-usage');   // evitar problemas de memoria compartida
  }

  const driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();

  try {
    // Paso 1 – abrir la página remota
    await driver.get('https://joshnisth.github.io/Grafos-practica-ATDD/docs/sort.html');
    await sleep(1500);

    // Paso 2 – marcar “Input Aleatorio”
    const chk = await driver.findElement(By.id('inputAleatorio'));
    if (!(await chk.isSelected())) await chk.click();
    await sleep(1500);

    // Paso 3 – Selecciona 50 elementos para la lista
    const numElements = await driver.findElement(By.id('numElements'));
    await numElements.clear();
    await numElements.sendKeys('50');
    await sleep(1500);

    // Paso 4 – escribir 500 en “Límite superior”
    const upper = await driver.findElement(By.id('upperLimit'));
    await upper.clear();
    await upper.sendKeys('500');
    await sleep(1500);

    // Paso 5 – generar lista
    await driver.findElement(By.id('crearListaAleatoriaBtn')).click();
    const listaLbl = await driver.findElement(By.id('listaAleatoriaLabel'));
    await driver.wait(async () => (await listaLbl.getText()).trim().length > 0, 5000);
    const listaTxt = (await listaLbl.getText()).trim();
    await sleep(1500);

    // Paso 6 – pulsar “Merge Sort”
    await driver.findElement(By.id('mergeSortBtn')).click();
    const outLbl = await driver.findElement(By.id('outputLabel'));
    await driver.wait(async () => (await outLbl.getText()).trim().length > 0, 5000);
    const outTxt = (await outLbl.getText()).trim();
    await sleep(1500);

    // Paso 7 – verificar resultado
    const original = listaTxt.split(',').map(n => parseInt(n.trim(), 10));
    const esperado = [...original].sort((a, b) => a - b).join(', ');
    assert.strictEqual(outTxt, esperado, 'La lista no quedó ordenada');
    console.log('✅ Shell Sort ordenó correctamente');

    // Inspección visual (solo si no es CI)
    if (!process.env.CI) await sleep(30000);
  } catch (e) {
    console.error('❌ Error durante la prueba:', e);
    if (!process.env.CI) await sleep(30000);
  }
})();
