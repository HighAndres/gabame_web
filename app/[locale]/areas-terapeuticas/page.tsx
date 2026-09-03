import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { PageHero } from '@/components/shared/PageHero';
import { AreaCards } from '@/components/shared/AreaCards';
import { PortalLink } from '@/components/shared/PortalLink';
import { pageMetadata, SITE_NAME } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({
    locale: params.locale,
    namespace: 'meta.areas',
  });
  return {
    title: t('title'),
    description: t('description'),
    ...pageMetadata({
      locale: params.locale,
      path: 'areas-terapeuticas',
      title: `${t('title')} · ${SITE_NAME}`,
      description: t('description'),
    }),
  };
}

/**
 * Índice de áreas terapéuticas. Sustituye a `/portafolio` (301) desde la
 * junta de sep 2026: el sitio público enseña ÁREAS, no fichas de producto.
 * La información para profesionales vive en el portal.
 */
export default function AreasPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  return <AreasBody />;
}

function AreasBody() {
  const t = useTranslations('areas');

  return (
    <>
      <PageHero
        eyebrow={t('kicker')}
        title={t('title')}
        subtitle={t('subtitle')}
      />

      <section className="section surface-white">
        <div className="container">
          <AreaCards tone="white" />

          <div className="btn-row" style={{ marginTop: 48 }}>
            <PortalLink className="btn btn-blue">{t('hcpCta')}</PortalLink>
            <Link href="/" className="btn btn-outline-black">
              {t('backHome')}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
