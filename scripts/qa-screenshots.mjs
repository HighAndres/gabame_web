/**
 * Capturas de QA (junta sep 2026): Home, un área, Healthy Eyes, Promociones,
 * Farmacovigilancia y Contacto, en los dos temas del fondo inmersivo y en
 * escritorio y móvil. Requiere `@playwright/test` (devDependency) y Chromium
 * (`npx playwright install chromium`).
 *
 *   BASE=http://localhost:3011 node scripts/qa-screenshots.mjs
 *
 * Deja los PNG en `docs/qa/screenshots/` (ignorado en git) y una hoja de
 * contacto por tema en `docs/qa/`. El tema se fuerza poniendo `data-theme`
 * en <html> antes de capturar, así no hace falta reconstruir para verlo.
 */
import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const BASE = process.env.BASE ?? 'http://localhost:3011';
const OUT = path.resolve('docs/qa/screenshots');
const PAGES = [
  ['home', '/es'],
  ['area', '/es/areas-terapeuticas/cardiometabolico'],
  ['healthy-eyes', '/es/areas-terapeuticas/oftalmologia/healthy-eyes'],
  ['promociones', '/es/promociones'],
  ['farmacovigilancia', '/es/farmacovigilancia'],
  ['contacto', '/es/contacto'],
];
const VIEWPORTS = { desktop: { width: 1440, height: 900 }, mobile: { width: 390, height: 844 } };
const THEMES = ['a', 'b'];

await mkdir(OUT, { recursive: true });
const browser = await chromium.launch();
const files = [];

for (const theme of THEMES) {
  for (const [vpName, viewport] of Object.entries(VIEWPORTS)) {
    const ctx = await browser.newContext({
      viewport,
      deviceScaleFactor: 1,
      isMobile: vpName === 'mobile',
      reducedMotion: 'reduce',
    });
    for (const [name, route] of PAGES) {
      const page = await ctx.newPage();
      await page.goto(BASE + route, { waitUntil: 'networkidle' });
      await page.evaluate((t) => {
        document.documentElement.dataset.theme = t;
        // Los Reveal entran al llegar a pantalla: para la captura completa se
        // destapan todos.
        document.querySelectorAll('.reveal, [class*="is-armed"]').forEach((el) => {
          el.classList.add('is-in');
          el.classList.remove('is-armed');
        });
      }, theme);
      await page.waitForTimeout(400);
      const file = path.join(OUT, `${name}--${theme}--${vpName}.png`);
      await page.screenshot({ path: file, fullPage: true });
      files.push({ theme, vpName, name, file });
      await page.close();
    }
    await ctx.close();
  }
}
await browser.close();

/* Hoja de contacto por tema: una fila por página, escritorio y móvil
   reducidos a la misma altura, para verlo todo de un vistazo. */
for (const theme of THEMES) {
  const rows = [];
  const ROW_H = 520;
  const GAP = 16;
  let maxW = 0;
  for (const [name] of PAGES) {
    const cells = [];
    for (const vpName of Object.keys(VIEWPORTS)) {
      const f = files.find((x) => x.theme === theme && x.vpName === vpName && x.name === name);
      const img = sharp(f.file);
      const meta = await img.metadata();
      const scale = ROW_H / meta.height;
      const w = Math.max(1, Math.round(meta.width * scale));
      cells.push({ buf: await img.resize({ width: w, height: ROW_H, fit: 'fill' }).png().toBuffer(), w });
    }
    const rowW = cells.reduce((a, c) => a + c.w + GAP, 0);
    maxW = Math.max(maxW, rowW);
    rows.push(cells);
  }
  const H = rows.length * (ROW_H + GAP);
  const composites = [];
  rows.forEach((cells, r) => {
    let x = 0;
    for (const c of cells) {
      composites.push({ input: c.buf, left: x, top: r * (ROW_H + GAP) });
      x += c.w + GAP;
    }
  });
  const sheet = path.resolve('docs/qa', `hoja-tema-${theme}.png`);
  await sharp({ create: { width: maxW, height: H, channels: 3, background: '#ffffff' } })
    .composite(composites)
    .png()
    .toFile(sheet);
  console.log('hoja', sheet);
}
await writeFile(path.join(OUT, 'index.json'), JSON.stringify(files.map((f) => path.basename(f.file)), null, 2));
console.log(`${files.length} capturas en ${OUT}`);
