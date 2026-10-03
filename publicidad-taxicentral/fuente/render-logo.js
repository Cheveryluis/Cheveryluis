// Exporta el logotipo horizontal (ícono + "TaxiCentral") en PNG transparente.
// Uso: NODE_PATH=$(npm root -g) node render-logo.js
const { chromium } = require('playwright');
const path = require('path');
const OUT = path.resolve(__dirname, '..', 'logotipo');
require('fs').mkdirSync(OUT, { recursive: true });
(async () => {
  const b = await chromium.launch();
  for (const [modo, nombre, fondo] of [
    ['oscuro', 'logotipo-para-fondo-oscuro.png', null],
    ['claro', 'logotipo-para-fondo-claro.png', null],
    ['oscuro', 'logotipo-fondo-negro.jpg', '#161a23'],
  ]) {
    const p = await b.newPage({ deviceScaleFactor: 2 });
    await p.goto('file://' + path.join(__dirname, 'logo-marca.html#' + modo));
    await p.evaluate(() => document.fonts.ready);
    if (fondo) await p.evaluate(f => document.body.style.background = f, fondo);
    const el = await p.$('#m');
    await el.screenshot({ path: path.join(OUT, nombre), omitBackground: !fondo, ...(fondo ? { type: 'jpeg', quality: 95 } : {}) });
    console.log('ok', nombre); await p.close();
  }
  await b.close();
})();
