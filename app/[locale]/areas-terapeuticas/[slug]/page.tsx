import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { PageHero } from '@/components/shared/PageHero';
import { Atmosphere } from '@/components/shared/Atmosphere';
import { Reveal } from '@/components/shared/Reveal';
import { PortalLink } from '@/components/shared/PortalLink';
import { pageMetadata, SITE_NAME } from '@/lib/seo';
import { AREAS, areaBySlug, type Area } from '@/content/areas';
import { SHOW_BRAND_NAMES } from '@/lib/flags';

type Params = { locale: string; slug: string };

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    AREAS.map((a) => ({ locale, slug: a.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const area = areaBySlug(params.slug);
  if (!area) return {};
  const t = await getTranslations({ locale: params.locale, namespace: 'areas' });
  const title = t(`list.${area.slug}.name`);
  const description = t(`list.${area.slug}.blurb`);
  return {
    title,
    description,
    ...pageMetadata({
      locale: params.locale,
      path: `areas-terapeuticas/${area.slug}`,
      title: `${title} · ${SITE_NAME}`,
      description,
    }),
  };
}

/**
 * Página pública de un área terapéutica: intro general, marcas por nombre
 * (solo con el flag) y la puerta al portal para profesionales de la salud.
 *
 * REGULATORIO: aquí no entra ningún dato clínico. La intro de cada área está
 * marcada `[PENDIENTE: copy área médica]` hasta que la redacte y valide el
 * área médica de GABAME; mientras tanto se pinta el marcador, a la vista, para
 * que se sepa dónde va.
 */
export default function AreaPage({ params }: { params: Params }) {
  const area = areaBySlug(params.slug);
  if (!area) notFound();
  setRequestLocale(params.locale);
  return <AreaBody area={area} />;
}

function AreaBody({ area }: { area: Area }) {
  const { slug, brands, featured } = area;
  const t = useTranslations('areas');
  const showBrands = SHOW_BRAND_NAMES && brands.length > 0;

  return (
    <>
      <PageHero
        eyebrow={t('kicker')}
        title={t(`list.${slug}.name`)}
        subtitle={t(`list.${slug}.blurb`)}
      />

      <section className="section surface-white">
        <Atmosphere />
        <div className="container area-page">
          <Reveal>
            <h2 style={{ fontSize: 'clamp(22px,2.4vw,32px)' }}>
              {t('introTitle')}
            </h2>
            {/* Marcador visible: el copy lo redacta el área médica. */}
            <p className="note" style={{ marginTop: 16 }}>
              {t(`list.${slug}.intro`)}
            </p>

            {/* Producto con página pública propia (dispositivo médico):
                se enlaza siempre, con o sin el flag de marcas. */}
            {featured && (
              <div className="area-featured">
                <h2 style={{ fontSize: 'clamp(22px,2.4vw,32px)' }}>
                  {t('featuredTitle')}
                </h2>
                <p className="lead" style={{ marginTop: 12 }}>
                  {t('featuredText', { name: featured.name })}
                </p>
                <Link href={featured.href} className="btn btn-black">
                  {t('featuredCta', { name: featured.name })}
                </Link>
              </div>
            )}

            {showBrands && (
              <>
                <h2
                  style={{ fontSize: 'clamp(22px,2.4vw,32px)', marginTop: 40 }}
                >
                  {t('brandsLabel')}
                </h2>
                <ul className="area-card-brands" style={{ marginTop: 16 }}>
                  {brands.map((b) => (
                    <li key={b} className="chip chip-blue">
                      {b}
                    </li>
                  ))}
                </ul>
                <p className="note" style={{ marginTop: 16 }}>
                  {t('brandsNote')}
                </p>
              </>
            )}
          </Reveal>

          {/* Puerta a la información profesional: fuera del sitio público. */}
          <Reveal className="surface-black hcp-card" delay={100}>
            <p className="eyebrow" style={{ color: 'var(--blue)' }}>
              {t('hcpKicker')}
            </p>
            <h2 style={{ fontSize: 'clamp(22px,2.4vw,32px)', marginTop: 10 }}>
              {t('hcpTitle')}
            </h2>
            <p className="lead" style={{ marginTop: 12 }}>
              {t('hcpText')}
            </p>
            <PortalLink className="btn btn-blue" >
              {t('hcpCta')}
            </PortalLink>
          </Reveal>
        </div>

        <div className="container">
          <div className="btn-row" style={{ marginTop: 56 }}>
            <Link href="/areas-terapeuticas" className="btn btn-outline-black">
              {t('backIndex')}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
