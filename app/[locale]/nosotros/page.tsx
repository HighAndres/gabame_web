import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { PageHero } from '@/components/shared/PageHero';
import { Stats } from '@/components/shared/Stats';
import { buildAlternates } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({
    locale: params.locale,
    namespace: 'meta.nosotros',
  });
  return {
    title: t('title'),
    description: t('description'),
    alternates: buildAlternates(params.locale, 'nosotros'),
  };
}

const BRANDS = ['GABAME', 'Medinter', 'Ordan', 'A7'] as const;

export default function AboutPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  return <AboutBody />;
}

function AboutBody() {
  const t = useTranslations('nosotros');
  const tEco = useTranslations('home.ecosistema');
  const tHome = useTranslations('home.nosotros');

  return (
    <>
      <PageHero eyebrow={t('kicker')} title={t('title')} />

      <section className="section surface-white">
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 24,
            }}
          >
            <article style={{ border: '2px solid #000', padding: 28 }}>
              <h2 style={{ fontSize: 'clamp(22px,2.4vw,32px)' }}>
                {t('purposeTitle')}
              </h2>
              <p className="lead" style={{ marginTop: 14 }}>
                {t('purposeText')}
              </p>
            </article>

            <article className="surface-black" style={{ padding: 28 }}>
              <h2
                style={{
                  fontSize: 'clamp(22px,2.4vw,32px)',
                  color: 'var(--blue)',
                }}
              >
                {t('visionTitle')}
              </h2>
              <p className="lead" style={{ marginTop: 14 }}>
                {t('visionText')}
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="section surface-blue">
        <div className="container">
          <h2>{t('missionTitle')}</h2>
          <p
            className="lead"
            style={{ marginTop: 18, fontSize: 'clamp(18px,1.6vw,24px)' }}
          >
            {tHome('subtitle')}
          </p>
        </div>
      </section>

      <section className="section surface-white">
        <div className="container">
          <h2>{t('statsTitle')}</h2>
          <Stats />
        </div>
      </section>

      <section className="section surface-white" style={{ paddingTop: 0 }}>
        <div className="container">
          <h2>{t('ecosystemTitle')}</h2>
          <p className="lead" style={{ marginTop: 16, marginBottom: 40 }}>
            {tEco('subtitle')}
          </p>

          <div className="eco-grid">
            {BRANDS.map((name) => {
              const active = name === 'GABAME';
              return (
                <div
                  key={name}
                  className={`eco-card ${active ? 'eco-card-active' : 'eco-card-later'}`}
                >
                  <span className="eco-dot" aria-hidden="true" />
                  <h3>{name}</h3>
                  <span className="chip chip-outline">
                    {active ? tEco('statusActive') : tEco('statusLater')}
                  </span>
                </div>
              );
            })}
          </div>

          <p className="note" style={{ marginTop: 28 }}>
            {t('ecosystemNote')}
          </p>
        </div>
      </section>

      <section className="section surface-black">
        <div className="container">
          <h2>{t('ctaTitle')}</h2>
          <div className="btn-row" style={{ marginTop: 28 }}>
            <Link href="/contacto" className="btn btn-blue">
              {t('ctaContact')}
            </Link>
            <Link href="/" className="btn btn-outline-white">
              {t('backHome')}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
