'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { NAV, PORTAL_CTAS } from '@/lib/nav';
import { useFocusTrap } from '@/lib/focus-trap';
import { PortalLink } from '@/components/shared/PortalLink';
import { LangSwitch } from './LangSwitch';
import { BrandLockup } from './BrandLockup';

/**
 * Cabecera pegajosa.
 *
 * - Se condensa al bajar: el lockup baja de 46 a 36px y la barra se ciñe.
 * - Marca la página activa.
 * - En móvil abre un panel a pantalla completa en vez de empujar el contenido.
 *
 * Negra, según la referencia del cliente (ago 2026): lockup a la izquierda,
 * navegación, y a la derecha el conmutador de idioma y las acciones. Desde la
 * junta de sep 2026 las acciones son DOS botones secundarios al portal
 * («Área médica» y «Portal de clientes», vía `PortalLink`). El botón a
 * Farmacias GABAME que vivía aquí se retiró: con tres botones la barra no
 * cabía por debajo de 1300px, y la franja de la Home y el pie ya lo enlazan.
 *
 * El menú dejó de tener anclas a la Home (Áreas, Ecosistema y Socios eran
 * secciones; Socios ya no existe y las otras dos tienen página), así que el
 * marcador de sección por scroll se fue con ellas.
 *
 * Nota histórica: los datos de contacto han entrado y salido de aquí dos veces
 * —primero una franja superior, después un bloque de teléfono con icono— y las
 * dos se retiraron a petición del cliente. El teléfono sigue en el pie y en
 * /contacto, que son los sitios donde se busca.
 */
export function SiteHeader() {
  const t = useTranslations('nav');
  const tA11y = useTranslations('a11y');
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const [condensed, setCondensed] = useState(false);

  /**
   * Con el panel abierto el foco se queda entre el botón de cerrar y el propio
   * panel. Antes, tras el último enlace, el tabulador seguía al contenido de
   * detrás —que el panel tapa— y se pulsaban botones invisibles.
   *
   * Las dos zonas van en este orden porque es el del documento: el botón vive
   * en la cabecera y el panel viene después.
   */
  const toggle = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  useFocusTrap(open, [toggle, panel]);

  // Un solo lector de scroll: condensar la cabecera.
  useEffect(() => {
    let ticking = false;
    const leer = () => setCondensed(window.scrollY > 80);
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        leer();
        ticking = false;
      });
    };

    leer();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // El panel móvil bloquea el scroll de fondo y cierra con Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  /**
   * Al pasar el punto de corte, el panel se cierra solo.
   *
   * Por encima del corte el botón de menú desaparece (`.menu-toggle` va a
   * `display: none` en `globals.css`) pero el panel seguía abierto: tapaba la
   * página entera, con el scroll bloqueado y sin botón de cerrar. Pasaba al
   * girar una tablet o al ensanchar la ventana con el menú desplegado, y solo
   * se salía con Escape o pulsando un enlace.
   *
   * El 1200 de aquí es el mismo de la media query; si se cambia uno, hay que
   * cambiar el otro. (Subió de 1080 con los dos botones al portal: la fila
   * de cinco enlaces más tres controles no cabía por debajo.)
   */
  useEffect(() => {
    if (!open) return;
    const mq = window.matchMedia('(min-width: 1201px)');
    const cerrarSiEsAncho = () => {
      if (mq.matches) setOpen(false);
    };
    cerrarSiEsAncho();
    mq.addEventListener('change', cerrarSiEsAncho);
    return () => mq.removeEventListener('change', cerrarSiEsAncho);
  }, [open]);

  const navLinks = NAV.map((item) => {
    const active = pathname === item.href;
    return (
      <Link
        key={item.key}
        href={item.href}
        className={`nav-link${active ? ' is-active' : ''}`}
        aria-current={active ? 'page' : undefined}
        onClick={() => setOpen(false)}
      >
        {t(item.key)}
      </Link>
    );
  });

  /** Los dos botones al portal. Secundarios: contorno blanco, sin latido. */
  const portalLinks = (className: string) =>
    PORTAL_CTAS.map((cta) => (
      <PortalLink
        key={cta.key}
        className={`btn btn-outline-white ${className}`}
        onClick={() => setOpen(false)}
      >
        {t(cta.key)}
      </PortalLink>
    ));

  return (
    <>
      <a className="skip-link" href="#contenido">
        {t('skipToContent')}
      </a>

      <div className={`site-chrome${condensed ? ' is-condensed' : ''}`}>
        <header className="site-header">
          <div className="container site-header-inner">
            <Link href="/" className="brand" aria-label="GABAME Human Health">
              <BrandLockup />
            </Link>

            <nav className="site-nav" aria-label={tA11y('mainNav')}>
              {navLinks}
            </nav>

            <div className="header-tools">
              <LangSwitch />
              {portalLinks('header-cta')}
            </div>

            <button
              ref={toggle}
              type="button"
              className="menu-toggle"
              aria-expanded={open}
              aria-controls="menu-panel"
              onClick={() => setOpen((v) => !v)}
            >
              <span className="menu-bars" aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
              {open ? tA11y('closeMenu') : t('menu')}
            </button>
          </div>
        </header>
      </div>

      {/* Panel móvil a pantalla completa */}
      <div
        ref={panel}
        id="menu-panel"
        className={`menu-panel${open ? ' is-open' : ''}`}
        hidden={!open}
      >
        <nav className="menu-panel-nav" aria-label={tA11y('mainNav')}>
          {navLinks}
        </nav>
        <div className="menu-panel-foot">
          <LangSwitch />
          {portalLinks('menu-panel-cta')}
        </div>
      </div>
    </>
  );
}
