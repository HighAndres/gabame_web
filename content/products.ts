/**
 * Colección de productos del portafolio Rx, editable y tipada.
 *
 * Diseñada para migrar a un CMS headless sin refactor: la página solo consume
 * `products` y `productsByArea()`. Mientras no lleguen los datos validados del
 * cliente, la colección va VACÍA y la página muestra un estado "en preparación"
 * por área (igual que los slots de media en la Home).
 *
 * IMPORTANTE (regulatorio): no se cargan datos clínicos, posología ni claims
 * sin validación COFEPRIS. Rellenar solo con información aprobada por el cliente.
 *
 * Ejemplo (descomenta y ajusta cuando lleguen las fichas aprobadas):
 *
 *   {
 *     slug: 'nombre-marca',
 *     name: 'Nombre Marca',
 *     area: 'cardiometabolico',
 *     molecule: 'Sustancia activa (DCI)',
 *     presentation: 'Tabletas 10 mg · caja con 30',
 *     status: 'available',
 *   },
 */

/** Claves de área terapéutica — deben coincidir con `home.areas.list` en i18n. */
export type TherapeuticArea =
  | 'cardiometabolico'
  | 'oncologia'
  | 'hospitalario'
  | 'urologia'
  | 'snc'
  | 'oftalmologia';

/** Orden canónico de las áreas (el mismo de la Home). */
export const AREA_ORDER: TherapeuticArea[] = [
  'cardiometabolico',
  'oncologia',
  'hospitalario',
  'urologia',
  'snc',
  'oftalmologia',
];

export type Product = {
  /** Identificador estable para URL de ficha (futuro /productos/[slug]). */
  slug: string;
  name: string;
  area: TherapeuticArea;
  /** Sustancia activa (DCI). Opcional hasta validación. */
  molecule?: string;
  /** Presentación comercial. Opcional hasta validación. */
  presentation?: string;
  /** Imagen de la marca para la tarjeta (en `/public/media/…`). Opcional. */
  image?: string;
  /** `available` = comercializado; `coming-soon` = en registro/lanzamiento. */
  status: 'available' | 'coming-soon';
};

/**
 * Portafolio.
 *
 * VACÍO a propósito (estado honesto "en preparación") hasta cargar las marcas
 * del catálogo real del cliente. Las 4 marcas demo que hubo aquí (Cardioline,
 * Oncovia, Hospimax, Neuraxis) NO eran productos reales; no re-publicar.
 */
export const products: Product[] = [];

/** Agrupa el portafolio por área, respetando el orden canónico. */
export function productsByArea(): Record<TherapeuticArea, Product[]> {
  const grouped = Object.fromEntries(
    AREA_ORDER.map((area) => [area, [] as Product[]]),
  ) as Record<TherapeuticArea, Product[]>;

  for (const product of products) {
    grouped[product.area]?.push(product);
  }
  return grouped;
}
