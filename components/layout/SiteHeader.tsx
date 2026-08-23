'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { NAV, EXTERNAL } from '@/lib/nav';
import { useFocusTrap } from '@/lib/focus-trap';
import { LangSwitch } from './LangSwitch';
import { BrandLockup } from './BrandLockup';

/** Anclas de la Home que el marcador de sección debe seguir. */
const SPY_IDS = ['areas', 'ecosistema', 'socios'];

/**
 * Cabecera pegajosa.
 *
 * - Se condensa al bajar: el lockup baja de 46 a 36px y la barra se ciñe.
 * - Marca la sección activa también para las anclas de la Home
 *   (Áreas · Ecosistema · Socios), no solo para las páginas.
 * - En móvil abre un panel a pantalla completa en vez de empujar el contenido.
 *
 * Negra, según la referencia del cliente (ago 2026): lockup a la izquierda,
 * navegación, y a la derecha el conmutador de idioma y el botón a Farmacias
 * GABAME. El lockup va en blanco con la etiqueta en azul, como en el pie.
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
  const [section, setSection] = useState<string | null>(null);

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

  const isHome = pathname === '/';

  /**
   * Un solo lector de scroll para las dos cosas que dependen de él: condensar
   * la cabecera y marcar la sección activa.
   *
   * La sección activa es la ÚLTIMA cuyo borde superior ya pasó la línea de
   * lectura (justo bajo la cabecera). Con «la que más área ocupa» fallaba:
   * estando en Ecosistema marcaba Socios, porque ese bloque es más alto.
   */
  useEffect(() => {
    let ticking = false;

    const leer = () => {
      const y = window.scrollY;
      setCondensed(y > 80);

      if (!isHome) {
        setSection(null);
        return;
      }

      // Línea de lectura: bajo la cabecera condensada, con holgura.
      const linea = 140;
      let activa: string | null = null;
      for (const id of SPY_IDS) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= linea) activa = id;
      }
      setSection(activa);
    };

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
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [isHome]);

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
   * Por encima de 1080px el botón de menú desaparece (`.menu-toggle` va a
   * `display: none` en `globals.css`) pero el panel seguía abierto: tapaba la
   * página entera, con el scroll bloqueado y sin botón de cerrar. Pasaba al
   * girar una tablet o al ensanchar la ventana con el menú desplegado, y solo
   * se salía con Escape o pulsando un enlace.
   *
   * El 1080 de aquí es el mismo de la media query; si se cambia uno, hay que
   * cambiar el otro.
   */
  useEffect(() => {
    if (!open) return;
    const mq = window.matchMedia('(min-width: 1081px)');
    const cerrarSiEsAncho = () => {
      if (mq.matches) setOpen(false);
    };
    cerrarSiEsAncho();
    mq.addEventListener('change', cerrarSiEsAncho);
    return () => mq.removeEventListener('change', cerrarSiEsAncho);
  }, [open]);

  function isActive(item: (typeof NAV)[number]) {
    if (item.anchor) {
      return isHome && section === item.href.split('#')[1];
    }
    if (item.href === '/') return isHome && section === null;
    return pathname === item.href;
  }

  /**
   * Farmacias GABAME — sale del sitio, así que no usa el `Link` de next-intl:
   * es un `<a>` a otro dominio, sin prefijo de idioma. La flecha diagonal es
   * la que avisa de que se abre fuera; el texto oculto lo dice para quien no
   * ve la flecha.
   */
  const pharmaLink = (className: string, labelKey: 'pharmacy' | 'pharmacyFull') => (
    <a
      className={`btn btn-blue header-pharma ${className}`}
      href={EXTERNAL.farmacias}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => setOpen(false)}
    >
      <span className="header-pharma-tx">{t(labelKey)}</span>
      <ArrowUpRight className="header-pharma-ic" size={18} aria-hidden="true" />
      <span className="sr-only"> ({tA11y('newTab')})</span>
    </a>
  );

  const navLinks = NAV.map((item) => {
    const active = isActive(item);
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
              {pharmaLink('header-cta', 'pharmacy')}
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
          {pharmaLink('menu-panel-pharma', 'pharmacyFull')}
        </div>
      </div>
    </>
  );
}
