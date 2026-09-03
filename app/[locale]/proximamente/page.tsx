import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { PageHero } from '@/components/shared/PageHero';
import { Reveal } from '@/components/shared/Reveal';
import { pageMetadata, SITE_NAME } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({
    locale: params.locale,
    namespace: 'meta.proximamente',
  });
  return {
    title: t('title'),
    description: t('description'),
    ...pageMetadata({
      locale: params.locale,
      path: 'proximamente',
      title: `${t('title')} · ${SITE_NAME}`,
      description: t('description'),
    }),
    // Página de paso: no debe posicionarse.
    robots: { index: false, follow: true },
  };
}

/**
 * Destino TEMPORAL de los CTAs «Área médica» y «Portal de clientes» mientras
 * el portal (`portal.gabame.com`) no existe. El día que exista, `PORTAL_URL`
 * en `lib/nav.ts` cambia a la URL definitiva y esta página deja de recibir
 * tráfico; se puede borrar entonces o dejar como red para enlaces viejos.
 */
export default function ComingSoonPage({
  params,
}: {
  params: { locale: string };
}) {
  setRequestLocale(params.locale);
  return <ComingSoonBody />;
}

function ComingSoonBody() {
  const t = useTranslations('proximamente');

  return (
    <>
      <PageHero
        eyebrow={t('kicker')}
        title={t('title')}
        subtitle={t('subtitle')}
        tone="black"
      />

      <section className="section surface-white">
        <Reveal className="container">
          <p className="lead" style={{ maxWidth: '64ch' }}>
            {t('text')}
          </p>
          <div className="btn-row" style={{ marginTop: 32 }}>
            <Link href="/" className="btn btn-blue">
              {t('backHome')}
            </Link>
            <Link href="/contacto" className="btn btn-outline-black">
              {t('contact')}
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
