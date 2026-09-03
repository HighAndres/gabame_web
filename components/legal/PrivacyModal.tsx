'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslations } from 'next-intl';
import { useFocusTrap } from '@/lib/focus-trap';
import { PrivacyBody } from './PrivacyBody';

/**
 * Aviso de privacidad en modal. El disparador es el propio componente, así el
 * pie y los formularios lo montan sin estado compartido.
 *
 * Bloquea el scroll de fondo, cierra con Escape y devuelve el foco al botón.
 *
 * **Se pinta en `document.body`, no donde está el disparador.** El velo lleva
 * `z-index: 120` —por encima de la cabecera, que va a 90— pero el disparador
 * de los formularios vive dentro de `.section > .container`, que es
 * `position: relative; z-index: 1`: eso abre un contexto de apilamiento y
 * dentro de él el 120 solo compite con sus hermanos. El resultado era un aviso
 * legal con la cabecera pegajosa por encima. Con `createPortal` el velo vuelve
 * a la raíz y el 120 vale lo que dice.
 */
export function PrivacyModal({
  className,
  label,
}: {
  className?: string;
  /** Texto del disparador. Por defecto, «Aviso de privacidad». */
  label?: string;
}) {
  const t = useTranslations('legal');
  const tForm = useTranslations('contactForm');

  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const card = useRef<HTMLDivElement>(null);
  /* `createPortal` necesita el DOM: en el render del servidor no hay `body`. */
  const [montado, setMontado] = useState(false);
  useEffect(() => setMontado(true), []);

  /* Es un diálogo modal y lo dice (`aria-modal`), así que tiene que cumplirlo:
     sin esto el primer tabulador después de «Cerrar» ya estaba en la página de
     detrás. */
  useFocusTrap(open, [card]);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKey);
    card.current?.focus();

    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
      trigger.current?.focus();
    };
  }, [open]);

  return (
    <>
      <button
        ref={trigger}
        type="button"
        className={className}
        onClick={() => setOpen(true)}
      >
        {label ?? tForm('privacyLink')}
      </button>

      {open &&
        montado &&
        createPortal(
          <div
            className="modal-scrim"
            onClick={(e) => {
              if (e.target === e.currentTarget) setOpen(false);
            }}
          >
            <div
              ref={card}
              className="modal-card"
              role="dialog"
              aria-modal="true"
              aria-labelledby="privacy-title"
              tabIndex={-1}
            >
              <PrivacyBody />

              <button
                type="button"
                className="modal-close"
                onClick={() => setOpen(false)}
              >
                {t('close')}
              </button>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
