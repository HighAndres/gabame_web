import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Atmosphere } from '@/components/shared/Atmosphere';

/**
 * Socios: composición asimétrica. Bloque negro con farmacovigilancia dentro,
 * bloque azul con la vía de socios. Sin gap entre ambos: los dos colores se
 * tocan, que es lo que hace la pieza.
 */
export function Partners() {
  const t = useTranslations('home.socios');

  return (
    <section id="socios">
      <div className="partners-grid">
        <div className="partners-main surface-black">
          <Atmosphere tone="dark" />

          <p className="eyebrow" style={{ color: 'var(--blue)' }}>
            {t('kicker')}
          </p>
          <h2 style={{ marginTop: 12 }}>{t('title')}</h2>
          <p className="lead" style={{ marginTop: 18 }}>
            {t('subtitle')}
          </p>

          <div className="pv-block">
            <h3>{t('pvTitle')}</h3>
            <p className="lead">{t('pvText')}</p>
            <Link href="/farmacovigilancia" className="btn btn-blue">
              {t('pvCta')}
            </Link>
          </div>
        </div>

        <div className="partners-side surface-blue">
          <Atmosphere tone="blue" />

          <h3>{t('partnerTitle')}</h3>
          <p className="lead">{t('partnerText')}</p>
          <Link
            href="/contacto"
            className="btn btn-black"
            style={{ alignSelf: 'flex-start' }}
          >
            {t('partnerCta')}
          </Link>
        </div>
      </div>
    </section>
  );
}
