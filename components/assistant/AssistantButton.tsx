'use client';

import { useEffect, useRef, useState } from 'react';
import { Sparkles, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

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
 */
export function AssistantButton() {
  const t = useTranslations('chat');
  const tNav = useTranslations('nav');
  const [open, setOpen] = useState(false);
  /* El halo llama la atención hasta que el usuario lo abre UNA vez; a partir
     de ahí ya sabe que está y el halo sería ruido. */
  const [visto, setVisto] = useState(false);
  const launcher = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

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

  return (
    <>
      <button
        ref={launcher}
        type="button"
        className={`assistant-launcher${visto ? ' is-seen' : ''}`}
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
