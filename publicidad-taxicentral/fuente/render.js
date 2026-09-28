// Genera los PNG/PDF finales a partir de los HTML de esta carpeta.
// Uso: NODE_PATH=$(npm root -g) node render.js
const { chromium } = require('playwright');
const path = require('path');
const OUT = path.resolve(__dirname, '..');
const piezas = [
  { html: 'volante-a4.html', w: 794, h: 1123, png: 'volante-A4.png', pdf: 'volante-A4.pdf', escala: 3 },
  { html: 'post-cuadrado.html', w: 1080, h: 1080, png: 'post-redes-1080x1080.png', escala: 1 },
  { html: 'historia-vertical.html', w: 1080, h: 1920, png: 'historia-whatsapp-1080x1920.png', escala: 1 },
];
(async () => {
  const browser = await chromium.launch();
  const solo = process.argv.slice(2);
  for (const p of piezas) {
    if (solo.length && !solo.includes(p.html)) continue;
    const page = await browser.newPage({ viewport: { width: p.w, height: p.h }, deviceScaleFactor: p.escala });
    await page.goto('file://' + path.join(__dirname, p.html), { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: path.join(OUT, p.png), clip: { x: 0, y: 0, width: p.w, height: p.h } });
    if (p.pdf) await page.pdf({ path: path.join(OUT, p.pdf), format: 'A4', printBackground: true, preferCSSPageSize: true });
    console.log('ok', p.png);
    await page.close();
  }
  await browser.close();
})();
