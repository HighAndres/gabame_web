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
 * Fue el destino TEMPORAL de los CTAs «Área médica» y «Portal de clientes»
 * mientras el portal no existía. Desde sep 2026 esos CTAs van a
 * `clientesgabame.mirmiapps.com` (ver `PORTAL` en `lib/nav.ts`), así que esta página
 * ya no recibe tráfico de la navegación.
 *
 * Se queda, y a propósito: sigue siendo el destino del 301 de `/medicos`
 * (`next.config.mjs`) y la red donde cae cualquier enlace viejo. También es
 * adónde se vuelve —cambiando una cadena en `PORTAL`— si el portal se cae o
 * aún no atiende a alguno de los dos públicos.
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
