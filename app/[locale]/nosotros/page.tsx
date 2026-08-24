import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { PageHero } from '@/components/shared/PageHero';
import { Reveal } from '@/components/shared/Reveal';
import { Stats } from '@/components/shared/Stats';
import { pageMetadata, SITE_NAME } from '@/lib/seo';

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
    ...pageMetadata({
      locale: params.locale,
      path: 'nosotros',
      title: `${t('title')} · ${SITE_NAME}`,
      description: t('description'),
    }),
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

      {/* Cada sección entra como una unidad: el Reveal ocupa el lugar del
          `.container`, así que la maquetación no gana envoltorios. */}
      <section className="section surface-white">
        <Reveal className="container">
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
        </Reveal>
      </section>

      <section className="section surface-blue">
        <Reveal className="container">
          <h2>{t('missionTitle')}</h2>
          <p
            className="lead"
            style={{ marginTop: 18, fontSize: 'clamp(18px,1.6vw,24px)' }}
          >
            {tHome('subtitle')}
          </p>
        </Reveal>
      </section>

      <section className="section surface-white">
        <Reveal className="container">
          <h2>{t('statsTitle')}</h2>
          <Stats />
        </Reveal>
      </section>

      <section className="section surface-white" style={{ paddingTop: 0 }}>
        <Reveal className="container">
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
        </Reveal>
      </section>

      <section className="section surface-black">
        <Reveal className="container">
          <h2>{t('ctaTitle')}</h2>
          <div className="btn-row" style={{ marginTop: 28 }}>
            <Link href="/contacto" className="btn btn-blue">
              {t('ctaContact')}
            </Link>
            <Link href="/" className="btn btn-outline-white">
              {t('backHome')}
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
