import { notFound } from 'next/navigation';

/**
 * Cazatodo dentro de un idioma.
 *
 * Sin esto, `/es/loquesea` no coincide con NINGUNA ruta y Next se va al 404 de
 * la raíz (`app/not-found.tsx`), que no está traducido ni lleva el layout del
 * sitio. Con esta página la URL sí coincide, `notFound()` dispara el límite
 * más cercano —`app/[locale]/not-found.tsx`— y el 404 sale en el idioma de la
 * URL, con cabecera y pie.
 *
 * ⚠ El 404 traducido se pinta EN EL CLIENTE, no en el servidor: Next 14
 * responde con el cuerpo vacío y el contenido dentro del payload cuando
 * `notFound()` se lanza desde una página. Comprobado que no lo causa el 404 de
 * la raíz —quitándolo pasa igual—, así que es del framework. El código de
 * estado sí es 404 de verdad, que es lo que miran los rastreadores; el coste
 * es un instante en blanco antes de pintar. Si algún día molesta, la vía es
 * mirar si una versión posterior de Next ya lo hace en servidor.
 */
export default function CazaTodo() {
  notFound();
}
