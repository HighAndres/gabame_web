import { useLocale, useTranslations } from 'next-intl';
import { privacyNotice } from '@/content/legal';

/**
 * Cuerpo del aviso de privacidad. Lo comparten el modal (`PrivacyModal`, en
 * los formularios y el pie) y la página `/aviso-de-privacidad`: un solo
 * texto —`content/legal.ts`— pintado igual en los dos sitios.
 *
 * `headingLevel`: en el modal el título es un `h2`; en la página ya lo pone
 * la cabecera y aquí no se repite.
 */
export function PrivacyBody({ withTitle = true }: { withTitle?: boolean }) {
  const t = useTranslations('legal');
  const locale = useLocale() as 'es' | 'en';
  const notice = privacyNotice[locale] ?? privacyNotice.es;

  return (
    <>
      {withTitle && <h2 id="privacy-title">{notice.title}</h2>}

      {notice.pending && <p className="modal-notice">{t('pendingNotice')}</p>}

      {notice.updated && (
        <p style={{ fontSize: 14, marginBottom: 18 }}>
          {t('updatedLabel')}: {notice.updated}
        </p>
      )}

      <p style={{ color: 'var(--on-white)', marginBottom: 24 }}>{notice.intro}</p>

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
    </>
  );
}
