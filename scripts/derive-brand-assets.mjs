/**
 * Deriva los assets de marca desde el render maestro del cliente
 * (_assets_originales/logo_gabame_render_2026.jpg — lockup 3D sobre muro claro):
 *
 *   - public/media/gabame_org_sf.png    lockup completo con fondo transparente
 *   - public/media/logo_gabame_sf.png   solo el símbolo, transparente (lo
 *                                       consume la tarjeta del ecosistema)
 *   - public/media/og.png               tarjeta OG 1200×630 (el render tal cual:
 *                                       su proporción 2076×1095 ≈ 1.896 casi
 *                                       coincide con la 1.905 de OG)
 *   - public/media/favicon.png (512)    solo el símbolo, transparente
 *   - public/media/favicon-32.png
 *   - public/media/apple-icon.png (180) símbolo sobre blanco (Apple no
 *                                       respeta transparencia)
 *
 * El fondo se quita por inundación desde los bordes: el muro es gris neutro
 * (saturación baja), el logo es azul/marino (saturación alta). Las luces
 * especulares dentro de las piezas quedan intactas porque no conectan con el
 * borde. Uso: `node scripts/derive-brand-assets.mjs`.
 */
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(root, '_assets_originales', 'logo_gabame_render_2026.jpg');
const MEDIA = path.join(root, 'public', 'media');

const { data, info } = await sharp(SRC)
  .raw()
  .toBuffer({ resolveWithObject: true });
const { width: W, height: H, channels: C } = info;

/* ¿Es pixel de muro? El muro es gris cálido CLARO (b ≤ r, luminancia alta);
   el texto marino es oscuro (max ~50-125) y las piezas azules tienen b ≫ r.
   Medido sobre el render: muro (216,215,211)–(233,233,231); GABAME (46,50,49),
   (92,108,123); HUMAN HEALTH (141,152,158). */
function isBg(i) {
  const r = data[i], g = data[i + 1], b = data[i + 2];
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  return max >= 140 && b - r <= 12 && max - min <= 45;
}

/* Inundación desde los cuatro bordes. */
const bg = new Uint8Array(W * H);
const stack = [];
for (let x = 0; x < W; x++) { stack.push(x, (H - 1) * W + x); }
for (let y = 0; y < H; y++) { stack.push(y * W, y * W + W - 1); }
while (stack.length) {
  const p = stack.pop();
  if (bg[p]) continue;
  if (!isBg(p * C)) continue;
  bg[p] = 1;
  const x = p % W;
  if (x > 0) stack.push(p - 1);
  if (x < W - 1) stack.push(p + 1);
  if (p >= W) stack.push(p - W);
  if (p < W * (H - 1)) stack.push(p + W);
}

/* RGBA con alfa 0 en el fondo, suavizado 3×3 para no dejar borde de sierra. */
const hard = new Uint8Array(W * H);
for (let p = 0; p < W * H; p++) hard[p] = bg[p] ? 0 : 255;
const rgba = Buffer.alloc(W * H * 4);
let minX = W, minY = H, maxX = 0, maxY = 0;
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const p = y * W + x;
    let sum = 0, n = 0;
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const yy = y + dy, xx = x + dx;
        if (yy < 0 || yy >= H || xx < 0 || xx >= W) continue;
        sum += hard[yy * W + xx];
        n++;
      }
    }
    const a = Math.round(sum / n);
    rgba[p * 4] = data[p * C];
    rgba[p * 4 + 1] = data[p * C + 1];
    rgba[p * 4 + 2] = data[p * C + 2];
    rgba[p * 4 + 3] = a;
    if (a > 8) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
}

const PAD = 14;
minX = Math.max(0, minX - PAD);
minY = Math.max(0, minY - PAD);
maxX = Math.min(W - 1, maxX + PAD);
maxY = Math.min(H - 1, maxY + PAD);
const lockup = sharp(rgba, { raw: { width: W, height: H, channels: 4 } })
  .extract({ left: minX, top: minY, width: maxX - minX + 1, height: maxY - minY + 1 });
await lockup.clone().png().toFile(path.join(MEDIA, 'gabame_org_sf.png'));
console.log('gabame_org_sf.png', maxX - minX + 1, '×', maxY - minY + 1);

/* Símbolo solo: primer hueco vertical (columnas 100% transparentes) tras el
   hexágono separa símbolo de texto. */
const lw = maxX - minX + 1, lh = maxY - minY + 1;
const colHasInk = new Uint8Array(lw);
for (let y = minY; y <= maxY; y++) {
  for (let x = minX; x <= maxX; x++) {
    if (rgba[(y * W + x) * 4 + 3] > 8) colHasInk[x - minX] = 1;
  }
}
let gapStart = -1;
for (let x = Math.floor(lw * 0.1); x < lw; x++) {
  if (!colHasInk[x]) { gapStart = x; break; }
}
if (gapStart < 0) throw new Error('No encontré el hueco símbolo/texto');
const markW = gapStart;
const side = Math.max(markW, lh) + 2 * PAD;
const markPng = await sharp(rgba, { raw: { width: W, height: H, channels: 4 } })
  .extract({ left: minX, top: minY, width: markW, height: lh })
  .png()
  .toBuffer();
await sharp(markPng).toFile(path.join(MEDIA, 'logo_gabame_sf.png'));
const square = (bgColor) =>
  sharp(markPng).resize(side, side, {
    fit: 'contain',
    background: bgColor,
  });
await square({ r: 0, g: 0, b: 0, alpha: 0 })
  .resize(512, 512)
  .png()
  .toFile(path.join(MEDIA, 'favicon.png'));
await square({ r: 0, g: 0, b: 0, alpha: 0 })
  .resize(32, 32)
  .png()
  .toFile(path.join(MEDIA, 'favicon-32.png'));
await square({ r: 255, g: 255, b: 255, alpha: 1 })
  .flatten({ background: '#ffffff' })
  .resize(180, 180)
  .png()
  .toFile(path.join(MEDIA, 'apple-icon.png'));
console.log('favicons regenerados (mark', markW, '×', lh, ')');

/* OG: el render completo, recortado al marco 1200×630. */
await sharp(SRC)
  .resize(1200, 630, { fit: 'cover' })
  .png({ compressionLevel: 9 })
  .toFile(path.join(MEDIA, 'og.png'));
console.log('og.png 1200×630');
