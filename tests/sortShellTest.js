const { Builder, By } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const assert = require('assert');

const sleep = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  /* ── Opciones de Chrome ───────────────────────────── */
  const opts = new chrome.Options();
  if (process.env.CI) {                       // Solo en GitHub Actions
    opts.addArguments('--headless', '--no-sandbox', '--disable-dev-shm-usage');
  }

  /* ── ServiceBuilder ── díselo a Selenium explícitamente en CI ── */
  const svc = process.env.CI
    ? new chrome.ServiceBuilder('/usr/bin/chromedriver') // ruta fija en Ubuntu-GH Actions
    : new chrome.ServiceBuilder();                       // local: usa el driver “normal”

  const driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(opts)
    .setChromeService(svc)
    .build();

  try {
    /* Paso 1 – abrir página */
    await driver.get('https://joshnisth.github.io/Grafos-practica-ATDD/docs/sort.html');
    await sleep(1000);

    /* Paso 2 – marcar “Input Aleatorio” */
    const chk = await driver.findElement(By.id('inputAleatorio'));
    if (!(await chk.isSelected())) await chk.click();
    await sleep(800);

    /* Paso 3 – 50 elementos */
    const num = await driver.findElement(By.id('numElements'));
    await num.clear();
    await num.sendKeys('50');
    await sleep(800);

    /* Paso 4 – límite sup. 500 */
    const upper = await driver.findElement(By.id('upperLimit'));
    await upper.clear();
    await upper.sendKeys('500');
    await sleep(800);

    /* Paso 5 – generar lista */
    await driver.findElement(By.id('crearListaAleatoriaBtn')).click();
    const listaLbl = await driver.findElement(By.id('listaAleatoriaLabel'));
    await driver.wait(async () => (await listaLbl.getText()).trim().length > 0, 5000);
    const listaTxt = (await listaLbl.getText()).trim();

    /* Paso 6 – Merge Sort */
    await driver.findElement(By.id('mergeSortBtn')).click();
    const outLbl = await driver.findElement(By.id('outputLabel'));
    await driver.wait(async () => (await outLbl.getText()).trim().length > 0, 5000);
    const outTxt = (await outLbl.getText()).trim();

    /* Paso 7 – assert */
    const original = listaTxt.split(',').map(n => parseInt(n.trim(), 10));
    const esperado = [...original].sort((a, b) => a - b).join(', ');
    assert.strictEqual(outTxt, esperado, 'La lista no quedó ordenada');
    console.log('Shell Sort ordenó correctamente');

    if (!process.env.CI) await sleep(30000);  // 30 s de inspección local
  } catch (e) {
    console.error('Error:', e);
    if (!process.env.CI) await sleep(30000);
  }
})();
