'use client';

import { useEffect, type RefObject } from 'react';

/**
 * Retiene el foco dentro de una o varias zonas mientras algo está abierto.
 *
 * El problema que resuelve: el sitio tiene tres piezas que tapan la página —el
 * panel de menú en móvil, el aviso de privacidad y el panel del asistente— y
 * en las tres el tabulador se escapaba al contenido de detrás, que está oculto
 * a la vista pero sigue siendo enfocable. Quien navega con teclado o con
 * lector de pantalla terminaba «escribiendo a ciegas» sobre botones que no
 * puede ver, y en el caso del aviso de privacidad encima el diálogo declaraba
 * `aria-modal="true"`, o sea prometía justo lo que no cumplía.
 *
 * VARIAS ZONAS, no una. El panel de menú es un caso propio: su botón de cerrar
 * vive en la cabecera, fuera del panel. Si la trampa se limitara al panel, el
 * botón quedaría inalcanzable, que es el fallo contrario. Por eso recibe una
 * lista y las recorre EN EL ORDEN EN QUE SE PASAN.
 *
 * Solo intercepta el tabulador. Escape, los clics y la devolución del foco al
 * cerrar los sigue gestionando cada componente, que es donde tienen sentido.
 */

/** Lo que el navegador considera enfocable con el tabulador. */
const ENFOCABLES = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

/** Descarta lo que está en el DOM pero no se puede ver ni pulsar. */
function visible(el: HTMLElement) {
  if (el.hidden || el.getAttribute('aria-hidden') === 'true') return false;
  // `getClientRects` vacío = display:none, un ancestro oculto, o fuera de flujo.
  return el.getClientRects().length > 0;
}

export function useFocusTrap(
  activa: boolean,
  zonas: Array<RefObject<HTMLElement | null>>,
) {
  useEffect(() => {
    if (!activa) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      // La zona CUENTA COMO ELEMENTO si ella misma es enfocable: el botón de
      // cerrar del menú es una zona de un solo elemento y sin esto quedaba
      // fuera del ciclo —o sea, inalcanzable con el tabulador—.
      const items = zonas
        .flatMap((z) => {
          const raiz = z.current;
          if (!raiz) return [];
          const dentro = Array.from(
            raiz.querySelectorAll<HTMLElement>(ENFOCABLES),
          );
          return raiz.matches(ENFOCABLES) ? [raiz, ...dentro] : dentro;
        })
        .filter(visible);

      if (items.length === 0) return;

      const primero = items[0];
      const ultimo = items[items.length - 1];
      const actual = document.activeElement as HTMLElement | null;
      const dentro = actual ? items.includes(actual) : false;

      // Foco fuera de las zonas (venía del contenido de detrás, o de la barra
      // del navegador): lo devolvemos al extremo que toque.
      if (!dentro) {
        e.preventDefault();
        (e.shiftKey ? ultimo : primero).focus();
        return;
      }

      if (e.shiftKey && actual === primero) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && actual === ultimo) {
        e.preventDefault();
        primero.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
    // `zonas` es una lista nueva en cada render; lo que decide es `activa`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activa]);
}
