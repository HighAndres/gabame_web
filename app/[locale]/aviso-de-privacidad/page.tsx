import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { PageHero } from '@/components/shared/PageHero';
import { PrivacyBody } from '@/components/legal/PrivacyBody';
import { pageMetadata, SITE_NAME } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({
    locale: params.locale,
    namespace: 'meta.aviso',
  });
  return {
    title: t('title'),
    description: t('description'),
    ...pageMetadata({
      locale: params.locale,
      path: 'aviso-de-privacidad',
      title: `${t('title')} · ${SITE_NAME}`,
      description: t('description'),
    }),
  };
}

/**
 * Aviso de privacidad como PÁGINA (con URL propia, enlazable desde fuera y
 * desde el portal). El modal de los formularios sigue existiendo y pinta el
 * mismo cuerpo. Estructura lista; el texto lo redacta GABAME/legal en
 * `content/legal.ts` (secciones marcadas como pendientes).
 */
export default function PrivacyPage({
  params,
}: {
  params: { locale: string };
}) {
  setRequestLocale(params.locale);
  return <PrivacyPageBody />;
}

function PrivacyPageBody() {
  const t = useTranslations('legal');

  return (
    <>
      <PageHero eyebrow={t('kicker')} title={t('title')} tone="black" />
      <section className="section surface-white">
        <div className="container legal-page">
          <PrivacyBody withTitle={false} />
        </div>
      </section>
    </>
  );
}
