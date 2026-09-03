import type { Metadata } from 'next';
import { ArrowUpRight } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { PageHero } from '@/components/shared/PageHero';
import { Atmosphere } from '@/components/shared/Atmosphere';
import { Reveal } from '@/components/shared/Reveal';
import { HealthyEyesVisual } from '@/components/shared/HealthyEyesVisual';
import { pageMetadata, SITE_NAME } from '@/lib/seo';
import { WHERE_TO_FIND } from '@/content/healthy-eyes';

const PATH = 'areas-terapeuticas/oftalmologia/healthy-eyes';

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({
    locale: params.locale,
    namespace: 'meta.healthyEyes',
  });
  return {
    title: t('title'),
    description: t('description'),
    ...pageMetadata({
      locale: params.locale,
      path: PATH,
      title: `${t('title')} · ${SITE_NAME}`,
      description: t('description'),
    }),
  };
}

/**
 * Healthy Eyes: dispositivo médico, el único producto con página pública.
 *
 * ENFOQUE CONSERVADOR (COFEPRIS): qué es, para qué se usa en lenguaje
 * general, presentación, modo de uso resumido, dónde encontrarlo (enlaces a
 * farmacias, sin precio) y la leyenda «Consulte a su médico». Sin claims de
 * eficacia, cifras, comparativos ni eslóganes. Todo el copy está marcado
 * [SUJETO A VALIDACIÓN REGULATORIA] en `i18n` hasta que GABAME lo apruebe.
 */
export default function HealthyEyesPage({
  params,
}: {
  params: { locale: string };
}) {
  setRequestLocale(params.locale);
  return <HealthyEyesBody />;
}

const SECTIONS = ['whatIs', 'use', 'presentation', 'howTo'] as const;

function HealthyEyesBody() {
  const t = useTranslations('healthyEyes');
  const tA11y = useTranslations('a11y');

  return (
    <>
      <PageHero eyebrow={t('kicker')} title={t('title')} subtitle={t('subtitle')} />

      <section className="section surface-white">
        <Atmosphere />
        <div className="container he-layout">
          <Reveal className="he-visual">
            <HealthyEyesVisual />
          </Reveal>

          <Reveal className="he-copy" delay={80}>
            {SECTIONS.map((key) => (
              <div key={key} className="he-block">
                <h2 style={{ fontSize: 'clamp(22px,2.4vw,32px)' }}>
                  {t(`${key}Title`)}
                </h2>
                <p className="lead" style={{ marginTop: 12 }}>
                  {t(`${key}Text`)}
                </p>
              </div>
            ))}

            <div className="he-block">
              <h2 style={{ fontSize: 'clamp(22px,2.4vw,32px)' }}>
                {t('whereTitle')}
              </h2>
              <p className="lead" style={{ marginTop: 12 }}>
                {t('whereText')}
              </p>
              {/* Enlaces a farmacias. Sin precios: aquí solo se dice dónde. */}
              <ul className="he-retailers">
                {WHERE_TO_FIND.map((r, i) =>
                  r.url ? (
                    <li key={i}>
                      <a
                        className="btn btn-outline-black he-retailer"
                        href={r.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span>{r.name}</span>
                        <ArrowUpRight size={18} aria-hidden="true" />
                        <span className="sr-only"> ({tA11y('newTab')})</span>
                      </a>
                    </li>
                  ) : (
                    <li key={i}>
                      <span className="btn btn-outline-black he-retailer is-pending">
                        {r.name}
                      </span>
                    </li>
                  ),
                )}
              </ul>
            </div>

            {/* Leyenda obligatoria. */}
            <p className="note he-legend">{t('legend')}</p>
            <p className="note">{t('regulatoryNote')}</p>
          </Reveal>
        </div>

        <div className="container">
          <div className="btn-row" style={{ marginTop: 56 }}>
            <Link
              href="/areas-terapeuticas/oftalmologia"
              className="btn btn-outline-black"
            >
              {t('backArea')}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
