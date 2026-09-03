import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { PageHero } from '@/components/shared/PageHero';
import { Atmosphere } from '@/components/shared/Atmosphere';
import { Reveal } from '@/components/shared/Reveal';
import { pageMetadata, SITE_NAME } from '@/lib/seo';
import { promosVigentes, type Promo } from '@/content/promociones';

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({
    locale: params.locale,
    namespace: 'meta.promociones',
  });
  return {
    title: t('title'),
    description: t('description'),
    ...pageMetadata({
      locale: params.locale,
      path: 'promociones',
      title: `${t('title')} · ${SITE_NAME}`,
      description: t('description'),
    }),
  };
}

/**
 * Promociones: pestaña propia, separada del portafolio (junta sep 2026).
 * Una tarjeta por dinámica desde `content/promociones.json`: nombre, marcas
 * participantes (logo placeholder), cadenas, vigencia, legales y la leyenda
 * «Consulte a su médico». Sin product shots, precios ni posología.
 *
 * Las promociones vencidas se filtran al construir; la página se revalida
 * cada hora para que una dinámica caduque sola sin redespliegue.
 */
export const revalidate = 3600;

export default function PromosPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  return <PromosBody promos={promosVigentes()} />;
}

function PromosBody({ promos }: { promos: Promo[] }) {
  const t = useTranslations('promociones');
  const locale = useLocale() as 'es' | 'en';

  const fecha = (iso: string) =>
    new Intl.DateTimeFormat(locale === 'es' ? 'es-MX' : 'en-US', {
      dateStyle: 'long',
      timeZone: 'UTC',
    }).format(new Date(`${iso}T00:00:00Z`));

  return (
    <>
      <PageHero eyebrow={t('kicker')} title={t('title')} subtitle={t('subtitle')} />

      <section className="section surface-white">
        <Atmosphere />
        <div className="container">
          {promos.length === 0 ? (
            <p className="lead">{t('empty')}</p>
          ) : (
            <div className="promo-grid">
              {promos.map((p, i) => (
                <Reveal key={p.id} className="promo-card" delay={80 * i}>
                  <p className="eyebrow">{t('dynamic')}</p>
                  <h2 className="promo-name">{p.name}</h2>
                  <p className="lead">{p.mechanics[locale]}</p>

                  <h3 className="promo-label">{t('brands')}</h3>
                  <ul className="promo-logos">
                    {p.brands.map((b, j) => (
                      <li key={j} className="promo-logo">
                        {/* Placeholder hasta que lleguen los logotipos: la caja
                            enseña el nombre. Con `logo` se pinta la imagen. */}
                        {b.logo ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={b.logo} alt={b.name} />
                        ) : (
                          <span>{b.name}</span>
                        )}
                      </li>
                    ))}
                  </ul>

                  <h3 className="promo-label">{t('chains')}</h3>
                  <ul className="area-card-brands">
                    {p.chains.map((c, j) => (
                      <li key={j} className="chip chip-outline">
                        {c}
                      </li>
                    ))}
                  </ul>

                  <h3 className="promo-label">{t('validity')}</h3>
                  <p className="promo-dates">
                    {t('validityRange', {
                      from: fecha(p.validFrom),
                      to: fecha(p.validTo),
                    })}
                  </p>

                  <p className="note promo-legal">{p.legal[locale]}</p>
                  <p className="note promo-legend">{t('legend')}</p>
                </Reveal>
              ))}
            </div>
          )}

          <p className="note" style={{ marginTop: 40 }}>
            {t('pos')}
          </p>

          <div className="btn-row" style={{ marginTop: 40 }}>
            <Link href="/areas-terapeuticas" className="btn btn-blue">
              {t('ctaAreas')}
            </Link>
            <Link href="/" className="btn btn-outline-black">
              {t('backHome')}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
