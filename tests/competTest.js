// constructor, localizador html, condiciones
const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');          // ← añadido
// validación
const assert = require('assert');

const sleep = ms => new Promise(r => setTimeout(r, ms));

let driver;

/******************** BeforeTest ********************/
async function setUp() {
  /* ── Opciones de Chrome ─────────────────────────── */
  const opts = new chrome.Options();
  if (process.env.CI) {                                   // GitHub Actions
    opts.addArguments('--headless', '--no-sandbox', '--disable-dev-shm-usage');
  }

  /* ── ServiceBuilder ── ruta fija a chromedriver en CI */
  const svc = process.env.CI
    ? new chrome.ServiceBuilder('/usr/bin/chromedriver')
    : new chrome.ServiceBuilder();                        // local normal

  driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(opts)
    .setChromeService(svc)
    .build();
}

/******************** AfterTest ********************/
async function tearDown() {
  if (driver) {
    await driver.quit();
  }
}

/******************** Test Principal ********************/
async function testCompet() {
  try {
    console.log('--- INICIO DE PRUEBA compet.html ---');

    /** Paso 1. Abrir la página **/
    await driver.get('https://joshnisth.github.io/Grafos-practica-ATDD/docs/compet.html');

    /** Paso 2. Verifica visibilidad del lienzo **/
    const lienzo = await driver.findElement(By.id('lienzo'));
    // lo desplaza al centro de la pantalla
    await driver.executeScript('arguments[0].scrollIntoView({block:"center"})', lienzo);
    // garantiza carga
    await driver.wait(async () => {
      const { width, height } = await lienzo.getRect();
      return width > 400 && height > 400;
    }, 8000);

    /** Paso 3. Activar modo nodo **/
    await driver.findElement(By.id('nodeButton')).click();
    await sleep(400);

    /** Paso 4. Dibujar 3 nodos en círculo **/
    const act = driver.actions({ bridge: true });
    await act.move({ origin: lienzo, x: 0, y: 0 }).perform();

    const { width, height } = await lienzo.getRect();
    const r = Math.round(Math.min(width, height) * 0.30 / 2);   // radio 30 %

    for (let i = 0; i < 3; i++) {
      const ang = (2 * Math.PI / 3) * i;                        // 0°,120°,240°
      const dx = Math.round(r * Math.cos(ang));
      const dy = Math.round(r * Math.sin(ang));
      await act.move({ origin: lienzo, x: dx, y: dy }).click().perform();
      await sleep(1500);
    }

    /** Paso 5. Calcular punto medio **/
    await driver.findElement(By.css("button[onclick*='calcularPuntoMedioTotal']")).click();

    /** Paso 6. Esperar a que aparezca el modal **/
    const modal = await driver.findElement(By.id('modal'));
    await driver.wait(until.elementIsVisible(modal), 10000);

    /** Paso 7. Verificar contenido del modal con Assert **/
    const message = await driver.findElement(By.id('message')).getText();
    console.log('Texto en el modal:', message);
    assert.ok(
      message.toLowerCase().includes('punto medio'),
      'ERROR: No se encontró el mensaje esperado en el modal'
    );

    /** Paso 8. Cerrar el modal **/
    const closeBtns = await driver.findElements(By.css('.modal-content .close'));
    if (closeBtns.length && await closeBtns[0].isDisplayed()) {
      await sleep(1500);
      await closeBtns[0].click();
    }

    console.log('Prueba completada: modal y punto medio OK');
  } catch (err) {
    console.error('La prueba falló por:', err.message);
  }
}

/******************** Ejecución ********************/
(async () => {
  await setUp();
  await testCompet();
  await tearDown();
})();