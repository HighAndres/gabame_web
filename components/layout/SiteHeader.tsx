'use client';

import { useEffect, useState } from 'react';
import { Phone } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { NAV, CONTACT } from '@/lib/nav';
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
 * navegación, y a la derecha el botón de contacto y un bloque de teléfono con
 * icono. El lockup va en blanco con la etiqueta en azul, como en el pie.
 *
 * Nota histórica: los datos de contacto vivieron aquí en una franja superior y
 * se retiraron a petición del cliente; el bloque de teléfono vuelve ahora por
 * la referencia que él mismo aportó. Si vuelve a sobrar, es `.header-phone`.
 */
export function SiteHeader() {
  const t = useTranslations('nav');
  const tA11y = useTranslations('a11y');
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const [condensed, setCondensed] = useState(false);
  const [section, setSection] = useState<string | null>(null);

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

  function isActive(item: (typeof NAV)[number]) {
    if (item.anchor) {
      return isHome && section === item.href.split('#')[1];
    }
    if (item.href === '/') return isHome && section === null;
    return pathname === item.href;
  }

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
              <Link href="/contacto" className="btn btn-blue header-cta">
                {t('cta')}
              </Link>
              <a className="header-phone" href={`tel:${CONTACT.phoneHref}`}>
                <span className="header-phone-ic" aria-hidden="true">
                  <Phone size={18} />
                </span>
                <span className="header-phone-tx">
                  <span className="header-phone-k">{t('callUs')}</span>
                  <span className="header-phone-v">{CONTACT.phone}</span>
                </span>
              </a>
            </div>

            <button
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
        id="menu-panel"
        className={`menu-panel${open ? ' is-open' : ''}`}
        hidden={!open}
      >
        <nav className="menu-panel-nav" aria-label={tA11y('mainNav')}>
          {navLinks}
        </nav>
        <div className="menu-panel-foot">
          <LangSwitch />
          <Link
            href="/contacto"
            className="btn btn-blue"
            onClick={() => setOpen(false)}
          >
            {t('cta')}
          </Link>
        </div>
      </div>
    </>
  );
}
