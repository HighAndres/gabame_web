'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Cross } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Atmosphere } from '@/components/shared/Atmosphere';
import { EXTERNAL } from '@/lib/nav';

/**
 * Franja de Farmacias GABAME. Va ENTRE la portada y Áreas.
 *
 * Es una banda estrecha, no una sección: la portada tiene que seguir siendo la
 * portada y Áreas sigue siendo el primer bloque grande. Por eso no usa
 * `.section` (96px arriba y abajo) sino su propio alto, la mitad.
 *
 * Va sobre NEGRO por obligación, no por gusto: la franja de cifras de la
 * portada y la sección de Áreas son las dos azules, y una tercera pieza azul
 * entre ellas las fundiría en una sola mancha. El negro las separa, y los dos
 * filetes azules de 2px la cosen a lo que tiene arriba y abajo.
 *
 * ⚠ CONTENIDO PENDIENTE. `kicker` y `subtitle` están marcados en `i18n` a la
 * espera del texto real del cliente: el sitio de farmacias está tras
 * autenticación básica y de aquí no se inventa nada. El título y el botón sí
 * son definitivos porque no afirman nada que haya que validar.
 */
export function Pharmacies() {
  const t = useTranslations('home.farmacias');
  const tA11y = useTranslations('a11y');

  /**
   * Entrada al llegar a pantalla, una sola vez, con `IntersectionObserver`
   * —no escuchando el scroll: la cabecera ya tiene el único lector de scroll
   * del sitio y no conviene añadir otro.
   *
   * QUIEN ESCONDE ES EL JS, NO EL CSS. Es la parte que importa: si el CSS
   * pusiera `opacity: 0` por su cuenta, bastaría con que el observador no
   * llegue a disparar —JS caído, navegador viejo, pestaña que nunca llega a
   * pintarse— para que la franja se quedara invisible PARA SIEMPRE. Una
   * animación no puede poder ocultar contenido. Así que el estado escondido
   * («armado») solo existe si este componente lo enciende, y encima lleva dos
   * salidas: si la franja ya está en pantalla al cargar no se esconde nunca, y
   * si el observador no responde en 3s se destapa igual.
   */
  const banda = useRef<HTMLElement>(null);
  const [estado, setEstado] = useState<'quieto' | 'armado' | 'dentro'>('quieto');

  useEffect(() => {
    const el = banda.current;
    if (!el || !('IntersectionObserver' in window)) {
      setEstado('dentro');
      return;
    }

    // Ya visible al cargar: entra puesta. Esconderla ahora para revelarla acto
    // seguido sería un parpadeo, no una entrada.
    const caja = el.getBoundingClientRect();
    if (caja.top < window.innerHeight && caja.bottom > 0) {
      setEstado('dentro');
      return;
    }

    setEstado('armado');
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        setEstado('dentro');
        io.disconnect();
      },
      // Que arranque cuando ya se ve de verdad, no al asomar el primer píxel.
      { rootMargin: '0px 0px -12% 0px' },
    );
    io.observe(el);

    // Red de seguridad.
    const red = setTimeout(() => setEstado('dentro'), 3000);
    return () => {
      clearTimeout(red);
      io.disconnect();
    };
  }, []);

  return (
    <section
      id="farmacias"
      ref={banda}
      className={`pharma-band surface-black${estado !== 'quieto' ? ' is-armed' : ''}${
        estado === 'dentro' ? ' is-in' : ''
      }`}
      aria-labelledby="farmacias-title"
    >
      <Atmosphere tone="dark" />

      <div className="container pharma-inner">
        {/* Cruz de farmacia: es la señal que se lee antes que el texto. */}
        <span className="pharma-badge" aria-hidden="true">
          <Cross size={24} />
        </span>

        <div className="pharma-copy">
          <p className="eyebrow pharma-kicker">{t('kicker')}</p>
          <h2 id="farmacias-title" className="pharma-title">
            {t('title')}
          </h2>
          <p className="pharma-line">{t('subtitle')}</p>
        </div>

        <a
          className="btn btn-blue pharma-cta"
          href={EXTERNAL.farmacias}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>{t('cta')}</span>
          <ArrowUpRight className="pharma-cta-ic" size={18} aria-hidden="true" />
          <span className="sr-only"> ({tA11y('newTab')})</span>
        </a>
      </div>
    </section>
  );
}
