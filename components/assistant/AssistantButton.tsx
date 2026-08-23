'use client';

import { useEffect, useRef, useState } from 'react';
import { Sparkles, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';

/**
 * Asistente de IA — todavía sin motor detrás. Pero un botón que no hace nada
 * es peor que uno honesto: al pulsar abre un panel que dice qué va a ser y
 * deriva al contacto, que es lo que hoy sí funciona. Las cadenas ya existían
 * en `i18n` (`chat.*`) desde el principio; nadie las usaba.
 *
 * El lanzador es una pastilla con icono y etiqueta, no un círculo con «IA»
 * dentro: la etiqueta se lee, y la pastilla no compite con los botones
 * redondos de envío que caen en la misma esquina en móvil. En pantallas
 * estrechas la etiqueta se oculta y queda solo el icono.
 *
 * Cierra con Escape, con el aspa y pulsando fuera; devuelve el foco al
 * lanzador al cerrar.
 *
 * DÓNDE NO SALE (ago 2026). Un botón fijo en la esquina inferior derecha se
 * monta sobre lo que haya debajo, y lo que había debajo era contenido que
 * importa: la tercera cifra de la portada, el campo de mensaje de /contacto y
 * la esquina de la tarjeta de /farmacovigilancia. Dos reglas lo resuelven sin
 * quitar el asistente:
 *
 *  1. **No aparece en las páginas con formulario.** Ahí el usuario ya está
 *     escribiendo por el canal bueno; el lanzador solo podía estorbar sobre el
 *     botón de enviar. Además el asistente todavía no responde: derivar al
 *     contacto desde la página de contacto no lleva a ninguna parte.
 *  2. **No aparece hasta pasar la primera pantalla.** Sobre la portada tapaba
 *     una cifra; a partir del primer scroll el usuario ya está leyendo y el
 *     lanzador entra donde se espera.
 */

/** Páginas cuyo contenido principal ES un formulario. Sin prefijo de idioma. */
const SIN_LANZADOR = ['/contacto', '/farmacovigilancia'];
export function AssistantButton() {
  const t = useTranslations('chat');
  const tNav = useTranslations('nav');
  const [open, setOpen] = useState(false);
  /* El halo llama la atención hasta que el usuario lo abre UNA vez; a partir
     de ahí ya sabe que está y el halo sería ruido. */
  const [visto, setVisto] = useState(false);
  const launcher = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  const pathname = usePathname();
  const oculto = SIN_LANZADOR.includes(pathname);

  /**
   * Aparece al pasar la primera pantalla. El testigo es un elemento de 1px
   * situado a 88vh del principio del documento: mientras se ve, seguimos en la
   * portada. Se usa `IntersectionObserver` y no un lector de scroll a
   * propósito —el sitio ya tiene uno, el de la cabecera, y no conviene añadir
   * otro—. Si el navegador no lo trae, el lanzador sale desde el principio:
   * el fallo tiene que ser hacia mostrarlo, no hacia esconderlo.
   */
  const testigo = useRef<HTMLSpanElement>(null);
  const [pasoPortada, setPasoPortada] = useState(false);

  useEffect(() => {
    if (oculto) return;
    const el = testigo.current;
    if (!el || !('IntersectionObserver' in window)) {
      setPasoPortada(true);
      return;
    }

    /* Página corta —el 404, por ejemplo—: si el recorrido de scroll no llega
       ni a donde está el testigo, este no sale nunca de la pantalla y el
       lanzador no aparecería jamás. Cuando la marca es inalcanzable, sale
       desde el principio. */
    const recorrido =
      document.documentElement.scrollHeight - window.innerHeight;
    if (recorrido <= el.offsetTop) {
      setPasoPortada(true);
      return;
    }
    const io = new IntersectionObserver(([e]) => {
      setPasoPortada(!e.isIntersecting && e.boundingClientRect.top < 0);
    });
    io.observe(el);
    return () => io.disconnect();
  }, [oculto]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    const onClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (panel.current?.contains(target) || launcher.current?.contains(target))
        return;
      setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    panel.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
      launcher.current?.focus();
    };
  }, [open]);

  if (oculto) return null;

  return (
    <>
      <span ref={testigo} className="assistant-sentinel" aria-hidden="true" />

      <button
        ref={launcher}
        type="button"
        className={`assistant-launcher${visto ? ' is-seen' : ''}${
          pasoPortada ? ' is-ready' : ''
        }`}
        aria-expanded={open}
        aria-controls="assistant-panel"
        onClick={() => {
          setVisto(true);
          setOpen((v) => !v);
        }}
      >
        <Sparkles size={20} aria-hidden="true" className="assistant-spark" />
        <span className="assistant-launcher-label">{t('launcher')}</span>
      </button>

      {open && (
        <div
          ref={panel}
          id="assistant-panel"
          className="assistant-panel"
          role="dialog"
          aria-labelledby="assistant-title"
          tabIndex={-1}
        >
          <div className="assistant-head">
            <div>
              <p className="assistant-badge">{t('badge')}</p>
              <h2 id="assistant-title">{t('title')}</h2>
            </div>
            <button
              type="button"
              className="assistant-close"
              onClick={() => setOpen(false)}
              aria-label={t('close')}
            >
              <X size={18} aria-hidden="true" />
            </button>
          </div>

          <p className="assistant-greeting">{t('greeting')}</p>
          <p className="assistant-notice">{t('notice')}</p>

          <Link
            href="/contacto"
            className="btn btn-blue"
            onClick={() => setOpen(false)}
          >
            {tNav('cta')}
          </Link>
        </div>
      )}
    </>
  );
}
