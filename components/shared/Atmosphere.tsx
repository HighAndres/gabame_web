/**
 * Atmósfera de fondo: dos auroras azules derivando. Retomada del sitio v1 y
 * traducida a la paleta estricta.
 *
 * Decorativa por completo: `aria-hidden` y sin eventos de puntero. El
 * contenedor la recorta, así que las auroras nunca provocan scroll lateral.
 *
 * La rejilla del v1 ya no está en ninguno de los dos tonos. Sobre claro se
 * comía la escena; sobre negro, en el bloque de Socios, la aurora la iluminaba
 * y volvía a ser lo primero que se veía. Sin ella la atmósfera significa una
 * sola cosa en todo el sitio —luz azul a la deriva—, que es más fácil de
 * sostener que dos tratamientos distintos.
 *
 * Tres tonos, uno por superficie:
 * - `light` y `dark`: auroras AZULES sobre claro y sobre negro.
 * - `blue`: sobre el propio color de marca el azul no se ve, así que la
 *   profundidad se hace con luz blanca y sombra negra. Ver la nota de
 *   `.atmo-blue` en `globals.css`: ahí está el presupuesto de contraste, que
 *   es lo que limita cuánto puede oscurecerse.
 *
 * La sección que la aloja necesita `position: relative` y su contenido subir a
 * `z-index: 1`. Para `.section > .container` eso ya está resuelto en
 * `globals.css`.
 */
export function Atmosphere({
  tone = 'light',
}: {
  tone?: 'light' | 'dark' | 'blue';
}) {
  return (
    <div className={`atmo atmo-${tone}`} aria-hidden="true">
      <span className="atmo-aurora atmo-a1" />
      <span className="atmo-aurora atmo-a2" />
    </div>
  );
}
