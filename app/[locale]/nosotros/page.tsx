import type { Metadata } from 'next';
import Image from 'next/image';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { PageHero } from '@/components/shared/PageHero';
import { Reveal } from '@/components/shared/Reveal';
import { Stats } from '@/components/shared/Stats';
import { pageMetadata, SITE_NAME } from '@/lib/seo';
import { GROUP_BRANDS } from '@/content/brands';

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

          {/* Las mismas tarjetas que el desfile de la Home, quietas y en
              rejilla. Marcas y logotipos en `content/brands.ts`. */}
          <div className="eco-grid">
            {GROUP_BRANDS.map((brand, i) => (
              <div
                key={brand.name}
                className={`eco-card ${brand.active ? 'eco-card-active' : 'eco-card-later'}`}
              >
                <div className="eco-media" aria-hidden="true">
                  {brand.logo ? (
                    <Image
                      src={brand.logo.src}
                      alt=""
                      width={600}
                      height={600}
                      sizes="280px"
                      className={brand.active ? 'eco-mark' : 'eco-logo'}
                    />
                  ) : (
                    <span className="eco-num">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  )}
                </div>
                <div className="eco-body">
                  <h3>{brand.name}</h3>
                  <span className="eco-status">
                    <span className="eco-dot" aria-hidden="true" />
                    {brand.active ? tEco('statusActive') : tEco('statusLater')}
                  </span>
                </div>
              </div>
            ))}
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
