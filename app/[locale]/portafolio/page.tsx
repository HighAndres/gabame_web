import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { PageHero } from '@/components/shared/PageHero';
import { pageMetadata, SITE_NAME } from '@/lib/seo';
import { AREA_ORDER, products } from '@/content/products';

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({
    locale: params.locale,
    namespace: 'meta.productos',
  });
  return {
    title: t('title'),
    description: t('description'),
    ...pageMetadata({
      locale: params.locale,
      path: 'portafolio',
      title: `${t('title')} · ${SITE_NAME}`,
      description: t('description'),
    }),
  };
}

/**
 * Portafolio Rx por área terapéutica.
 *
 * La colección `products` está VACÍA a propósito: sin validación COFEPRIS no se
 * publican marcas, moléculas ni posología. Cada área muestra su estado honesto
 * y una vía para pedir información.
 */
export default function PortfolioPage({
  params,
}: {
  params: { locale: string };
}) {
  setRequestLocale(params.locale);
  return <PortfolioBody />;
}

function PortfolioBody() {
  const t = useTranslations('productos');
  const tAreas = useTranslations('home.areas.list');
  const tBlurb = useTranslations('productos.areaBlurb');

  return (
    <>
      <PageHero
        eyebrow={t('kicker')}
        title={t('title')}
        subtitle={t('subtitle')}
      />

      <section className="section surface-white">
        <div className="container">
          <div className="area-table">
            {AREA_ORDER.map((area, i) => {
              const items = products.filter((p) => p.area === area);

              return (
                <div key={area} className="area-row" id={area}>
                  <span className="area-num">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h2 style={{ fontSize: 'clamp(22px, 2.4vw, 32px)' }}>
                    {tAreas(area)}
                  </h2>
                  <div>
                    <p className="area-desc">{tBlurb(area)}</p>
                    {items.length === 0 && (
                      <p
                        className="area-desc"
                        style={{ marginTop: 8, opacity: 0.75 }}
                      >
                        {t('emptyHint')}
                      </p>
                    )}
                  </div>
                  <div style={{ display: 'grid', gap: 10, justifyItems: 'start' }}>
                    <span className="chip chip-blue">{t('emptyState')}</span>
                    <Link
                      href="/contacto"
                      style={{ textDecoration: 'underline', fontSize: 15 }}
                    >
                      {t('requestInfo')}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="note" style={{ marginTop: 40 }}>
            {t('note')}
          </p>

          <div className="btn-row" style={{ marginTop: 40 }}>
            <Link href="/contacto" className="btn btn-blue">
              {t('ctaContact')}
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
