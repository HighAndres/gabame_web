/**
 * Interruptores de despliegue. Se leen EN EL BUILD (`NEXT_PUBLIC_*`), así que
 * cambiar uno exige reconstruir; a cambio no hay lógica en cliente ni cookies.
 */

/**
 * Chips con el NOMBRE de las marcas en la vitrina de áreas terapéuticas.
 *
 * `false` (por defecto): la vitrina enseña solo las áreas.
 * `true`: además, un chip por marca —solo el nombre, sin claims—.
 *
 * Solo acepta la cadena exacta `true`: cualquier otra cosa, incluida la
 * variable ausente, deja el sitio en el lado conservador.
 */
export const SHOW_BRAND_NAMES =
  process.env.NEXT_PUBLIC_SHOW_BRAND_NAMES === 'true';

/**
 * Variante del FONDO INMERSIVO, mientras el cliente elige (`a` azul-noche,
 * `b` gris azulado). Va a `<html data-theme>`; los valores viven en `:root`
 * de `globals.css`. Cualquier cosa que no sea `b` es `a`.
 */
export const THEME: 'a' | 'b' =
  process.env.NEXT_PUBLIC_THEME === 'b' ? 'b' : 'a';
