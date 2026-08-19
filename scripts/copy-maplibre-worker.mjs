/**
 * Copia el worker de MapLibre (y el trozo compartido que importa) a `public/`.
 *
 * MapLibre 6 resuelve la URL de su worker a partir de `import.meta.url`, y con
 * webpack (Next 14) eso no apunta a un archivo servible: el worker nunca
 * arranca y el mapa se queda sin teselas, SIN error en consola. Es el fallo
 * más silencioso posible. La solución es servir el worker como archivo
 * estático y decirle dónde está con `setWorkerUrl` (ver `components/ui/map`).
 *
 * Corre en `postinstall`, así al actualizar `maplibre-gl` la copia se renueva
 * sola y no se queda un worker de una versión con el motor de otra.
 */
import { copyFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = join(root, 'node_modules', 'maplibre-gl', 'dist');
const dst = join(root, 'public', 'vendor', 'maplibre');

mkdirSync(dst, { recursive: true });
for (const f of ['maplibre-gl-worker.mjs', 'maplibre-gl-shared.mjs']) {
  copyFileSync(join(src, f), join(dst, f));
}
console.log('maplibre worker → public/vendor/maplibre');
