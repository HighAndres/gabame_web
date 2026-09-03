/**
 * Tipado de `promociones.json`, que es la fuente editable. Aquí solo se le da
 * forma y se filtran las vencidas.
 *
 * REGULATORIO: en esta sección no entran precios, product shots, posología ni
 * listados tipo catálogo. Marcas y cadenas SOLO por nombre; logo placeholder.
 */

import data from './promociones.json';

export type Localized = { es: string; en: string };

export type Promo = {
  id: string;
  /** Nombre de la dinámica, p. ej. «3+1». */
  name: string;
  mechanics: Localized;
  /** Marcas participantes por nombre; `logo` es una ruta en /public o null. */
  brands: { name: string; logo: string | null }[];
  chains: string[];
  /** ISO `YYYY-MM-DD`. */
  validFrom: string;
  validTo: string;
  legal: Localized;
};

export const PROMOS: Promo[] = data.promos;

/**
 * Vigentes o futuras. Una promoción vencida no se enseña: en un sitio
 * regulado, anunciar una dinámica caducada es peor que no anunciar nada.
 * Se compara por día en UTC para que el servidor y el cliente coincidan.
 */
export function promosVigentes(hoy = new Date()): Promo[] {
  const dia = hoy.toISOString().slice(0, 10);
  return PROMOS.filter((p) => p.validTo >= dia);
}
