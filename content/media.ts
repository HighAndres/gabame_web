/**
 * Inventario de la media REAL entregada por el cliente (`/public/media/…`).
 *
 * Autocontenido a propósito: no depende de componentes, así el concepto nuevo
 * decide libremente dónde y cómo usar cada pieza.
 */

export type MediaAsset =
  | { type: 'video'; src: string; poster?: string; alt?: string; note?: string }
  | { type: 'image'; src: string; alt: string; note?: string };

export const mediaLibrary = {
  /**
   * Lockup horizontal: símbolo + «GABAME HUMAN HEALTH».
   * Desde ago-2026 es el logotipo definitivo (serif lapidaria, símbolo azul,
   * nombre marino, bajada azul), extraído del render del cliente con
   * `scripts/derive-brand-assets.mjs`. OJO con el nombre del archivo:
   * `gabame_org_sf.png` NO es el organigrama, es el lockup.
   */
  logo: {
    type: 'image',
    src: '/media/gabame_org_sf.png',
    alt: 'GABAME Human Health',
    note: 'El nombre va en marino: sobre fondos oscuros usar BrandLockup (HTML), no esta imagen.',
  },
  /** Símbolo hexagonal solo, recortado a su caja. Ecosistema y filigranas. */
  mark: {
    type: 'image',
    src: '/media/logo_gabame_sf.png',
    alt: 'Símbolo GABAME',
    note: 'Recortado del render ago-2026; sin aire alrededor, el margen lo pone el CSS.',
  },
  /**
   * Símbolo recortado a su caja real (202×256). Se usa como `mask-image` en
   * `BrandLockup`: solo importa su canal alfa, la tinta la pone el CSS con
   * `#3D89FD`. Regenerable desde `logo_gabame_sf.png`.
   */
  markMask: {
    type: 'image',
    src: '/media/gabame-mark.png',
    alt: '',
    note: 'Máscara del lockup. No usar como imagen visible.',
  },
  /** Video de portada vigente (16-ago-2026), 1280×720, 10 s. */
  header: {
    type: 'video',
    src: '/media/vid_header.mp4',
    poster: '/media/vid_header_poster.jpg',
    note: 'Póster sacado del segundo 1,5 con el navegador (no hay ffmpeg en la máquina).',
  },
  /** Video de portada ANTERIOR. Ya no se usa; se conserva por si se recupera. */
  headerLegacy: {
    type: 'video',
    src: '/media/gabame_header.mp4',
    poster: '/media/gabame_header_poster.jpg',
    note: 'Generado con IA: marca de agua abajo a la derecha, recortarla al encuadrar.',
  },
  /** Video vertical 9:16 del portafolio Rx. */
  portfolio: {
    type: 'video',
    src: '/media/portafoliorx.mp4',
    note: 'Formato 9:16, mudo.',
  },
  /** Foto de laboratorio, ya sin marca de agua. */
  lab: {
    type: 'image',
    src: '/media/bg1_clean.webp',
    alt: 'Laboratorio de bioprocesos GABAME Human Health',
  },
} satisfies Record<string, MediaAsset>;
