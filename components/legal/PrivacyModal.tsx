'use client';

import { useEffect, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { privacyNotice } from '@/content/legal';

/**
 * Aviso de privacidad en modal. El disparador es el propio componente, así el
 * pie y los formularios lo montan sin estado compartido.
 *
 * Bloquea el scroll de fondo, cierra con Escape y devuelve el foco al botón.
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
  const locale = useLocale() as 'es' | 'en';
  const notice = privacyNotice[locale] ?? privacyNotice.es;

  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const card = useRef<HTMLDivElement>(null);

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

      {open && (
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
            <h2 id="privacy-title">{notice.title}</h2>

            {notice.pending && (
              <p className="modal-notice">{t('pendingNotice')}</p>
            )}

            {notice.updated && (
              <p style={{ fontSize: 14, marginBottom: 18 }}>
                {t('updatedLabel')}: {notice.updated}
              </p>
            )}

            <p style={{ color: 'var(--on-white)', marginBottom: 24 }}>
              {notice.intro}
            </p>

            {notice.sections.map((s) => (
              <section key={s.heading} style={{ marginBottom: 22 }}>
                <h3 style={{ fontSize: 20, marginBottom: 8 }}>{s.heading}</h3>
                {s.body.map((p, i) => (
                  <p key={i} style={{ color: 'var(--on-white)', marginTop: 6 }}>
                    {p}
                  </p>
                ))}
              </section>
            ))}

            <button
              type="button"
              className="modal-close"
              onClick={() => setOpen(false)}
            >
              {t('close')}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
