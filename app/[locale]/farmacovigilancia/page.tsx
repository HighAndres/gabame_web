import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { PageHero } from '@/components/shared/PageHero';
import { Atmosphere } from '@/components/shared/Atmosphere';
import { PvForm } from '@/components/forms/PvForm';
import { PrivacyModal } from '@/components/legal/PrivacyModal';
import { buildAlternates } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({
    locale: params.locale,
    namespace: 'meta.farmacovigilancia',
  });
  return {
    title: t('title'),
    description: t('description'),
    alternates: buildAlternates(params.locale, 'farmacovigilancia'),
  };
}

export default function PvPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  return <PvBody />;
}

function PvBody() {
  const t = useTranslations('farmacovigilancia');

  return (
    <>
      <PageHero
        eyebrow={t('kicker')}
        title={t('title')}
        subtitle={t('subtitle')}
        tone="black"
      />

      <section className="section surface-white form-v1">
        <Atmosphere />

        <div className="container">
          {/* Aviso obligatorio: este no es un canal de urgencias. */}
          <div className="surface-blue notice-card">
            <p className="eyebrow">{t('noticeLabel')}</p>
            <h2 style={{ fontSize: 'clamp(22px,2.4vw,32px)', marginTop: 10 }}>
              {t('emergencyTitle')}
            </h2>
            <p className="lead" style={{ marginTop: 12 }}>
              {t('emergencyText')}
            </p>
          </div>

          <div className="form-layout">
            <div>
              <h2 style={{ fontSize: 'clamp(22px,2.4vw,32px)' }}>
                {t('whatTitle')}
              </h2>
              <p className="lead" style={{ marginTop: 14 }}>
                {t('whatText')}
              </p>

              <h2
                style={{ fontSize: 'clamp(22px,2.4vw,32px)', marginTop: 40 }}
              >
                {t('privacyTitle')}
              </h2>
              {/* `privacyText` termina en «Consulta el»: la frase PIDE el enlace
                  al aviso y se estaba renderizando sola, cortada a media idea. */}
              <p className="lead" style={{ marginTop: 14 }}>
                {t('privacyText')}{' '}
                <PrivacyModal className="form-privacy-link" />.
              </p>

              <p className="note" style={{ marginTop: 28 }}>
                {t('fallbackNote')}
              </p>
            </div>

            <PvForm />
          </div>

          <div className="btn-row" style={{ marginTop: 56 }}>
            <Link href="/" className="btn btn-outline-black">
              {t('backHome')}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
